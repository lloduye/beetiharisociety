import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, DollarSign, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  stripeDonationUrl,
  stripeMembershipUrl,
  stripePublishableKey,
} from '../config/stripe';

const PRESET_AMOUNTS = [
  { label: '$25', value: 2500 },
  { label: '$50', value: 5000 },
  { label: '$100', value: 10000 },
  { label: '$250', value: 25000 },
  { label: '$500', value: 50000 },
];

const EMBEDDED_MOUNT_ID = 'stripe-embedded-checkout-mount';

/**
 * Modal that shows Stripe payment form *inside* the page using Embedded Checkout.
 * Requires REACT_APP_STRIPE_PUBLISHABLE_KEY. Falls back to "open in new tab" if not set.
 */
const StripePaymentModal = ({ isOpen, type, onClose }) => {
  const [step, setStep] = useState(type === 'donation' ? 'amount' : 'embed');
  const [donationAmount, setDonationAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const embedRef = useRef(null);

  const amountCents =
    type === 'donation'
      ? donationAmount !== null
        ? donationAmount
        : (parseInt(String(customAmount).replace(/[^0-9]/g, ''), 10) || 0)
      : 0;
  const canContinueDonation = amountCents >= 100;

  const getReturnUrl = useCallback(() => {
    const origin = window.location.origin;
    const path = window.location.pathname || '/';
    if (type === 'membership') return `${origin}/get-involved?membership=success`;
    return `${origin}${path}${path.endsWith('/') ? '' : '/'}?donate=success`;
  }, [type]);

  const createEmbeddedSession = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embedded: true,
          returnUrl: getReturnUrl(),
          ...(type === 'membership'
            ? { subscription: true }
            : { amount: amountCents }),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start checkout');
      if (!data.clientSecret) throw new Error('No client secret returned');
      return data.clientSecret;
    } finally {
      setLoading(false);
    }
  }, [type, amountCents, getReturnUrl]);

  const mountEmbeddedCheckout = async (clientSecret) => {
    if (!stripePublishableKey) return;
    const stripe = await loadStripe(stripePublishableKey);
    if (!stripe) return;
    const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
    const mountPoint = document.getElementById(EMBEDDED_MOUNT_ID);
    if (mountPoint) checkout.mount(mountPoint);
    embedRef.current = checkout;
  };

  useEffect(() => {
    if (!isOpen) return;
    setStep(type === 'donation' ? 'amount' : 'embed');
    setError('');
    setDonationAmount(null);
    setCustomAmount('');
  }, [isOpen, type]);

  // For membership only: create embedded session and mount when modal opens to embed step
  useEffect(() => {
    if (!isOpen || step !== 'embed' || type !== 'membership' || !stripePublishableKey) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const clientSecret = await createEmbeddedSession();
        if (cancelled) return;
        await mountEmbeddedCheckout(clientSecret);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (embedRef.current && typeof embedRef.current.destroy === 'function') {
        try {
          embedRef.current.destroy();
        } catch (_) {}
      }
    };
  }, [isOpen, step, type, createEmbeddedSession]);

  if (!isOpen) return null;

  const openInNewTab = () => {
    const url = type === 'membership' ? stripeMembershipUrl : stripeDonationUrl;
    if (url) window.open(url, '_blank');
    onClose();
  };

  // No publishable key: show simple "open in new tab" CTA
  if (!stripePublishableKey) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {type === 'membership' ? 'Become a Member' : 'Make a Donation'}
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Add <code className="bg-gray-100 px-1 rounded">REACT_APP_STRIPE_PUBLISHABLE_KEY</code> to use the form here. For now, open the payment page in a new tab.
          </p>
          <button type="button" onClick={openInNewTab} className="btn-primary w-full">
            Open payment page
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {type === 'membership' ? 'Become a Member' : 'Make a Donation'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {step === 'amount' && (
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-sm">Choose an amount (USD).</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_AMOUNTS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setDonationAmount(value);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-3 rounded-lg border-2 text-sm font-medium ${
                    donationAmount === value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Or custom amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setDonationAmount(null);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {amountCents > 0 && amountCents < 100 && (
                <p className="mt-1 text-sm text-amber-600">Minimum $1.</p>
              )}
            </div>
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  setLoading(true);
                  try {
                    const clientSecret = await createEmbeddedSession();
                    setStep('embed');
                    setTimeout(() => mountEmbeddedCheckout(clientSecret), 100);
                  } catch (err) {
                    setError(err.message || 'Something went wrong');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={!canContinueDonation || loading}
                className="flex-1 py-2.5 rounded-lg bg-primary-600 text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 'embed' && (
          <div className="flex-1 min-h-[400px] flex flex-col">
            {loading && (
              <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
              </div>
            )}
            {error && (
              <div className="mx-4 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            <div
              id={EMBEDDED_MOUNT_ID}
              className="flex-1 min-h-[400px]"
              style={{ display: loading ? 'none' : 'block' }}
            />
            <div className="shrink-0 px-4 py-2 border-t bg-gray-50 text-center">
              <button
                type="button"
                onClick={openInNewTab}
                className="text-sm text-primary-600 hover:underline"
              >
                Open payment page in new tab instead
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripePaymentModal;
