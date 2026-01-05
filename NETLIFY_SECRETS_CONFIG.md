# Netlify Secrets Scanning Configuration

## Problem
Netlify's secrets scanner is detecting Firebase configuration values in the build output. These are **public client-side config values** (not secrets), but Netlify flags them by default.

## Solution: Configure Netlify to Ignore Firebase Config Keys

Since Firebase API keys are meant to be public in client-side applications (they're protected by Firebase security rules), we need to tell Netlify to ignore these specific keys.

### ✅ Solution: netlify.toml (Already Configured)

The `netlify.toml` file has been created with the correct configuration. This tells Netlify to ignore Firebase config keys during secrets scanning.

**No additional steps needed** - just commit and push the `netlify.toml` file, and Netlify will automatically use it.

### Alternative: Manual Configuration in Netlify UI

If you prefer to set it manually in the Netlify UI instead:

1. Go to **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Click **Add variable**
4. **Key:** `SECRETS_SCAN_OMIT_KEYS`
5. **Value:** 
   ```
   REACT_APP_FIREBASE_API_KEY,REACT_APP_FIREBASE_AUTH_DOMAIN,REACT_APP_FIREBASE_PROJECT_ID,REACT_APP_FIREBASE_STORAGE_BUCKET,REACT_APP_FIREBASE_MESSAGING_SENDER_ID,REACT_APP_FIREBASE_APP_ID
   ```
6. Click **Save**

### Step 2: Trigger New Deploy

After the `netlify.toml` file is committed and pushed:
1. Netlify will automatically detect the new configuration
2. The build should now succeed

## Why This Is Safe

Firebase API keys are **public by design** for client-side applications. They are:
- Meant to be included in client-side JavaScript
- Protected by Firebase Security Rules (not by hiding the key)
- Safe to expose in build output

The real security comes from:
- Firebase Security Rules (Firestore rules)
- Firebase Authentication
- Domain restrictions (if configured in Firebase Console)

## Alternative: Remove Documentation Files

If you prefer not to configure Netlify, you can:
1. Delete `NETLIFY_ENV_VARS.md` and `FIREBASE_TROUBLESHOOTING.md` from the repository
2. Or add them to `.gitignore`

However, configuring `SECRETS_SCAN_OMIT_KEYS` is the recommended approach since these values will appear in the build output anyway (which is normal and expected for React apps).

