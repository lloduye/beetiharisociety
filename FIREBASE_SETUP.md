# Firebase Setup Guide

This guide will help you set up Firebase for your Beti-Hari Society website.

## Prerequisites

- A Firebase account (Spark Plan is free)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name: `betiharisociety` (or your preferred name)
   - Enable Google Analytics (optional)
   - Create project

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Enable**

### Important: Set up Security Rules

After creating the database, go to **Rules** tab and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - allow read/write
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Stories collection - public read, write allowed
    match /stories/{storyId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Interactions collection - public read/write
    match /interactions/{interactionId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Default: deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Note:** These rules allow public access for development. For production, you should:
1. Set up Firebase Authentication
2. Update rules to require authentication
3. Add role-based access control

See `FIRESTORE_RULES.md` for detailed instructions and production-ready rules.

## Step 3: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Beti-Hari Website")
5. Copy the Firebase configuration object

## Step 4: Set Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`)
2. Add your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

3. **For Netlify deployment:**
   - Go to your Netlify site dashboard
   - Navigate to **Site settings** → **Environment variables**
   - Add all the environment variables from your `.env` file

## Step 5: Initialize Default Data

The app will automatically create a default admin user on first load:
- **Email:** `admin@betiharisociety.org`
- **Team:** `Board of Directors`
- **Password:** `betihari2024`

**Important:** Change this password after first login!

## Step 6: Migrate Existing Data (Optional)

If you have existing data in localStorage, you can migrate it:

1. Open browser console on your website
2. Run:
```javascript
import { migrateToFirebase } from './src/utils/migrateToFirebase';
migrateToFirebase();
```

Or create a temporary migration page that calls this function.

## Step 7: Test the Setup

1. Start your development server: `npm start`
2. Navigate to `/dashboard/login`
3. Login with default credentials
4. Check that you can:
   - View users
   - Create/edit stories
   - See interactions

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### "Missing or insufficient permissions"
- Check Firestore security rules
- Ensure you're authenticated

### Data not syncing
- Check browser console for errors
- Verify environment variables are set correctly
- Check Firebase Console → Firestore for data

## Collections Structure

Your Firestore will have these collections:

- **users** - Staff user accounts
- **stories** - Story content
- **interactions** - Likes, comments, views, shares per story

## Real-time Updates

The app uses Firestore's real-time listeners, so:
- Changes made by one user appear instantly for others
- No page refresh needed
- Works across all devices

## Support

For Firebase documentation:
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

