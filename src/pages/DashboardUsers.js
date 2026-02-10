import React, { useState, useEffect, useMemo } from 'react';
import { usersService } from '../services/usersService';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Users as UsersIcon, 
  X,
  Search,
  Filter,
  Download,
  UserCheck,
  UserX,
  Shield,
  Activity,
  Clock
} from 'lucide-react';

const DashboardUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    personalEmail: '',
    team: '',
    phone: '',
    address: '',
    position: '',
    password: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [loginActivity, setLoginActivity] = useState([]);
  const [activityError, setActivityError] = useState('');
  const [activityLoading, setActivityLoading] = useState(false);

  const teams = [
    'Board of Directors',
    'Finance',
    'Administration',
    'Communications'
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await usersService.getAll();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Derive recent login activity from users' lastLoginAt field
  useEffect(() => {
    if (loading) return;

    setActivityLoading(true);
    try {
      const getMillis = (value) => {
        if (!value) return 0;
        if (typeof value.toMillis === 'function') return value.toMillis();
        if (typeof value.toDate === 'function') return value.toDate().getTime();
        const date = new Date(value);
        return isNaN(date.getTime()) ? 0 : date.getTime();
      };

      const events = users
        .filter((u) => u.lastLoginAt)
        .sort((a, b) => getMillis(b.lastLoginAt) - getMillis(a.lastLoginAt))
        .slice(0, 10)
        .map((user) => ({
          id: user.id,
          userId: user.id,
          email: user.email,
          team: user.team,
          timestamp: user.lastLoginAt
        }));

      setLoginActivity(events);
      setActivityError('');
    } catch (err) {
      console.error('Failed to build login activity from users:', err);
      setActivityError('Failed to load login activity');
      setLoginActivity([]);
    } finally {
      setActivityLoading(false);
    }
  }, [users, loading]);

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      if (typeof value.toDate === 'function') {
        return value.toDate().toLocaleDateString();
      }
      if (typeof value.toMillis === 'function') {
        return new Date(value.toMillis()).toLocaleDateString();
      }
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
      return '—';
    } catch {
      return '—';
    }
  };

  const formatDateTime = (value) => {
    if (!value) return '—';
    try {
      const date = typeof value.toDate === 'function'
        ? value.toDate()
        : typeof value.toMillis === 'function'
        ? new Date(value.toMillis())
        : new Date(value);
      if (isNaN(date.getTime())) return '—';
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  };

  const formatTimeAgo = (value) => {
    if (!value) return 'Never';
    let time;
    try {
      if (typeof value.toDate === 'function') {
        time = value.toDate();
      } else if (typeof value.toMillis === 'function') {
        time = new Date(value.toMillis());
      } else {
        time = new Date(value);
      }
    } catch {
      return '—';
    }

    if (!time || isNaN(time.getTime())) return '—';

    const now = new Date();
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

  const handleExport = () => {
    if (!users || users.length === 0) return;

    const header = [
      'First Name',
      'Last Name',
      'Email',
      'Personal Email',
      'Team',
      'Position',
      'Phone',
      'Address',
      'Status',
      'Created At',
      'Last Login At'
    ];

    const rows = users.map((user) => [
      user.firstName || '',
      user.lastName || '',
      user.email || '',
      user.personalEmail || '',
      user.team || '',
      user.position || '',
      user.phone || '',
      user.address || '',
      user.isActive ? 'Active' : 'Inactive',
      formatDateTime(user.createdAt),
      formatDateTime(user.lastLoginAt)
    ]);

    const csvContent = [header, ...rows]
      .map((row) =>
        row
          .map((cell) =>
            `"${String(cell ?? '').replace(/"/g, '""')}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const teamsFromUsers = useMemo(
    () =>
      Array.from(
        new Set(
          users
            .map((u) => u.team)
            .filter(Boolean)
        )
      ),
    [users]
  );

  const allTeams = Array.from(new Set([...teams, ...teamsFromUsers]));

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const matchesSearch =
        !term || fullName.includes(term) || email.includes(term);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      const matchesTeam =
        teamFilter === 'all' || user.team === teamFilter;

      return matchesSearch && matchesStatus && matchesTeam;
    });
  }, [users, searchTerm, statusFilter, teamFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const uniqueTeams = new Set(
    users
      .map((u) => u.team)
      .filter(Boolean)
  ).size;

  const recentUsers = useMemo(() => {
    const getMillis = (value) => {
      if (!value) return 0;
      if (typeof value.toMillis === 'function') return value.toMillis();
      if (typeof value.toDate === 'function') return value.toDate().getTime();
      const date = new Date(value);
      return isNaN(date.getTime()) ? 0 : date.getTime();
    };

    return [...users]
      .sort((a, b) => getMillis(b.createdAt) - getMillis(a.createdAt))
      .slice(0, 5);
  }, [users]);

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      personalEmail: '',
      team: '',
      phone: '',
      address: '',
      position: '',
      password: '',
      isActive: true
    });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      team: user.team,
      phone: user.phone || '',
      personalEmail: user.personalEmail || '',
      address: user.address || '',
      position: user.position || '',
      password: '', // Don't show password
      isActive: user.isActive
    });
    setError('');
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersService.deleteUser(userId);
        await loadUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingUser) {
        // Update existing user
        const updates = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          team: formData.team,
          phone: formData.phone,
          personalEmail: formData.personalEmail,
          address: formData.address,
          position: formData.position,
          isActive: formData.isActive
        };
        
        // Only update email if it changed
        if (formData.email !== editingUser.email) {
          updates.email = formData.email;
        }
        
        // Only update password if provided
        if (formData.password) {
          updates.password = formData.password;
        }

        await usersService.updateUser(editingUser.id, updates);
      } else {
        // Create new user
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }
        await usersService.createUser(formData);
      }
      
      setShowModal(false);
      loadUsers();
    } catch (error) {
      setError(error.message || 'Failed to save user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header + key stats + quick tools */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                Manage staff accounts, access levels, and see how your internal team is using the BETI-HARI SOCIETY dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
              <button
                onClick={handleCreate}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add User</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Total Users
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {totalUsers}
                </p>
              </div>
              <div className="rounded-full bg-primary-100 p-3">
                <UsersIcon className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Active
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {activeUsers}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Inactive
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {inactiveUsers}
                </p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <UserX className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Teams Represented
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {uniqueTeams}
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          {error && !showModal && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Activity panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent login activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="rounded-full bg-primary-100 p-2">
                  <Activity className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Login Activity</h2>
                  <p className="text-xs text-gray-500">
                    See which team members are actively logging into the dashboard.
                  </p>
                </div>
              </div>
            </div>

            {activityLoading ? (
              <div className="py-6 text-center text-gray-500 text-sm">
                Loading login activity…
              </div>
            ) : activityError ? (
              <div className="py-6 text-center text-sm text-red-600">
                {activityError}
              </div>
            ) : loginActivity.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                No login activity recorded yet. As staff sign in, their latest logins will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {loginActivity.map((event) => {
                  const user = users.find((u) => u.id === event.userId);
                  const name = user
                    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
                    : event.email;

                  return (
                    <div
                      key={event.id}
                      className="flex items-start justify-between rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1 rounded-full bg-green-100 p-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {event.team || (user && user.team) || 'Unknown team'}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Signed in {formatTimeAgo(event.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{formatDateTime(event.timestamp)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently added users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="rounded-full bg-secondary-100 p-2">
                <UsersIcon className="h-4 w-4 text-secondary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recently Added Users</h2>
                <p className="text-xs text-gray-500">
                  New accounts created in your organization.
                </p>
              </div>
            </div>

            {recentUsers.length === 0 ? (
              <p className="text-sm text-gray-500">
                No users created yet. Start by adding your first staff member.
              </p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start justify-between rounded-lg bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.team || 'No team'} • {user.position || 'Role not set'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Created {formatTimeAgo(user.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Users Table + filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 text-xs">
                    ▼
                  </span>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>
                  <select
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm focus:border-transparent focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All teams</option>
                    {allTeams.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 text-xs">
                    ▼
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
              <span className="font-semibold">{totalUsers}</span> users
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No users match your current filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setTeamFilter('all');
                }}
                className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
              <div className="mt-4">
                <button
                  onClick={handleCreate}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create a new user</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emails
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position / Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          ID: {user.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start flex-col">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">{user.email}</span>
                          </div>
                          {user.personalEmail && (
                            <div className="mt-1 text-xs text-gray-500">
                              Personal: {user.personalEmail}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{user.team || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.position || '-'}
                        </div>
                        {user.address && (
                          <div className="mt-1 text-xs text-gray-500 max-w-xs truncate">
                            {user.address}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? formatTimeAgo(user.lastLoginAt) : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingUser ? 'Edit User' : 'Create User'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team
                    </label>
                    <select
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select team</option>
                      {teams.map((team) => (
                        <option key={team} value={team}>{team}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g. Director, Manager"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      value={formData.personalEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, personalEmail: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Optional personal contact"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Street, city, country (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password {editingUser && '(leave blank to keep current)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={!editingUser}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active account
                  </label>
                </div>

                {editingUser && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <div>
                      <span className="font-semibold">Account created:</span>{' '}
                      {formatDateTime(editingUser.createdAt) || '—'}
                    </div>
                    <div>
                      <span className="font-semibold">Last logged in:</span>{' '}
                      {editingUser.lastLoginAt
                        ? formatDateTime(editingUser.lastLoginAt)
                        : 'Never'}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUsers;

