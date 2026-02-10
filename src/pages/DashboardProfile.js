import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersService } from '../services/usersService';
import { storageService } from '../services/storageService';
import { Mail, Phone, MapPin, Image as ImageIcon, User, Loader2 } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const DashboardProfile = () => {
  const { userEmail } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    team: '',
    position: '',
    personalEmail: '',
    phone: '',
    address: '',
    country: '',
    stateProvince: '',
    profileImageUrl: '',
    bio: '',
    showOnTeamPage: false,
  });

  // Google Places Autocomplete
  const addressInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Image upload & crop state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const countries = [
    { code: 'SS', name: 'South Sudan', dialCode: '+211' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'KE', name: 'Kenya', dialCode: '+254' },
    { code: 'UG', name: 'Uganda', dialCode: '+256' },
    { code: 'ET', name: 'Ethiopia', dialCode: '+251' },
    // Fallback / other
    { code: 'OTHER', name: 'Other', dialCode: '' },
  ];

  const getCountryByCode = (code) =>
    countries.find((c) => c.code === code) || countries[0];

  const formatPhoneWithDialCode = (raw, dialCode) => {
    const onlyDigits = (raw || '').replace(/[^\d]/g, '');
    const baseDigits = (dialCode || '').replace(/[^\d]/g, '');

    let fullDigits = onlyDigits;
    if (baseDigits && !onlyDigits.startsWith(baseDigits)) {
      fullDigits = baseDigits + onlyDigits;
    }

    if (!fullDigits) return '';

    const phoneNumber = parsePhoneNumberFromString(`+${fullDigits}`);
    if (phoneNumber) {
      return phoneNumber.formatInternational();
    }

    return `+${fullDigits}`;
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const user = await usersService.getByEmail(userEmail);
        if (!user) {
          setError('Profile not found for this account email.');
          setLoading(false);
          return;
        }
        setUserId(user.id);
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          team: user.team || '',
          position: user.position || '',
          personalEmail: user.personalEmail || '',
          phone: user.phone || '',
          address: user.address || '',
          country: user.country || '',
          stateProvince: user.stateProvince || '',
          profileImageUrl: user.profileImageUrl || '',
          bio: user.bio || '',
          showOnTeamPage: !!user.showOnTeamPage,
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load your profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userEmail]);

  // Initialize Google Places Autocomplete for address field
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !addressInputRef.current) {
      return;
    }

    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) return;
      if (!addressInputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['geocode'],
      });
      autocomplete.setFields(['address_components', 'formatted_address']);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place) return;

        const components = place.address_components || [];
        const countryComp = components.find((c) => c.types.includes('country'));
        const stateComp = components.find((c) => c.types.includes('administrative_area_level_1'));

        const countryCode = countryComp?.short_name || '';
        const stateName = stateComp?.long_name || '';

        setFormData((prev) => ({
          ...prev,
          address: place.formatted_address || prev.address,
          country: countryCode || prev.country,
          stateProvince: stateName || prev.stateProvince,
        }));
      });

      autocompleteRef.current = autocomplete;
    };

    const existing = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (!existing) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      if (window.google && window.google.maps && window.google.maps.places) {
        initAutocomplete();
      } else {
        existing.addEventListener('load', initAutocomplete);
      }
    }
  }, []);

  const handleChange = (field) => (e) => {
    if (field === 'showOnTeamPage') {
      setFormData((prev) => ({ ...prev, showOnTeamPage: e.target.checked }));
      return;
    }

    if (field === 'country') {
      const code = e.target.value;
      const country = getCountryByCode(code);
      // When changing country, adjust phone prefix if empty or not starting with +
      setFormData((prev) => {
        const newPhone = formatPhoneWithDialCode(prev.phone || '', country.dialCode || '');
        return { ...prev, country: code, phone: newPhone };
      });
      return;
    }

    if (field === 'phone') {
      setFormData((prev) => {
        const country = getCountryByCode(prev.country);
        const formatted = formatPhoneWithDialCode(e.target.value, country.dialCode || '');
        return { ...prev, phone: formatted };
      });
      return;
    }

    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const updates = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        // Keep work email and team managed by admins, so we don't update them here
        personalEmail: formData.personalEmail.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        country: formData.country,
        stateProvince: formData.stateProvince.trim(),
        position: formData.position.trim(),
        profileImageUrl: formData.profileImageUrl.trim(),
        bio: formData.bio.trim(),
        showOnTeamPage: !!formData.showOnTeamPage,
      };

      await usersService.updateUser(userId, updates);
      setSuccess('Your profile has been updated.');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    const first = formData.firstName?.[0] || '';
    const last = formData.lastName?.[0] || '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || 'U';
  };

  const avatarSrc = avatarPreview || formData.profileImageUrl;
  const avatar = avatarSrc ? (
    <img
      src={avatarSrc}
      alt="Profile"
      className="h-16 w-16 rounded-full object-cover border border-gray-200"
    />
  ) : (
    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xl border border-primary-200">
      {getInitials()}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {avatar}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {formData.firstName || formData.lastName
                ? `${formData.firstName} ${formData.lastName}`.trim()
                : 'Your Profile'}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your personal details, contact information, and public profile used on the website.
            </p>
          </div>
        </div>
        {formData.team && (
          <div className="text-right text-sm text-gray-500">
            <p className="font-semibold text-gray-800">{formData.team}</p>
            {formData.position && <p>{formData.position}</p>}
          </div>
        )}
      </div>

      {/* Content */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        {/* Account info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <User className="h-4 w-4 text-primary-600" />
            <span>Account information</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work email
              </label>
              <div className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span>{formData.email}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This is the email used to sign in and match you on the website. It can be changed by an administrator.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role / Position
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={handleChange('position')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. Communications Manager"
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Phone className="h-4 w-4 text-primary-600" />
            <span>Contact details</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Personal email
              </label>
              <input
                type="email"
                value={formData.personalEmail}
                onChange={handleChange('personalEmail')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Optional personal contact"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={formData.country}
                onChange={handleChange('country')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                autoComplete="country"
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State / Province
              </label>
              <input
                type="text"
                value={formData.stateProvince}
                onChange={handleChange('stateProvince')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="State or province"
                autoComplete="address-level1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handleChange('phone')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+211 9 123 456"
                autoComplete="tel"
              />
              <p className="mt-1 text-xs text-gray-500">
                Phone is formatted with an international prefix based on your selected country.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-start pt-2">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                ref={addressInputRef}
                value={formData.address}
                onChange={handleChange('address')}
                rows={2}
                className="block w-full pl-9 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Start typing your address…"
                autoComplete="street-address"
              />
            </div>
          </div>
        </div>

        {/* Public profile */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <ImageIcon className="h-4 w-4 text-primary-600" />
            <span>Public profile (Team page)</span>
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            This information can be used on the public “Our Team” section of the website. 
            It is matched using your work email so visitors see the correct profile.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  setAvatarFile(file);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setAvatarPreview(reader.result?.toString() || null);
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-sm text-gray-700"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload a clear image. You can crop it before saving.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short bio
              </label>
              <textarea
                value={formData.bio}
                onChange={handleChange('bio')}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Write a short introduction about your background and your role with BETI-HARI SOCIETY."
              />
              <p className="mt-1 text-xs text-gray-500">
                Keep it concise. This text can be shown on the public website with your profile.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="showOnTeamPage"
              type="checkbox"
              checked={formData.showOnTeamPage}
              onChange={handleChange('showOnTeamPage')}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="showOnTeamPage" className="text-sm text-gray-700">
              Show me on the public team page (if enabled on the website)
            </label>
          </div>
        </div>

        {/* Status */}
        {(error || success) && (
          <div className="pt-2">
            {error && (
              <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || uploadingImage || !userId}
            className="btn-primary inline-flex items-center"
          >
            {(saving || uploadingImage) && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            <span>
              {uploadingImage
                ? 'Uploading picture...'
                : saving
                ? 'Saving changes...'
                : 'Save profile'}
            </span>
          </button>
        </div>
      </form>

      {/* Cropper overlay for profile image */}
      {avatarFile && avatarPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Crop profile picture</h3>
            <div className="relative w-full h-64 bg-black rounded-lg overflow-hidden">
              <Cropper
                image={avatarPreview}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-1/2"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarFile(null);
                    setAvatarPreview(formData.profileImageUrl || null);
                    setCroppedAreaPixels(null);
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={uploadingImage || !userId}
                  onClick={async () => {
                    if (!avatarPreview || !croppedAreaPixels || !userId) return;
                    try {
                      setUploadingImage(true);
                      const imageElement = new Image();
                      imageElement.src = avatarPreview;
                      await new Promise((resolve, reject) => {
                        imageElement.onload = resolve;
                        imageElement.onerror = reject;
                      });

                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const { width, height, x, y } = croppedAreaPixels;
                      canvas.width = width;
                      canvas.height = height;
                      ctx.drawImage(
                        imageElement,
                        x,
                        y,
                        width,
                        height,
                        0,
                        0,
                        width,
                        height
                      );

                      const blob = await new Promise((resolve, reject) => {
                        canvas.toBlob(
                          (b) => {
                            if (!b) {
                              reject(new Error('Failed to crop image'));
                            } else {
                              resolve(b);
                            }
                          },
                          'image/jpeg',
                          0.9
                        );
                      });

                      const file = new File([blob], avatarFile.name || 'avatar.jpg', {
                        type: 'image/jpeg',
                      });
                      const url = await storageService.uploadProfileImage(userId, file);
                      setFormData((prev) => ({ ...prev, profileImageUrl: url }));
                      setAvatarPreview(url);
                      setAvatarFile(null);
                      setCroppedAreaPixels(null);
                      setSuccess('Profile picture updated.');
                    } catch (err) {
                      console.error('Failed to upload profile image:', err);
                      setError('Failed to upload profile image. Please try again.');
                    } finally {
                      setUploadingImage(false);
                    }
                  }}
                  className="px-4 py-2 text-sm btn-primary"
                >
                  {uploadingImage ? 'Saving...' : 'Use this photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardProfile;

