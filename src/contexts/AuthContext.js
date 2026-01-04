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
    // Ensure default user is initialized on app load
    try {
      usersService.getAll(); // This will trigger initialization if needed
    } catch (error) {
      console.error('Failed to initialize users:', error);
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
        const user = usersService.getByEmail(email);
        if (user && user.firstName) {
          const fullName = `${user.firstName} ${user.lastName || ''}`.trim();
          localStorage.setItem('user_name', fullName);
          setUserName(fullName);
        } else {
          setUserName(null);
        }
      } else {
        setUserName(name);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email, team, password) => {
    // Authenticate using users service
    const result = usersService.authenticate(email, team, password);
    
    if (result.success) {
      const token = 'admin_' + Date.now();
      const fullName = `${result.user.firstName} ${result.user.lastName}`;
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

