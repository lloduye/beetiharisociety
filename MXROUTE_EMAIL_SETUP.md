## MXroute Email Setup (for Dashboard Send Email)

This app can send email from your MXroute account using a Netlify serverless function.

You control the credentials; never paste real passwords into chat or commit them to Git.  
Add them only in **Netlify environment variables** (and local `.env` for testing with Netlify Dev).

---

### 1. MXroute details you need

From your MXroute panel / welcome email:

- **Server** – e.g. `redbull.mxrouting.net`
- **Username** – usually the full mailbox address you want to send from, such as `contact@yourdomain.org`
- **Password** – that mailbox password

You should already have this from logging into webmail (Roundcube).

---

### 2. Add environment variables in Netlify

In Netlify:

1. Open your site.
2. Go to **Site configuration → Environment variables**.
3. Add these variables:

- `MXROUTE_SERVER` – your MXroute server hostname (e.g. `redbull.mxrouting.net`)
- `MXROUTE_USERNAME` – mailbox username (e.g. `contact@yourdomain.org`)
- `MXROUTE_PASSWORD` – mailbox password  
  - Mark as **sensitive/secret** so Netlify hides it.
- `MXROUTE_FROM` – default From address (usually same as `MXROUTE_USERNAME`)

4. Save the variables.
5. Trigger a new deploy so Netlify functions can see them.

The Netlify function at `/.netlify/functions/send-email` uses these values to talk to the MXroute SMTP API.

---

### 3. Local development (`.env`)

For local testing with **Netlify Dev** (`npx netlify dev`), you can mirror the same variables in `.env`:

```env
MXROUTE_SERVER=redbull.mxrouting.net
MXROUTE_USERNAME=contact@yourdomain.org
MXROUTE_PASSWORD=your_password_here
MXROUTE_FROM=contact@yourdomain.org
```

`.env` is already in `.gitignore`, so Git will not commit these secrets.

---

### 4. Using it from the dashboard

On `/dashboard/emails` you now have:

- A **Send Email** form that calls the Netlify function.
- The existing button that opens **Roundcube webmail** for full inbox management.

If the function is not configured, the UI will show a clear error message so you know to set the MXroute env vars in Netlify.

