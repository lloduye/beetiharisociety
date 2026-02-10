# Where to Put Your Stripe Keys (you add them yourself)

**Never paste your Stripe keys in chat or in code.** You add them only in Netlify (and in `.env` for local dev). This guide shows the process.

---

## Step 1: Get your keys from Stripe

1. Go to [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys).
2. You’ll see:
   - **Publishable key** – starts with `pk_test_` or `pk_live_`. (Safe to use in the browser.)
   - **Secret key** – click “Reveal” to see it; starts with `sk_test_` or `sk_live_`. (Must stay private, server-only.)
3. Keep that tab open (or copy the values somewhere private) so you can paste them into Netlify in the next step.

---

## Step 2: Add the keys in Netlify

1. Open [Netlify](https://app.netlify.com) and sign in.
2. Open your **site** (e.g. beti-hari society).
3. Go to **Site configuration** (or **Site settings**) → **Environment variables**.
4. Click **Add a variable** or **Add environment variable** (or **Edit variables**).
5. Add **two** variables:

   **Variable 1 – Publishable key (for the embedded form in the popup)**  
   - **Key:** `REACT_APP_STRIPE_PUBLISHABLE_KEY`  
   - **Value:** your publishable key from Stripe (e.g. `pk_test_...` or `pk_live_...`)  
   - **Scopes:** leave default (e.g. “All” or “Production”)  
   - **Sensitive:** optional (Netlify can hide it in the UI; it’s still safe in the browser.)

   **Variable 2 – Secret key (for the server that creates checkout)**  
   - **Key:** `STRIPE_SECRET_KEY`  
   - **Value:** your secret key from Stripe (e.g. `sk_test_...` or `sk_live_...`)  
   - **Scopes:** same as above  
   - **Sensitive:** turn **on** so Netlify hides the value in the UI.

6. Save / add the variables.

---

## Step 3: Redeploy so Netlify uses them

1. In Netlify, go to the **Deploys** tab.
2. Click **Trigger deploy** → **Deploy site** (or **Clear cache and deploy site**).
3. Wait for the deploy to finish.
4. Open your site and click **Donate** or **Become a member** – the Stripe form should load inside the popup.

---

## Optional: Local development (`.env`)

To test the embedded form on your machine with `npm start`:

1. In the project root (same folder as `package.json`), create or edit a file named **`.env`**.
2. Add these two lines (replace the placeholders with your real keys from Stripe):

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_value_here
STRIPE_SECRET_KEY=sk_test_your_value_here
```

3. **Do not** commit `.env` to Git (it’s already in `.gitignore`).
4. Restart the dev server: stop `npm start` (Ctrl+C), then run `npm start` again.

For local testing, the Netlify function runs only if you use **Netlify Dev** (`npx netlify dev`). With plain `npm start`, the function isn’t available, so the embedded form will only work after you deploy to Netlify.

---

## Summary

| Key                         | Where you put it        | Who sees it              |
|----------------------------|-------------------------|---------------------------|
| Publishable (`pk_...`)     | Netlify + optional `.env` | Browser (your site only) |
| Secret (`sk_...`)          | Netlify + optional `.env` | Server only (Netlify)     |

You do **not** need to give the keys to anyone; you add them only in Netlify (and in your local `.env` if you want).
