# Firestore Connection Timeout Fix

## Error Message
```
Could not reach Cloud Firestore backend. Backend didn't respond within 10 seconds.
This typically indicates that your device does not have a healthy Internet connection.
```

## Possible Causes

### 1. Firestore Not Enabled
Firestore database might not be enabled in your Firebase project.

**Fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **betiharisociety-427f1**
3. Go to **Build** → **Firestore Database**
4. If you see "Create database", click it and create the database
5. Choose **Start in test mode** (or use production mode with proper rules)

### 2. Firestore Security Rules Too Restrictive
Security rules might be blocking all access.

**Fix:**
1. Go to Firebase Console → Firestore Database → **Rules** tab
2. Use these rules (for development):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click **Publish**

### 3. Network/Firewall Issues
Your network or firewall might be blocking Firestore connections.

**Fix:**
- Check your internet connection
- Try from a different network
- Check if corporate firewall is blocking Firebase domains

### 4. Firebase Project Region
Firestore might be in a region that's slow to connect to.

**Check:**
1. Firebase Console → Project Settings → General
2. Check the **Default GCP resource location**
3. Consider creating Firestore in a region closer to your users

## Quick Test

1. **Check Firestore is enabled:**
   - Firebase Console → Firestore Database
   - You should see the database interface (not "Create database")

2. **Test connection:**
   - Open browser console
   - Run: `db` (should show Firestore instance, not null)

3. **Check security rules:**
   - Firebase Console → Firestore Database → Rules
   - Rules should allow read/write (at least for testing)

## Expected Behavior

After fixing:
- Firebase should connect within 1-2 seconds
- No timeout errors in console
- Data should load from Firestore
- App should work normally

## If Still Not Working

1. **Clear browser cache** and reload
2. **Check Firebase Console** for any service outages
3. **Verify environment variables** are set correctly in Netlify
4. **Check browser console** for other errors

The app will work in offline mode, but data won't sync until connection is established.

