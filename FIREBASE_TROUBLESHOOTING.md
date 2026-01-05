# Firebase Troubleshooting Guide

## Current Issue: Firebase Not Initializing

The errors show that Firebase environment variables are **not being read** in your Netlify deployment.

## Error Messages You're Seeing:
- `Firebase configuration is missing`
- `Expected first argument to collection() to be a CollectionReference`
- `Expected first argument to doc() to be a CollectionReference`

This means `db` is `null` because Firebase didn't initialize.

## Solution: Set Environment Variables in Netlify

### Step 1: Your Firebase Config Values

Here are your exact Firebase configuration values:

```
apiKey: AIzaSyALbeACu2PoaXcdEXB_6VQgSmUA5c-We_8
authDomain: betiharisociety-427f1.firebaseapp.com
projectId: betiharisociety-427f1
storageBucket: betiharisociety-427f1.firebasestorage.app
messagingSenderId: 18570375410
appId: 1:18570375410:web:e86b12bfa9197c7090206b
```

### Step 2: Add to Netlify Environment Variables

1. Go to **Netlify Dashboard** → Your Site
2. **Site settings** → **Environment variables**
3. Click **Add variable** for each (copy and paste these exact values):

| Variable Name | Value |
|--------------|-------|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyALbeACu2PoaXcdEXB_6VQgSmUA5c-We_8` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `betiharisociety-427f1.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `betiharisociety-427f1` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `betiharisociety-427f1.firebasestorage.app` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `18570375410` |
| `REACT_APP_FIREBASE_APP_ID` | `1:18570375410:web:e86b12bfa9197c7090206b` |

**Important:** 
- Variable names MUST start with `REACT_APP_` (this is required for React to read them)
- Copy the values exactly as shown above
- No spaces before or after the values

### Step 3: Trigger New Deploy

**IMPORTANT:** After adding variables, you MUST trigger a new deploy:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete

### Step 4: Verify It's Working

After deploy:
1. Open your website
2. Press **F12** → **Console** tab
3. Look for: `✅ Firebase initialized successfully`
4. If you see errors, check which variables are missing

## Quick Test

In browser console, run:
```javascript
// Check Firebase status
console.log('Firebase initialized:', typeof db !== 'undefined' && db !== null);
console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing');
```

## Common Issues

### Variables Not Showing in Build
- **Cause:** Variables added but deploy not triggered
- **Fix:** Trigger a new deploy after adding variables

### Variables Set But Still Not Working
- **Cause:** Typo in variable name (must be exact: `REACT_APP_FIREBASE_API_KEY`)
- **Fix:** Double-check spelling, especially `REACT_APP_` prefix

### Build Succeeds But Firebase Still Fails
- **Cause:** Variables might be set for wrong branch/environment
- **Fix:** Check if variables are set for "Production" or "All"

## After Fixing

Once Firebase initializes:
- ✅ Login will work
- ✅ Stories will save to Firestore
- ✅ Interactions (likes, views, comments) will work
- ✅ Data will sync across all devices
- ✅ Firebase Analytics will show activity

