import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';
import { ArrowLeft, Save, X, Eye, Heart, MessageCircle, Share2, User, Calendar, MapPin } from 'lucide-react';

const StoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    category: 'students',
    image: '',
    featured: false,
    published: false,
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isNew) {
      loadStory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadStory = async () => {
    try {
      setLoading(true);
      const story = await storiesService.getById(id);
      if (story) {
        setFormData({
          ...story,
          tags: story.tags || [],
        });
      }
    } catch (error) {
      console.error('Failed to load story:', error);
      alert('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const allStories = await storiesService.getAll();
      let updatedStories;

      if (isNew) {
        // Create new story
        const newId = Math.max(...allStories.map(s => s.id), 0) + 1;
        const newStory = {
          ...formData,
          id: newId,
          views: 0,
          shares: 0,
          comments: 0,
          likes: 0,
        };
        updatedStories = [...allStories, newStory];
      } else {
        // Update existing story
        updatedStories = allStories.map(story =>
          story.id === parseInt(id)
            ? { ...story, ...formData }
            : story
        );
      }

      await storiesService.saveStories(updatedStories);
      navigate('/dashboard/stories');
    } catch (error) {
      console.error('Failed to save story:', error);
      alert('Failed to save story');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard/stories"
                className="text-gray-600 hover:text-primary-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isNew ? 'Create New Story' : 'Edit Story'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {isNew ? 'Add a new story to the website' : 'Update story details'}
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Author and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="students">Student Success</option>
                  <option value="teachers">Teacher Stories</option>
                  <option value="community">Community Impact</option>
                  <option value="donors">Donor Stories</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Story Image *
              </label>
              <div className="space-y-4">
                {/* Image Preview */}
                {formData.image && (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Check file size (5MB max)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('File size must be less than 5MB');
                            e.target.value = ''; // Reset input
                            return;
                          }
                          
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            // Store as data URL for immediate use
                            // Note: For production, you'd upload to a CDN/server
                            // For now, this works but data URLs can be large
                            const dataUrl = reader.result;
                            setFormData(prev => ({ ...prev, image: dataUrl }));
                          };
                          reader.onerror = () => {
                            alert('Failed to read image file');
                            e.target.value = '';
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                
                {/* Or use URL */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or enter image URL</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.image && !formData.image.startsWith('data:') ? formData.image : ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, image: e.target.value }));
                    }}
                    placeholder="/Images/Story000001.jpg or https://example.com/image.jpg"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {formData.image && formData.image.startsWith('data:') && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm whitespace-nowrap"
                    >
                      Clear Upload
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload an image (stored as base64) or paste an image URL. For best performance, use image URLs from your public folder.
                </p>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add a tag"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Featured and Published */}
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Story</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Published</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Link
                to="/dashboard/stories"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 flex items-center space-x-2"
              >
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-5 w-5" />
                <span>{saving ? 'Saving...' : 'Save Story'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-primary-600 text-white">
              <h2 className="text-2xl font-bold">Story Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-white hover:text-gray-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {/* Story Preview Content */}
              <div className="p-6">
                {/* Hero Image */}
                <div className="relative h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/900x400?text=Image+Not+Found';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image set
                    </div>
                  )}
                  {formData.featured && (
                    <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured Story
                    </div>
                  )}
                  {!formData.published && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Draft - Not Published
                    </div>
                  )}
                </div>

                {/* Story Meta */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formData.date ? new Date(formData.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'No date set'}</span>
                  {formData.location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{formData.location}</span>
                    </>
                  )}
                  <span className="mx-2">•</span>
                  <span className="capitalize">{formData.category || 'Uncategorized'}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {formData.title || 'Untitled Story'}
                </h1>

                {/* Excerpt */}
                {formData.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {formData.excerpt}
                  </p>
                )}

                {/* Author */}
                {formData.author && (
                  <div className="flex items-center mb-6 text-gray-600">
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                    <span>By {formData.author}</span>
                  </div>
                )}

                {/* Engagement Stats - Only show if story exists */}
                {!isNew && (
                  <div className="flex items-center space-x-6 py-4 border-t border-b border-gray-200 mb-6">
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-gray-600">{interactionsService.getViews(parseInt(id)) || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-red-400" />
                      <span className="text-gray-600">{interactionsService.getLikes(parseInt(id)) || 0} likes</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-blue-400" />
                      <span className="text-gray-600">{interactionsService.getComments(parseInt(id)).length || 0} comments</span>
                    </div>
                    <div className="flex items-center">
                      <Share2 className="h-5 w-5 mr-2 text-green-400" />
                      <span className="text-gray-600">{interactionsService.getShares(parseInt(id)) || 0} shares</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {formData.tags && formData.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {formData.content ? (
                    formData.content.includes('\n\n') ? (
                      formData.content.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-6">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                        {formData.content}
                      </p>
                    )
                  ) : (
                    <p className="text-gray-400 italic">No content added yet</p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {!formData.published && (
                  <span className="text-yellow-600 font-medium">⚠️ This story is not published yet</span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryEdit;

