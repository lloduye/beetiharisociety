// Migration utility to move data from localStorage to Firebase
// Run this once after setting up Firebase to migrate existing data

import { usersService } from '../services/usersService';
import { storiesService } from '../services/storiesService';
import { interactionsService } from '../services/interactionsService';

export const migrateToFirebase = async () => {
  console.log('Starting migration to Firebase...');
  
  try {
    // 1. Migrate users
    const usersKey = 'dashboard_users';
    const localUsers = localStorage.getItem(usersKey);
    if (localUsers) {
      const users = JSON.parse(localUsers);
      console.log(`Migrating ${users.length} users...`);
      for (const user of users) {
        try {
          // Check if user already exists
          const existing = await usersService.getByEmail(user.email);
          if (!existing) {
            await usersService.createUser(user);
            console.log(`Migrated user: ${user.email}`);
          } else {
            console.log(`User already exists: ${user.email}`);
          }
        } catch (error) {
          console.error(`Error migrating user ${user.email}:`, error);
        }
      }
    }

    // 2. Migrate stories
    const storiesKey = 'stories_data';
    const localStories = localStorage.getItem(storiesKey);
    if (localStories) {
      const stories = JSON.parse(localStories);
      console.log(`Migrating ${stories.length} stories...`);
      await storiesService.saveStories(stories);
      console.log('Stories migrated successfully');
    }

    // 3. Migrate interactions
    const interactionsKey = 'story_interactions';
    const localInteractions = localStorage.getItem(interactionsKey);
    if (localInteractions) {
      const interactions = JSON.parse(localInteractions);
      console.log(`Migrating interactions for ${Object.keys(interactions).length} stories...`);
      await interactionsService.saveAll(interactions);
      console.log('Interactions migrated successfully');
    }

    console.log('Migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Function to check if migration is needed
export const needsMigration = () => {
  const hasLocalUsers = !!localStorage.getItem('dashboard_users');
  const hasLocalStories = !!localStorage.getItem('stories_data');
  const hasLocalInteractions = !!localStorage.getItem('story_interactions');
  
  return hasLocalUsers || hasLocalStories || hasLocalInteractions;
};

