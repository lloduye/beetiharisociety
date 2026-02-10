import React, { createContext, useContext } from 'react';
import { stripeDonationUrl, stripeMembershipUrl } from '../config/stripe';

const DonationContext = createContext();

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};

/** Redirect to Stripe Payment Link (any amount). */
const openDonation = () => {
  if (stripeDonationUrl) {
    window.location.href = stripeDonationUrl;
  } else {
    window.open('mailto:donate@betiharisociety.org?subject=Donation%20inquiry', '_blank');
  }
};

/**
 * Redirect to Stripe Checkout with a specific amount prefilled (uses Netlify function).
 * amountCents: number, e.g. 1000000 for $10,000.
 */
const openDonationWithAmount = async (amountCents) => {
  if (!amountCents || amountCents < 100) {
    openDonation();
    return;
  }
  try {
    const origin = window.location.origin;
    const res = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountCents,
        successUrl: `${origin}/?donate=success`,
        cancelUrl: origin + (window.location.pathname || '/'),
      }),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
      return;
    }
  } catch (_) {}
  openDonation();
};

const openMembership = () => {
  if (stripeMembershipUrl) {
    window.location.href = stripeMembershipUrl;
  } else {
    window.open('mailto:donate@betiharisociety.org?subject=Membership%20inquiry', '_blank');
  }
};

export const DonationProvider = ({ children }) => {
  const value = {
    openModal: openDonation,
    openDonation,
    openDonationWithAmount,
    openMembership,
  };
  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};
