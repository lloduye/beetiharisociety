import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '../services/projectsService';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  DollarSign,
  RefreshCw,
  Database,
  Search,
  Filter,
  LayoutGrid,
  List,
  GripVertical,
  ChevronUp,
  ChevronDown,
  BarChart2,
  FolderOpen,
  Archive,
  CheckCircle2,
} from 'lucide-react';
import { projects as staticProjects } from '../data/projects';

const STATUS_OPTIONS = [
  { value: 'current', label: 'Current', icon: FolderOpen, color: 'bg-green-100 text-green-800' },
  { value: 'past', label: 'Past', icon: Archive, color: 'bg-amber-100 text-amber-800' },
  { value: 'completed', label: 'Completed', icon: CheckCircle2, color: 'bg-blue-100 text-blue-800' },
];

const DashboardProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [reordering, setReordering] = useState(null);
  const [draggedId, setDraggedId] = useState(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await projectsService.getAll();
      setProjects(list || []);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err.message || 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleSeed = async () => {
    if (!window.confirm('Import the default projects from the website? This will add them to Firestore.')) return;
    setSeeding(true);
    try {
      for (let i = 0; i < staticProjects.length; i++) {
        const p = staticProjects[i];
        await projectsService.create({
          title: p.title,
          shortDescription: p.shortDescription,
          story: p.story,
          targetFunds: p.targetFunds,
          raisedFunds: p.raisedFunds,
          slug: p.slug || p.id,
          order: i,
          status: 'current',
          images: p.images || [],
        });
      }
      window.dispatchEvent(new Event('projectsUpdated'));
      await loadProjects();
    } catch (err) {
      alert('Seed failed: ' + (err.message || 'Unknown error'));
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will remove it from the public website.`)) return;
    try {
      await projectsService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      window.dispatchEvent(new Event('projectsUpdated'));
    } catch (err) {
      alert('Failed to delete project: ' + (err.message || 'Unknown error'));
    }
  };

  const handleReorder = async (id, action) => {
    const list = projects.filter((p) => p.status === projects.find((x) => x.id === id)?.status);
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) return;
    const orders = list.map((p) => p.order ?? 999).sort((a, b) => a - b);
    let newOrder;
    if (action === 'up' && idx > 0) {
      const swap = list[idx - 1];
      await projectsService.update(swap.id, { order: list[idx].order ?? idx });
      await projectsService.update(id, { order: swap.order ?? idx - 1 });
    } else if (action === 'down' && idx < list.length - 1) {
      const swap = list[idx + 1];
      await projectsService.update(swap.id, { order: list[idx].order ?? idx });
      await projectsService.update(id, { order: swap.order ?? idx + 1 });
    } else if (action === 'first') {
      newOrder = (orders[0] ?? 0) - 100;
      await projectsService.update(id, { order: newOrder });
    } else if (action === 'last') {
      newOrder = (orders[orders.length - 1] ?? 999) + 100;
      await projectsService.update(id, { order: newOrder });
    } else return;
    setReordering(id);
    window.dispatchEvent(new Event('projectsUpdated'));
    await loadProjects();
    setReordering(null);
  };

  const handleDragStart = (e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetId) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const list = projects.filter((p) => p.status === projects.find((x) => x.id === draggedId)?.status);
    const fromIdx = list.findIndex((p) => p.id === draggedId);
    const toIdx = list.findIndex((p) => p.id === targetId);
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) {
      setDraggedId(null);
      return;
    }
    setReordering(draggedId);
    const reordered = [...list];
    const [removed] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, removed);
    try {
      for (let i = 0; i < reordered.length; i++) {
        await projectsService.update(reordered[i].id, { order: i });
      }
      window.dispatchEvent(new Event('projectsUpdated'));
      await loadProjects();
    } catch (err) {
      alert('Failed to reorder: ' + (err.message || 'Unknown error'));
    }
    setDraggedId(null);
    setReordering(null);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await projectsService.update(id, { status: newStatus });
      window.dispatchEvent(new Event('projectsUpdated'));
      await loadProjects();
    } catch (err) {
      alert('Failed to update status: ' + (err.message || 'Unknown error'));
    }
  };

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n || 0);

  const currentProjects = projects.filter((p) => (p.status || 'current') === 'current');
  const pastProjects = projects.filter((p) => p.status === 'past' || p.status === 'completed');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'current' && (p.status || 'current') === 'current') ||
      (filterStatus === 'past' && p.status === 'past') ||
      (filterStatus === 'completed' && p.status === 'completed');
    return matchesSearch && matchesStatus;
  });

  const totalRaised = projects.reduce((sum, p) => sum + (Number(p.raisedFunds) || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <RefreshCw className="h-12 w-12 animate-spin text-primary-600 mb-4" />
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage projects displayed on the public Projects page</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {projects.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50 disabled:opacity-70"
            >
              <Database className="h-5 w-5" />
              {seeding ? 'Importing...' : 'Import Default'}
            </button>
          )}
          <Link
            to="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 shadow-sm"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadProjects} className="text-sm font-medium underline">
            Retry
          </button>
        </div>
      )}

      {projects.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
          <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add your first project or import the default projects to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50"
            >
              <Database className="h-5 w-5" />
              {seeding ? 'Importing...' : 'Import Default Projects'}
            </button>
            <Link
              to="/dashboard/projects/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Add Project
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-100">
                  <FolderOpen className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Projects</p>
                  <p className="text-xl font-bold text-gray-900">{projects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <BarChart2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current</p>
                  <p className="text-xl font-bold text-gray-900">{currentProjects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Archive className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Past / Completed</p>
                  <p className="text-xl font-bold text-gray-900">{pastProjects.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Raised</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRaised)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1 sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="current">Current</option>
                    <option value="past">Past</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    title="Grid view"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    title="List view"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Showing <span className="font-semibold">{filteredProjects.length}</span> of {projects.length} projects
            </p>
          </div>

          {/* Project cards/list */}
          <div className="space-y-6">
            {filteredProjects.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                No projects match your filters. Try adjusting search or status.
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const progress =
                    project.targetFunds > 0
                      ? Math.min(100, Math.round(((project.raisedFunds || 0) / project.targetFunds) * 100))
                      : 0;
                  const statusOpt = STATUS_OPTIONS.find((s) => s.value === (project.status || 'current')) || STATUS_OPTIONS[0];
                  const StatusIcon = statusOpt.icon;
                  return (
                    <div
                      key={project.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Thumbnail */}
                      <div className="h-36 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center overflow-hidden">
                        {project.images?.[0]?.src ? (
                          <img
                            src={project.images[0].src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FolderOpen className="h-16 w-16 text-primary-300" />
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusOpt.color}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusOpt.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.shortDescription}</p>
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>{formatCurrency(project.raisedFunds)}</span>
                            <span>{formatCurrency(project.targetFunds)}</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{progress}% funded</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`/projects/${project.slug || project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 rounded-lg border border-gray-200 hover:border-primary-300"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View
                          </a>
                          <Link
                            to={`/dashboard/projects/${project.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg border border-primary-200"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                          <select
                            value={project.status || 'current'}
                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {filteredProjects.map((project, index) => {
                    const progress =
                      project.targetFunds > 0
                        ? Math.min(100, Math.round(((project.raisedFunds || 0) / project.targetFunds) * 100))
                        : 0;
                    const statusOpt = STATUS_OPTIONS.find((s) => s.value === (project.status || 'current')) || STATUS_OPTIONS[0];
                    const StatusIcon = statusOpt.icon;
                    const sameStatusList = projects.filter((p) => (p.status || 'current') === (project.status || 'current'));
                    const idx = sameStatusList.findIndex((p) => p.id === project.id);
                    const canMoveUp = idx > 0;
                    const canMoveDown = idx >= 0 && idx < sameStatusList.length - 1;

                    return (
                      <div
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, project.id)}
                        className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${draggedId === project.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-1 shrink-0">
                          <div
                            className="p-1.5 rounded text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                            title="Drag to reorder"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleReorder(project.id, 'up')}
                              disabled={!canMoveUp || reordering === project.id}
                              className="p-0.5 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                              title="Move up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReorder(project.id, 'down')}
                              disabled={!canMoveDown || reordering === project.id}
                              className="p-0.5 text-gray-400 hover:text-primary-600 disabled:opacity-30"
                              title="Move down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusOpt.color}`}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusOpt.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-1">{project.shortDescription}</p>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-600 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {formatCurrency(project.raisedFunds)} / {formatCurrency(project.targetFunds)} ({progress}%)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={project.status || 'current'}
                            onChange={(e) => handleStatusChange(project.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                          <a
                            href={`/projects/${project.slug || project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                            title="View on website"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                          <Link
                            to={`/dashboard/projects/${project.id}/edit`}
                            className="p-2 text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50"
                            title="Edit"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id, project.title)}
                            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardProjects;
