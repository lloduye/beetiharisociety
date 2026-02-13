import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsService } from '../services/projectsService';
import { storageService } from '../services/storageService';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const editId = isNew ? null : id;
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const fileInputRefs = useRef({});
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

  const handleImageUpload = async (index, file) => {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    setUploadingIndex(index);
    try {
      const url = await storageService.uploadProjectImage(editId, file, index);
      handleImageChange(index, 'src', url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleImageRemove = (index) => {
    setFormData((prev) => {
      const imgs = [...(prev.images || [])];
      while (imgs.length <= index) imgs.push({ src: '', alt: '', caption: '' });
      imgs[index] = { src: '', alt: '', caption: '' };
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
          <p className="text-xs text-gray-500 mb-3">Upload images for the project. Stored in Firebase and editable anytime. PNG, JPG, GIF (max 5MB each).</p>
          {[0, 1].map((i) => {
            const hasImage = !!(formData.images?.[i]?.src);
            const isUploading = uploadingIndex === i;
            return (
              <div key={i} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <p className="text-sm font-medium text-gray-600">Image {i + 1}</p>
                {hasImage ? (
                  <div className="relative">
                    <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={formData.images[i].src}
                        alt={formData.images[i].alt || 'Project'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <input
                        ref={(el) => { fileInputRefs.current[i] = el; }}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(i, f);
                          e.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => fileInputRefs.current[i]?.click()}
                        className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white shadow border border-gray-200"
                        title="Replace image"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageRemove(i)}
                        className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const f = e.dataTransfer.files?.[0];
                      if (f && f.type.startsWith('image/')) handleImageUpload(i, f);
                    }}
                  >
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={isUploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(i, f);
                        e.target.value = '';
                      }}
                    />
                    <div className="flex flex-col items-center justify-center py-4">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mb-2" />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      )}
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">{isUploading ? 'Uploading...' : 'Click to upload'}</span>
                        {!isUploading && ' or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF (max 5MB)</p>
                    </div>
                  </label>
                )}
                <input
                  type="text"
                  placeholder="Alt text (for accessibility)"
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
            );
          })}
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
