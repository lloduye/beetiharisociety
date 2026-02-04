// Migration script to import initial stories into Firestore
// Run this once to populate your Firestore database with initial stories

import { storiesData } from '../data/storiesData';
import { storiesService } from '../services/storiesService';

/**
 * Migrate stories from storiesData.js to Firestore
 * Call this function once to populate your database
 */
export const migrateStoriesToFirebase = async () => {
  try {
    console.log('Starting stories migration to Firebase...');
    console.log(`Found ${storiesData.length} stories to migrate`);

    // Convert stories to Firestore format
    const storiesToMigrate = storiesData.map(story => ({
      ...story,
      // Ensure dates are in proper format
      date: story.date || new Date().toISOString().split('T')[0],
      // Ensure numeric fields are numbers
      views: story.views || 0,
      shares: story.shares || 0,
      comments: story.comments || 0,
      likes: story.likes || 0,
      // Ensure boolean fields
      featured: story.featured || false,
      published: story.published !== undefined ? story.published : true
    }));

    // Save all stories to Firestore
    await storiesService.saveStories(storiesToMigrate);
    
    console.log('✅ Successfully migrated all stories to Firebase!');
    console.log(`Migrated ${storiesToMigrate.length} stories`);
    
    return { success: true, count: storiesToMigrate.length };
  } catch (error) {
    console.error('❌ Error migrating stories:', error);
    throw error;
  }
};

// Auto-run migration if called directly (for testing)
if (typeof window !== 'undefined') {
  // Make it available in browser console for manual migration
  window.migrateStoriesToFirebase = migrateStoriesToFirebase;
  console.log('💡 To migrate stories, run: migrateStoriesToFirebase() in browser console');
}


