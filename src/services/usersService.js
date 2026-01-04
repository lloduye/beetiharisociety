// Users service - manages user accounts using Firebase Firestore
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

const USERS_COLLECTION = 'users';

export const usersService = {
  /**
   * Get all users - with optional real-time updates
   * @param {Function} callback - Optional callback for real-time updates
   * @returns {Promise|Function} Returns promise or unsubscribe function
   */
  getAll(callback) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot load users. Please check Firebase configuration.');
      // For login to work, we need Firebase - show helpful error
      if (callback) callback([]);
      return Promise.resolve([]);
    }
    const usersRef = collection(db, USERS_COLLECTION);
    
    if (callback) {
      // Real-time listener
      return onSnapshot(usersRef, (snapshot) => {
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(users);
      }, (error) => {
        console.error('Error getting users:', error);
        callback([]);
      });
    } else {
      // One-time fetch
      return getDocs(usersRef).then(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }).catch(error => {
        console.error('Error getting users:', error);
        return [];
      });
    }
  },

  /**
   * Get a user by email
   */
  async getByEmail(email) {
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return null;
      
      return {
        id: snapshot.docs[0].id,
        ...snapshot.docs[0].data()
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  },

  /**
   * Create a new user
   */
  async createUser(userData) {
    try {
      // Check if user already exists
      const existing = await this.getByEmail(userData.email);
      if (existing) {
        throw new Error('User with this email already exists');
      }

      const userRef = doc(collection(db, USERS_COLLECTION));
      const newUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.toLowerCase(),
        team: userData.team,
        phone: userData.phone || '',
        position: userData.position || '',
        password: userData.password, // In production, hash this!
        createdAt: serverTimestamp(),
        isActive: userData.isActive !== undefined ? userData.isActive : true
      };
      
      await setDoc(userRef, newUser);
      return { id: userRef.id, ...newUser };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Update a user
   */
  async updateUser(userId, updates) {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };
      
      // Don't update email if it's the same
      if (updates.email) {
        const currentUser = await getDoc(userRef);
        if (currentUser.exists() && currentUser.data().email === updates.email.toLowerCase()) {
          delete updateData.email;
        } else {
          // Check if new email already exists
          const existing = await this.getByEmail(updates.email);
          if (existing && existing.id !== userId) {
            throw new Error('User with this email already exists');
          }
          updateData.email = updates.email.toLowerCase();
        }
      }
      
      await setDoc(userRef, updateData, { merge: true });
      
      const updated = await getDoc(userRef);
      return { id: updated.id, ...updated.data() };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete a user
   */
  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, userId));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Reset user password
   */
  async resetPassword(email, team) {
    const user = await this.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.team !== team) {
      throw new Error('Team does not match');
    }

    // Generate a temporary password
    const tempPassword = 'temp' + Math.random().toString(36).slice(-8);
    await this.updateUser(user.id, { password: tempPassword });
    return tempPassword;
  },

  /**
   * Authenticate user
   */
  async authenticate(email, team, password) {
    try {
      const user = await this.getByEmail(email);
      
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (!user.isActive) {
        return { success: false, error: 'Account is inactive' };
      }

      if (user.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (user.team !== team) {
        return { success: false, error: 'Team does not match' };
      }

      // Ensure firstName and lastName exist (for backward compatibility)
      const userWithName = {
        ...user,
        firstName: user.firstName || 'User',
        lastName: user.lastName || ''
      };

      return { success: true, user: userWithName };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, error: 'Authentication failed' };
    }
  },

  /**
   * Initialize default user (run once on app start)
   */
  async initializeDefaultUser() {
    try {
      const existing = await this.getByEmail('admin@betiharisociety.org');
      if (existing) {
        return; // Default user already exists
      }

      await this.createUser({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@betiharisociety.org',
        team: 'Board of Directors',
        position: 'Administrator',
        password: 'betihari2024',
        isActive: true
      });
      console.log('Default admin user created successfully');
    } catch (error) {
      console.error('Error initializing default user:', error);
      // Don't throw - allow app to continue even if default user creation fails
      // This prevents the app from crashing if Firestore rules haven't been set up yet
    }
  }
};
