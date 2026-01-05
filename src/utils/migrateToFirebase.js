// Migration utility to move data from localStorage to Firebase
// Auto-runs when Firebase is ready

import { usersService } from '../services/usersService';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';
import { storiesData } from '../data/storiesData';
import { firebaseInitialized } from '../config/firebase';

export const migrateToFirebase = async () => {
  console.log('🔄 Starting automatic migration to Firebase...');
  
  try {
    // 1. Migrate users (only if they don't exist)
    const usersKey = 'dashboard_users';
    const localUsers = localStorage.getItem(usersKey);
    if (localUsers) {
      const users = JSON.parse(localUsers);
      console.log(`📦 Found ${users.length} users in localStorage. Migrating...`);
      for (const user of users) {
        try {
          // Check if user already exists
          const existing = await usersService.getByEmail(user.email);
          if (!existing) {
            await usersService.createUser(user);
            console.log(`✅ Migrated user: ${user.email}`);
          } else {
            console.log(`⏭️  User already exists: ${user.email}`);
          }
        } catch (error) {
          console.error(`❌ Error migrating user ${user.email}:`, error);
        }
      }
    }

    // 2. Migrate stories - ALWAYS check Firestore first
    try {
      const existingStories = await storiesService.getAll();
      if (existingStories && existingStories.length > 0) {
        console.log(`✅ Found ${existingStories.length} stories already in Firestore. Skipping story migration.`);
      } else {
        // No stories in Firestore - migrate from storiesData.js
        console.log(`📚 No stories in Firestore. Migrating ${storiesData.length} initial stories...`);
        await storiesService.saveStories(storiesData);
        console.log(`✅ Successfully migrated ${storiesData.length} stories to Firestore!`);
      }
    } catch (error) {
      // If getAll fails, try to migrate anyway
      console.log(`⚠️  Could not check existing stories. Attempting migration...`);
      try {
        await storiesService.saveStories(storiesData);
        console.log(`✅ Successfully migrated ${storiesData.length} stories to Firestore!`);
      } catch (migrateError) {
        console.error('❌ Error migrating stories:', migrateError);
      }
    }

    // 3. Migrate interactions (if any in localStorage)
    const interactionsKey = 'story_interactions';
    const localInteractions = localStorage.getItem(interactionsKey);
    if (localInteractions) {
      try {
        const interactions = JSON.parse(localInteractions);
        console.log(`📊 Migrating interactions for ${Object.keys(interactions).length} stories...`);
        await interactionsService.saveAll(interactions);
        console.log('✅ Interactions migrated successfully');
      } catch (error) {
        console.error('❌ Error migrating interactions:', error);
      }
    }

    console.log('✅ Migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Auto-run migration when Firebase is ready
let migrationAttempted = false;
let migrationInProgress = false;

export const autoMigrate = async () => {
  // Only run once
  if (migrationAttempted || migrationInProgress) {
    return;
  }
  
  // Check if Firebase is initialized
  if (!firebaseInitialized) {
    console.log('⏳ Waiting for Firebase to initialize...');
    // Retry after a short delay
    setTimeout(() => {
      autoMigrate();
    }, 2000);
    return;
  }
  
  migrationInProgress = true;
  console.log('🚀 Firebase ready. Starting automatic migration...');
  
  try {
    // Run migration
    await migrateToFirebase();
    migrationAttempted = true;
  } catch (error) {
    console.error('❌ Auto-migration failed:', error);
  } finally {
    migrationInProgress = false;
  }
};

// Function to check if migration is needed
export const needsMigration = () => {
  const hasLocalUsers = !!localStorage.getItem('dashboard_users');
  const hasLocalStories = !!localStorage.getItem('stories_data');
  const hasLocalInteractions = !!localStorage.getItem('story_interactions');
  
  return hasLocalUsers || hasLocalStories || hasLocalInteractions;
};

// Auto-run migration when module loads (if Firebase is ready)
if (typeof window !== 'undefined') {
  // Make function available in console for manual migration
  window.migrateToFirebase = migrateToFirebase;
  window.autoMigrate = autoMigrate;
  
  // Auto-run migration after a short delay to ensure Firebase is initialized
  setTimeout(() => {
    autoMigrate();
  }, 3000);
  
  console.log('💡 Automatic migration will run when Firebase is ready');
  console.log('💡 To manually migrate, run: migrateToFirebase() in browser console');
}

