// Interactions service - handles comments, likes, views, shares using Firebase Firestore
import { db, firebaseInitialized } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';

const INTERACTIONS_COLLECTION = 'interactions';

export const interactionsService = {
  /**
   * Get all interactions for all stories
   */
  async getAll() {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Returning empty object.');
      return {};
    }
    try {
      const interactionsRef = collection(db, INTERACTIONS_COLLECTION);
      const snapshot = await getDocs(interactionsRef);
      
      const interactions = {};
      snapshot.docs.forEach(doc => {
        interactions[doc.id] = doc.data();
      });
      
      return interactions;
    } catch (error) {
      console.error('Failed to load interactions:', error);
      return {};
    }
  },

  /**
   * Get interactions for a specific story
   */
  async getStoryInteractions(storyId) {
    try {
      const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
      const interactionSnap = await getDoc(interactionRef);
      
      if (!interactionSnap.exists()) {
        // Return default structure
        return {
          likes: [],
          comments: [],
          views: 0,
          shares: 0,
          activityLog: []
        };
      }
      
      const data = interactionSnap.data();
      return {
        likes: data.likes || [],
        comments: data.comments || [],
        views: data.views || 0,
        shares: data.shares || 0,
        activityLog: data.activityLog || []
      };
    } catch (error) {
      console.error('Error getting story interactions:', error);
      return {
        likes: [],
        comments: [],
        views: 0,
        shares: 0,
        activityLog: []
      };
    }
  },

  /**
   * Initialize interaction document if it doesn't exist
   */
  async ensureInteractionDoc(storyId) {
    const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
    const interactionSnap = await getDoc(interactionRef);
    
    if (!interactionSnap.exists()) {
      await setDoc(interactionRef, {
        likes: [],
        comments: [],
        views: 0,
        shares: 0,
        activityLog: [],
        createdAt: serverTimestamp()
      });
    }
  },

  /**
   * Add a like to a story
   */
  async addLike(storyId, userId = null) {
    try {
      await this.ensureInteractionDoc(storyId);
      const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
      const interaction = await getDoc(interactionRef);
      const data = interaction.data();
      
      const userKey = userId || `user_${Date.now()}_${Math.random()}`;
      const likes = data.likes || [];
      
      if (!likes.includes(userKey)) {
        likes.push(userKey);
        const activityLog = data.activityLog || [];
        activityLog.push({
          type: 'like',
          timestamp: new Date().toISOString(),
          storyId: storyId.toString()
        });
        
        await updateDoc(interactionRef, {
          likes,
          activityLog,
          updatedAt: serverTimestamp()
        });
      }
      
      return likes.length;
    } catch (error) {
      console.error('Error adding like:', error);
      throw error;
    }
  },

  /**
   * Remove a like from a story
   */
  async removeLike(storyId, userId = null) {
    try {
      const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
      const interaction = await getDoc(interactionRef);
      
      if (!interaction.exists()) {
        return 0;
      }
      
      const data = interaction.data();
      const likes = data.likes || [];
      const userKey = userId || this.getUserKey(storyId);
      
      const updatedLikes = likes.filter(key => key !== userKey);
      
      await updateDoc(interactionRef, {
        likes: updatedLikes,
        updatedAt: serverTimestamp()
      });
      
      return updatedLikes.length;
    } catch (error) {
      console.error('Error removing like:', error);
      throw error;
    }
  },

  /**
   * Check if user has liked a story
   */
  async hasLiked(storyId, userId = null) {
    try {
      const interactions = await this.getStoryInteractions(storyId);
      const userKey = userId || this.getUserKey(storyId);
      return interactions.likes.includes(userKey);
    } catch (error) {
      console.error('Error checking like:', error);
      return false;
    }
  },

  /**
   * Add a comment to a story
   */
  async addComment(storyId, comment) {
    try {
      await this.ensureInteractionDoc(storyId);
      const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
      const interaction = await getDoc(interactionRef);
      const data = interaction.data();
      
      const newComment = {
        id: Date.now().toString(),
        text: comment.text,
        author: comment.author || 'Anonymous User',
        date: new Date().toISOString(),
        likes: 0,
        userId: comment.userId || null,
      };
      
      const comments = data.comments || [];
      comments.push(newComment);
      
      const activityLog = data.activityLog || [];
      activityLog.push({
        type: 'comment',
        timestamp: new Date().toISOString(),
        storyId: storyId.toString(),
        commentId: newComment.id,
        author: newComment.author
      });
      
      await updateDoc(interactionRef, {
        comments,
        activityLog,
        updatedAt: serverTimestamp()
      });
      
      return comments;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Get comments for a story
   */
  async getComments(storyId) {
    try {
      const interactions = await this.getStoryInteractions(storyId);
      return interactions.comments || [];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  /**
   * Increment view count
   */
  async incrementViews(storyId) {
    try {
      await this.ensureInteractionDoc(storyId);
      const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
      
      // Check sessionStorage to prevent duplicate views in same session
      const viewKey = `viewed_${storyId}`;
      if (sessionStorage.getItem(viewKey)) {
        const interaction = await getDoc(interactionRef);
        return interaction.data()?.views || 0;
      }
      
      sessionStorage.setItem(viewKey, 'true');
      
      await updateDoc(interactionRef, {
        views: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // Add to activity log
      const interaction = await getDoc(interactionRef);
      const data = interaction.data();
      const activityLog = data.activityLog || [];
      activityLog.push({
        type: 'view',
        timestamp: new Date().toISOString(),
        storyId: storyId.toString()
      });
      
      await updateDoc(interactionRef, {
        activityLog,
        updatedAt: serverTimestamp()
      });
      
      const updated = await getDoc(interactionRef);
      return updated.data()?.views || 0;
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  },

  /**
   * Increment share count
   */
  async incrementShares(storyId) {
    try {
      await this.ensureInteractionDoc(storyId);
      const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
      
      await updateDoc(interactionRef, {
        shares: increment(1),
        updatedAt: serverTimestamp()
      });
      
      // Add to activity log
      const interaction = await getDoc(interactionRef);
      const data = interaction.data();
      const activityLog = data.activityLog || [];
      activityLog.push({
        type: 'share',
        timestamp: new Date().toISOString(),
        storyId: storyId.toString()
      });
      
      await updateDoc(interactionRef, {
        activityLog,
        updatedAt: serverTimestamp()
      });
      
      const updated = await getDoc(interactionRef);
      return updated.data()?.shares || 0;
    } catch (error) {
      console.error('Error incrementing shares:', error);
      throw error;
    }
  },

  /**
   * Get view count
   */
  async getViews(storyId) {
    try {
      const interactions = await this.getStoryInteractions(storyId);
      return interactions.views || 0;
    } catch (error) {
      console.error('Error getting views:', error);
      return 0;
    }
  },

  /**
   * Get share count
   */
  async getShares(storyId) {
    try {
      const interactions = await this.getStoryInteractions(storyId);
      return interactions.shares || 0;
    } catch (error) {
      console.error('Error getting shares:', error);
      return 0;
    }
  },

  /**
   * Get like count
   */
  async getLikes(storyId) {
    try {
      const interactions = await this.getStoryInteractions(storyId);
      return interactions.likes?.length || 0;
    } catch (error) {
      console.error('Error getting likes:', error);
      return 0;
    }
  },

  /**
   * Save all interactions (for backward compatibility)
   */
  async saveAll(interactions) {
    try {
      const batch = [];
      Object.keys(interactions).forEach(storyId => {
        const interactionRef = doc(db, INTERACTIONS_COLLECTION, storyId.toString());
        batch.push(setDoc(interactionRef, {
          ...interactions[storyId],
          updatedAt: serverTimestamp()
        }, { merge: true }));
      });
      await Promise.all(batch);
    } catch (error) {
      console.error('Failed to save interactions:', error);
      throw error;
    }
  },

  /**
   * Get or create user key for this story (for backward compatibility)
   */
  getUserKey(storyId) {
    const key = `user_${storyId}`;
    if (!localStorage.getItem(key)) {
      const userKey = `user_${Date.now()}_${Math.random()}`;
      localStorage.setItem(key, userKey);
      return userKey;
    }
    return localStorage.getItem(key);
  },

  /**
   * Get recent activity across all stories
   */
  async getRecentActivity(activityLimit = 10) {
    try {
      const interactionsRef = collection(db, INTERACTIONS_COLLECTION);
      const snapshot = await getDocs(interactionsRef);
      
      const activities = [];
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const storyId = doc.id;
        
        if (data.activityLog && data.activityLog.length > 0) {
          data.activityLog.forEach(activity => {
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
      return activities.slice(0, activityLimit);
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }
};
