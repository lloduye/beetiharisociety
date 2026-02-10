/**
 * Stripe: Payment Links (for fallback open-in-tab) and Publishable Key (for embedded checkout).
 * Set REACT_APP_STRIPE_PUBLISHABLE_KEY (pk_live_... or pk_test_...) for embedded form in the modal.
 */
const DEFAULT_DONATION_URL = 'https://donate.betiharisociety.org/b/7sY8wIf6S739e0j1qU7Vm02';
const DEFAULT_MEMBERSHIP_URL = 'https://donate.betiharisociety.org/b/6oU9AM4se739aO77Pi7Vm00';

export const stripeDonationUrl = process.env.REACT_APP_STRIPE_DONATION_URL || DEFAULT_DONATION_URL;
export const stripeMembershipUrl = process.env.REACT_APP_STRIPE_MEMBERSHIP_URL || DEFAULT_MEMBERSHIP_URL;
export const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

export const hasDonationLink = Boolean(stripeDonationUrl);
export const hasMembershipLink = Boolean(stripeMembershipUrl);
export const hasEmbeddedCheckout = Boolean(stripePublishableKey);
