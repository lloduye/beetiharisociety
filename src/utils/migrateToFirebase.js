// Migration utility to move data from localStorage to Firebase
// MANUAL MIGRATION ONLY - Run migrateToFirebase() in browser console when needed
// Automatic migration removed for faster page load

import { usersService } from '../services/usersService';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';
import { storiesData } from '../data/storiesData';

export const migrateToFirebase = async () => {
  console.log('🔄 Starting automatic migration to Firebase...');
  console.log('📋 This will migrate: users, stories, and interactions');
  
  try {
    // 1. Migrate users - Always ensure users exist
    console.log('👤 Checking users in Firestore...');
    try {
      // First, check if any users exist in Firestore
      const existingUsers = await usersService.getAll();
      console.log(`📊 Found ${existingUsers.length} users in Firestore`);
      
      // Migrate users from localStorage if they exist
      const usersKey = 'dashboard_users';
      const localUsers = localStorage.getItem(usersKey);
      if (localUsers) {
        try {
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
        } catch (error) {
          console.error('❌ Error parsing users from localStorage:', error);
        }
      }
      
      // Always ensure default admin user exists (won't duplicate if already exists)
      console.log('👤 Ensuring default admin user exists...');
      await usersService.initializeDefaultUser();
      console.log('✅ Default user check completed');
      
      // Final count
      const finalUsers = await usersService.getAll();
      console.log(`✅ Total users in Firestore: ${finalUsers.length}`);
    } catch (error) {
      console.error('❌ Error during user migration:', error);
      // Still try to create default user
      try {
        console.log('👤 Attempting to create default user as fallback...');
        await usersService.initializeDefaultUser();
      } catch (defaultUserError) {
        console.error('❌ Error creating default user:', defaultUserError);
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

// Manual migration only - no automatic migration
// To run migration manually, open browser console and run: migrateToFirebase()

if (typeof window !== 'undefined') {
  // Make function available in console for manual migration only
  window.migrateToFirebase = migrateToFirebase;
  console.log('💡 To manually migrate data, run: migrateToFirebase() in browser console');
  console.log('💡 Automatic migration is disabled for faster page load');
}

