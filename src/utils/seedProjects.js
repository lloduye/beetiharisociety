/**
 * Seed Firestore with projects from static data.
 * Run in browser console: import('./utils/seedProjects').then(m => m.seedProjects())
 * Or add a temporary button in the admin dashboard.
 */
import { projectsService } from '../services/projectsService';
import { projects } from '../data/projects';

export async function seedProjects() {
  console.log('Seeding projects to Firestore...');
  try {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const payload = {
        title: p.title,
        shortDescription: p.shortDescription,
        story: p.story,
        targetFunds: p.targetFunds,
        raisedFunds: p.raisedFunds,
        slug: p.slug || p.id,
        order: i,
        images: p.images || [],
      };
      await projectsService.create(payload);
      console.log('Created:', p.title);
    }
    console.log('Done seeding projects.');
    return { success: true };
  } catch (err) {
    console.error('Seed failed:', err);
    throw err;
  }
}
