import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Define which teams can access which routes
const getRoutePermissions = (pathname) => {
  // Overview - available to all
  if (pathname === '/dashboard' || pathname === '/dashboard/') {
    return ['all'];
  }
  // Profile - available to all authenticated users
  if (pathname === '/dashboard/profile') {
    return ['all'];
  }
  // Stories - Administration and Communications
  if (pathname.startsWith('/dashboard/stories')) {
    return ['Administration', 'Communications'];
  }
  // Donations - Board of Directors, Finance, and Administration
  if (pathname === '/dashboard/donations') {
    return ['Board of Directors', 'Finance', 'Administration'];
  }
  // Users - Administration only
  if (pathname === '/dashboard/users') {
    return ['Administration'];
  }
  // Mailbox - available to all
  if (pathname === '/dashboard/emails') {
    return ['all'];
  }
  // Default: no access
  return [];
};

const RoleProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, userTeam } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/dashboard/login" replace />;
  }

  const normalizedTeam =
    userTeam && String(userTeam).toLowerCase() === 'board of directors'
      ? 'Board of Directors'
      : userTeam;

  // Check if user has access to this route
  const allowedTeams = getRoutePermissions(location.pathname);
  const hasAccess =
    allowedTeams.includes('all') ||
    allowedTeams.includes(normalizedTeam) ||
    normalizedTeam === 'Administration';

  if (!hasAccess) {
    // Redirect to overview if user doesn't have access
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

