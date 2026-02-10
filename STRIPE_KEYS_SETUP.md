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

---

## "API key provided is invalid" – what to check

Stripe returns this when the wrong key type is used or the value is malformed.

| Symptom | Fix |
|--------|-----|
| **Keys swapped** | **STRIPE_SECRET_KEY** must be the **secret** key (starts with `sk_test_` or `sk_live_`). **REACT_APP_STRIPE_PUBLISHABLE_KEY** must be the **publishable** key (starts with `pk_test_` or `pk_live_`). In [Stripe Dashboard → API keys](https://dashboard.stripe.com/apikeys), use "Publishable key" for the former and "Secret key" (Reveal) for the latter. |
| **Spaces or quotes** | In Netlify, paste the key with **no spaces** before/after and **no quotes** around the value. Edit the variable and re-paste the key. |
| **Wrong key or rolled** | If you rolled keys in Stripe, the old secret is invalid. Copy the **current** secret key from the Dashboard and update **STRIPE_SECRET_KEY** in Netlify. |
| **Test vs Live** | Use **test** keys (`pk_test_`, `sk_test_`) for testing; use **live** keys (`pk_live_`, `sk_live_`) for real charges. Don’t mix (e.g. test publishable with live secret). |

After changing variables in Netlify, go to **Deploys** → **Trigger deploy** so the new values are used.

---

## Check that Netlify has the secret key (diagnostic)

After deploying, open this URL in your browser (replace with your real site URL):

**`https://YOUR-NETLIFY-SITE.netlify.app/.netlify/functions/create-checkout-session`**

You should see JSON like:

```json
{
  "ok": true,
  "message": "Stripe function is reachable",
  "secretKeySet": true,
  "secretKeyStartsWith": "sk_test"
}
```

- If **secretKeySet** is `false` → Netlify doesn’t see `STRIPE_SECRET_KEY`. Add it in Environment variables and redeploy.
- If **secretKeyStartsWith** is `"pk_test"` or `"pk_live"` → You set the publishable key as the secret. Use the **secret** key (starts with `sk_`) for `STRIPE_SECRET_KEY`.
- If you get a 404 → The function didn’t deploy. Check that the repo has a `netlify/functions/create-checkout-session.js` file and that the deploy completed.

**Where “invalid API key” can come from**

- **When you click Continue / Pay** (after choosing amount or opening membership): the **secret** key (`STRIPE_SECRET_KEY`) is wrong or not set. Fix in Netlify and redeploy, then use the diagnostic URL above.
- **When the Stripe form loads in the popup** (card field appears then errors): the **publishable** key (`REACT_APP_STRIPE_PUBLISHABLE_KEY`) might be wrong. It’s baked in at build time, so set it in Netlify, then trigger a **new deploy** so the build runs again with the correct key.
