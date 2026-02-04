# How to Migrate Stories to Firebase

## Problem
Stories are not showing because they haven't been imported into Firestore yet. The initial stories are in `storiesData.js` but need to be migrated to Firebase.

## Quick Solution: Run Migration from Browser Console

1. **Open your website** (after Firebase is configured)
2. **Open browser console** (F12 → Console tab)
3. **Run this command:**
   ```javascript
   migrateToFirebase()
   ```
4. **Wait for completion** - you should see messages like:
   - "Migrating X initial stories from storiesData.js..."
   - "Initial stories migrated successfully"
5. **Refresh the page** - stories should now appear!

## What This Does

The migration script will:
- Check if stories already exist in Firestore (won't duplicate)
- Import all stories from `storiesData.js` into Firestore
- Preserve all story data (title, content, images, etc.)
- Set up the stories collection properly

## Alternative: Manual Migration via Dashboard

If the console method doesn't work, you can manually add stories:

1. Go to **Firebase Console** → **Firestore Database**
2. Click **Start collection**
3. Collection ID: `stories`
4. Add documents manually (or use the import feature)

## Verify Migration

After migration:
1. Go to **Firebase Console** → **Firestore Database**
2. You should see a `stories` collection
3. It should contain multiple documents (one per story)
4. Refresh your website - stories should appear!

## Troubleshooting

### "Firebase is not initialized"
- Make sure Firebase environment variables are set in Netlify
- Check browser console for Firebase initialization message

### "Missing or insufficient permissions"
- Update Firestore security rules (see `FIRESTORE_RULES.md`)
- Make sure rules allow read/write access

### Stories still not showing
- Check browser console for errors
- Verify stories exist in Firestore
- Make sure stories have `published: true` in Firestore


