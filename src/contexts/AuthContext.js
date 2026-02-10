import React, { createContext, useContext, useState, useEffect } from 'react';
import { usersService } from '../services/usersService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userTeam, setUserTeam] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Initialize default user and check authentication
    const initialize = async () => {
      // Only initialize default user once per session (not on every login)
      const defaultUserInitialized = sessionStorage.getItem('default_user_initialized');
      if (!defaultUserInitialized) {
        try {
          // Ensure default user is initialized on app load (only once)
          await usersService.initializeDefaultUser();
          sessionStorage.setItem('default_user_initialized', 'true');
        } catch (error) {
          console.error('Failed to initialize users:', error);
        }
      }
      
      // Check if user is logged in on mount
      const token = localStorage.getItem('admin_token');
      const team = localStorage.getItem('user_team');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      if (token) {
        setIsAuthenticated(true);
        setUserTeam(team);
        setUserEmail(email);
        
        // If name is not in localStorage but we have email, try to get it from user record
        if (!name && email) {
          try {
            const user = await usersService.getByEmail(email);
            if (user && user.firstName) {
              const fullName = `${user.firstName} ${user.lastName || ''}`.trim();
              localStorage.setItem('user_name', fullName);
              setUserName(fullName);
            } else {
              setUserName(null);
            }
          } catch (error) {
            console.error('Error fetching user:', error);
            setUserName(name);
          }
        } else {
          setUserName(name);
        }
      }
      setIsLoading(false);
    };
    
    initialize();
  }, []);

  const login = async (email, password) => {
    try {
      // Authenticate using users service
      const result = await usersService.authenticate(email, password);
      
      if (result.success) {
        const token = 'admin_' + Date.now();
        const fullName = `${result.user.firstName} ${result.user.lastName}`;
        const team = result.user.team;
        localStorage.setItem('admin_token', token);
        localStorage.setItem('user_team', team);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_id', result.user.id);
        localStorage.setItem('user_name', fullName);
        setIsAuthenticated(true);
        setUserTeam(team);
        setUserEmail(email);
        setUserName(fullName);
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('user_team');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setIsAuthenticated(false);
    setUserTeam(null);
    setUserEmail(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, userTeam, userEmail, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

