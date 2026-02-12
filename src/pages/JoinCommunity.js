import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, Heart } from 'lucide-react';
import { communityMembersService } from '../services/communityMembersService';
import { stripeMembershipUrl } from '../config/stripe';

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Bahrain', 'Bangladesh', 'Belgium', 'Brazil', 'Bulgaria', 'Cambodia', 'Cameroon',
  'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Egypt', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hong Kong',
  'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Jordan', 'Kenya', 'South Korea', 'Kuwait', 'Lebanon', 'Malaysia', 'Mexico', 'Morocco',
  'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Palestine', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tanzania', 'Thailand', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates',
  'United Kingdom', 'United States', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe', 'Other',
];

const JoinCommunity = () => {
  const [formData, setFormData] = useState({
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
    consentGiven: false,
  });

  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consentGiven) {
      setErrorMessage('You must agree and authorize Beti-Hari Society to use your information.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/.netlify/functions/register-community-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
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

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      await communityMembersService.create({
        ...formData,
        stripeCustomerId: data.stripeCustomerId,
        consentGiven: true,
      });

      setStatus('success');
      setFormData({
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
        consentGiven: false,
      });
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to the Community!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for joining the Beti-Hari Society community. We have received your information
            and you are now part of our mission to support education and economic development in
            South Sudan.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You can make donations or become a paying member at any time. We will keep you informed
            about our work and ways to get involved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/get-involved"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Get Involved
            </Link>
            {stripeMembershipUrl && (
              <a
                href={stripeMembershipUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-50 transition-colors"
              >
                Become a Paying Member ($120/mo)
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4">
            <Heart className="h-7 w-7 text-primary-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Join the Beti-Hari Society Community
          </h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            Sign up to become part of our community. Your information helps us stay connected and
            enables future donations and membership.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 sm:p-8 space-y-5">
            {errorMessage && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <select
                required
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full address *</label>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  value={formData.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Address line 1"
                />
                <input
                  type="text"
                  value={formData.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Address line 2 (optional)"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="State / Province"
                  />
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.consentGiven}
                  onChange={(e) => handleChange('consentGiven', e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  I agree and authorize Beti-Hari Society to use this information for community
                  membership and for future communications and donations. I understand that my data
                  will be stored securely and used in accordance with Beti-Hari Society&apos;s
                  privacy practices.
                </span>
              </label>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-6 bg-gray-50 border-t border-gray-100">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'submitting' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Community'
              )}
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              <Link to="/" className="text-primary-600 hover:underline">
                Return to home
              </Link>
            </p>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already part of our community?{' '}
          <Link to="/get-involved" className="text-primary-600 font-medium hover:underline">
            Get involved
          </Link>
        </p>
      </div>
    </div>
  );
};

export default JoinCommunity;
