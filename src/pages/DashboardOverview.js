import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  BookOpen, 
  Mail, 
  TrendingUp,
  ArrowRight,
  Heart,
  Eye,
  Share2,
  MessageCircle,
  Users
} from 'lucide-react';
import { interactionsService } from '../services/interactionsService';
import { storiesService } from '../services/storiesService';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/usersService';

const DashboardOverview = () => {
  const { userName, userTeam, userEmail } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stories, setStories] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [storyActivityLimit, setStoryActivityLimit] = useState(5);
  const [donationSummary, setDonationSummary] = useState(null);
  const [donationRecent, setDonationRecent] = useState([]);
  const [donationLoading, setDonationLoading] = useState(true);
  const [donationError, setDonationError] = useState(null);
  const [stats, setStats] = useState({
    publishedStories: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0
  });

  // Load user position
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

  useEffect(() => {
    loadData();
    
    // Listen for activity updates
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storiesUpdated', handleStorageChange);
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadData, 30000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storiesUpdated', handleStorageChange);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    await loadStories();
    loadRecentActivity();
    loadDonations();
  };

  const loadStories = async () => {
    try {
      const allStories = await storiesService.getAll();
      setStories(allStories);
    } catch (error) {
      console.error('Failed to load stories:', error);
    }
  };

  const loadDonations = async () => {
    try {
      setDonationLoading(true);
      const res = await fetch('/.netlify/functions/get-donations');
      const json = await res.json();
      setDonationSummary(json.summary || null);
      setDonationRecent(json.recentDonations || []);
      setDonationError(json.error || null);
    } catch (error) {
      console.error('Failed to load donation overview:', error);
      setDonationError(error.message || 'Failed to load donation data');
    } finally {
      setDonationLoading(false);
    }
  };

  const calculateStats = useCallback(async () => {
    try {
      const publishedStories = stories.filter(s => s.published);
      
      let totalViews = 0;
      let totalLikes = 0;
      let totalComments = 0;
      let totalShares = 0;

      for (const story of publishedStories) {
        const interactions = await interactionsService.getStoryInteractions(story.id);
        totalViews += interactions.views || 0;
        totalLikes += interactions.likes?.length || 0;
        totalComments += interactions.comments?.length || 0;
        totalShares += interactions.shares || 0;
      }

      setStats({
        publishedStories: publishedStories.length,
        totalViews,
        totalLikes,
        totalComments,
        totalShares
      });
    } catch (error) {
      console.error('Failed to calculate stats:', error);
    }
  }, [stories]);

  useEffect(() => {
    if (stories.length > 0) {
      calculateStats();
    }
  }, [stories, calculateStats]);

  const loadRecentActivity = async () => {
    try {
      const activities = await interactionsService.getRecentActivity(10);
      setRecentActivity(activities);
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  };

  const getStoryTitle = (storyId) => {
    const story = stories.find(s => s.id === storyId);
    return story ? story.title : `Story #${storyId}`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getActivityMessage = (activity) => {
    const storyTitle = getStoryTitle(activity.storyId);
    switch (activity.type) {
      case 'like':
        return `Someone liked "${storyTitle}"`;
      case 'view':
        return `"${storyTitle}" was viewed`;
      case 'share':
        return `"${storyTitle}" was shared`;
      case 'comment':
        return `${activity.author || 'Someone'} commented on "${storyTitle}"`;
      default:
        return `Activity on "${storyTitle}"`;
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'like':
        return Heart;
      case 'view':
        return Eye;
      case 'share':
        return Share2;
      case 'comment':
        return MessageCircle;
      default:
        return BookOpen;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'like':
        return 'bg-red-100 text-red-600';
      case 'view':
        return 'bg-blue-100 text-blue-600';
      case 'share':
        return 'bg-green-100 text-green-600';
      case 'comment':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRoleBasedMessage = (team, position) => {
    if (!team) {
      return "Here's what's happening with BETI-HARI SOCIETY. Use this dashboard to stay informed about our impact and community engagement.";
    }

    switch (team) {
      case 'Administration':
        return `As part of the ${team} team${position ? ` (${position})` : ''}, you have full access to manage all aspects of the organization. You can oversee stories, track donations, manage user accounts, and monitor real-time engagement metrics. Your comprehensive view helps ensure smooth operations and strategic decision-making across all departments.`;

      case 'Board of Directors':
        return `As a member of the ${team}${position ? ` (${position})` : ''}, you have access to financial oversight and donation tracking. Monitor fundraising progress, review donor contributions, and analyze financial trends to guide organizational strategy. Your insights help ensure sustainable growth and effective resource allocation for our education and economic development programs.`;

      case 'Finance':
        return `In your role with the ${team} department${position ? ` (${position})` : ''}, you can track all donation activities, monitor fundraising progress, and analyze financial data through Stripe. Use this dashboard to review donation trends, export financial reports, and ensure transparent financial management that supports our mission in South Sudan.`;

      case 'Communications':
        return `As part of the ${team} team${position ? ` (${position})` : ''}, you can create, edit, and manage stories that showcase our impact. Share inspiring narratives from our community, monitor engagement metrics, and ensure our message reaches supporters effectively. Your storytelling helps amplify the voices of those we serve and demonstrates the real-world impact of our programs.`;

      default:
        return `Welcome to the BETI-HARI SOCIETY dashboard! As a member of the ${team}${position ? ` (${position})` : ''}, you can access relevant information and tools to support our mission of empowering children and communities through education in South Sudan.`;
    }
  };

  // Get role-based stats
  const getRoleBasedStats = () => {
    if (!userTeam) {
      return [];
    }

    switch (userTeam) {
      case 'Administration':
        // Administration sees all stats
        return [
          {
            name: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            change: 'All Stories',
            icon: Eye,
            color: 'primary',
            link: '/dashboard/stories'
          },
          {
            name: 'Total Likes',
            value: stats.totalLikes.toLocaleString(),
            change: 'All Stories',
            icon: Heart,
            color: 'green',
            link: '/dashboard/stories'
          },
          {
            name: 'Published Stories',
            value: stats.publishedStories.toString(),
            change: 'Active',
            icon: BookOpen,
            color: 'secondary',
            link: '/dashboard/stories'
          },
          {
            name: 'Total Comments',
            value: stats.totalComments.toLocaleString(),
            change: 'All Stories',
            icon: MessageCircle,
            color: 'purple',
            link: '/dashboard/stories'
          },
        ];

      case 'Communications':
        // Communications sees story engagement stats
        return [
          {
            name: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            change: 'All Stories',
            icon: Eye,
            color: 'primary',
            link: '/dashboard/stories'
          },
          {
            name: 'Total Likes',
            value: stats.totalLikes.toLocaleString(),
            change: 'All Stories',
            icon: Heart,
            color: 'green',
            link: '/dashboard/stories'
          },
          {
            name: 'Published Stories',
            value: stats.publishedStories.toString(),
            change: 'Active',
            icon: BookOpen,
            color: 'secondary',
            link: '/dashboard/stories'
          },
          {
            name: 'Total Comments',
            value: stats.totalComments.toLocaleString(),
            change: 'All Stories',
            icon: MessageCircle,
            color: 'purple',
            link: '/dashboard/stories'
          },
        ];

      case 'Board of Directors':
      case 'Finance':
        // Finance and Board see donation-focused stats
        return [
          {
            name: 'Donation Platform',
            value: 'Stripe',
            change: 'Active',
            icon: DollarSign,
            color: 'primary',
            link: '/dashboard/donations'
          },
          {
            name: 'Story Engagement',
            value: stats.totalViews.toLocaleString(),
            change: 'Total Views',
            icon: Eye,
            color: 'green',
            link: '/dashboard'
          },
          {
            name: 'Community Impact',
            value: stats.publishedStories.toString(),
            change: 'Stories Shared',
            icon: BookOpen,
            color: 'secondary',
            link: '/dashboard'
          },
          {
            name: 'Engagement Rate',
            value: stats.totalLikes > 0 ? `${Math.round((stats.totalLikes / Math.max(stats.totalViews, 1)) * 100)}%` : '0%',
            change: 'Likes per View',
            icon: TrendingUp,
            color: 'purple',
            link: '/dashboard'
          },
        ];

      default:
        // Default: show basic engagement stats
        return [
          {
            name: 'Total Views',
            value: stats.totalViews.toLocaleString(),
            change: 'All Stories',
            icon: Eye,
            color: 'primary',
            link: '/dashboard'
          },
          {
            name: 'Published Stories',
            value: stats.publishedStories.toString(),
            change: 'Active',
            icon: BookOpen,
            color: 'secondary',
            link: '/dashboard'
          },
        ];
    }
  };

  const statsData = getRoleBasedStats();

  // Get role-based quick actions
  const getRoleBasedQuickActions = () => {
    if (!userTeam) {
      return [];
    }

    const allActions = [
      {
        title: 'Add New Story',
        description: 'Create and publish a new story',
        icon: BookOpen,
        link: '/dashboard/stories/new',
        color: 'primary',
        teams: ['Administration', 'Communications']
      },
      {
        title: 'Manage Stories',
        description: 'Edit and manage all stories',
        icon: BookOpen,
        link: '/dashboard/stories',
        color: 'primary',
        teams: ['Administration', 'Communications']
      },
      {
        title: 'View Donations',
        description: 'Track donations and fundraising',
        icon: DollarSign,
        link: '/dashboard/donations',
        color: 'green',
        teams: ['Administration', 'Board of Directors', 'Finance']
      },
      {
        title: 'Manage Users',
        description: 'Add and manage staff accounts',
        icon: Users,
        link: '/dashboard/users',
        color: 'purple',
        teams: ['Administration']
      },
      {
        title: 'Access Mailbox',
        description: 'Check organization emails',
        icon: Mail,
        link: '/dashboard/emails',
        color: 'secondary',
        teams: ['all'] // Available to all
      },
    ];

    return allActions.filter(action => {
      if (action.teams.includes('all')) return true;
      if (userTeam === 'Administration') return true; // Administration sees all
      return action.teams.includes(userTeam);
    });
  };

  const quickActions = getRoleBasedQuickActions();
  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {userName ? `Welcome, ${userName.split(' ')[0]}!` : 'Welcome!'}
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          {getRoleBasedMessage(userTeam, userPosition)}
        </p>
      </div>

      {/* High-priority donation overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Raised (Stripe)
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {donationSummary ? formatCurrency(donationSummary.totalAmount) : '—'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {donationSummary
                ? `${donationSummary.totalCount} completed donations`
                : donationLoading
                ? 'Loading live donation data…'
                : donationError || 'No donation data yet'}
            </p>
          </div>
          <Link
            to="/dashboard/donations"
            className="inline-flex items-center px-3 py-2 rounded-lg bg-primary-600 text-white text-xs font-medium shadow-sm hover:bg-primary-700 transition-colors"
          >
            <DollarSign className="h-4 w-4 mr-1" />
            View Details
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Last 30 Days (Stripe)
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {donationSummary ? formatCurrency(donationSummary.last30DaysAmount) : '—'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {donationSummary
                ? `${donationSummary.last30DaysCount} donations in the last month`
                : donationLoading
                ? 'Refreshing from Stripe…'
                : ''}
            </p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {statsData.length > 0 && (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${statsData.length === 4 ? 'lg:grid-cols-4' : statsData.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 mb-8`}>
          {statsData.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              primary: 'bg-primary-100 text-primary-600',
              green: 'bg-green-100 text-green-600',
              secondary: 'bg-secondary-100 text-secondary-600',
              purple: 'bg-purple-100 text-purple-600',
            };
            
            return (
              <Link
                key={stat.name}
                to={stat.link}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`rounded-full p-3 ${colorClasses[stat.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Story Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Story Activity</h2>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No recent activity yet</p>
                <p className="text-sm mt-2">
                  Activity will appear here as visitors interact with stories.
                </p>
              </div>
            ) : (
              <>
                {recentActivity.slice(0, storyActivityLimit).map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={`${activity.storyId}-${activity.timestamp}-${index}`}
                      className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div className={`rounded-full p-2 ${getActivityColor(activity.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{getActivityMessage(activity)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {recentActivity.length > storyActivityLimit && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setStoryActivityLimit((prev) =>
                          Math.min(prev + 5, recentActivity.length)
                        )
                      }
                      className="text-xs font-medium text-primary-600 hover:text-primary-700"
                    >
                      Load more activity
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent Donations Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Donation Activity</h2>
          <div className="space-y-3">
            {donationLoading ? (
              <p className="text-sm text-gray-500">Loading recent donations from Stripe…</p>
            ) : donationError ? (
              <p className="text-sm text-gray-500">{donationError}</p>
            ) : donationRecent.length === 0 ? (
              <p className="text-sm text-gray-500">No donations yet.</p>
            ) : (
              donationRecent.slice(0, 8).map((d, index) => (
                <div
                  key={`${d.time}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{d.name}</p>
                    <p className="text-xs text-gray-500">{d.time}</p>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {typeof d.amount === 'number' ? formatCurrency(d.amount) : d.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Compact quick actions */}
        {quickActions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <p className="text-xs text-gray-500 mb-4">
              Frequently used tools in one place.
            </p>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gray-100 text-gray-600">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;

