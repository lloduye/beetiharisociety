import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  Search,
  DollarSign,
  CreditCard,
  RefreshCw,
  Loader2,
  X,
  UserPlus,
  Send,
  FileText,
  Copy,
  Check,
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
  const d = timestamp instanceof Date ? timestamp : new Date((timestamp || 0) * 1000);
  return d.toLocaleDateString();
};

const INIT_MEMBER = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  country: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
};

const Modal = ({ isOpen, onClose, title, children }) =>
  isOpen ? (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  ) : null;

const DashboardCommunity = () => {
  const [customers, setCustomers] = useState([]);
  const [recentSignups, setRecentSignups] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [addModal, setAddModal] = useState(false);
  const [addForm, setAddForm] = useState(INIT_MEMBER);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [newsletterModal, setNewsletterModal] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterBody, setNewsletterBody] = useState('');
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [newsletterResult, setNewsletterResult] = useState(null);
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [requestInfoModal, setRequestInfoModal] = useState(false);
  const [requestInfoSending, setRequestInfoSending] = useState(false);
  const [requestInfoResult, setRequestInfoResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('limit', '50');
      if (searchEmail.trim()) params.set('email', searchEmail.trim());

      const [customersRes, donationsRes] = await Promise.all([
        fetch(`/.netlify/functions/stripe-customers?${params}`),
        fetch('/.netlify/functions/get-donations'),
      ]);
      const customersData = await customersRes.json();
      const donationsData = await donationsRes.json();

      const stripeCustomers = customersData.customers || [];
      const customerMap = new Map();
      stripeCustomers.forEach((c) => {
        const email = (c.email || '').toLowerCase();
        if (email) customerMap.set(email, { ...c, id: c.id });
      });

      (donationsData.donations || []).forEach((d) => {
        const email = (d.email || '').toLowerCase();
        if (email && !customerMap.has(email) && d.customerId) {
          customerMap.set(email, {
            id: d.customerId,
            email: d.email,
            name: d.fullName || d.name,
            created: d.created,
            source: 'donation',
          });
        }
      });

      const merged = Array.from(customerMap.values()).sort((a, b) => (b.created || 0) - (a.created || 0));

      setCustomers(customersData.error ? [] : merged.length ? merged : stripeCustomers);
      setHasMore(customersData.hasMore || false);
      setLastId(customersData.lastId || null);

      const allDonations = donationsData.donations || [];
      const recentDonationsList = [...allDonations].sort((a, b) => (b.created || 0) - (a.created || 0)).slice(0, 15);
      setRecentDonors(recentDonationsList);

      const { communityMembersService } = await import('../services/communityMembersService');
      const signups = await communityMembersService.getAll();
      setRecentSignups(signups.slice(0, 15));
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [searchEmail]);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLastId(null);
    setHasMore(false);
    fetchAllData();
  };

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    setLoading(true);
    fetch(`/.netlify/functions/stripe-customers?limit=50&starting_after=${lastId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setCustomers((prev) => {
            const existingEmails = new Set(prev.map((c) => (c.email || '').toLowerCase()));
            const newOnes = (data.customers || []).filter((c) => !existingEmails.has((c.email || '').toLowerCase()));
            return [...prev, ...newOnes].sort((a, b) => (b.created || 0) - (a.created || 0));
          });
          setHasMore(data.hasMore || false);
          setLastId(data.lastId || null);
        }
      })
      .finally(() => setLoading(false));
  };

  const fetchCustomerDetail = useCallback(async (customerId) => {
    setSelectedCustomerId(customerId);
    setDetailLoading(true);
    setSelectedCustomer(null);
    setEditForm(null);
    try {
      const res = await fetch(`/.netlify/functions/stripe-customers?customer=${customerId}`);
      const data = await res.json();
      if (res.ok && data.customer) {
        setSelectedCustomer(data.customer);
        const c = data.customer;
        const addr = c.address || {};
        setEditForm({
          firstName: (c.metadata?.firstName || c.name?.split(' ')[0] || ''),
          lastName: (c.metadata?.lastName || c.name?.split(' ').slice(1).join(' ') || ''),
          email: c.email || '',
          phone: c.phone || '',
          country: addr.country || '',
          addressLine1: addr.line1 || '',
          addressLine2: addr.line2 || '',
          city: addr.city || '',
          state: addr.state || '',
          postalCode: addr.postal_code || '',
        });
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
    setEditForm(null);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === customers.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(customers.map((c) => c.id)));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/register-community-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add member');
      const { communityMembersService } = await import('../services/communityMembersService');
      await communityMembersService.create({ ...addForm, stripeCustomerId: data.stripeCustomerId, consentGiven: true });
      setAddModal(false);
      setAddForm(INIT_MEMBER);
      fetchAllData();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleEditMember = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !editForm) return;
    setEditSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/update-stripe-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: selectedCustomer.id, ...editForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      const { communityMembersService } = await import('../services/communityMembersService');
      const fm = await communityMembersService.getByStripeCustomerId(selectedCustomer.id);
      if (fm) await communityMembersService.update(fm.id, editForm);
      setSelectedCustomer({ ...selectedCustomer, name: [editForm.firstName, editForm.lastName].filter(Boolean).join(' '), email: editForm.email, phone: editForm.phone, address: { ...selectedCustomer.address, line1: editForm.addressLine1, line2: editForm.addressLine2, city: editForm.city, state: editForm.state, postal_code: editForm.postalCode, country: editForm.country } });
    } catch (err) {
      setError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    const recipients = selectedIds.size > 0
      ? customers.filter((c) => selectedIds.has(c.id)).map((c) => c.email).filter(Boolean)
      : customers.map((c) => c.email).filter(Boolean);
    if (recipients.length === 0) {
      setNewsletterResult({ success: false, message: 'No recipients selected. Add members first.' });
      return;
    }
    setNewsletterSending(true);
    setNewsletterResult(null);
    try {
      const res = await fetch('/.netlify/functions/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients, subject: newsletterSubject, body: newsletterBody }),
      });
      const data = await res.json();
      setNewsletterResult(data);
      if (data.success) {
        setNewsletterModal(false);
        setNewsletterSubject('');
        setNewsletterBody('');
      }
    } catch (err) {
      setNewsletterResult({ success: false, message: err.message });
    } finally {
      setNewsletterSending(false);
    }
  };

  const handleRequestPayment = async (e) => {
    e.preventDefault();
    const customerId = paymentModal?.id;
    if (!customerId || !paymentAmount || Number(paymentAmount) < 1) return;
    setPaymentSubmitting(true);
    setPaymentResult(null);
    try {
      const res = await fetch('/.netlify/functions/request-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          amountCents: Math.round(Number(paymentAmount) * 100),
          description: paymentDescription || 'Beti-Hari Society - Payment Request',
          sendNow: true,
        }),
      });
      const data = await res.json();
      setPaymentResult(data);
      if (data.success) {
        setPaymentAmount('');
        setPaymentDescription('');
      }
    } catch (err) {
      setPaymentResult({ success: false, error: err.message });
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleRequestInfoUpdate = async () => {
    const recipients = selectedIds.size > 0
      ? customers.filter((c) => selectedIds.has(c.id)).map((c) => c.email).filter(Boolean)
      : customers.map((c) => c.email).filter(Boolean);
    if (recipients.length === 0) {
      setRequestInfoResult({ success: false, message: 'No recipients.' });
      return;
    }
    const baseUrl = window.location.origin;
    const body = `Hello,\n\nPlease update your community member information by visiting:\n\n${baseUrl}/community/update-info\n\nEnter your email to load your record and update your details.\n\nThank you,\nBeti-Hari Society`;
    setRequestInfoSending(true);
    setRequestInfoResult(null);
    try {
      const res = await fetch('/.netlify/functions/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: 'Beti-Hari Society – Please update your information',
          body,
        }),
      });
      const data = await res.json();
      setRequestInfoResult(data);
      if (data.success) setRequestInfoModal(false);
    } catch (err) {
      setRequestInfoResult({ success: false, message: err.message });
    } finally {
      setRequestInfoSending(false);
    }
  };

  const updateInfoLink = `${window.location.origin}/community/update-info`;
  const copyUpdateLink = () => {
    navigator.clipboard.writeText(updateInfoLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenStripe = () => window.open('https://dashboard.stripe.com/customers', '_blank');

  const hasStripeCustomer = (c) => c && (c.id?.startsWith('cus_') || c.customerId?.startsWith('cus_'));

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Members</h1>
          <p className="text-gray-600 mt-1 max-w-2xl">
            Add, edit, and manage community members. Send newsletters, request payments, and collect updated information.
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setAddModal(true)} className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
            <UserPlus className="h-4 w-4 mr-2" /> Add Member
          </button>
          <button type="button" onClick={() => { setNewsletterModal(true); setNewsletterResult(null); }} className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary-500 text-white text-sm font-medium hover:bg-secondary-600">
            <Send className="h-4 w-4 mr-2" /> Send Newsletter
          </button>
          <button type="button" onClick={() => setRequestInfoModal(true)} className="inline-flex items-center px-4 py-2 rounded-lg border border-primary-600 text-primary-600 text-sm font-medium hover:bg-primary-50">
            <FileText className="h-4 w-4 mr-2" /> Request Info Update
          </button>
          <button type="button" onClick={handleOpenStripe} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
            <ExternalLink className="h-4 w-4 mr-2" /> Stripe
          </button>
          <button type="button" onClick={() => fetchAllData(false)} disabled={loading} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Filter by email..." value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <button type="submit" className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium">Search</button>
        </form>
      </div>

      {/* 3-column layout: Members | Recent Signups | Recent Donors */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Members list */}
        <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="px-4 py-3 bg-gray-50 border-b font-semibold text-gray-900">All Members</h2>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2"><input type="checkbox" checked={customers.length > 0 && selectedIds.size === customers.length} onChange={toggleSelectAll} className="rounded" /></th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Member</th>
                  <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && customers.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-500">No members. <a href="/join" className="text-primary-600 hover:underline">Share /join</a></td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2"><input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" /></td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900 text-sm">{c.name || c.email || '—'}</div>
                        <div className="text-xs text-gray-500">{c.email || '—'}</div>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => fetchCustomerDetail(c.id)} className="text-primary-600 hover:text-primary-700 text-xs mr-2">View</button>
                        {hasStripeCustomer(c) && (
                          <button type="button" onClick={() => setPaymentModal(c)} className="text-green-600 hover:text-green-700 text-xs">Request Payment</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {hasMore && (
            <div className="px-4 py-2 bg-gray-50 border-t text-center">
              <button type="button" onClick={handleLoadMore} disabled={loading} className="text-xs text-primary-600 font-medium">Load more</button>
            </div>
          )}
        </div>

        {/* Recent signups */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="px-4 py-3 bg-gray-50 border-b font-semibold text-gray-900">Recent Signups</h2>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
            {recentSignups.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No signups yet</div>
            ) : (
              recentSignups.map((s) => (
                <div key={s.id} className="px-4 py-3 hover:bg-gray-50">
                  <div className="font-medium text-gray-900 text-sm">{s.firstName} {s.lastName}</div>
                  <div className="text-xs text-gray-500">{s.email}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {s.createdAt?.toDate ? formatDate(s.createdAt.toDate()) : (s.createdAt ? formatDate(s.createdAt) : '—')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent donors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="px-4 py-3 bg-gray-50 border-b font-semibold text-gray-900">Recent Donors</h2>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
            {recentDonors.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No donations yet</div>
            ) : (
              recentDonors.map((d, i) => (
                <div key={d.id || i} className="px-4 py-3 hover:bg-gray-50">
                  <div className="font-medium text-gray-900 text-sm">{d.fullName || d.name || 'Anonymous'}</div>
                  <div className="text-xs text-gray-500">{d.email || '—'}</div>
                  <div className="text-xs text-green-600 font-medium mt-0.5">{formatCurrency(d.amount, d.currency)}</div>
                  <div className="text-xs text-gray-400">{formatDate(d.created)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Community Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">First name *</label><input type="text" required value={addForm.firstName} onChange={(e) => setAddForm((p) => ({ ...p, firstName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Last name *</label><input type="text" required value={addForm.lastName} onChange={(e) => setAddForm((p) => ({ ...p, lastName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" required value={addForm.email} onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={addForm.phone} onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" value={addForm.country} onChange={(e) => setAddForm((p) => ({ ...p, country: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={addForm.addressLine1} onChange={(e) => setAddForm((p) => ({ ...p, addressLine1: e.target.value }))} className="w-full px-3 py-2 border rounded-lg mb-2" placeholder="Line 1" /><input type="text" value={addForm.addressLine2} onChange={(e) => setAddForm((p) => ({ ...p, addressLine2: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" placeholder="Line 2" /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={addForm.city} onChange={(e) => setAddForm((p) => ({ ...p, city: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={addForm.state} onChange={(e) => setAddForm((p) => ({ ...p, state: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Postal</label><input type="text" value={addForm.postalCode} onChange={(e) => setAddForm((p) => ({ ...p, postalCode: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setAddModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={addSubmitting} className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium disabled:opacity-50">{addSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Add Member'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail + Edit Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4" onClick={closeDetailModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
              <button type="button" onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            {detailLoading ? (
              <div className="p-12 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary-600" /></div>
            ) : selectedCustomer && editForm ? (
              <div className="p-6 space-y-6">
                <form onSubmit={handleEditMember} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">First name</label><input type="text" value={editForm.firstName} onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">Last name</label><input type="text" value={editForm.lastName} onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label><input type="tel" value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Country</label><input type="text" value={editForm.country} onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Address</label><input type="text" value={editForm.addressLine1} onChange={(e) => setEditForm((p) => ({ ...p, addressLine1: e.target.value }))} className="w-full px-3 py-2 border rounded-lg mb-2" /><input type="text" value={editForm.addressLine2} onChange={(e) => setEditForm((p) => ({ ...p, addressLine2: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">City</label><input type="text" value={editForm.city} onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">State</label><input type="text" value={editForm.state} onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">Postal</label><input type="text" value={editForm.postalCode} onChange={(e) => setEditForm((p) => ({ ...p, postalCode: e.target.value }))} className="w-full px-3 py-2 border rounded-lg" /></div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setPaymentModal(selectedCustomer)} className="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium">Request Payment</button>
                    <button type="submit" disabled={editSubmitting} className="flex-1 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium disabled:opacity-50">{editSubmitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Save changes'}</button>
                  </div>
                </form>
                {selectedCustomer.charges && selectedCustomer.charges.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Recent Payments</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left font-medium text-gray-500">Date</th><th className="px-3 py-2 text-left font-medium text-gray-500">Amount</th><th className="px-3 py-2 text-left font-medium text-gray-500">Status</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedCustomer.charges.slice(0, 10).map((ch) => (
                            <tr key={ch.id}><td className="px-3 py-2">{formatDate(ch.created)}</td><td className="px-3 py-2 font-medium">{formatCurrency(ch.amount, ch.currency)}</td><td className="px-3 py-2"><span className={`inline-flex px-2 py-0.5 rounded text-xs ${ch.status === 'succeeded' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{ch.status}</span></td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {selectedCustomer.subscriptions && selectedCustomer.subscriptions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Subscriptions</h3>
                    <div className="space-y-2">
                      {selectedCustomer.subscriptions.map((sub) => (
                        <div key={sub.id} className="border rounded-lg p-3 flex justify-between items-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{sub.status}</span>
                          {sub.items?.[0] && <span className="text-sm">{formatCurrency(sub.items[0].unitAmount)}/{sub.items[0].interval}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <a href={`https://dashboard.stripe.com/customers/${selectedCustomer.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-600 font-medium">View in Stripe <ExternalLink className="h-4 w-4" /></a>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Newsletter Modal */}
      <Modal isOpen={newsletterModal} onClose={() => { setNewsletterModal(false); setNewsletterResult(null); }} title="Send Newsletter">
        <form onSubmit={handleSendNewsletter} className="space-y-4">
          <p className="text-sm text-gray-600">
            {selectedIds.size > 0 ? `Sending to ${selectedIds.size} selected member(s).` : 'Sending to all members.'}
          </p>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label><input type="text" required value={newsletterSubject} onChange={(e) => setNewsletterSubject(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Message *</label><textarea rows={6} required value={newsletterBody} onChange={(e) => setNewsletterBody(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div>
          {newsletterResult && <p className={`text-sm ${newsletterResult.success ? 'text-green-600' : 'text-red-600'}`}>{newsletterResult.message}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setNewsletterModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={newsletterSending} className="flex-1 py-2 rounded-lg bg-secondary-500 text-white font-medium disabled:opacity-50">{newsletterSending ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Send'}</button>
          </div>
        </form>
      </Modal>

      {/* Request Payment Modal */}
      <Modal isOpen={!!paymentModal} onClose={() => { setPaymentModal(null); setPaymentAmount(''); setPaymentDescription(''); setPaymentResult(null); }} title={paymentModal ? `Request Payment – ${paymentModal.name || paymentModal.email}` : 'Request Payment'}>
        {paymentModal && (
          <form onSubmit={handleRequestPayment} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD) *</label><input type="number" min="0.01" step="0.01" required value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. 120" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" value={paymentDescription} onChange={(e) => setPaymentDescription(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Annual membership" /></div>
            {paymentResult && <p className={`text-sm ${paymentResult.success ? 'text-green-600' : 'text-red-600'}`}>{paymentResult.success ? `Invoice sent. ${paymentResult.hostedInvoiceUrl ? 'View: ' + paymentResult.hostedInvoiceUrl : ''}` : paymentResult.error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setPaymentModal(null)} className="flex-1 py-2 border rounded-lg">Close</button>
              <button type="submit" disabled={paymentSubmitting} className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium disabled:opacity-50">{paymentSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Send Invoice'}</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Request Info Update Modal */}
      <Modal isOpen={requestInfoModal} onClose={() => { setRequestInfoModal(false); setRequestInfoResult(null); }} title="Request Information Update">
        <div className="space-y-4">
          <p className="text-gray-600">
            {selectedIds.size > 0 ? `Send an email to ${selectedIds.size} selected member(s) with a link to update their information.` : 'Send to all members.'}
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Update link (share manually if needed):</p>
            <div className="flex gap-2">
              <input type="text" readOnly value={updateInfoLink} className="flex-1 px-3 py-2 border rounded-lg text-sm bg-white" />
              <button type="button" onClick={copyUpdateLink} className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
                {copiedLink ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {requestInfoResult && <p className={`text-sm ${requestInfoResult.success ? 'text-green-600' : 'text-red-600'}`}>{requestInfoResult.success ? `Sent to ${requestInfoResult.sent} recipient(s).` : requestInfoResult.message}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setRequestInfoModal(false)} className="flex-1 py-2 border rounded-lg">Close</button>
            <button type="button" onClick={handleRequestInfoUpdate} disabled={requestInfoSending} className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium disabled:opacity-50">{requestInfoSending ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Send Email'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardCommunity;
