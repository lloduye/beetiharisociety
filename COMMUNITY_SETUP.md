# Community Membership & Dashboard Setup

## Overview

The Beti-Hari Society website now includes:

1. **Public signup form** – `/join` – sharable link for self-service community membership
2. **Community dashboard** – `/dashboard/community` – Stripe-integrated view of members, payments, and subscriptions

## Shareable Link

**URL:** `https://yoursite.com/join`

Share this link for people to sign up. The form collects:
- First and last name
- Country
- Full address (line 1, line 2, city, state, postal code)
- Email
- Phone number
- Consent checkbox: "I agree and authorize Beti-Hari Society to use this information for community membership and for future communications and donations"

On submit:
- A **Stripe Customer** is created (for future donations/subscriptions)
- The record is stored in **Firestore** (`communityMembers` collection)

## Requirements

- **Stripe:** `STRIPE_SECRET_KEY` must be set in Netlify environment variables
- **Firebase/Firestore:** Must be configured. Add `communityMembers` to Firestore rules (see FIRESTORE_RULES.md)

## Community Dashboard (Admin)

When logged in, navigate to **Community** (before Mailbox in the nav). Available to:
- Board of Directors
- Finance
- Administration

Features:
- List all Stripe customers (community members)
- Search by email
- View details: payments (charges), subscriptions
- Link to Stripe Dashboard
- Live data – click **Refresh** to fetch latest from Stripe

## Firestore

Add `communityMembers` to your Firestore rules:

```javascript
match /communityMembers/{memberId} {
  allow read, write: if true;  // Adjust for production
}
```

## Netlify Functions

- `register-community-member` – Creates Stripe customer from signup form data
- `stripe-customers` – Lists Stripe customers; with `?customer=cus_xxx` returns single customer with charges and subscriptions
