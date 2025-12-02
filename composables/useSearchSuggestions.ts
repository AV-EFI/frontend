// composables/useSearchSuggestions.ts
import { ref } from 'vue';

/**
 * Unified search suggestions composable
 * - loadFacetSuggestions(attr, query, size)
 * - handleFacetInput(attr, modelRef)  -> updates searchSuggestions & show flag
 * - loadQuerySuggestions(query, size) -> suggestions for main query fields (based on search_attributes)
 *
 * This composable only calls the server endpoint /api/elastic/suggestions which implements
 * mapping/nested handling. We avoid any file persistence here — the server may optionally
 * cache and persist top values separately.
 */

type Suggestion = { text: string; type: string }

export function useSearchSuggestions() {
    const searchSuggestions = ref<Suggestion[]>([]);
    const showSearchSuggestions = ref(false);

    // simple in-memory cache for facet top lists
    const facetCache = ref<Record<string, Suggestion[]>>({});

    async function loadFacetSuggestions(attr: string, query = '', size = 20) {
        if (!attr) {
            searchSuggestions.value = [];
            showSearchSuggestions.value = false;
            return [];
        }

        // if no query and cache exists return cached
        if (!query && facetCache.value[attr] && facetCache.value[attr].length > 0) {
            searchSuggestions.value = facetCache.value[attr];
            showSearchSuggestions.value = true;
            return searchSuggestions.value;
        }

        try {
            const res = await $fetch<{ success: boolean; suggestions: Suggestion[]; count?: number }>(
                '/api/elastic/suggestions',
                {
                    method: 'POST',
                    body: {
                        mode: 'facet',
                        facetAttr: attr,
                        query,
                        size
                    }
                }
            );

            if (res?.success && Array.isArray(res.suggestions)) {
                searchSuggestions.value = res.suggestions;
                // cache top (no-query) suggestions
                if (!query) facetCache.value[attr] = res.suggestions;
                showSearchSuggestions.value = true;
                return res.suggestions;
            } 
            // fallback: empty
            searchSuggestions.value = [];
            showSearchSuggestions.value = false;
            return [];
            
        } catch (err) {
            console.error('[useSearchSuggestions] loadFacetSuggestions error', err);
            // fallback to cached if available
            if (facetCache.value[attr]) {
                searchSuggestions.value = facetCache.value[attr];
                showSearchSuggestions.value = true;
                return searchSuggestions.value;
            }
            searchSuggestions.value = [];
            showSearchSuggestions.value = false;
            return [];
        }
    }

    // For main query autocompletion (search_attributes)
    async function loadQuerySuggestions(query = '', size = 10) {
        try {
            const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>(
                '/api/elastic/suggestions',
                {
                    method: 'POST',
                    body: {
                        mode: 'query',
                        query,
                        size
                    }
                }
            );
            if (res?.success && Array.isArray(res.suggestions)) {
                searchSuggestions.value = res.suggestions;
                showSearchSuggestions.value = true;
                return res.suggestions;
            }
            searchSuggestions.value = [];
            showSearchSuggestions.value = false;
            return [];
        } catch (err) {
            console.error('[useSearchSuggestions] loadQuerySuggestions error', err);
            searchSuggestions.value = [];
            showSearchSuggestions.value = false;
            return [];
        }
    }

    // Simple helper for components to call when user types in main query input
    async function handleSearchInputForQuery(queryRef: any, size = 10) {
        const q = (queryRef?.value || '').toString();
        if (!q) {
            // show top suggestions if empty (click-down behavior)
            await loadQuerySuggestions('', size);
            return;
        }
        await loadQuerySuggestions(q, size);
    }

    // Simple helper for components to call when user types in facet value input
    async function handleFacetInputForAttr(attr: string, queryRefOrString: any, size = 10) {
        const q = typeof queryRefOrString === 'string' ? queryRefOrString : (queryRefOrString?.value || '');
        return loadFacetSuggestions(attr, q, size);
    }

    // Expose a method to fetch & cache the top N values for many facets (for server or admin call)
    async function fetchAndCacheTopFacets(attrs: string[], size = 50) {
        for (const a of attrs) {
            try {
                const res = await $fetch<{ success: boolean; suggestions: Suggestion[] }>(
                    '/api/elastic/suggestions',
                    { method: 'POST', body: { mode: 'facet', facetAttr: a, size } }
                );
                if (res?.success && Array.isArray(res.suggestions)) {
                    facetCache.value[a] = res.suggestions;
                }
            } catch (err) {
                console.warn('[useSearchSuggestions] fetchAndCacheTopFacets failed for', a, err);
            }
        }
    }

    return {
        searchSuggestions,
        showSearchSuggestions,
        loadFacetSuggestions,
        loadQuerySuggestions,
        handleSearchInputForQuery,
        handleFacetInputForAttr,
        fetchAndCacheTopFacets,
        facetCache
    };
}
