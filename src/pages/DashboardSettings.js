import React, { useState } from 'react';
import { Settings, Save, Key, Mail, Globe } from 'lucide-react';

const DashboardSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'BETI-HARI SOCIETY',
    siteDescription: 'Beti-Hari Society for Education & Economic Development',
    contactEmail: 'contact@betiharisociety.org',
    donateEmail: 'donate@betiharisociety.org',
  });

  const handleSave = () => {
    // Save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage website and integration settings</p>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Globe className="h-5 w-5 mr-2 text-primary-600" />
              General Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Email
                </label>
                <input
                  type="email"
                  value={settings.donateEmail}
                  onChange={(e) => setSettings({ ...settings, donateEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stripe Integration */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Key className="h-5 w-5 mr-2 text-primary-600" />
              Stripe Donations
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Donations are processed securely with Stripe. To configure payments, add your
                <strong className="font-semibold text-gray-800"> STRIPE_SECRET_KEY</strong> in Netlify:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Netlify Dashboard → Site settings → Environment variables</li>
                <li>Add variable: <code className="bg-gray-100 px-1 rounded">STRIPE_SECRET_KEY</code> (secret, not visible in build)</li>
                <li>Redeploy the site after adding the key</li>
              </ul>
              <p className="text-sm text-gray-500">
                The secret key is only used on the server (Netlify Functions) and is never exposed to the browser.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;

