// Users service - manages user accounts for the dashboard
const USERS_STORAGE_KEY = 'dashboard_users';

// Initialize with a default admin user if no users exist
const initializeDefaultUser = () => {
  // Check if localStorage is available (browser environment)
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
      const defaultUser = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@betiharisociety.org',
        team: 'Board of Directors',
        phone: '',
        position: 'Administrator',
        password: 'betihari2024', // Default password
        createdAt: new Date().toISOString(),
        isActive: true
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultUser]));
    }
  } catch (error) {
    console.error('Failed to initialize default user:', error);
  }
};

export const usersService = {
  /**
   * Get all users - ensures default user exists
   */
  getAll() {
    // Ensure default user is initialized before getting users
    initializeDefaultUser();
    
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return [];
      }
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  },

  /**
   * Get a user by email
   */
  getByEmail(email) {
    // Ensure default user is initialized
    initializeDefaultUser();
    const users = this.getAll();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  /**
   * Create a new user
   */
  createUser(userData) {
    const users = this.getAll();
    
    // Check if user already exists
    if (this.getByEmail(userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email.toLowerCase(),
      team: userData.team,
      phone: userData.phone || '',
      position: userData.position || '',
      password: userData.password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  /**
   * Update a user
   */
  updateUser(userId, updates) {
    const users = this.getAll();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
      throw new Error('User not found');
    }

    // If email is being updated, check for duplicates
    if (updates.email && updates.email.toLowerCase() !== users[index].email.toLowerCase()) {
      if (this.getByEmail(updates.email)) {
        throw new Error('User with this email already exists');
      }
    }

    users[index] = {
      ...users[index],
      ...updates,
      email: updates.email ? updates.email.toLowerCase() : users[index].email,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return users[index];
  },

  /**
   * Delete a user
   */
  deleteUser(userId) {
    const users = this.getAll();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  /**
   * Reset user password
   */
  resetPassword(email, team) {
    const user = this.getByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.team !== team) {
      throw new Error('Team does not match');
    }

    // Generate a temporary password
    const tempPassword = 'temp' + Math.random().toString(36).slice(-8);
    this.updateUser(user.id, { password: tempPassword });
    return tempPassword;
  },

  /**
   * Authenticate user
   */
  authenticate(email, team, password) {
    // Ensure default user is initialized before authentication
    initializeDefaultUser();
    
    const user = this.getByEmail(email);
    
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
  }
};

