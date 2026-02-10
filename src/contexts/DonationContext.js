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

/** Redirect to Stripe-hosted payment pages. No popups, no API keys in the app. */
const openDonation = () => {
  if (stripeDonationUrl) {
    window.location.href = stripeDonationUrl;
  } else {
    window.open('mailto:donate@betiharisociety.org?subject=Donation%20inquiry', '_blank');
  }
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
    openMembership,
  };
  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};
