import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { communityMembersService } from '../services/communityMembersService';

const CommunityUpdateInfo = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
      loadMember(emailParam);
    }
  }, [emailParam]);

  const loadMember = async (em) => {
    if (!em) return;
    const m = await communityMembersService.getByEmail(em);
    if (m) {
      setMember(m);
      setFormData({
        firstName: m.firstName || '',
        lastName: m.lastName || '',
        phone: m.phone || '',
        country: m.country || '',
        addressLine1: m.addressLine1 || '',
        addressLine2: m.addressLine2 || '',
        city: m.city || '',
        state: m.state || '',
        postalCode: m.postalCode || '',
      });
    } else {
      setMember(null);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setStatus('loading');
    await loadMember(email.trim());
    setStatus('idle');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');
    try {
      if (!member || !member.stripeCustomerId) {
        throw new Error('Cannot update: no linked member record found.');
      }
      const res = await fetch('/.netlify/functions/update-stripe-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: member.stripeCustomerId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          country: formData.country,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      await communityMembersService.update(member.id, formData);
      setStatus('success');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Information Updated</h1>
          <p className="text-gray-600 mb-6">Thank you. Your community member information has been updated.</p>
          <Link to="/" className="text-primary-600 font-medium hover:underline">Return to home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">Update Your Information</h1>
        <p className="text-gray-600 text-center mb-8">Enter your email to load your record, then update your details.</p>

        {!member ? (
          <form onSubmit={handleLookup} className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border rounded-lg mb-4"
              placeholder="you@example.com"
              required
            />
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <button type="submit" disabled={status === 'loading'} className="w-full btn-primary">
              {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Look up my record'}
            </button>
            {member === null && email && status === 'idle' && (
              <p className="mt-4 text-amber-600 text-sm">No member record found for this email.</p>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            <p className="text-sm text-gray-500">Updating record for: <strong>{member.email}</strong></p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address line 1</label>
              <input type="text" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address line 2</label>
              <input type="text" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                <input type="text" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setMember(null)} className="flex-1 py-2 border rounded-lg text-gray-700">Use different email</button>
              <button type="submit" disabled={status === 'submitting'} className="flex-1 btn-primary">
                {status === 'submitting' ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Save changes'}
              </button>
            </div>
          </form>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to="/" className="text-primary-600 hover:underline">Return to home</Link>
        </p>
      </div>
    </div>
  );
};

export default CommunityUpdateInfo;
