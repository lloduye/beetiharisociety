import React, { useEffect, useMemo, useState } from 'react';
import {
  DollarSign,
  ExternalLink,
  TrendingUp,
  Users,
  Globe,
  MapPin,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const formatCurrency = (value) => {
  if (typeof value !== 'number') return value;
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toLocaleString()}`;
};

const DashboardDonations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    summary: null,
    recentDonations: [],
    topDonors: [],
    byCountry: [],
    byRegion: [],
    timeline: [],
    donors: [],
  });
  const [periodFilter, setPeriodFilter] = useState('year'); // 'all' | 'year' | 'sixMonths'
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  const handleOpenStripe = (e) => {
    e.preventDefault();
    window.open('https://dashboard.stripe.com', '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/.netlify/functions/get-donations');
        const json = await res.json();
        setData({
          summary: json.summary || null,
          recentDonations: json.recentDonations || [],
          topDonors: json.topDonors || [],
          byCountry: json.byCountry || [],
          byRegion: json.byRegion || [],
          timeline: json.timeline || [],
          donors: json.donors || [],
        });
        if (json.error) {
          setError(json.error);
        }
      } catch (err) {
        setError(err.message || 'Failed to load donation analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const totalAmount = data.summary?.totalAmount || 0;

  const filteredTimeline = useMemo(() => {
    if (!data.timeline || data.timeline.length === 0) return [];
    if (periodFilter === 'all') return data.timeline;

    const limit = periodFilter === 'year' ? 12 : 6;
    return data.timeline.slice(-limit);
  }, [data.timeline, periodFilter]);

  const topCountriesForChart = useMemo(() => {
    if (!data.byCountry || data.byCountry.length === 0) return [];
    return data.byCountry.slice(0, 6).map((c) => ({
      ...c,
      label: c.country || 'Unknown',
    }));
  }, [data.byCountry]);

  const topRegions = useMemo(() => {
    if (!data.byRegion || data.byRegion.length === 0) return [];
    const flat = [];
    data.byRegion.forEach((country) => {
      (country.regions || []).forEach((r) => {
        if (!r.state || r.state === 'Unknown') return;
        flat.push({
          country: country.country || 'Unknown',
          state: r.state,
          totalAmount: r.totalAmount,
          totalCount: r.totalCount,
        });
      });
    });
    return flat.sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 10);
  }, [data.byRegion]);

  const filteredDonors = useMemo(() => {
    let donors = data.donors || [];
    if (countryFilter !== 'all') {
      donors = donors.filter((d) => d.country === countryFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      donors = donors.filter(
        (d) =>
          (d.name && d.name.toLowerCase().includes(term)) ||
          (d.country && d.country.toLowerCase().includes(term)) ||
          (d.state && d.state.toLowerCase().includes(term)),
      );
    }
    return donors.slice(0, 50); // keep list manageable for board view
  }, [data.donors, countryFilter, searchTerm]);

  const donorsTotalAmount = useMemo(
    () => filteredDonors.reduce((sum, d) => sum + (d.total || 0), 0),
    [filteredDonors],
  );

  const uniqueCountries = useMemo(
    () => Array.from(new Set((data.byCountry || []).map((c) => c.country))).filter(Boolean),
    [data.byCountry],
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donations Dashboard</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            Read-only Stripe analytics for Board and Finance teams. View key metrics, trends, and
            donor insights at a glance without exposing sensitive payment data.
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error} &mdash; showing whatever data is available.
            </p>
          )}
        </div>
        <div className="flex flex-col items-stretch sm:items-end gap-3">
          <button
            onClick={handleOpenStripe}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Stripe Dashboard
          </button>
          <p className="text-xs text-gray-500 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Live data is fetched directly from Stripe via secure serverless functions.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total Raised (All Time)
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Across {data.summary?.totalCount || 0} completed donations
            </p>
          </div>
          <div className="bg-primary-100 rounded-full p-3">
            <DollarSign className="h-6 w-6 text-primary-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Last 30 Days
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(data.summary?.last30DaysAmount || 0)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {data.summary?.last30DaysCount || 0} donations in the last month
            </p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Average Donation
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {formatCurrency(data.summary?.averageDonation || 0)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Largest single gift: {formatCurrency(data.summary?.largestDonation || 0)}
            </p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Donation History
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              {data.summary?.firstDonationDate
                ? `Since ${new Date(data.summary.firstDonationDate).toLocaleDateString()}`
                : 'No donations yet'}
            </p>
            {data.summary?.lastDonationDate && (
              <p className="mt-1 text-xs text-gray-500">
                Most recent: {new Date(data.summary.lastDonationDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="bg-purple-100 rounded-full p-3">
            <Globe className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Donations Over Time</h2>
              <p className="text-xs text-gray-500">
                Monthly totals based on completed Stripe Checkout payments.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-1">View:</span>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="year">Last 12 months</option>
                <option value="sixMonths">Last 6 months</option>
                <option value="all">All available</option>
              </select>
            </div>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                Loading timeline…
              </div>
            ) : filteredTimeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No donation history yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredTimeline} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'totalAmount'
                        ? [formatCurrency(value), 'Total Raised']
                        : [value, 'Donations']
                    }
                  />
                  <Legend formatter={(value) => (value === 'totalAmount' ? 'Total Raised' : 'Donations')} />
                  <Bar
                    dataKey="totalAmount"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                    name="totalAmount"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalCount"
                    stroke="#0f766e"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    name="totalCount"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Countries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary-600" />
                By Country
              </h2>
              <p className="text-xs text-gray-500">
                Top countries by total amount raised.
              </p>
            </div>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                Loading country breakdown…
              </div>
            ) : topCountriesForChart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No country data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCountriesForChart}
                  layout="vertical"
                  margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" fontSize={11} />
                  <YAxis
                    dataKey="label"
                    type="category"
                    fontSize={11}
                    width={80}
                  />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Total Raised']} />
                  <Bar dataKey="totalAmount" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Regions and Recent Donations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* States / Provinces */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-secondary-600" />
              Top States / Provinces
            </h2>
            <p className="text-xs text-gray-500">
              Based on billing addresses provided to Stripe.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">State / Province</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Country</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Total Raised</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-500">Donations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      Loading regions…
                    </td>
                  </tr>
                ) : topRegions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      No state or province data available yet.
                    </td>
                  </tr>
                ) : (
                  topRegions.map((r, idx) => (
                    <tr key={`${r.country}-${r.state}-${idx}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-900">{r.state}</td>
                      <td className="px-4 py-2 text-gray-600">{r.country}</td>
                      <td className="px-4 py-2 text-right text-gray-900 font-semibold">
                        {formatCurrency(r.totalAmount)}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-600">{r.totalCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Recent Donations
          </h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {loading ? (
              <p className="text-sm text-gray-500">Loading recent donations…</p>
            ) : data.recentDonations.length === 0 ? (
              <p className="text-sm text-gray-500">No donations yet.</p>
            ) : (
              data.recentDonations.slice(0, 12).map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.time}</div>
                  </div>
                  <div className="text-sm font-bold text-green-600">
                    {typeof d.amount === 'number' ? formatCurrency(d.amount) : d.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Donor List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary-600" />
              Donor Overview (Anonymized)
            </h2>
            <p className="text-xs text-gray-500 max-w-xl">
              Each row represents a donor profile grouped by Stripe email or name. Names are
              shortened and no full email addresses or card details are exposed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, country, state…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All countries</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Donor</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">Country</th>
                <th className="px-4 py-2 text-left font-medium text-gray-500">State / Province</th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">Total Given</th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">Donations</th>
                <th className="px-4 py-2 text-right font-medium text-gray-500">Most Recent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Loading donors…
                  </td>
                </tr>
              ) : filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    No donors match the current filters.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900 font-semibold">{d.name}</td>
                    <td className="px-4 py-2 text-gray-600">{d.country || 'Unknown'}</td>
                    <td className="px-4 py-2 text-gray-600">{d.state || '—'}</td>
                    <td className="px-4 py-2 text-right text-gray-900 font-semibold">
                      {formatCurrency(d.total || 0)}
                    </td>
                    <td className="px-4 py-2 text-right text-gray-600">{d.count}</td>
                    <td className="px-4 py-2 text-right text-gray-600">
                      {d.lastDonationDate
                        ? new Date(d.lastDonationDate).toLocaleDateString()
                        : ''}
                      {d.lastDonationTime && (
                        <span className="ml-1 text-xs text-gray-400">({d.lastDonationTime})</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filteredDonors.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
            <p>
              Showing <span className="font-semibold">{filteredDonors.length}</span> donor profiles
              (max 50 for this view).
            </p>
            <p>
              Filtered total:{' '}
              <span className="font-semibold">
                {formatCurrency(donorsTotalAmount)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDonations;
