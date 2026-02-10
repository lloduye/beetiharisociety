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
  const { displayName, userTeam, userEmail } = useAuth();
  const [recentActivity, setRecentActivity] = useState([]);
  const [stories, setStories] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState(null);
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
          if (user) {
            if (user.position) {
              setUserPosition(user.position);
            }
            const img = user.profileImageUrl;
            if (typeof img === 'string' && img.length > 0 && (img.startsWith('data:') || img.startsWith('http'))) {
              setUserAvatarUrl(img);
            }
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
        if (story?.id == null) continue;
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
    if (storyId == null || storyId === '') return 'Story';
    const story = stories.find(s => s?.id != null && (s.id === storyId || String(s.id) === String(storyId)));
    return story?.title ? story.title : `Story #${storyId}`;
  };

  const formatTimeAgo = (timestamp) => {
    if (timestamp == null) return '';
    let time;
    try {
      if (typeof timestamp?.toDate === 'function') {
        time = timestamp.toDate();
      } else if (typeof timestamp?.toMillis === 'function') {
        time = new Date(timestamp.toMillis());
      } else {
        time = new Date(timestamp);
      }
      if (!time || isNaN(time.getTime())) return '';
    } catch {
      return '';
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now - time) / 1000);
    if (Number.isNaN(diffInSeconds) || diffInSeconds < 0) return '';

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
    if (!activity || typeof activity !== 'object') return 'Activity';
    const storyTitle = getStoryTitle(activity.storyId);
    const type = activity.type || 'activity';
    switch (type) {
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
    if (type == null) return BookOpen;
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
      return "Use this dashboard to keep track of donations, stories, and engagement across BETI-HARI SOCIETY.";
    }

    switch (team) {
      case 'Administration':
        return `You have full access${position ? ` as ${position}` : ''}. From here you can oversee stories, donations, users, and emails to keep the whole organization running smoothly.`;

      case 'Board of Directors':
        return `This view focuses on fundraising and impact${position ? ` for your role as ${position}` : ''}. Use the donation overview and reports to support strategic decisions.`;

      case 'Finance':
        return `This dashboard is centered on Stripe donations${position ? ` for your role as ${position}` : ''}. Track total revenue, trends, and recent payments for financial reporting.`;

      case 'Communications':
        return `This dashboard highlights story performance${position ? ` for your role as ${position}` : ''}. Monitor views, likes, comments, and use quick links to manage stories.`;

      default:
        return `This dashboard shows the key information for your role${position ? ` as ${position}` : ''} at BETI-HARI SOCIETY.`;
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
      case 'Finance': {
        // Finance and Board: donation-focused stats only
        const totalAmount = donationSummary?.totalAmount || 0;
        const totalCount = donationSummary?.totalCount || 0;
        const last30Amount = donationSummary?.last30DaysAmount || 0;
        const last30Count = donationSummary?.last30DaysCount || 0;

        return [
          {
            name: 'Total Raised',
            value: donationSummary ? formatCurrency(totalAmount) : '—',
            change: donationSummary ? `${totalCount} completed donations` : 'All time',
            icon: DollarSign,
            color: 'primary',
            link: '/dashboard/donations'
          },
          {
            name: 'Last 30 Days',
            value: donationSummary ? formatCurrency(last30Amount) : '—',
            change: donationSummary ? `${last30Count} donations in last month` : 'Recent period',
            icon: TrendingUp,
            color: 'green',
            link: '/dashboard/donations'
          },
          {
            name: 'Average Donation',
            value: totalCount > 0 ? formatCurrency(totalAmount / totalCount) : '—',
            change: 'Across all completed donations',
            icon: Users,
            color: 'secondary',
            link: '/dashboard/donations'
          },
          {
            name: 'Donation Platform',
            value: 'Stripe',
            change: 'Live payments',
            icon: DollarSign,
            color: 'purple',
            link: '/dashboard/donations'
          },
        ];
      }

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start justify-between space-x-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayName ? `Welcome, ${(displayName.split(' ')[0] || displayName).trim()}!` : 'Welcome!'}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            {getRoleBasedMessage(userTeam, userPosition)}
          </p>
        </div>
        {/* Profile quick access */}
        <Link
          to="/dashboard/profile"
          className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-full border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-sm"
        >
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold overflow-hidden">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt={displayName || 'Profile'}
                className="h-full w-full object-cover"
              />
            ) : (
              (displayName ? (displayName[0] || 'U').toUpperCase() : 'U')
            )}
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900 text-xs">
              {displayName || 'Your profile'}
            </p>
            <p className="text-[11px] text-gray-500">
              View & update your profile
            </p>
          </div>
        </Link>
      </div>

      {/* High-priority donation overview (Admin, Finance, Board only) */}
      {(userTeam === 'Administration' || userTeam === 'Finance' || userTeam === 'Board of Directors') && (
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
      )}

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
        {/* Recent Story Activity - Administration & Communications */}
        {(userTeam === 'Administration' || userTeam === 'Communications' || !userTeam) && (
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
        )}

        {/* Recent Donations Activity - Administration, Finance & Board */}
        {(userTeam === 'Administration' || userTeam === 'Finance' || userTeam === 'Board of Directors' || !userTeam) && (
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
        )}

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

