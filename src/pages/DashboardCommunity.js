import React, { useState, useEffect, useCallback } from 'react';
import {
  ExternalLink,
  Search,
  DollarSign,
  CreditCard,
  RefreshCw,
  Phone,
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
  const d = new Date(timestamp * 1000);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  ) : null;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (!hasMore || loading) return;
    fetchCustomers(true);
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
        body: JSON.stringify({
          firstName: addForm.firstName,
          lastName: addForm.lastName,
          email: addForm.email,
          phone: addForm.phone,
          country: addForm.country,
          addressLine1: addForm.addressLine1,
          addressLine2: addForm.addressLine2,
          city: addForm.city,
          state: addForm.state,
          postalCode: addForm.postalCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add member');
      const { communityMembersService } = await import('../services/communityMembersService');
      await communityMembersService.create({
        ...addForm,
        stripeCustomerId: data.stripeCustomerId,
        consentGiven: true,
      });
      setAddModal(false);
      setAddForm(INIT_MEMBER);
      fetchCustomers(false);
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
        body: JSON.stringify({
          customerId: selectedCustomer.id,
          ...editForm,
        }),
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
      setNewsletterResult({ success: false, message: 'No recipients selected.' });
      return;
    }
    setNewsletterSending(true);
    setNewsletterResult(null);
    try {
      const res = await fetch('/.netlify/functions/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject: newsletterSubject,
          body: newsletterBody,
        }),
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
            Add, edit, and manage community members. Send newsletters, request payments, and collect updated information.
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setAddModal(true)} className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
            <UserPlus className="h-4 w-4 mr-2" /> Add Member
          </button>
          <button onClick={() => { setNewsletterModal(true); setNewsletterResult(null); }} className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary-500 text-white text-sm font-medium hover:bg-secondary-600">
            <Send className="h-4 w-4 mr-2" /> Send Newsletter
          </button>
          <button onClick={() => setRequestInfoModal(true)} className="inline-flex items-center px-4 py-2 rounded-lg border border-primary-600 text-primary-600 text-sm font-medium hover:bg-primary-50">
            <FileText className="h-4 w-4 mr-2" /> Request Info Update
          </button>
          <button onClick={handleOpenStripe} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
            <ExternalLink className="h-4 w-4 mr-2" /> Stripe
          </button>
          <button onClick={() => fetchCustomers(false)} disabled={loading} className="inline-flex items-center px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50">
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <input type="checkbox" checked={customers.length > 0 && selectedIds.size === customers.length} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Country</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && customers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No members. <a href="/join" className="text-primary-600 hover:underline">Share /join</a> to sign up.</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.has(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{c.name || '—'}</div>
                      {c.phone && <div className="text-xs text-gray-500"><Phone className="h-3 w-3 inline mr-1" />{c.phone}</div>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{c.address?.country || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(c.created)}</td>
                    <td className="px-4 py-3 text-right flex justify-end gap-2">
                      <button onClick={() => fetchCustomerDetail(c.id)} className="text-primary-600 hover:text-primary-700 text-sm">View</button>
                      <button onClick={() => setPaymentModal(c)} className="text-green-600 hover:text-green-700 text-sm">Request Payment</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-4 py-3 bg-gray-50 border-t text-center">
            <button onClick={handleLoadMore} disabled={loading} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Load more</button>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Community Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">First name *</label><input type="text" required value={addForm.firstName} onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Last name *</label><input type="text" required value={addForm.lastName} onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" required value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone</label><input type="tel" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Country</label><input type="text" value={addForm.country} onChange={(e) => setAddForm({ ...addForm, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><input type="text" value={addForm.addressLine1} onChange={(e) => setAddForm({ ...addForm, addressLine1: e.target.value })} className="w-full px-3 py-2 border rounded-lg mb-2" placeholder="Line 1" /><input type="text" value={addForm.addressLine2} onChange={(e) => setAddForm({ ...addForm, addressLine2: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Line 2" /></div>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label><input type="text" value={addForm.city} onChange={(e) => setAddForm({ ...addForm, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">State</label><input type="text" value={addForm.state} onChange={(e) => setAddForm({ ...addForm, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Postal</label><input type="text" value={addForm.postalCode} onChange={(e) => setAddForm({ ...addForm, postalCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setAddModal(false)} className="flex-1 py-2 border rounded-lg">Cancel</button>
            <button type="submit" disabled={addSubmitting} className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium disabled:opacity-50">{addSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Add Member'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail + Edit Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeDetailModal}>
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Member Details</h2>
              <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600"><X className="h-6 w-6" /></button>
            </div>
            {detailLoading ? (
              <div className="p-12 text-center"><Loader2 className="h-10 w-10 animate-spin mx-auto text-primary-600" /></div>
            ) : selectedCustomer && editForm ? (
              <div className="p-6 space-y-6">
                <form onSubmit={handleEditMember} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">First name</label><input type="text" value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">Last name</label><input type="text" value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  </div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Email</label><input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label><input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Country</label><input type="text" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div><label className="block text-xs font-semibold text-gray-500 mb-1">Address</label><input type="text" value={editForm.addressLine1} onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })} className="w-full px-3 py-2 border rounded-lg mb-2" /><input type="text" value={editForm.addressLine2} onChange={(e) => setEditForm({ ...editForm, addressLine2: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">City</label><input type="text" value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">State</label><input type="text" value={editForm.state} onChange={(e) => setEditForm({ ...editForm, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
                    <div><label className="block text-xs font-semibold text-gray-500 mb-1">Postal</label><input type="text" value={editForm.postalCode} onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg" /></div>
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
            <button onClick={handleRequestInfoUpdate} disabled={requestInfoSending} className="flex-1 py-2 rounded-lg bg-primary-600 text-white font-medium disabled:opacity-50">{requestInfoSending ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Send Email'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardCommunity;
