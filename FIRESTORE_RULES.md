# Firestore Security Rules Setup

## Current Issue
Firebase is initialized but Firestore is blocking access with "Missing or insufficient permissions" errors.

## Solution: Update Firestore Security Rules

### Step 1: Go to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **betiharisociety-427f1**
3. Go to **Build** → **Firestore Database**
4. Click on the **Rules** tab

### Step 2: Update Security Rules

Replace the existing rules with these rules that allow your app to function:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - allow read/write for now
    // TODO: Add authentication later for better security
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Stories collection - public read for published stories, write for admins
    match /stories/{storyId} {
      allow read: if true; // Anyone can read stories
      allow write: if true; // TODO: Restrict to authenticated admins later
    }
    
    // Interactions collection - public read/write
    match /interactions/{interactionId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Community members - public create (signup form), read for dashboard
    match /communityMembers/{memberId} {
      allow read, write: if true;
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Publish Rules

1. Click **Publish** button
2. Wait for confirmation that rules are published

### Step 4: Test

After publishing:
1. Refresh your website
2. Check browser console - errors should be gone
3. Try logging in - it should work now

## Security Notes

⚠️ **Important:** These rules allow public read/write access. This is fine for development, but for production you should:

1. **Set up Firebase Authentication** - Use email/password or other auth methods
2. **Update rules to require authentication:**
   ```javascript
   match /users/{userId} {
     allow read: if request.auth != null;
     allow write: if request.auth != null && request.auth.uid == userId;
   }
   ```

3. **Add role-based access** - Check user roles in security rules

For now, the open rules will allow your app to function while you set up proper authentication.

## Quick Copy-Paste Rules

If you want the simplest rules that will work immediately:

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

**Warning:** This allows anyone to read/write everything. Use only for development/testing.


