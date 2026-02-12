import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  Search,
  ChevronRight,
  DollarSign,
  CreditCard,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Loader2,
  X,
} from 'lucide-react';

const formatCurrency = (value, currency = 'USD') => {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatDate = (timestamp) => {
  if (!timestamp) return '—';
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString();
};

const DashboardCommunity = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchCustomers = useCallback(async (append = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (append && lastId) params.set('starting_after', lastId);
      if (searchEmail.trim()) params.set('email', searchEmail.trim());
      const res = await fetch(`/.netlify/functions/stripe-customers?${params}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        if (!append) setCustomers([]);
      } else {
        setCustomers((prev) => (append ? [...prev, ...data.customers] : data.customers));
        setHasMore(data.hasMore);
        setLastId(data.lastId || null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load community members');
      if (!append) setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [lastId, searchEmail]);

  useEffect(() => {
    fetchCustomers(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchCustomers(true);
  };

  const fetchCustomerDetail = useCallback(async (customerId) => {
    setSelectedCustomerId(customerId);
    setDetailLoading(true);
    setSelectedCustomer(null);
    try {
      const res = await fetch(`/.netlify/functions/stripe-customers?customer=${customerId}`);
      const data = await res.json();
      if (res.ok && data.customer) {
        setSelectedCustomer(data.customer);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeDetailModal = () => {
    setSelectedCustomerId(null);
    setSelectedCustomer(null);
  };

  const handleOpenStripe = () => {
    window.open('https://dashboard.stripe.com/customers', '_blank', 'noopener,noreferrer');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLastId(null);
    setHasMore(false);
    fetchCustomers(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Members</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            Manage community members and view their Stripe customer records, payments, and subscriptions. Live data from your Stripe account.
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>
        <div className="flex flex-col items-stretch sm:items-end gap-3">
          <button
            onClick={handleOpenStripe}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Stripe Customers
          </button>
          <button
            onClick={() => fetchCustomers(false)}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Customer list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    Loading community members…
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                    No community members yet. Share your{' '}
                    <a href="/join" className="text-primary-600 hover:underline">
                      /join
                    </a>{' '}
                    link for people to sign up.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{c.name || '—'}</div>
                      {c.phone && (
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" />
                          {c.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3 text-gray-400" />
                        {c.email || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.address?.country || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(c.created)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => fetchCustomerDetail(c.id)}
                        className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View details
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {hasMore && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedCustomerId && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeDetailModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Community Member Details</h2>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary-600" />
              </div>
            ) : selectedCustomer ? (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Name</p>
                    <p className="text-gray-900 font-medium">{selectedCustomer.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Email</p>
                    <p className="text-gray-900">{selectedCustomer.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Phone</p>
                    <p className="text-gray-900">{selectedCustomer.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">Stripe Customer ID</p>
                    <p className="text-gray-900 font-mono text-sm">{selectedCustomer.id}</p>
                  </div>
                </div>

                {selectedCustomer.address && (
                  selectedCustomer.address.line1 || selectedCustomer.address.city ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3" />
                        Address
                      </p>
                      <p className="text-gray-700 text-sm">
                        {[
                          selectedCustomer.address.line1,
                          selectedCustomer.address.line2,
                          [selectedCustomer.address.city, selectedCustomer.address.state, selectedCustomer.address.postalCode].filter(Boolean).join(', '),
                          selectedCustomer.address.country,
                        ]
                          .filter(Boolean)
                          .join('\n') || '—'}
                      </p>
                    </div>
                  ) : null
                )}

                {/* Charges */}
                {selectedCustomer.charges && selectedCustomer.charges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Recent Payments
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">Date</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">Amount</th>
                            <th className="px-3 py-2 text-left font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedCustomer.charges.map((ch) => (
                            <tr key={ch.id}>
                              <td className="px-3 py-2">{formatDate(ch.created)}</td>
                              <td className="px-3 py-2 font-medium">
                                {formatCurrency(ch.amount, ch.currency)}
                              </td>
                              <td className="px-3 py-2">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                    ch.status === 'succeeded'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {ch.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {selectedCustomer.charges && selectedCustomer.charges.length === 0 && (
                  <p className="text-sm text-gray-500">No payment history yet.</p>
                )}

                {/* Subscriptions */}
                {selectedCustomer.subscriptions && selectedCustomer.subscriptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Subscriptions
                    </h3>
                    <div className="space-y-2">
                      {selectedCustomer.subscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                sub.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : sub.status === 'canceled' || sub.status === 'past_due'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {sub.status}
                            </span>
                            {sub.items?.[0] && (
                              <span className="ml-2 text-sm text-gray-600">
                                {formatCurrency(sub.items[0].unitAmount)}/{sub.items[0].interval}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            Until {formatDate(sub.currentPeriodEnd)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href={`https://dashboard.stripe.com/customers/${selectedCustomer.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View in Stripe Dashboard
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCommunity;
