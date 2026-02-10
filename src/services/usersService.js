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
  serverTimestamp,
  addDoc,
  orderBy,
  limit as limitQuery
} from 'firebase/firestore';

const USERS_COLLECTION = 'users';
const USER_LOGINS_COLLECTION = 'userLogins';

export const usersService = {
  /**
   * Get all users - with optional real-time updates
   * @param {Function} callback - Optional callback for real-time updates
   * @returns {Promise|Function} Returns promise or unsubscribe function
   */
  getAll(callback) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot load users. Please check Firebase configuration.');
      if (callback) callback([]);
      return Promise.resolve([]);
    }
    const usersRef = collection(db, USERS_COLLECTION);
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Firestore query timeout after 5 seconds')), 5000);
    });
    
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
      // One-time fetch with timeout
      return Promise.race([
        getDocs(usersRef).then(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }),
        timeoutPromise
      ]).catch(error => {
        console.error('Error getting users (timeout or error):', error);
        return [];
      });
    }
  },

  /**
   * Get a user by email
   */
  async getByEmail(email) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot get user by email.');
      return null;
    }
    try {
      const usersRef = collection(db, USERS_COLLECTION);
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      
      // Add 5 second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Firestore query timeout')), 5000);
      });
      
      const snapshot = await Promise.race([
        getDocs(q),
        timeoutPromise
      ]);
      
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
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot create user.');
      throw new Error('Firebase is not initialized. Please check environment variables.');
    }
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
        personalEmail: userData.personalEmail || '',
        address: userData.address || '',
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
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot update user.');
      throw new Error('Firebase is not initialized. Please check environment variables.');
    }
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
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot delete user.');
      throw new Error('Firebase is not initialized. Please check environment variables.');
    }
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
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot authenticate user.');
      return { success: false, error: 'Firebase is not configured. Please check environment variables in Netlify.' };
    }
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

      // Record successful login metadata on the user record
      try {
        await this.updateUser(user.id, {
          lastLoginAt: serverTimestamp(),
          lastLoginTeam: team
        });
      } catch (metaError) {
        console.error('Error updating user login metadata:', metaError);
      }

      // Log login event to a separate collection for activity views
      try {
        if (firebaseInitialized && db) {
          const logRef = collection(db, USER_LOGINS_COLLECTION);
          await addDoc(logRef, {
            userId: user.id,
            email: user.email,
            team: user.team,
            timestamp: serverTimestamp(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
          });
        }
      } catch (logError) {
        console.error('Error logging user login event:', logError);
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
   * Get recent login activity across all users
   */
  async getRecentLogins(limit = 20) {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot get recent logins.');
      return [];
    }

    try {
      const logRef = collection(db, USER_LOGINS_COLLECTION);
      const q = query(
        logRef,
        orderBy('timestamp', 'desc'),
        limitQuery(limit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    } catch (error) {
      console.error('Error getting recent logins:', error);
      return [];
    }
  },

  /**
   * Initialize default user (run once per session)
   */
  async initializeDefaultUser() {
    if (!firebaseInitialized || !db) {
      console.warn('Firebase not initialized. Cannot initialize default user.');
      return; // Silently fail - Firebase not configured
    }
    
    // Check session storage to avoid running multiple times
    const alreadyChecked = sessionStorage.getItem('default_user_checked');
    if (alreadyChecked) {
      return; // Already checked in this session
    }
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout checking default user')), 3000);
      });
      
      const existing = await Promise.race([
        this.getByEmail('admin@betiharisociety.org'),
        timeoutPromise
      ]);
      
      if (existing) {
        sessionStorage.setItem('default_user_checked', 'true');
        return; // Default user already exists
      }

      // Create default user with timeout
      await Promise.race([
        this.createUser({
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@betiharisociety.org',
          team: 'Board of Directors',
          position: 'Administrator',
          password: 'betihari2024',
          isActive: true
        }),
        timeoutPromise
      ]);
      
      sessionStorage.setItem('default_user_checked', 'true');
      console.log('Default admin user created successfully');
    } catch (error) {
      // Mark as checked even on error to prevent retrying
      sessionStorage.setItem('default_user_checked', 'true');
      console.error('Error initializing default user:', error);
      // Don't throw - allow app to continue
    }
  }
};
