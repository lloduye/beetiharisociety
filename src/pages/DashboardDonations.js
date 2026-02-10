import React, { useEffect, useMemo, useState } from 'react';
import {
  DollarSign,
  ExternalLink,
  Filter,
  RefreshCw,
  Search,
  Download,
  Eye,
  RotateCcw,
  Shield,
  Wallet,
  AlertTriangle,
  X,
} from 'lucide-react';
import {
  getStripeAdminPassphrase,
  setStripeAdminPassphrase,
  stripeAdminApi,
} from '../services/stripeAdminApi';

function fmtMoney(cents, currency = 'usd') {
  if (cents == null) return '';
  const amount = Number(cents) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: String(currency).toUpperCase(),
    }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

function fmtDate(tsSec) {
  if (!tsSec) return '';
  return new Date(tsSec * 1000).toLocaleString();
}

function toIsoDate(d) {
  // YYYY-MM-DD
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-4 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="text-lg font-semibold text-gray-900">{title}</div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'donations', label: 'Donations', icon: DollarSign },
  { id: 'payouts', label: 'Payouts', icon: Wallet },
  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
  { id: 'balance', label: 'Balance', icon: Shield },
  { id: 'exports', label: 'Exports', icon: Download },
];

const DashboardDonations = () => {
  const [tab, setTab] = useState('donations');

  // Security: passphrase is entered by staff and stored only in sessionStorage.
  const [passphrase, setPassphrase] = useState(() => getStripeAdminPassphrase());
  const [passInput, setPassInput] = useState('');

  const isUnlocked = !!passphrase;

  // Date range defaults: last 30 days.
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return toIsoDate(d);
  });
  const [dateTo, setDateTo] = useState(() => toIsoDate(new Date()));

  const createdRange = useMemo(() => {
    // Use ISO dates; server converts to seconds.
    const created_gte = dateFrom ? `${dateFrom}T00:00:00` : undefined;
    const created_lte = dateTo ? `${dateTo}T23:59:59` : undefined;
    return { created_gte, created_lte };
  }, [dateFrom, dateTo]);

  // Donations list state
  const [donations, setDonations] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Details + refund flows
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const [refundOpen, setRefundOpen] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);
  const [refundError, setRefundError] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('requested_by_customer');

  // Payouts/disputes/balance
  const [payouts, setPayouts] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [balance, setBalance] = useState(null);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [secondaryError, setSecondaryError] = useState(null);

  const filteredDonations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return donations;
    return donations.filter((d) => {
      return (
        (d.customer_name || '').toLowerCase().includes(q) ||
        (d.customer_email || '').toLowerCase().includes(q) ||
        (d.sessionId || '').toLowerCase().includes(q) ||
        (d.payment_intent_id || '').toLowerCase().includes(q) ||
        (d.charge_id || '').toLowerCase().includes(q)
      );
    });
  }, [donations, query]);

  const grossCents = useMemo(
    () => donations.reduce((sum, d) => sum + (d.amount_total || 0), 0),
    [donations]
  );
  const refundedCents = useMemo(
    () => donations.reduce((sum, d) => sum + (d.amount_refunded || 0), 0),
    [donations]
  );

  const handleOpenStripe = (e) => {
    e.preventDefault();
    window.open('https://dashboard.stripe.com', '_blank', 'noopener,noreferrer');
  };

  const lock = () => {
    setStripeAdminPassphrase('');
    setPassphrase('');
    setPassInput('');
    setDonations([]);
    setError(null);
  };

  const unlock = () => {
    const p = (passInput || '').trim();
    if (!p) return;
    setStripeAdminPassphrase(p);
    setPassphrase(p);
    setPassInput('');
  };

  const loadDonations = async ({ reset } = { reset: false }) => {
    setError(null);
    setLoading(true);
    try {
      const res = await stripeAdminApi.listDonations({
        limit: 50,
        starting_after: reset ? undefined : nextCursor,
        ...createdRange,
      });
      const items = res.items || [];
      setHasMore(!!res.has_more);
      setNextCursor(res.next_starting_after || null);
      setDonations((prev) => (reset ? items : [...prev, ...items]));
    } catch (e) {
      setError(e.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const openDetails = async (sessionId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailData(null);
    try {
      const data = await stripeAdminApi.getDonation(sessionId);
      setDetailData(data);
    } catch (e) {
      setDetailError(e.message || 'Failed to load details');
    } finally {
      setDetailLoading(false);
    }
  };

  const openRefund = (row) => {
    setRefundTarget(row);
    setRefundAmount('');
    setRefundReason('requested_by_customer');
    setRefundError(null);
    setRefundOpen(true);
  };

  const submitRefund = async () => {
    if (!refundTarget) return;
    setRefundLoading(true);
    setRefundError(null);
    try {
      const amountCents = refundAmount.trim()
        ? Math.round(Number(refundAmount) * 100)
        : undefined;
      if (amountCents != null && (!Number.isFinite(amountCents) || amountCents <= 0)) {
        throw new Error('Refund amount must be a positive number');
      }
      await stripeAdminApi.refund({
        payment_intent_id: refundTarget.payment_intent_id || undefined,
        charge_id: refundTarget.charge_id || undefined,
        amount: amountCents,
        reason: refundReason || undefined,
      });

      setRefundOpen(false);
      // Refresh list (best-effort)
      await loadDonations({ reset: true });
    } catch (e) {
      setRefundError(e.message || 'Refund failed');
    } finally {
      setRefundLoading(false);
    }
  };

  const loadSecondary = async (which) => {
    setSecondaryError(null);
    setSecondaryLoading(true);
    try {
      if (which === 'payouts') {
        const res = await stripeAdminApi.listPayouts({ limit: 25, ...createdRange });
        setPayouts(res.items || []);
      } else if (which === 'disputes') {
        const res = await stripeAdminApi.listDisputes({ limit: 25, ...createdRange });
        setDisputes(res.items || []);
      } else if (which === 'balance') {
        const res = await stripeAdminApi.balance();
        setBalance(res.balance || null);
      }
    } catch (e) {
      setSecondaryError(e.message || 'Failed to load');
    } finally {
      setSecondaryLoading(false);
    }
  };

  const downloadExport = async () => {
    setSecondaryError(null);
    setSecondaryLoading(true);
    try {
      const res = await stripeAdminApi.exportDonations({ ...createdRange, max: 2000 });
      if (res.kind !== 'csv') throw new Error('Unexpected export response');
      const url = URL.createObjectURL(res.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.filename || 'donations_export.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setSecondaryError(e.message || 'Export failed');
    } finally {
      setSecondaryLoading(false);
    }
  };

  useEffect(() => {
    if (!isUnlocked) return;
    // Load initial view
    if (tab === 'donations') loadDonations({ reset: true });
    if (tab === 'payouts') loadSecondary('payouts');
    if (tab === 'disputes') loadSecondary('disputes');
    if (tab === 'balance') loadSecondary('balance');
    // exports loads on demand
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlocked, tab]);

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
              <p className="text-gray-600 mt-1">Stripe-backed donation management (refunds, exports, payouts, disputes)</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleOpenStripe} className="btn-outline flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>Open Stripe</span>
              </button>
              {isUnlocked && (
                <button onClick={lock} className="btn-outline">
                  Lock
                </button>
              )}
            </div>
          </div>
        </div>

        {!isUnlocked ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-gray-700" />
                <div className="text-xl font-semibold text-gray-900">Unlock Stripe admin tools</div>
              </div>
              <p className="text-gray-600">
                Enter the <span className="font-medium">Stripe admin passphrase</span> to use refunds, exports, payouts, and disputes inside this dashboard.
                This passphrase is stored only for this browser session.
              </p>
              <div className="flex gap-3 flex-wrap">
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="Admin passphrase"
                  className="w-full md:flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button onClick={unlock} className="btn-primary px-6 py-3">
                  Unlock
                </button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700">
                <div className="font-medium mb-1">Netlify environment variable required</div>
                <div>
                  Set <code className="px-1 py-0.5 bg-white border rounded">STRIPE_ADMIN_PASSPHRASE</code> in Netlify (server-only).
                  This keeps the Stripe admin API endpoints protected.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
              <div className="flex gap-2 flex-wrap">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={
                        active
                          ? 'px-4 py-2 rounded-lg bg-primary-600 text-white flex items-center gap-2'
                          : 'px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2'
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Filter className="h-4 w-4" />
                    <span className="font-medium">Date range</span>
                  </div>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-400">→</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  {tab === 'donations' && (
                    <button
                      onClick={() => loadDonations({ reset: true })}
                      disabled={loading}
                      className="btn-outline flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </button>
                  )}
                </div>

                {tab === 'donations' && (
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                      <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search name/email/session/payment intent/charge"
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>

              {(error || secondaryError) && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                  {error || secondaryError}
                </div>
              )}

              {tab === 'donations' && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Gross (loaded)</div>
                      <div className="text-2xl font-bold text-gray-900">{fmtMoney(grossCents, 'usd')}</div>
                      <div className="text-xs text-gray-500 mt-1">{donations.length} donations</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Refunded (loaded)</div>
                      <div className="text-2xl font-bold text-gray-900">{fmtMoney(refundedCents, 'usd')}</div>
                      <div className="text-xs text-gray-500 mt-1">Excludes fees; see details for net</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Tip</div>
                      <div className="text-sm text-gray-700 mt-2">
                        Click <span className="font-medium">View</span> on a donation to see card brand/last4, receipt URL, and fees/net.
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-gray-700">
                        <tr>
                          <th className="text-left p-3 font-medium">Date</th>
                          <th className="text-left p-3 font-medium">Donor</th>
                          <th className="text-left p-3 font-medium">Amount</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Receipt</th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading && donations.length === 0 ? (
                          <tr>
                            <td className="p-4 text-gray-500" colSpan={6}>
                              Loading…
                            </td>
                          </tr>
                        ) : filteredDonations.length === 0 ? (
                          <tr>
                            <td className="p-4 text-gray-500" colSpan={6}>
                              No donations found in this range.
                            </td>
                          </tr>
                        ) : (
                          filteredDonations.map((d) => (
                            <tr key={d.sessionId} className="border-t border-gray-200">
                              <td className="p-3 text-gray-700">{fmtDate(d.created)}</td>
                              <td className="p-3">
                                <div className="font-medium text-gray-900">{d.customer_name || '—'}</div>
                                <div className="text-gray-500">{d.customer_email || '—'}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {d.sessionId}
                                </div>
                              </td>
                              <td className="p-3 font-medium text-gray-900">
                                {fmtMoney(d.amount_total, d.currency)}
                              </td>
                              <td className="p-3">
                                <div className="text-gray-900">{d.payment_status || '—'}</div>
                                {d.refunded ? (
                                  <div className="text-xs text-red-700">Refunded {fmtMoney(d.amount_refunded, d.currency)}</div>
                                ) : null}
                              </td>
                              <td className="p-3">
                                {d.receipt_url ? (
                                  <a
                                    href={d.receipt_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary-700 hover:underline"
                                  >
                                    Open
                                  </a>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex justify-end gap-2 flex-wrap">
                                  <button
                                    onClick={() => openDetails(d.sessionId)}
                                    className="btn-outline flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    onClick={() => openRefund(d)}
                                    className="btn-outline flex items-center gap-2"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                    <span>Refund</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {hasMore && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => loadDonations({ reset: false })}
                        disabled={loading}
                        className="btn-outline flex items-center gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>{loading ? 'Loading…' : 'Load more'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {tab === 'payouts' && (
                <div className="mt-6">
                  {secondaryLoading ? (
                    <div className="text-gray-500">Loading…</div>
                  ) : payouts.length === 0 ? (
                    <div className="text-gray-500">No payouts found in this range.</div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Amount</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Arrival</th>
                            <th className="text-left p-3 font-medium">ID</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payouts.map((p) => (
                            <tr key={p.id} className="border-t border-gray-200">
                              <td className="p-3 text-gray-700">{fmtDate(p.created)}</td>
                              <td className="p-3 font-medium text-gray-900">{fmtMoney(p.amount, p.currency)}</td>
                              <td className="p-3 text-gray-700">{p.status}</td>
                              <td className="p-3 text-gray-700">{p.arrival_date ? fmtDate(p.arrival_date) : '—'}</td>
                              <td className="p-3 text-gray-500">{p.id}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {tab === 'disputes' && (
                <div className="mt-6">
                  {secondaryLoading ? (
                    <div className="text-gray-500">Loading…</div>
                  ) : disputes.length === 0 ? (
                    <div className="text-gray-500">No disputes found in this range.</div>
                  ) : (
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Amount</th>
                            <th className="text-left p-3 font-medium">Status</th>
                            <th className="text-left p-3 font-medium">Reason</th>
                            <th className="text-left p-3 font-medium">Charge</th>
                          </tr>
                        </thead>
                        <tbody>
                          {disputes.map((d) => (
                            <tr key={d.id} className="border-t border-gray-200">
                              <td className="p-3 text-gray-700">{fmtDate(d.created)}</td>
                              <td className="p-3 font-medium text-gray-900">{fmtMoney(d.amount, d.currency)}</td>
                              <td className="p-3 text-gray-700">{d.status}</td>
                              <td className="p-3 text-gray-700">{d.reason || '—'}</td>
                              <td className="p-3 text-gray-500">{d.charge || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {tab === 'balance' && (
                <div className="mt-6">
                  {secondaryLoading ? (
                    <div className="text-gray-500">Loading…</div>
                  ) : !balance ? (
                    <div className="text-gray-500">No balance data.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="font-semibold text-gray-900 mb-2">Available</div>
                        <div className="space-y-1 text-sm">
                          {(balance.available || []).map((b, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-700">{String(b.currency).toUpperCase()}</span>
                              <span className="font-medium text-gray-900">{fmtMoney(b.amount, b.currency)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="font-semibold text-gray-900 mb-2">Pending</div>
                        <div className="space-y-1 text-sm">
                          {(balance.pending || []).map((b, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span className="text-gray-700">{String(b.currency).toUpperCase()}</span>
                              <span className="font-medium text-gray-900">{fmtMoney(b.amount, b.currency)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'exports' && (
                <div className="mt-6 space-y-4">
                  <div className="text-gray-700">
                    Download a CSV of donation sessions for the selected date range.
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={downloadExport}
                      disabled={secondaryLoading}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>{secondaryLoading ? 'Preparing…' : 'Download CSV'}</span>
                    </button>
                    <div className="text-sm text-gray-500">
                      Export is capped to 2000 donations per download.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Modal
        open={detailOpen}
        title="Donation details"
        onClose={() => {
          setDetailOpen(false);
          setDetailData(null);
          setDetailError(null);
        }}
      >
        {detailLoading ? (
          <div className="text-gray-500">Loading…</div>
        ) : detailError ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
            {detailError}
          </div>
        ) : !detailData ? (
          <div className="text-gray-500">No data.</div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="font-semibold text-gray-900 mb-2">Donor</div>
                <div className="text-gray-700">{detailData.session.customer_name || '—'}</div>
                <div className="text-gray-700">{detailData.session.customer_email || '—'}</div>
                <div className="text-gray-500 mt-2">{fmtDate(detailData.session.created)}</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="font-semibold text-gray-900 mb-2">Amounts</div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Gross</span>
                  <span className="font-medium text-gray-900">
                    {fmtMoney(detailData.session.amount_total, detailData.session.currency)}
                  </span>
                </div>
                {detailData.balance_transaction ? (
                  <>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-700">Fee</span>
                      <span className="font-medium text-gray-900">
                        {fmtMoney(detailData.balance_transaction.fee, detailData.balance_transaction.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-700">Net</span>
                      <span className="font-medium text-gray-900">
                        {fmtMoney(detailData.balance_transaction.net, detailData.balance_transaction.currency)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500 mt-2">Fee/net unavailable for this donation.</div>
                )}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Identifiers</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                <div>
                  <span className="text-gray-500">Session</span>
                  <div className="font-mono text-xs mt-1">{detailData.session.id}</div>
                </div>
                <div>
                  <span className="text-gray-500">Payment Intent</span>
                  <div className="font-mono text-xs mt-1">{detailData.payment_intent?.id || '—'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Charge</span>
                  <div className="font-mono text-xs mt-1">{detailData.charge?.id || '—'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Balance Tx</span>
                  <div className="font-mono text-xs mt-1">{detailData.balance_transaction?.id || '—'}</div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Receipt & payment method</div>
              <div className="text-gray-700">
                {detailData.charge?.receipt_url ? (
                  <a
                    href={detailData.charge.receipt_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-700 hover:underline"
                  >
                    Open receipt URL
                  </a>
                ) : (
                  <span className="text-gray-500">No receipt URL available.</span>
                )}
              </div>
              {detailData.charge?.payment_method_details?.card ? (
                <div className="text-gray-700 mt-2">
                  Card: {detailData.charge.payment_method_details.card.brand} •••• {detailData.charge.payment_method_details.card.last4}
                </div>
              ) : null}
              {detailData.charge?.refunded ? (
                <div className="text-red-700 mt-2">
                  Refunded {fmtMoney(detailData.charge.amount_refunded, detailData.charge.currency)}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={refundOpen}
        title="Issue refund"
        onClose={() => {
          if (refundLoading) return;
          setRefundOpen(false);
          setRefundTarget(null);
          setRefundError(null);
        }}
      >
        {!refundTarget ? (
          <div className="text-gray-500">No donation selected.</div>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="font-medium text-gray-900">{refundTarget.customer_name || '—'}</div>
              <div className="text-gray-600">{refundTarget.customer_email || '—'}</div>
              <div className="text-gray-700 mt-2">
                Gross: <span className="font-medium">{fmtMoney(refundTarget.amount_total, refundTarget.currency)}</span>
              </div>
            </div>

            {refundError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3">
                {refundError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (optional, USD)</label>
                <input
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Leave blank for full refund"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="requested_by_customer">Requested by customer</option>
                  <option value="duplicate">Duplicate</option>
                  <option value="fraudulent">Fraudulent</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRefundOpen(false)}
                className="btn-outline"
                disabled={refundLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitRefund}
                className="btn-primary flex items-center gap-2"
                disabled={refundLoading}
              >
                <RotateCcw className="h-4 w-4" />
                <span>{refundLoading ? 'Refunding…' : 'Refund'}</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DashboardDonations;
