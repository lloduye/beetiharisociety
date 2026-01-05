// Stories service - manages stories using Firebase Firestore
import { db, firebaseInitialized } from '../config/firebase';
import { storiesData } from '../data/storiesData';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

const STORIES_COLLECTION = 'stories';
const STORIES_CACHE_KEY = 'stories_data';

export const storiesService = {
  /**
   * Get all stories - with optional real-time updates
   * @param {Function} callback - Optional callback for real-time updates
   * @returns {Promise|Function} Returns promise or unsubscribe function
   */
  getAll(callback) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Loading stories from fallback data.');
      // Fallback to localStorage or initial data
      try {
        const cached = localStorage.getItem(STORIES_CACHE_KEY);
        if (cached) {
          const stories = JSON.parse(cached);
          if (callback) callback(stories);
          return Promise.resolve(stories);
        }
      } catch (e) {
        console.warn('Failed to load from cache:', e);
      }
      // Use initial data as last resort
      const fallbackStories = storiesData || [];
      if (callback) callback(fallbackStories);
      return Promise.resolve(fallbackStories);
    }
    const storiesRef = collection(db, STORIES_COLLECTION);
    
    if (callback) {
      // Real-time listener
      return onSnapshot(storiesRef, (snapshot) => {
        const stories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(stories);
      }, (error) => {
        console.error('Error getting stories:', error);
        callback([]);
      });
    } else {
      // One-time fetch
      return getDocs(storiesRef).then(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }).catch(error => {
        console.error('Error getting stories:', error);
        return [];
      });
    }
  },

  /**
   * Get a single story by ID
   */
  async getById(id) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Loading story from fallback data.');
      // Fallback to localStorage or initial data
      try {
        const cached = localStorage.getItem(STORIES_CACHE_KEY);
        if (cached) {
          const stories = JSON.parse(cached);
          const story = stories.find(s => s.id === parseInt(id) || s.id === id);
          return story || null;
        }
      } catch (e) {
        console.warn('Failed to load from cache:', e);
      }
      // Use initial data as last resort
      const fallbackStories = storiesData || [];
      return fallbackStories.find(s => s.id === parseInt(id) || s.id === id) || null;
    }
    try {
      const storyRef = doc(db, STORIES_COLLECTION, id.toString());
      const storySnap = await getDoc(storyRef);
      
      if (!storySnap.exists()) {
        // Fallback check
        const fallbackStories = storiesData || [];
        return fallbackStories.find(s => s.id === parseInt(id) || s.id === id) || null;
      }
      
      return {
        id: storySnap.id,
        ...storySnap.data()
      };
    } catch (error) {
      console.error('Error getting story by ID:', error);
      // Fallback on error
      const fallbackStories = storiesData || [];
      return fallbackStories.find(s => s.id === parseInt(id) || s.id === id) || null;
    }
  },

  /**
   * Get published stories only (for public website)
   */
  async getPublished() {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Loading published stories from fallback data.');
      // Fallback to localStorage or initial data
      try {
        const cached = localStorage.getItem(STORIES_CACHE_KEY);
        if (cached) {
          const stories = JSON.parse(cached);
          return stories.filter(s => s.published);
        }
      } catch (e) {
        console.warn('Failed to load from cache:', e);
      }
      // Use initial data as last resort
      const fallbackStories = storiesData || [];
      return fallbackStories.filter(s => s.published);
    }
    try {
      const storiesRef = collection(db, STORIES_COLLECTION);
      const q = query(storiesRef, where('published', '==', true));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting published stories:', error);
      // Fallback on error
      const fallbackStories = storiesData || [];
      return fallbackStories.filter(s => s.published);
    }
  },

  /**
   * Save stories - saves to Firestore
   */
  async saveStories(stories) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot save stories to Firestore.');
      // Fallback to localStorage
      try {
        localStorage.setItem(STORIES_CACHE_KEY, JSON.stringify(stories));
        return { success: true, message: 'Stories saved to local storage (Firebase not available)' };
      } catch (error) {
        throw new Error('Firebase is not initialized and local storage save failed.');
      }
    }
    try {
      const batch = [];
      stories.forEach(story => {
        const storyId = story.id?.toString() || Date.now().toString();
        const storyRef = doc(db, STORIES_COLLECTION, storyId);
        const storyData = {
          ...story,
          id: storyId,
          updatedAt: serverTimestamp()
        };
        batch.push(setDoc(storyRef, storyData, { merge: true }));
      });
      await Promise.all(batch);
      return { success: true, message: 'Stories saved successfully' };
    } catch (error) {
      console.error('Error saving stories:', error);
      throw error;
    }
  },

  /**
   * Create a new story
   */
  async createStory(storyData) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot create story.');
      throw new Error('Firebase is not initialized. Please check environment variables.');
    }
    try {
      const storyRef = doc(collection(db, STORIES_COLLECTION));
      const newStory = {
        ...storyData,
        id: storyRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        shares: 0,
        likes: 0,
        comments: 0,
        published: storyData.published || false,
        featured: storyData.featured || false
      };
      
      await setDoc(storyRef, newStory);
      return { id: storyRef.id, ...newStory };
    } catch (error) {
      console.error('Error creating story:', error);
      throw error;
    }
  },

  /**
   * Update a single story
   */
  async updateStory(storyId, updates) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot update story.');
      throw new Error('Firebase is not initialized. Please check environment variables.');
    }
    try {
      const storyRef = doc(db, STORIES_COLLECTION, storyId.toString());
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(storyRef, updateData, { merge: true });
      
      const updated = await getDoc(storyRef);
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      console.error('Error updating story:', error);
      throw error;
    }
  },

  /**
   * Delete a story
   */
  async deleteStory(storyId) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot delete story.');
      throw new Error('Firebase is not initialized. Please check environment variables.');
    }
    try {
      await deleteDoc(doc(db, STORIES_COLLECTION, storyId.toString()));
      return true;
    } catch (error) {
      console.error('Error deleting story:', error);
      throw error;
    }
  },

  /**
   * Get cached stories (for backward compatibility - now just calls getAll)
   */
  getCached() {
    // For backward compatibility, return null to trigger fetch
    return null;
  },

  /**
   * Clear the cache (no-op for Firestore)
   */
  clearCache() {
    // No-op for Firestore
    return;
  }
};
