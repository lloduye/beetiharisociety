import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/usersService';
import { 
  LogOut, 
  DollarSign, 
  BookOpen, 
  Mail, 
  Menu,
  X,
  Home,
  Globe,
  Users
} from 'lucide-react';

const DashboardLayout = () => {
  const { logout, userTeam, userEmail, userName } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userPosition, setUserPosition] = useState(null);

  // Load user position/role
  useEffect(() => {
    const loadUserPosition = async () => {
      if (userEmail) {
        try {
          const user = await usersService.getByEmail(userEmail);
          if (user && user.position) {
            setUserPosition(user.position);
          }
        } catch (error) {
          console.error('Error loading user position:', error);
        }
      }
    };
    loadUserPosition();
  }, [userEmail]);

  // Define all navigation items with team permissions
  const allNavigationItems = [
    // Ordered: Overview, Donations, Stories, Mailbox, Users
    { name: 'Overview', href: '/dashboard', icon: Home, teams: ['all'] }, // Available to all
    { name: 'Donations', href: '/dashboard/donations', icon: DollarSign, teams: ['Board of Directors', 'Finance', 'Administration'] },
    { name: 'Stories', href: '/dashboard/stories', icon: BookOpen, teams: ['Administration', 'Communications'] },
    { name: 'Mailbox', href: '/dashboard/emails', icon: Mail, teams: ['all'] }, // Available to all
    { name: 'Users', href: '/dashboard/users', icon: Users, teams: ['Administration'] },
  ];

  // Filter navigation based on user's team
  const getNavigationItems = () => {
    if (!userTeam) return allNavigationItems.filter(item => item.teams.includes('all'));
    
    return allNavigationItems.filter(item => {
      // Always show items available to all
      if (item.teams.includes('all')) return true;
      // Administration has access to everything
      if (userTeam === 'Administration') return true;
      // Check if user's team is in the allowed teams
      return item.teams.includes(userTeam);
    });
  };

  const navigation = getNavigationItems();

  const getUserSubtitle = () => {
    if (userName && userTeam && userPosition) {
      return `${userName} • ${userTeam} - ${userPosition}`;
    }
    if (userName && userTeam) {
      return `${userName} • ${userTeam}`;
    }
    if (userName) {
      return userName;
    }
    if (userTeam && userPosition) {
      return `${userTeam} - ${userPosition}`;
    }
    if (userTeam) {
      return `${userTeam} Dashboard`;
    }
    return 'Dashboard';
  };

  const userSubtitle = getUserSubtitle();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - matching website design */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-sm md:text-xl font-bold text-gray-900 whitespace-nowrap">BETI-HARI SOCIETY</h1>
                <p className="text-xs text-gray-600 hidden sm:block">
                  {userSubtitle}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

          {/* Main content - centered with max width */}
          <main className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </main>
    </div>
  );
};

export default DashboardLayout;
