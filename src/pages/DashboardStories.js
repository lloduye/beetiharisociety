import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';
import { 
  Plus, Edit, Trash2, Eye, Search, Filter, Star, StarOff, Heart, MessageCircle, Share2, EyeOff, X
} from 'lucide-react';

const DashboardStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStory, setSelectedStory] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'students', name: 'Student Success' },
    { id: 'teachers', name: 'Teacher Stories' },
    { id: 'community', name: 'Community Impact' },
    { id: 'donors', name: 'Donor Stories' }
  ];

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      // Load all stories (prioritizes localStorage with admin changes)
      const data = await storiesService.getAll();
      setStories(data);
    } catch (error) {
      console.error('Failed to load stories:', error);
      alert('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const saveStories = async (updatedStories) => {
    try {
      setSaving(true);
      await storiesService.saveStories(updatedStories);
      // Optional: Show success message
      return true;
    } catch (error) {
      console.error('Failed to save stories:', error);
      alert('Failed to save stories');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story? This will remove it from the website.')) {
      const updated = stories.filter(story => story.id !== id);
      setStories(updated);
      await saveStories(updated);
    }
  };

  const handleToggleFeatured = async (id) => {
    const updated = stories.map(story => 
      story.id === id ? { ...story, featured: !story.featured } : story
    );
    setStories(updated);
    await saveStories(updated);
  };

  const handleTogglePublished = async (id) => {
    const updated = stories.map(story => 
      story.id === id ? { ...story, published: !story.published } : story
    );
    setStories(updated);
    await saveStories(updated);
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || story.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && story.published) ||
      (filterStatus === 'draft' && !story.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    // Featured stories first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    // Then sort by date, newest first
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Stories Management</h1>
              <p className="text-gray-600 mt-1">Manage and publish stories for the website</p>
              {saving && (
                <p className="text-sm text-primary-600 mt-1">Saving changes...</p>
              )}
            </div>
            <Link
              to="/dashboard/stories/new"
              className="btn-primary flex items-center space-x-2 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Story</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stories List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading stories...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Story
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={story.image} 
                          alt={story.title}
                          className="h-16 w-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64';
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {story.title}
                            {story.featured && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 line-clamp-2 max-w-md">
                            {story.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{story.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{story.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                        {story.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Eye className="h-3 w-3 mr-1 text-gray-400" />
                          <span>{interactionsService.getViews(story.id) || 0} views</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Heart className="h-3 w-3 mr-1 text-red-400" />
                          <span>{interactionsService.getLikes(story.id) || 0} likes</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MessageCircle className="h-3 w-3 mr-1 text-blue-400" />
                          <span>{interactionsService.getComments(story.id).length || 0} comments</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Share2 className="h-3 w-3 mr-1 text-green-400" />
                          <span>{interactionsService.getShares(story.id) || 0} shares</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublished(story.id)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          story.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {story.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedStory(story);
                            setShowPreview(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Preview Story"
                        >
                          <EyeOff className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStory(story);
                            setShowComments(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 relative"
                          title="View Comments"
                        >
                          <MessageCircle className="h-5 w-5" />
                          {interactionsService.getComments(story.id).length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {interactionsService.getComments(story.id).length}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(story.id)}
                          className={`${
                            story.featured 
                              ? 'text-yellow-600 hover:text-yellow-900' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={story.featured ? 'Unfeature' : 'Feature'}
                        >
                          {story.featured ? <Star className="h-5 w-5 fill-current" /> : <StarOff className="h-5 w-5" />}
                        </button>
                        <Link
                          to={`/dashboard/stories/${story.id}/edit`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        {story.published && (
                          <Link
                            to={`/stories/${story.id}`}
                            target="_blank"
                            className="text-green-600 hover:text-green-900"
                            title="View on Website"
                          >
                            <Eye className="h-5 w-5" />
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}

      {/* Comments Modal */}
      {showComments && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Comments for: {selectedStory.title}
              </h2>
              <button
                onClick={() => {
                  setShowComments(false);
                  setSelectedStory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {interactionsService.getComments(selectedStory.id).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No comments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {interactionsService.getComments(selectedStory.id).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {comment.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{comment.author}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 ml-10">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total: {interactionsService.getComments(selectedStory.id).length} comments</span>
                <button
                  onClick={() => {
                    setShowComments(false);
                    setSelectedStory(null);
                  }}
                  className="btn-primary text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-primary-600 text-white">
              <h2 className="text-2xl font-bold">Story Preview</h2>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedStory(null);
                }}
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
                  <img
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/900x400?text=Image+Not+Found';
                    }}
                  />
                  {selectedStory.featured && (
                    <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured Story
                    </div>
                  )}
                  {!selectedStory.published && (
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Draft - Not Published
                    </div>
                  )}
                </div>

                {/* Story Meta */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span>{new Date(selectedStory.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedStory.location}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">{selectedStory.category}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedStory.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  {selectedStory.excerpt}
                </p>

                {/* Author */}
                <div className="flex items-center mb-6 text-gray-600">
                  <span>By {selectedStory.author}</span>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center space-x-6 py-4 border-t border-b border-gray-200 mb-6">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="text-gray-600">{interactionsService.getViews(selectedStory.id) || 0} views</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-400" />
                    <span className="text-gray-600">{interactionsService.getLikes(selectedStory.id) || 0} likes</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="text-gray-600">{interactionsService.getComments(selectedStory.id).length || 0} comments</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-green-400" />
                    <span className="text-gray-600">{interactionsService.getShares(selectedStory.id) || 0} shares</span>
                  </div>
                </div>

                {/* Tags */}
                {selectedStory.tags && selectedStory.tags.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedStory.tags.map((tag, index) => (
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
                  {selectedStory.content.includes('\n\n') ? (
                    selectedStory.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed mb-6">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                      {selectedStory.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {!selectedStory.published && (
                  <span className="text-yellow-600 font-medium">⚠️ This story is not published yet</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/dashboard/stories/${selectedStory.id}/edit`}
                  className="btn-primary text-sm"
                  onClick={() => setShowPreview(false)}
                >
                  Edit Story
                </Link>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setSelectedStory(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardStories;
