import React, { createContext, useContext, useState } from 'react';
import { stripeDonationUrl, stripeMembershipUrl } from '../config/stripe';
import StripePaymentModal from '../components/StripePaymentModal';

const DonationContext = createContext();

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};

export const DonationProvider = ({ children }) => {
  const [modal, setModal] = useState({ open: false, type: 'donation' });

  const openDonation = () => {
    if (stripeDonationUrl) {
      setModal({ open: true, type: 'donation' });
    } else {
      window.open('mailto:donate@betiharisociety.org?subject=Donation%20inquiry', '_blank');
    }
  };

  const openMembership = () => {
    if (stripeMembershipUrl) {
      setModal({ open: true, type: 'membership' });
    } else {
      window.open('mailto:donate@betiharisociety.org?subject=Membership%20inquiry', '_blank');
    }
  };

  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  const value = {
    openModal: openDonation,
    openDonation,
    openMembership,
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
      <StripePaymentModal
        isOpen={modal.open}
        type={modal.type}
        onClose={closeModal}
      />
    </DonationContext.Provider>
  );
};
