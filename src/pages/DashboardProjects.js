import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '../services/projectsService';
import { Plus, Edit, Trash2, ExternalLink, DollarSign, RefreshCw, Database, ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { projects as staticProjects } from '../data/projects';

const DashboardProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seeding, setSeeding] = useState(false);

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
    if (action === 'first') newOrder = (orders[0] ?? 0) - 100;
    else if (action === 'last') newOrder = (orders[orders.length - 1] ?? 999) + 100;
    else if (action === 'up' && idx > 0) {
      const swap = list[idx - 1];
      await projectsService.update(swap.id, { order: list[idx].order ?? idx });
      await projectsService.update(id, { order: swap.order ?? idx - 1 });
      await loadProjects();
      return;
    } else if (action === 'down' && idx < list.length - 1) {
      const swap = list[idx + 1];
      await projectsService.update(swap.id, { order: list[idx].order ?? idx });
      await projectsService.update(id, { order: swap.order ?? idx + 1 });
      await loadProjects();
      return;
    } else return;
    try {
      await projectsService.update(id, { order: newOrder });
      window.dispatchEvent(new Event('projectsUpdated'));
      await loadProjects();
    } catch (err) {
      alert('Failed to reorder: ' + (err.message || 'Unknown error'));
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <RefreshCw className="h-10 w-10 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage projects displayed on the public Projects page. Add, edit, or remove projects.
          </p>
        </div>
        <Link
          to="/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
        >
          <Plus className="h-5 w-5" />
          Add Project
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
          <button onClick={loadProjects} className="ml-4 text-sm underline">
            Retry
          </button>
        </div>
      )}

      {projects.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No projects yet.</p>
          <p className="text-sm text-gray-500 mb-6">
            Add your first project or import the default projects from the website.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-primary-600 text-primary-600 font-medium hover:bg-primary-50 disabled:opacity-70"
            >
              <Database className="h-5 w-5" />
              {seeding ? 'Importing...' : 'Import Default Projects'}
            </button>
            <Link
              to="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              Add Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {(() => {
            const currentProjects = projects.filter((p) => (p.status || 'current') === 'current');
            const pastProjects = projects.filter((p) => p.status === 'past' || p.status === 'completed');

            const ProjectRow = ({ project, isCurrent }) => {
              const progress =
                project.targetFunds > 0
                  ? Math.min(100, Math.round(((project.raisedFunds || 0) / project.targetFunds) * 100))
                  : 0;
              const list = isCurrent ? currentProjects : pastProjects;
              const idx = list.findIndex((p) => p.id === project.id);

              return (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleReorder(project.id, 'first')}
                          className="p-0.5 text-gray-400 hover:text-primary-600 rounded"
                          title="Move to first"
                          disabled={idx <= 0}
                        >
                          <ChevronsUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReorder(project.id, 'up')}
                          className="p-0.5 text-gray-400 hover:text-primary-600 rounded"
                          title="Move up"
                          disabled={idx <= 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReorder(project.id, 'down')}
                          className="p-0.5 text-gray-400 hover:text-primary-600 rounded"
                          title="Move down"
                          disabled={idx >= list.length - 1 || idx < 0}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReorder(project.id, 'last')}
                          className="p-0.5 text-gray-400 hover:text-primary-600 rounded"
                          title="Move to last"
                          disabled={idx >= list.length - 1 || idx < 0}
                        >
                          <ChevronsDown className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{project.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{project.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={project.status || 'current'}
                      onChange={(e) => handleStatusChange(project.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="current">Current</option>
                      <option value="past">Past</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {formatCurrency(project.raisedFunds)} / {formatCurrency(project.targetFunds)}
                      </span>
                      <span className="text-xs text-gray-400">({progress}%)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/projects/${project.slug || project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-primary-600 rounded"
                        title="View on website"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Link
                        to={`/dashboard/projects/${project.id}/edit`}
                        className="p-2 text-gray-500 hover:text-primary-600 rounded"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-2 text-gray-500 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            };

            return (
              <>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <h2 className="px-4 py-3 bg-primary-50 border-b border-primary-100 text-lg font-semibold text-gray-900">
                    Current Projects
                  </h2>
                  {currentProjects.length === 0 ? (
                    <p className="px-4 py-8 text-gray-500 text-center">No current projects. Add one or move projects from Past.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Project / Order</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Funding</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {currentProjects.map((p) => (
                            <ProjectRow key={p.id} project={p} isCurrent />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <h2 className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-lg font-semibold text-gray-900">
                    Past Projects
                  </h2>
                  {pastProjects.length === 0 ? (
                    <p className="px-4 py-8 text-gray-500 text-center">No past or completed projects. Change status to move projects here.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Project / Order</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Funding</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {pastProjects.map((p) => (
                            <ProjectRow key={p.id} project={p} isCurrent={false} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default DashboardProjects;
