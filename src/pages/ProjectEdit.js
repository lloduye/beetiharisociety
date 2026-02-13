import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsService } from '../services/projectsService';
import { ArrowLeft, Save } from 'lucide-react';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const editId = isNew ? null : id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    story: '',
    targetFunds: '',
    raisedFunds: '',
    slug: '',
    order: 0,
    images: [
      { src: '', alt: '', caption: '' },
      { src: '', alt: '', caption: '' },
    ],
  });

  const loadProject = useCallback(async () => {
    if (!editId) return;
    try {
      setLoading(true);
      const project = await projectsService.getById(editId);
      if (project) {
        setFormData({
          title: project.title || '',
          shortDescription: project.shortDescription || '',
          story: project.story || '',
          targetFunds: project.targetFunds ?? '',
          raisedFunds: project.raisedFunds ?? '',
          slug: project.slug || '',
          order: project.order ?? 0,
          images: [
          { src: project.images?.[0]?.src || '', alt: project.images?.[0]?.alt || '', caption: project.images?.[0]?.caption || '' },
          { src: project.images?.[1]?.src || '', alt: project.images?.[1]?.alt || '', caption: project.images?.[1]?.caption || '' },
        ],
        });
      }
    } catch (err) {
      console.error('Failed to load project:', err);
      alert('Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [editId]);

  useEffect(() => {
    if (editId) loadProject();
  }, [editId, loadProject]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (type === 'number') val = value === '' ? '' : Number(value);
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleImageChange = (index, field, value) => {
    setFormData((prev) => {
      const imgs = [...(prev.images || [])];
      while (imgs.length <= index) imgs.push({ src: '', alt: '', caption: '' });
      imgs[index] = { ...imgs[index], [field]: value };
      return { ...prev, images: imgs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        targetFunds: Number(formData.targetFunds) || 0,
        raisedFunds: Number(formData.raisedFunds) || 0,
        order: Number(formData.order) || 0,
        images: (formData.images || []).filter((img) => img.src || img.alt || img.caption),
      };
      if (isNew) {
        await projectsService.create(payload);
      } else {
        await projectsService.update(editId, payload);
      }
      window.dispatchEvent(new Event('projectsUpdated'));
      navigate('/dashboard/projects');
    } catch (err) {
      console.error('Failed to save project:', err);
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link to="/dashboard/projects" className="text-gray-600 hover:text-primary-600 flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          Back to Projects
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {isNew ? 'Add Project' : 'Edit Project'}
      </h1>
      <p className="text-gray-600 mb-6">
        {isNew ? 'Create a new project for the public Projects page.' : 'Update project details.'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="e.g. Lotukei High School Construction"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short description *</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="One-line summary for cards and hero"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Story *</label>
          <p className="text-xs text-gray-500 mb-2">
            Use paragraphs separated by blank lines. First 2 paragraphs appear next to images.
          </p>
          <textarea
            name="story"
            value={formData.story}
            onChange={handleChange}
            required
            rows="14"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-mono text-sm"
            placeholder="Full project narrative..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target funds (USD) *</label>
            <input
              type="number"
              name="targetFunds"
              value={formData.targetFunds}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Raised funds (USD) *</label>
            <input
              type="number"
              name="raisedFunds"
              value={formData.raisedFunds}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL slug (optional)</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            placeholder="Auto-generated from title if left blank"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display order</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            className="w-full max-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Images (2)</label>
          <p className="text-xs text-gray-500 mb-3">Enter image URL, alt text, and caption for each image.</p>
          {[0, 1].map((i) => (
            <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-gray-600">Image {i + 1}</p>
              <input
                type="url"
                placeholder="Image URL"
                value={formData.images?.[i]?.src || ''}
                onChange={(e) => handleImageChange(i, 'src', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Alt text"
                value={formData.images?.[i]?.alt || ''}
                onChange={(e) => handleImageChange(i, 'alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Caption"
                value={formData.images?.[i]?.caption || ''}
                onChange={(e) => handleImageChange(i, 'caption', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Project'}
          </button>
          <Link
            to="/dashboard/projects"
            className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProjectEdit;
