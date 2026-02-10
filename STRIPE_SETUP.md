# Stripe Payment Links – Setup

Payments are handled entirely on **Stripe’s hosted pages**. Your site only redirects users to your Stripe Payment Links. No custom payment form; thank-you and receipts are handled by Stripe.

## 1. Create products in Stripe (you already did)

- **Donations** – one product for general donations (one-time or your chosen options).
- **Memberships** – one product for membership (e.g. $120/month).

## 2. Create Payment Links

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Product catalog** (or **Payment links**).
2. For the **donation** product: open it → **Create payment link** (or use an existing link). Copy the URL (e.g. `https://buy.stripe.com/xxxxx`).
3. For the **membership** product: same steps and copy that URL.

## 3. Add links to the project

**Option A – Netlify**

1. Netlify → your site → **Site settings** → **Environment variables**.
2. Add:
   - **Key:** `REACT_APP_STRIPE_DONATION_URL`  
     **Value:** your donation Payment Link URL
   - **Key:** `REACT_APP_STRIPE_MEMBERSHIP_URL`  
     **Value:** your membership Payment Link URL
3. **Trigger deploy** so the new variables are used.

**Option B – Local (.env)**

1. In the project root, create a file named `.env` (if it doesn’t exist).
2. Add (replace with your real links):

```env
REACT_APP_STRIPE_DONATION_URL=https://buy.stripe.com/your_donation_link_id
REACT_APP_STRIPE_MEMBERSHIP_URL=https://buy.stripe.com/your_membership_link_id
```

3. Restart the dev server (`npm start`).

## 4. What happens when links are set

- **Donate** (navbar, footer, homepage, Get Involved, etc.) → redirects to `REACT_APP_STRIPE_DONATION_URL`.
- **Join Our Community** (Get Involved) → redirects to `REACT_APP_STRIPE_MEMBERSHIP_URL`.

If a link is not set, the app falls back to opening a mailto to `donate@betiharisociety.org`.

## 5. Success / cancel URLs (optional)

When creating or editing a Payment Link in Stripe, you can set:

- **After payment** – e.g. `https://yoursite.com/?donate=success` or `https://yoursite.com/get-involved?membership=success`.
- **If customer cancels** – e.g. `https://yoursite.com` or the page they came from.

The site already shows a short thank-you message when it detects `?donate=success` or `?membership=success` in the URL.

## API key

You do **not** need to put your Stripe secret key in the frontend. Payment Links are public URLs. Keep your API key only in Stripe Dashboard (or in server-side env if you add backend logic later).
