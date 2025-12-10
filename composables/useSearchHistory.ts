/**
 * Composable for managing search history in localStorage
 * Stores the latest 3 searches with timestamps and full URL
 * Syncs across multiple browser tabs automatically
 */
export const useSearchHistory = () => {
    const STORAGE_KEY = 'avefi-search-history';
    const MAX_HISTORY_SIZE = 3;

  interface SearchHistoryItem {
    query: string;
    url: string;
    timestamp: number;
  }

  // Simple reactive ref for history
  const history = ref<SearchHistoryItem[]>([]);

  // Initialize from localStorage (client-side only)
  if (import.meta.client) {
      try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
              const parsed = JSON.parse(stored);
              history.value = Array.isArray(parsed) ? parsed : [];
          }
      } catch (error) {
          console.error('Failed to load search history:', error);
      }

      // Set up cross-tab sync listener
      window.addEventListener('storage', (event) => {
          if (event.key === STORAGE_KEY) {
              try {
                  const newHistory = event.newValue ? JSON.parse(event.newValue) : [];
                  history.value = Array.isArray(newHistory) ? newHistory : [];
              } catch (error) {
                  console.error('Failed to sync search history across tabs:', error);
              }
          }
      });
  }

  /**
   * Save history to localStorage
   */
  const saveToStorage = () => {
      if (typeof window === 'undefined') return;
      try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
      } catch (error) {
          console.error('Failed to save search history:', error);
      }
  };

  /**
   * Get search history
   */
  const getSearchHistory = (): SearchHistoryItem[] => {
      return history.value;
  };

  /**
   * Add a search query to history with full URL
   * Removes duplicates and keeps only the latest 3 searches
   */
  const addToSearchHistory = (query: string, url?: string): void => {
      if (typeof window === 'undefined') return;
      if (!query || query.trim() === '') return;

      // Use provided URL or get from latest-search-query
      const searchUrl = url || localStorage.getItem('latest-search-query') || '';
      
      // Remove existing entry with the same query (case-insensitive)
      const filteredHistory = history.value.filter(
          item => item.query.toLowerCase() !== query.toLowerCase()
      );

      // Add new query at the beginning with full URL
      history.value = [
          { query: query.trim(), url: searchUrl, timestamp: Date.now() },
          ...filteredHistory
      ].slice(0, MAX_HISTORY_SIZE);

      saveToStorage();
  };

  /**
   * Clear all search history
   */
  const clearSearchHistory = (): void => {
      if (typeof window === 'undefined') return;
      history.value = [];
      try {
          localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
          console.error('Failed to clear search history:', error);
      }
  };

  /**
   * Get search queries as a simple string array (most recent first)
   */
  const getSearchQueries = (): string[] => {
      return history.value.map(item => item.query);
  };

  /**
   * Remove a specific query from history
   */
  const removeFromHistory = (query: string): void => {
      if (typeof window === 'undefined') return;

      history.value = history.value.filter(
          item => item.query.toLowerCase() !== query.toLowerCase()
      );
      
      saveToStorage();
  };

  /**
   * Extract and save query from latest-search-query URL with all facets
   */
  const saveFromUrlState = (): void => {
      if (typeof window === 'undefined') return;

      try {
          const latestSearchQuery = localStorage.getItem('latest-search-query');
          if (!latestSearchQuery) return;

          // Parse URL parameters
          const urlParams = new URLSearchParams(latestSearchQuery);
          const query = urlParams.get('query');

          if (query && query.trim() !== '') {
              // Save with full URL including all facets
              addToSearchHistory(query, latestSearchQuery);
          }
      } catch (error) {
          console.error('Failed to save from URL state:', error);
      }
  };

  return {
      history,
      getSearchHistory,
      addToSearchHistory,
      clearSearchHistory,
      getSearchQueries,
      removeFromHistory,
      saveFromUrlState
  };
};
