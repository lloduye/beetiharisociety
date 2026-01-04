// Interactions service - handles comments, likes, views, shares
const INTERACTIONS_KEY = 'story_interactions';

export const interactionsService = {
  /**
   * Get all interactions for all stories
   */
  getAll() {
    try {
      const data = localStorage.getItem(INTERACTIONS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load interactions:', error);
      return {};
    }
  },

  /**
   * Get interactions for a specific story
   */
  getStoryInteractions(storyId) {
    const all = this.getAll();
    return all[storyId] || {
      likes: [],
      comments: [],
      views: 0,
      shares: 0,
      activityLog: [],
    };
  },

  /**
   * Add a like to a story
   */
  addLike(storyId, userId = null) {
    const all = this.getAll();
    if (!all[storyId]) {
      all[storyId] = { likes: [], comments: [], views: 0, shares: 0, activityLog: [] };
    }
    
    const userKey = userId || `user_${Date.now()}_${Math.random()}`;
    if (!all[storyId].likes.includes(userKey)) {
      all[storyId].likes.push(userKey);
      // Log activity
      if (!all[storyId].activityLog) {
        all[storyId].activityLog = [];
      }
      all[storyId].activityLog.push({
        type: 'like',
        timestamp: new Date().toISOString(),
        storyId: storyId
      });
      this.saveAll(all);
    }
    
    return all[storyId].likes.length;
  },

  /**
   * Remove a like from a story
   */
  removeLike(storyId, userId = null) {
    const all = this.getAll();
    if (!all[storyId]) return 0;
    
    const userKey = userId || this.getUserKey(storyId);
    all[storyId].likes = all[storyId].likes.filter(key => key !== userKey);
    this.saveAll(all);
    
    return all[storyId].likes.length;
  },

  /**
   * Check if user has liked a story
   */
  hasLiked(storyId, userId = null) {
    const interactions = this.getStoryInteractions(storyId);
    const userKey = userId || this.getUserKey(storyId);
    return interactions.likes.includes(userKey);
  },

  /**
   * Add a comment to a story
   */
  addComment(storyId, comment) {
    const all = this.getAll();
    if (!all[storyId]) {
      all[storyId] = { likes: [], comments: [], views: 0, shares: 0, activityLog: [] };
    }
    
    const newComment = {
      id: Date.now(),
      text: comment.text,
      author: comment.author || 'Anonymous User',
      date: new Date().toISOString(),
      likes: 0,
      userId: comment.userId || null,
    };
    
    all[storyId].comments.push(newComment);
    // Log activity
    if (!all[storyId].activityLog) {
      all[storyId].activityLog = [];
    }
    all[storyId].activityLog.push({
      type: 'comment',
      timestamp: new Date().toISOString(),
      storyId: storyId,
      commentId: newComment.id,
      author: newComment.author
    });
    this.saveAll(all);
    
    return all[storyId].comments;
  },

  /**
   * Get comments for a story
   */
  getComments(storyId) {
    const interactions = this.getStoryInteractions(storyId);
    return interactions.comments || [];
  },

  /**
   * Increment view count
   */
  incrementViews(storyId) {
    const all = this.getAll();
    if (!all[storyId]) {
      all[storyId] = { likes: [], comments: [], views: 0, shares: 0, activityLog: [] };
    }
    
    // Only increment once per session
    const viewKey = `viewed_${storyId}`;
    if (!sessionStorage.getItem(viewKey)) {
      all[storyId].views += 1;
      sessionStorage.setItem(viewKey, 'true');
      // Log activity
      if (!all[storyId].activityLog) {
        all[storyId].activityLog = [];
      }
      all[storyId].activityLog.push({
        type: 'view',
        timestamp: new Date().toISOString(),
        storyId: storyId
      });
      this.saveAll(all);
    }
    
    return all[storyId].views;
  },

  /**
   * Increment share count
   */
  incrementShares(storyId) {
    const all = this.getAll();
    if (!all[storyId]) {
      all[storyId] = { likes: [], comments: [], views: 0, shares: 0, activityLog: [] };
    }
    
    all[storyId].shares += 1;
    // Log activity
    if (!all[storyId].activityLog) {
      all[storyId].activityLog = [];
    }
    all[storyId].activityLog.push({
      type: 'share',
      timestamp: new Date().toISOString(),
      storyId: storyId
    });
    this.saveAll(all);
    
    return all[storyId].shares;
  },

  /**
   * Get view count
   */
  getViews(storyId) {
    const interactions = this.getStoryInteractions(storyId);
    return interactions.views || 0;
  },

  /**
   * Get share count
   */
  getShares(storyId) {
    const interactions = this.getStoryInteractions(storyId);
    return interactions.shares || 0;
  },

  /**
   * Get like count
   */
  getLikes(storyId) {
    const interactions = this.getStoryInteractions(storyId);
    return interactions.likes.length || 0;
  },

  /**
   * Save all interactions
   */
  saveAll(interactions) {
    try {
      localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(interactions));
    } catch (error) {
      console.error('Failed to save interactions:', error);
    }
  },

  /**
   * Get or create user key for this story
   */
  getUserKey(storyId) {
    const key = `user_${storyId}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, `user_${Date.now()}_${Math.random()}`);
    }
    return localStorage.getItem(key);
  },

  /**
   * Get recent activity across all stories
   */
  getRecentActivity(limit = 10) {
    const all = this.getAll();
    const activities = [];

    // Collect all activities from all stories
    Object.keys(all).forEach(storyId => {
      const story = all[storyId];
      if (story.activityLog && story.activityLog.length > 0) {
        story.activityLog.forEach(activity => {
          activities.push({
            ...activity,
            storyId: parseInt(storyId)
          });
        });
      }
    });

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Return limited results
    return activities.slice(0, limit);
  },
};

