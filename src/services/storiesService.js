// Stories service - manages stories using Firebase Firestore
// REQUIRES Firebase to be initialized - no fallbacks
import { db, firebaseInitialized } from '../config/firebase';
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

export const storiesService = {
  /**
   * Get all stories - with optional real-time updates
   * @param {Function} callback - Optional callback for real-time updates
   * @returns {Promise|Function} Returns promise or unsubscribe function
   */
  getAll(callback) {
    if (!firebaseInitialized || !db) {
      const error = new Error('Firebase is not initialized. Please configure environment variables in Netlify.');
      console.error('❌ Firebase required for stories:', error);
      if (callback) callback([]);
      return Promise.reject(error);
    }
    const storiesRef = collection(db, STORIES_COLLECTION);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firestore query timeout after 5 seconds')), 5000);
    });
    
    if (callback) {
      // Real-time listener with timeout
      const listener = onSnapshot(storiesRef, (snapshot) => {
        const stories = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(stories);
      }, (error) => {
        console.error('Error getting stories:', error);
        callback([]);
      });
      
      // Return unsubscribe function
      return listener;
    } else {
      // One-time fetch with timeout
      return Promise.race([
        getDocs(storiesRef).then(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }),
        timeoutPromise
      ]).catch(error => {
        console.error('Error getting stories (timeout or error):', error);
        return [];
      });
    }
  },

  /**
   * Get a single story by ID
   * Supports both string and numeric IDs
   */
  async getById(id) {
    if (!firebaseInitialized || !db) {
      const error = new Error('Firebase is not initialized. Please configure environment variables in Netlify.');
      console.error('❌ Firebase required for stories:', error);
      throw error;
    }
    try {
      // Try the ID as-is first (string)
      let storyRef = doc(db, STORIES_COLLECTION, id.toString());
      let storySnap = await getDoc(storyRef);
      
      if (storySnap.exists()) {
        return {
          id: storySnap.id,
          ...storySnap.data()
        };
      }
      
      // If not found, try querying by the id field in the document
      const storiesRef = collection(db, STORIES_COLLECTION);
      const q = query(storiesRef, where('id', '==', id.toString()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        return {
          id: docData.id,
          ...docData.data()
        };
      }
      
      // Also try numeric comparison
      const allStories = await this.getAll();
      const found = allStories.find(s => 
        s.id === id || 
        s.id === parseInt(id) || 
        s.id?.toString() === id?.toString() ||
        parseInt(s.id) === parseInt(id)
      );
      
      return found || null;
    } catch (error) {
      console.error('Error getting story by ID:', error);
      throw error;
    }
  },

  /**
   * Get published stories only (for public website)
   */
  async getPublished() {
    if (!firebaseInitialized || !db) {
      const error = new Error('Firebase is not initialized. Please configure environment variables in Netlify.');
      console.error('❌ Firebase required for stories:', error);
      throw error;
    }
    try {
      const storiesRef = collection(db, STORIES_COLLECTION);
      const q = query(storiesRef, where('published', '==', true));
      
      // Add 5 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Firestore query timeout')), 5000);
      });
      
      const snapshot = await Promise.race([
        getDocs(q),
        timeoutPromise
      ]);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting published stories:', error);
      // Return empty array instead of throwing to prevent page crashes
      return [];
    }
  },

  /**
   * Save stories - saves to Firestore
   */
  async saveStories(stories) {
    if (!firebaseInitialized || !db) {
      const error = new Error('Firebase is not initialized. Please configure environment variables in Netlify.');
      console.error('❌ Firebase required to save stories:', error);
      throw error;
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
