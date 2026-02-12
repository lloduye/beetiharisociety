# Community Membership & Dashboard Setup

## Overview

The Beti-Hari Society website includes:

1. **Public signup form** – `/join` – sharable link for self-service community membership
2. **Community dashboard** – `/dashboard/community` – full management of members (after Donations, before Mailbox)
3. **Update info form** – `/community/update-info` – members can update their own information

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
- **Email (newsletter):** `MXROUTE_SERVER`, `MXROUTE_USERNAME`, `MXROUTE_PASSWORD`, `MXROUTE_FROM` for sending newsletters and info-update requests

## Community Dashboard (Admin)

Navigate to **Community** (after Donations, before Mailbox). Available to Board of Directors, Finance, and Administration.

### Features

- **Add Member** – Manually add a community member (creates Stripe customer + Firestore record)
- **Edit Member** – Click "View" on any member to open details; edit name, email, phone, address; save updates both Stripe and Firestore
- **Send Newsletter** – Select members (or use all) and send an email to multiple recipients
- **Request Payment** – Create a Stripe invoice for a member (amount + description), send to their email
- **Request Info Update** – Send an email to selected members with a link to update their information; or copy the update link to share manually
- **View payments & subscriptions** – In member details, see recent charges and active subscriptions

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
- `update-stripe-customer` – Updates a Stripe customer (name, email, phone, address)
- `request-payment` – Creates and sends a Stripe invoice to a customer
- `send-newsletter` – Sends email to multiple recipients (uses MXroute)
