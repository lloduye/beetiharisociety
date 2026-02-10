import React, { useState } from 'react';
import { Mail, ExternalLink, Inbox, Send, Shield, Info } from 'lucide-react';

const DashboardEmails = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenEmail = (e) => {
    e.preventDefault();
    window.open('https://redbull.mxrouting.net/roundcube/', '_blank', 'noopener,noreferrer');
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!to.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in To, Subject, and Message before sending.');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: to.trim(),
          subject: subject.trim(),
          body: message.trim(),
          replyTo: replyTo.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        setError(data.error || data.message || 'Failed to send email. Please try again.');
        return;
      }

      setSuccess(data.message || 'Email sent successfully.');
      setTo('');
      setSubject('');
      setMessage('');
      setReplyTo('');
    } catch (err) {
      setError(err.message || 'Network error while sending email. Please try again.');
    } finally {
      setIsSending(false);
    }
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
                Send email directly from this dashboard using your MXroute account, and open the full
                Roundcube webmail interface when you need full mailbox management.
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

            {/* Quick Send Email Form */}
            <div className="border-t border-gray-200 pt-8 mb-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Send Email</h3>
              <p className="text-gray-600 mb-6">
                Use this form to send an email from the organization mailbox configured in Netlify
                (MXroute). For full inbox, folders, and advanced features, use the Roundcube link
                below.
              </p>

              {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="recipient@example.com"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reply-To (optional)
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="you@yourdomain.org"
                      value={replyTo}
                      onChange={(e) => setReplyTo(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    rows={6}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Emails are sent through your MXroute account configured on the server.
                  </p>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="btn-primary inline-flex items-center space-x-2 px-6 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSending ? 'Sending...' : 'Send Email'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Roundcube Webmail Link */}
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
