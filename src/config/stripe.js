/**
 * Stripe Payment Links – Donate and Membership go straight to these Stripe-hosted pages.
 * Override with REACT_APP_STRIPE_DONATION_URL / REACT_APP_STRIPE_MEMBERSHIP_URL if needed.
 */
const DEFAULT_DONATION_URL = 'https://donate.betiharisociety.org/b/7sY8wIf6S739e0j1qU7Vm02';
const DEFAULT_MEMBERSHIP_URL = 'https://donate.betiharisociety.org/b/6oU9AM4se739aO77Pi7Vm00';

export const stripeDonationUrl = process.env.REACT_APP_STRIPE_DONATION_URL || DEFAULT_DONATION_URL;
export const stripeMembershipUrl = process.env.REACT_APP_STRIPE_MEMBERSHIP_URL || DEFAULT_MEMBERSHIP_URL;
