# Netlify Environment Variables Setup

## Quick Copy-Paste Guide

Go to **Netlify Dashboard** → Your Site → **Site settings** → **Environment variables**

Then add these 6 variables one by one:

### Variable 1
**Key:** `REACT_APP_FIREBASE_API_KEY`  
**Value:** `AIzaSyALbeACu2PoaXcdEXB_6VQgSmUA5c-We_8`

### Variable 2
**Key:** `REACT_APP_FIREBASE_AUTH_DOMAIN`  
**Value:** `betiharisociety-427f1.firebaseapp.com`

### Variable 3
**Key:** `REACT_APP_FIREBASE_PROJECT_ID`  
**Value:** `betiharisociety-427f1`

### Variable 4
**Key:** `REACT_APP_FIREBASE_STORAGE_BUCKET`  
**Value:** `betiharisociety-427f1.firebasestorage.app`

### Variable 5
**Key:** `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`  
**Value:** `18570375410`

### Variable 6
**Key:** `REACT_APP_FIREBASE_APP_ID`  
**Value:** `1:18570375410:web:e86b12bfa9197c7090206b`

## After Adding Variables

1. **IMPORTANT:** Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for the build to complete
4. Check your website - the red error banner should disappear
5. Check browser console - you should see: `✅ Firebase initialized successfully`

## Verification

After deploy, open browser console (F12) and you should see:
- `✅ Firebase initialized successfully`
- `Firebase Project: betiharisociety-427f1`

If you still see errors, double-check:
- Variable names are EXACT (case-sensitive)
- All 6 variables are added
- You triggered a new deploy after adding them


