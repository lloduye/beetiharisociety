import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '../services/projectsService';
import { Plus, Edit, Trash2, ExternalLink, DollarSign, RefreshCw, Database } from 'lucide-react';
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Funding</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => {
                  const progress =
                    project.targetFunds > 0
                      ? Math.min(100, Math.round(((project.raisedFunds || 0) / project.targetFunds) * 100))
                      : 0;
                  return (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{project.title}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">{project.shortDescription}</p>
                        </div>
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProjects;
