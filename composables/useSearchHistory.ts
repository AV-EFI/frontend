/**
 * Composable for managing search history in localStorage
 * Stores the latest 3 searches with timestamps and full URL
 */
export const useSearchHistory = () => {
    const STORAGE_KEY = 'avefi-search-history';
    const MAX_HISTORY_SIZE = 3;

  interface SearchHistoryItem {
    query: string;
    url: string;
    timestamp: number;
  }

  // Internal reactive state
  const historyState = ref<SearchHistoryItem[]>([]);

  /**
   * Load from localStorage into reactive state
   */
  const loadHistory = (): SearchHistoryItem[] => {
      if (typeof window === 'undefined') return [];
    
      try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (!stored) return [];
      
          const history = JSON.parse(stored) as SearchHistoryItem[];
          return Array.isArray(history) ? history : [];
      } catch (error) {
          console.error('Failed to parse search history:', error);
          return [];
      }
  };

  /**
   * Get search history (returns reactive ref)
   */
  const getSearchHistory = (): SearchHistoryItem[] => {
      historyState.value = loadHistory();
      return historyState.value;
  };

  /**
   * Add a search query to history with full URL
   * Removes duplicates and keeps only the latest 3 searches
   */
  const addToSearchHistory = (query: string, url?: string): void => {
      if (typeof window === 'undefined') return;
      if (!query || query.trim() === '') return;

      try {
          const history = loadHistory();
          
          // Use provided URL or get from latest-search-query
          const searchUrl = url || localStorage.getItem('latest-search-query') || '';
      
          // Remove existing entry with the same query (case-insensitive)
          const filteredHistory = history.filter(
              item => item.query.toLowerCase() !== query.toLowerCase()
          );

          // Add new query at the beginning with full URL
          const newHistory: SearchHistoryItem[] = [
              { query: query.trim(), url: searchUrl, timestamp: Date.now() },
              ...filteredHistory
          ];

          // Keep only the latest MAX_HISTORY_SIZE items
          const trimmedHistory = newHistory.slice(0, MAX_HISTORY_SIZE);

          localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedHistory));
          historyState.value = trimmedHistory;
      } catch (error) {
          console.error('Failed to save search history:', error);
      }
  };

  /**
   * Clear all search history
   */
  const clearSearchHistory = (): void => {
      if (typeof window === 'undefined') return;
    
      try {
          console.log('Clearing search history from localStorage');
          localStorage.removeItem(STORAGE_KEY);
          historyState.value = [];
          console.log('Search history cleared. localStorage value:', localStorage.getItem(STORAGE_KEY));
      } catch (error) {
          console.error('Failed to clear search history:', error);
      }
  };

  /**
   * Get search queries as a simple string array (most recent first)
   */
  const getSearchQueries = (): string[] => {
      return getSearchHistory().map(item => item.query);
  };

  /**
   * Remove a specific query from history
   */
  const removeFromHistory = (query: string): void => {
      if (typeof window === 'undefined') return;

      try {
          const history = loadHistory();
          const filteredHistory = history.filter(
              item => item.query.toLowerCase() !== query.toLowerCase()
          );
      
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredHistory));
          historyState.value = filteredHistory;
      } catch (error) {
          console.error('Failed to remove from search history:', error);
      }
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
      getSearchHistory,
      addToSearchHistory,
      clearSearchHistory,
      getSearchQueries,
      removeFromHistory,
      saveFromUrlState
  };
};
