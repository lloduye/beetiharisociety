import React from 'react';
import { Mail, ExternalLink, Inbox, Send, Shield, Info } from 'lucide-react';

const DashboardEmails = () => {
  const handleOpenEmail = (e) => {
    e.preventDefault();
    window.open('https://redbull.mxrouting.net/roundcube/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Mailbox</h1>
          <p className="text-gray-600 mt-1">Access organization email through mxroute Roundcube webmail</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <div className="bg-primary-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Mail className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Management</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Access the organization's email account through Roundcube webmail. Manage the inbox, 
                compose messages, and handle all email communications from a secure interface.
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-primary-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Inbox className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Inbox Management</h3>
                <p className="text-sm text-gray-600">View, organize, and manage all incoming emails efficiently</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-secondary-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Send className="h-6 w-6 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Compose Messages</h3>
                <p className="text-sm text-gray-600">Create and send professional emails to contacts and supporters</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-green-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Access</h3>
                <p className="text-sm text-gray-600">Protected email access through mxroute's secure platform</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center border-t border-gray-200 pt-8">
              <p className="text-gray-600 mb-6">
                Click the button below to open the Roundcube email login page in a new browser tab. 
                The admin dashboard will remain open in this tab.
              </p>
              <button
                onClick={handleOpenEmail}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
              >
                <ExternalLink className="h-6 w-6" />
                <span>Open Email Login Page</span>
              </button>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Info className="h-4 w-4 mr-2" />
                <span>The email login page will open in a new tab</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmails;
