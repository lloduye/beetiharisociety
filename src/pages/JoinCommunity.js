import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, Heart, Info, Gift, Shield } from 'lucide-react';
import { AsYouType, getCountryCallingCode } from 'libphonenumber-js';
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

const COUNTRY_TO_ISO = {
  Afghanistan: 'AF', Albania: 'AL', Algeria: 'DZ', Andorra: 'AD', Angola: 'AO',
  Argentina: 'AR', Armenia: 'AM', Australia: 'AU', Austria: 'AT', Bahrain: 'BH',
  Bangladesh: 'BD', Belgium: 'BE', Brazil: 'BR', Bulgaria: 'BG', Cambodia: 'KH',
  Cameroon: 'CM', Canada: 'CA', Chile: 'CL', China: 'CN', Colombia: 'CO',
  Croatia: 'HR', Cyprus: 'CY', 'Czech Republic': 'CZ', Denmark: 'DK', Egypt: 'EG',
  Estonia: 'EE', Ethiopia: 'ET', Finland: 'FI', France: 'FR', Germany: 'DE',
  Ghana: 'GH', Greece: 'GR', 'Hong Kong': 'HK', Hungary: 'HU', India: 'IN',
  Indonesia: 'ID', Iran: 'IR', Iraq: 'IQ', Ireland: 'IE', Israel: 'IL',
  Italy: 'IT', Japan: 'JP', Jordan: 'JO', Kenya: 'KE', 'South Korea': 'KR',
  Kuwait: 'KW', Lebanon: 'LB', Malaysia: 'MY', Mexico: 'MX', Morocco: 'MA',
  Netherlands: 'NL', 'New Zealand': 'NZ', Nigeria: 'NG', Norway: 'NO',
  Pakistan: 'PK', Palestine: 'PS', Philippines: 'PH', Poland: 'PL', Portugal: 'PT',
  Qatar: 'QA', Romania: 'RO', Russia: 'RU', 'Saudi Arabia': 'SA', Singapore: 'SG',
  'South Africa': 'ZA', 'South Sudan': 'SS', Spain: 'ES', 'Sri Lanka': 'LK',
  Sudan: 'SD', Sweden: 'SE', Switzerland: 'CH', Syria: 'SY', Taiwan: 'TW',
  Tanzania: 'TZ', Thailand: 'TH', Tunisia: 'TN', Turkey: 'TR', Uganda: 'UG',
  Ukraine: 'UA', 'United Arab Emirates': 'AE', 'United Kingdom': 'GB',
  'United States': 'US', Vietnam: 'VN', Yemen: 'YE', Zambia: 'ZM', Zimbabwe: 'ZW',
};

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
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'country') next.phone = '';
      return next;
    });
  };

  const countryIso = useMemo(() => formData.country && formData.country !== 'Other' ? COUNTRY_TO_ISO[formData.country] : null, [formData.country]);
  const callingCode = useMemo(() => countryIso ? getCountryCallingCode(countryIso) : '', [countryIso]);

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    if (!countryIso) {
      const asYouType = new AsYouType();
      asYouType.input(raw);
      const num = asYouType.getNumber();
      setFormData((prev) => ({
        ...prev,
        phone: num ? num.number : (raw ? new AsYouType().input(raw) : ''),
      }));
      return;
    }
    const digits = raw.replace(/\D/g, '');
    const stripped = digits.startsWith(callingCode) ? digits.slice(callingCode.length) : digits;
    const e164 = stripped ? `+${callingCode}${stripped}` : '';
    setFormData((prev) => ({ ...prev, phone: e164 }));
  };

  const phoneDisplayValue = useMemo(() => {
    if (!formData.phone) return '';
    if (!countryIso) return formData.phone;
    const digits = formData.phone.replace(/\D/g, '');
    const national = digits.startsWith(callingCode) ? digits.slice(callingCode.length) : digits;
    return national ? new AsYouType(countryIso).input(national) : '';
  }, [formData.phone, countryIso, callingCode]);

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
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 py-12 sm:py-16 px-4 flex justify-center">
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
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
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
            <Link
              to="/join"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Return to Join Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-11">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
              <Heart className="h-8 w-8" />
              Join the Beti-Hari Society Community
            </h1>
            <p className="text-base text-primary-100">
              Sign up to become part of our community of advocates committed to supporting education
              and economic development in South Sudan.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container-custom">
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Your membership helps us stay connected with you, share updates on our work with the
            Didinga children in Lotukei sub-county, and makes it easy for you to donate or become a
            paying member whenever you&apos;re ready.
          </p>

          {/* Form first, info side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form - key, first */}
          <div className="lg:col-span-3">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
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
              <div className="flex">
                {countryIso && (
                  <span className="inline-flex items-center px-3 py-2.5 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-700">
                    +{callingCode}
                  </span>
                )}
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phoneDisplayValue}
                  onChange={handlePhoneChange}
                  className={`flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${countryIso ? 'rounded-l-none' : ''}`}
                  placeholder={
                    countryIso
                      ? (countryIso === 'US' ? '(555) 123-4567' : 'Enter your number')
                      : 'e.g. +44 7911 123456'
                  }
                />
              </div>
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
        <p className="mt-4 text-center text-sm text-gray-500">
          Already part of our community?{' '}
          <Link to="/get-involved" className="text-primary-600 font-medium hover:underline">
            Get involved
          </Link>
        </p>
          </div>

          {/* Info - side by side */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-primary-600 flex-shrink-0" />
                What membership means
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                You join a network of advocates supporting education and economic development in South Sudan — a declaration of support for the Didinga children in Lotukei sub-county. Whether you donate, volunteer, or stay informed, you stand with a community for change.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary-600 flex-shrink-0" />
                Why we collect this
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-2">We use your details to:</p>
              <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                <li>Keep you updated on our impact</li>
                <li>Enable secure donations and payments</li>
                <li>Send newsletters and event invites</li>
                <li>Meet legal and tax requirements</li>
              </ul>
              <p className="text-gray-600 text-xs mt-2">Stored securely. Never sold.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <Gift className="h-4 w-4 text-primary-600 flex-shrink-0" />
                Membership perks
              </h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li><strong className="text-gray-900">Stay informed</strong> — Updates on programs and impact</li>
                <li><strong className="text-gray-900">Easy giving</strong> — One-step donations with info on file</li>
                <li><strong className="text-gray-900">Get involved</strong> — Volunteer and advocacy opportunities</li>
                <li><strong className="text-gray-900">Make an impact</strong> — Support education for every child</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </section>
    </div>
  );
};

export default JoinCommunity;
