import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Share2, Eye, Calendar, User, MapPin, ArrowRight } from 'lucide-react';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';

const Stories = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stories, setStories] = useState([]);
  const [storyInteractions, setStoryInteractions] = useState({});

  const categories = [
    { id: 'all', name: 'All Stories' },
    { id: 'students', name: 'Student Success' },
    { id: 'teachers', name: 'Teacher Stories' },
    { id: 'community', name: 'Community Impact' },
    { id: 'donors', name: 'Donor Stories' }
  ];

  const loadInteractionsForStories = useCallback(async (storiesList) => {
    if (!storiesList || storiesList.length === 0) {
      setStoryInteractions({});
      return;
    }
    try {
      const interactionsByStory = {};
      await Promise.all(
        storiesList.map(async (story) => {
          const storyId = story.id?.toString();
          if (!storyId) return;
          try {
            const data = await interactionsService.getStoryInteractions(storyId);
            interactionsByStory[storyId] = {
              views: data.views || 0,
              comments: (data.comments || []).length,
              shares: data.shares || 0,
            };
          } catch (error) {
            console.error('Failed to load interactions for story:', storyId, error);
          }
        })
      );
      setStoryInteractions(interactionsByStory);
    } catch (error) {
      console.error('Failed to load interactions for stories:', error);
      setStoryInteractions({});
    }
  }, []);

  const loadStories = useCallback(async () => {
    try {
      // Load published stories from Firestore
      const allStories = await storiesService.getPublished();
      setStories(allStories);
      await loadInteractionsForStories(allStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  }, [loadInteractionsForStories]);

  useEffect(() => {
    loadStories();
    
    // Listen for storage changes (when admin updates stories)
    const handleStorageChange = (e) => {
      if (e.key === 'stories_data') {
        loadStories();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (same-tab updates)
    const handleStoriesUpdate = () => {
      loadStories();
    };
    
    window.addEventListener('storiesUpdated', handleStoriesUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storiesUpdated', handleStoriesUpdate);
    };
  }, [loadStories]);

  const filteredStories = (selectedCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory)
  ).sort((a, b) => {
    // Featured stories first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    // Then sort by date, newest first
    return new Date(b.date) - new Date(a.date);
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatNumber = (num) => {
    const value = typeof num === 'number' ? num : 0;
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value.toString();
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="container-custom section-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Stories of Impact</h1>
            <p className="text-xl text-primary-100">
              Real stories from the communities we serve, the students we educate, and the lives we transform.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedCategory === 'all' ? 'All Stories' : `${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the real impact of education through the stories of students, teachers, and communities.
            </p>
          </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredStories.map((story) => (
               <Link key={story.id} to={`/stories/${story.id}`} className="block">
                 <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                   {/* Story Image */}
                   <div className="relative h-40 bg-gray-200">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                  {story.featured && (
                    <div className="absolute top-4 left-4 bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                </div>

                {/* Story Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(story.date)}</span>
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{story.location}</span>
                  </div>

                                     {/* Title and Excerpt */}
                   <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                     {story.title}
                   </h3>
                   <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                     {story.excerpt}
                   </p>

                                     {/* Author */}
                   <div className="flex items-center mb-3">
                     <User className="h-3 w-3 text-gray-400 mr-1" />
                     <span className="text-xs text-gray-600">By {story.author}</span>
                   </div>

                                     {/* Engagement Stats */}
                   <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                     <div className="flex items-center space-x-3">
                       <div className="flex items-center">
                         <Eye className="h-3 w-3 mr-1" />
                         <span>
                           {formatNumber(
                             storyInteractions[story.id?.toString()]?.views ?? story.views ?? 0
                           )}
                         </span>
                       </div>
                       <div className="flex items-center">
                         <MessageCircle className="h-3 w-3 mr-1" />
                         <span>
                           {formatNumber(
                             storyInteractions[story.id?.toString()]?.comments ?? story.comments ?? 0
                           )}
                         </span>
                       </div>
                       <div className="flex items-center">
                         <Share2 className="h-3 w-3 mr-1" />
                         <span>
                           {formatNumber(
                             storyInteractions[story.id?.toString()]?.shares ?? story.shares ?? 0
                           )}
                         </span>
                       </div>
                     </div>
                   </div>

                                     {/* Read More Button */}
                   <div className="text-primary-600 hover:text-primary-700 font-semibold text-xs flex items-center group">
                     Read Full Story
                     <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                   </div>
                 </div>
               </article>
               </Link>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="btn-primary">
              Load More Stories
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Have you been impacted by our work? We'd love to hear your story and share it with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:contact@betiharisociety.org" 
              className="btn-secondary text-lg px-8 py-4"
            >
              Share Your Story
            </a>
            <a 
              href="/get-involved" 
              className="btn-outline text-white border-white hover:bg-white hover:text-primary-700 text-lg px-8 py-4"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Stories;
