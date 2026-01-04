import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useZeffy } from '../contexts/ZeffyContext';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';
import { 
  ArrowLeft, 
  ArrowRight,
  Calendar, 
  User, 
  MapPin, 
  Eye, 
  MessageCircle, 
  Share2, 
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Send
} from 'lucide-react';

const StoryDetail = () => {
  const { id } = useParams();
  const { openModal } = useZeffy();
  const [liked, setLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [story, setStory] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interactions, setInteractions] = useState({
    likes: 0,
    views: 0,
    shares: 0,
    comments: 0,
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadStories = async () => {
    try {
      setLoading(true);
      // Load stories - prioritizes localStorage (has admin changes)
      const allStories = await storiesService.getPublished();
      setStories(allStories);
      const found = allStories.find(s => s.id === parseInt(id));
      setStory(found);

      // Load interactions
      if (found) {
        loadInteractions(parseInt(id));
      }
    } catch (error) {
      console.error('Failed to load stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInteractions = async (storyId) => {
    try {
      // Increment views
      const views = await interactionsService.incrementViews(storyId);
      
      // Load existing interactions
      const likes = await interactionsService.getLikes(storyId);
      const shares = await interactionsService.getShares(storyId);
      const commentsList = await interactionsService.getComments(storyId);
      const hasLiked = await interactionsService.hasLiked(storyId);

      setInteractions({
        likes,
        views,
        shares,
        comments: commentsList.length,
      });
      setLiked(hasLiked);
      setComments(commentsList);
    } catch (error) {
      console.error('Error loading interactions:', error);
    }
  };

  const handleLike = async () => {
    const storyId = parseInt(id);
    try {
      if (liked) {
        const newCount = await interactionsService.removeLike(storyId);
        setInteractions(prev => ({ ...prev, likes: newCount }));
        setLiked(false);
      } else {
        const newCount = await interactionsService.addLike(storyId);
        setInteractions(prev => ({ ...prev, likes: newCount }));
        setLiked(true);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleComment = async () => {
    if (commentText.trim()) {
      const storyId = parseInt(id);
      try {
        const newComments = await interactionsService.addComment(storyId, {
          text: commentText,
        author: 'Anonymous User',
      });
        setComments(newComments);
        setInteractions(prev => ({ ...prev, comments: newComments.length }));
        setCommentText('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleShare = async (platform) => {
    const storyId = parseInt(id);
    try {
      const newShares = await interactionsService.incrementShares(storyId);
      setInteractions(prev => ({ ...prev, shares: newShares }));

      const url = window.location.href;
      const text = story.title;
      
      let shareUrl = '';
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check out this story: ${url}`)}`;
          break;
        default:
          break;
      }
      
      if (shareUrl) {
        window.open(shareUrl, '_blank');
      }
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error incrementing shares:', error);
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

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-6">The story you're looking for doesn't exist.</p>
          <Link to="/stories" className="btn-primary">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatNumber = (num) => {
    const value = num || 0;
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }
    return value.toString();
  };

  return (
    <div>
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <Link 
            to="/stories" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 bg-gray-200">
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {story.featured && (
          <div className="absolute top-6 left-6 bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Featured Story
          </div>
        )}
      </div>

      {/* Story Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(story.date)}</span>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4 mr-1" />
              <span>{story.location}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{story.category}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {story.title}
            </h1>

            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {story.excerpt}
            </p>

            <div className="flex items-center mb-8">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-600">By {story.author}</span>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 mb-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-600">{formatNumber(interactions.views || story.views)} views</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-600">{formatNumber(interactions.comments || story.comments)} comments</span>
              </div>
              <div className="flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-gray-400" />
                <span className="text-gray-600">{formatNumber(interactions.shares || story.shares)} shares</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  liked 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                <span>{formatNumber(interactions.likes || story.likes)}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Linkedin className="h-4 w-4 mr-3 text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <Mail className="h-4 w-4 mr-3 text-gray-600" />
                      Email
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {story.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

                     {/* Main Content */}
           <div className="prose prose-lg max-w-none mb-12">
             {story.content.includes('\n\n') ? (
               story.content.split('\n\n').map((paragraph, index) => (
                 <p key={index} className="text-gray-700 leading-relaxed mb-6">
                   {paragraph}
                 </p>
               ))
             ) : (
               <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                 {story.content}
               </p>
             )}
           </div>

           {/* Comments Section */}
           <div className="mb-12">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-2xl font-bold text-gray-900">Comments ({interactions.comments || story.comments})</h3>
               <button
                 onClick={() => setShowComments(!showComments)}
                 className="text-primary-600 hover:text-primary-700 font-medium"
               >
                 {showComments ? 'Hide Comments' : 'Show Comments'}
               </button>
             </div>

             {showComments && (
               <div className="space-y-6">
                 {/* Add Comment */}
                 <div className="bg-gray-50 rounded-lg p-4">
                   <div className="flex space-x-3">
                     <div className="flex-shrink-0">
                       <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                         <User className="h-4 w-4 text-white" />
                       </div>
                     </div>
                     <div className="flex-1">
                       <textarea
                         value={commentText}
                         onChange={(e) => setCommentText(e.target.value)}
                         placeholder="Share your thoughts..."
                         className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                         rows="3"
                       />
                       <div className="flex justify-end mt-2">
                         <button
                           onClick={handleComment}
                           disabled={!commentText.trim()}
                           className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                         >
                           <Send className="h-4 w-4 mr-1" />
                           Post Comment
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Comments List */}
                 <div className="space-y-4">
                   {comments.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">
                       <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                       <p>No comments yet. Be the first to share your thoughts!</p>
                     </div>
                   ) : (
                     comments.map((comment) => (
                     <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                       <div className="flex items-start space-x-3">
                         <div className="flex-shrink-0">
                           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                             <User className="h-4 w-4 text-gray-600" />
                           </div>
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center space-x-2 mb-2">
                             <span className="font-medium text-gray-900">{comment.author}</span>
                             <span className="text-gray-500">•</span>
                             <span className="text-sm text-gray-500">
                               {new Date(comment.date).toLocaleDateString()}
                             </span>
                           </div>
                           <p className="text-gray-700">{comment.text}</p>
                         </div>
                       </div>
                     </div>
                   ))
                   )}
                 </div>
               </div>
             )}
           </div>

                     {/* Call to Action */}
           <div className="bg-primary-50 rounded-lg p-8 text-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-4">
               Inspired by this story?
             </h3>
             <p className="text-gray-600 mb-6">
               Help us create more stories like this by supporting our educational programs.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button 
                 onClick={openModal}
                 className="btn-primary"
               >
                 Make a Donation
               </button>
               <Link 
                 to="/get-involved" 
                 className="btn-outline"
               >
                 Get Involved
               </Link>
             </div>
           </div>
         </div>
       </div>

       {/* Next Stories Section */}
       <section className="bg-gray-50 py-16">
         <div className="container-custom">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-gray-900 mb-4">More Stories</h2>
             <p className="text-lg text-gray-600">Discover more inspiring stories from our community</p>
           </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {stories
               .filter(s => s.id !== story.id)
               .sort((a, b) => {
                 // Featured stories first
                 if (a.featured && !b.featured) return -1;
                 if (!a.featured && b.featured) return 1;
                 // Then sort by date, newest first
                 return new Date(b.date) - new Date(a.date);
               })
               .slice(0, 6)
               .map((nextStory) => (
                 <Link key={nextStory.id} to={`/stories/${nextStory.id}`} className="block">
                   <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                     {/* Story Image */}
                     <div className="relative h-40 bg-gray-200">
                       <img
                         src={nextStory.image}
                         alt={nextStory.title}
                         className="w-full h-full object-cover"
                       />
                       {nextStory.featured && (
                         <div className="absolute top-3 left-3 bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                           Featured
                         </div>
                       )}
                     </div>

                     {/* Story Content */}
                     <div className="p-4">
                       {/* Meta Information */}
                       <div className="flex items-center text-xs text-gray-500 mb-2">
                         <Calendar className="h-3 w-3 mr-1" />
                         <span>{formatDate(nextStory.date)}</span>
                         <span className="mx-2">•</span>
                         <span className="capitalize">{nextStory.category}</span>
                       </div>

                       {/* Title and Excerpt */}
                       <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                         {nextStory.title}
                       </h3>
                       <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                         {nextStory.excerpt}
                       </p>

                       {/* Author */}
                       <div className="flex items-center mb-3">
                         <User className="h-3 w-3 text-gray-400 mr-1" />
                         <span className="text-xs text-gray-600">By {nextStory.author}</span>
                       </div>

                       {/* Engagement Stats */}
                       <div className="flex items-center justify-between text-xs text-gray-500">
                         <div className="flex items-center space-x-3">
                           <div className="flex items-center">
                             <Eye className="h-3 w-3 mr-1" />
                             <span>{formatNumber(interactionsService.getViews(nextStory.id) || nextStory.views)}</span>
                           </div>
                           <div className="flex items-center">
                             <MessageCircle className="h-3 w-3 mr-1" />
                             <span>{formatNumber(interactionsService.getComments(nextStory.id).length || nextStory.comments)}</span>
                           </div>
                         </div>
                         <div className="text-primary-600 hover:text-primary-700 font-semibold text-xs flex items-center group">
                           Read More
                           <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                         </div>
                       </div>
                     </div>
                   </article>
                 </Link>
               ))}
           </div>

           <div className="text-center mt-8">
             <Link to="/stories" className="btn-primary">
               View All Stories
             </Link>
           </div>
         </div>
       </section>
     </div>
   );
 };

export default StoryDetail;
