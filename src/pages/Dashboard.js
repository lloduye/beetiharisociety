import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  LogOut, 
  RefreshCw,
  Download,
  Filter,
  Search,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const { logout } = useAuth();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 0,
    totalDonations: 0,
    monthlyRaised: 0,
    averageDonation: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Mock data - In production, this would fetch from Zeffy API
  useEffect(() => {
    // Simulate API call
    const fetchDonations = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock donation data - Replace with actual Zeffy API call
      const mockDonations = [
        {
          id: 1,
          donorName: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          amount: 250,
          date: new Date('2024-01-15'),
          status: 'completed',
          project: 'Classroom Construction',
          paymentMethod: 'Credit Card'
        },
        {
          id: 2,
          donorName: 'Michael Chen',
          email: 'm.chen@example.com',
          amount: 100,
          date: new Date('2024-01-20'),
          status: 'completed',
          project: 'Teacher Support',
          paymentMethod: 'PayPal'
        },
        {
          id: 3,
          donorName: 'Anonymous',
          email: null,
          amount: 500,
          date: new Date('2024-01-22'),
          status: 'completed',
          project: 'General Fund',
          paymentMethod: 'Bank Transfer'
        },
        {
          id: 4,
          donorName: 'Emma Williams',
          email: 'emma.w@example.com',
          amount: 50,
          date: new Date('2024-01-25'),
          status: 'pending',
          project: 'Student Supplies',
          paymentMethod: 'Credit Card'
        },
        {
          id: 5,
          donorName: 'David Brown',
          email: 'd.brown@example.com',
          amount: 1000,
          date: new Date('2024-01-28'),
          status: 'completed',
          project: 'Classroom Construction',
          paymentMethod: 'Credit Card'
        },
      ];

      setDonations(mockDonations);
      
      // Calculate stats
      const completed = mockDonations.filter(d => d.status === 'completed');
      const totalRaised = completed.reduce((sum, d) => sum + d.amount, 0);
      const monthlyRaised = completed
        .filter(d => d.date.getMonth() === new Date().getMonth())
        .reduce((sum, d) => sum + d.amount, 0);
      
      setStats({
        totalRaised,
        totalDonations: completed.length,
        monthlyRaised,
        averageDonation: completed.length > 0 ? totalRaised / completed.length : 0
      });
      
      setIsLoading(false);
    };

    fetchDonations();
  }, []);

  const handleRefresh = () => {
    // Refresh donations data
    window.location.reload();
  };

  const handleExport = () => {
    // Export donations to CSV
    const csv = [
      ['Donor Name', 'Email', 'Amount', 'Date', 'Status', 'Project', 'Payment Method'],
      ...donations.map(d => [
        d.donorName,
        d.email || 'N/A',
        `$${d.amount}`,
        d.date.toLocaleDateString(),
        d.status,
        d.project,
        d.paymentMethod
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.email && donation.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const now = new Date();
    let matchesPeriod = true;
    if (filterPeriod === 'month') {
      matchesPeriod = donation.date.getMonth() === now.getMonth() && 
                     donation.date.getFullYear() === now.getFullYear();
    } else if (filterPeriod === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesPeriod = donation.date >= weekAgo;
    }
    
    return matchesSearch && matchesPeriod;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">BETI-HARI SOCIETY</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalRaised.toLocaleString()}
                </p>
              </div>
              <div className="bg-primary-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalDonations}
                </p>
              </div>
              <div className="bg-secondary-100 rounded-full p-3">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.monthlyRaised.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Donation</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${Math.round(stats.averageDonation).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Donations Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Time</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading donations...</p>
              </div>
            ) : filteredDonations.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">No donations found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {donation.donorName}
                        </div>
                        {donation.email && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {donation.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-primary-600">
                          ${donation.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {donation.date.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {donation.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {donation.project}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          donation.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {donation.paymentMethod}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Summary */}
          {!isLoading && filteredDonations.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-medium">{filteredDonations.length}</span> donation{filteredDonations.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Filtered Total: ${filteredDonations
                    .filter(d => d.status === 'completed')
                    .reduce((sum, d) => sum + d.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Integration Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Zeffy Integration</h3>
          <p className="text-sm text-blue-800 mb-4">
            To connect this dashboard with your Zeffy account, you'll need to:
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
            <li>Get your Zeffy API key from your Zeffy dashboard</li>
            <li>Set up webhooks in Zeffy to send donation notifications</li>
            <li>Replace the mock data in <code className="bg-blue-100 px-1 rounded">Dashboard.js</code> with actual API calls</li>
            <li>Store the API key securely in environment variables</li>
          </ol>
          <p className="text-sm text-blue-700 mt-4">
            <strong>Note:</strong> Currently displaying sample data. Connect to Zeffy API for live donation tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

