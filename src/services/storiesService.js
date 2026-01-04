// Stories service - reads from JSON file (instant) and saves to localStorage
const STORIES_CACHE_KEY = 'stories_data';
const STORIES_JSON_PATH = '/stories.json';

export const storiesService = {
  /**
   * Get all stories - prioritizes localStorage (admin changes) over JSON file
   * This ensures dashboard changes are reflected immediately
   */
  async getAll() {
    // First check localStorage (has admin changes)
    const cached = this.getCached();
    if (cached && cached.length > 0) {
      // If we have cached data, use it (it has the latest admin changes)
      return cached;
    }

    // If no cache, load from JSON file (initial load)
    try {
      const response = await fetch(STORIES_JSON_PATH);
      if (response.ok) {
        const stories = await response.json();
        // Cache in localStorage for offline access
        localStorage.setItem(STORIES_CACHE_KEY, JSON.stringify(stories));
        return stories;
      }
    } catch (error) {
      console.warn('Failed to fetch stories.json:', error);
    }

    // Last resort: return empty array
    return [];
  },

  /**
   * Get a single story by ID
   */
  async getById(id) {
    const stories = await this.getAll();
    return stories.find(s => s.id === parseInt(id));
  },

  /**
   * Get published stories only (for public website)
   */
  async getPublished() {
    const stories = await this.getAll();
    return stories.filter(s => s.published);
  },

  /**
   * Save stories - saves to localStorage immediately (instant)
   * Also updates the stories in memory so changes reflect immediately
   * Dispatches custom event to notify other components
   */
  saveStories(stories) {
    try {
      localStorage.setItem(STORIES_CACHE_KEY, JSON.stringify(stories));
      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new Event('storiesUpdated'));
      return Promise.resolve({ success: true, message: 'Stories saved locally' });
    } catch (error) {
      console.error('Failed to save stories:', error);
      return Promise.reject(error);
    }
  },

  /**
   * Update a single story
   */
  async updateStory(storyId, updates) {
    const allStories = await this.getAll();
    const updated = allStories.map(story =>
      story.id === parseInt(storyId) ? { ...story, ...updates } : story
    );
    await this.saveStories(updated);
    return updated.find(s => s.id === parseInt(storyId));
  },

  /**
   * Get stories from localStorage cache (for offline/instant access)
   */
  getCached() {
    try {
      const cached = localStorage.getItem(STORIES_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to read cache:', error);
      return null;
    }
  },

  /**
   * Clear the cache
   */
  clearCache() {
    localStorage.removeItem(STORIES_CACHE_KEY);
  },
};

