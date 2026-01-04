import React from 'react';
import { DollarSign, ExternalLink, TrendingUp, Receipt, Shield, Info } from 'lucide-react';

const DashboardDonations = () => {
  const handleOpenZeffy = (e) => {
    e.preventDefault();
    window.open('https://www.zeffy.com/en-US/login', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600 mt-1">Manage donations through Zeffy platform</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <div className="bg-primary-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <DollarSign className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Donation Management</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Access the Zeffy dashboard to view all donations, track fundraising progress, 
                manage donor information, and generate reports. Zeffy provides comprehensive 
                tools for managing the organization's donation campaigns.
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-primary-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Track Donations</h3>
                <p className="text-sm text-gray-600">View real-time donation data and fundraising progress</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-secondary-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Receipt className="h-6 w-6 text-secondary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Generate Reports</h3>
                <p className="text-sm text-gray-600">Export donation data and create detailed financial reports</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="bg-green-100 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Secure Platform</h3>
                <p className="text-sm text-gray-600">PCI-compliant payment processing through Zeffy</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center border-t border-gray-200 pt-8">
              <p className="text-gray-600 mb-6">
                Click the button below to open the Zeffy login page in a new browser tab. 
                The admin dashboard will remain open in this tab.
              </p>
              <button
                onClick={handleOpenZeffy}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
              >
                <ExternalLink className="h-6 w-6" />
                <span>Open Zeffy Login Page</span>
              </button>
              <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                <Info className="h-4 w-4 mr-2" />
                <span>The Zeffy login page will open in a new tab</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDonations;
