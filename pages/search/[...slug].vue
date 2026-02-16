<template>
    <div class="container mx-auto p-2">
        <GlobalBreadcrumbsComp :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`],
      ]" />
        <keep-alive>
            <SearchSection v-if="searchClient" :search-client="searchClient" @facetsChanged="onFacetsChanged" />
            <div v-else class="text-center py-4">
                <span class="loading loading-spinner loading-lg text-primary" />
            </div>
        </keep-alive>
    </div>
</template>
<script setup lang="ts">
import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi';
import { useCurrentUrlState } from '../../composables/useCurrentUrlState';

definePageMeta({
    auth: false,
});

// Initialize search client only on client-side
const searchClient = process.client ? Client({
    config: config,
    url: `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_SEARCH}`,  
}) : null;

const { currentUrlState } = useCurrentUrlState();
const { t } = useI18n();
const route = useRoute();
const { $matomo } = useNuxtApp();

// Extract the value from query parameter (SSR-compatible)
const searchValue = ref<string | null>(route.query.query as string || null);
let pollInterval: ReturnType<typeof setInterval> | null = null;
const lastTrackedFacets = ref(null);

// Track search with all parameters (debounced until results/facets are present)
const trackSearchWithParams = (retryCount = 0) => {
    if (!import.meta.client) return;
    // Wait for results/facets to be present in DOM
    const statsEl = document.querySelector('.ais-Stats-text');
    if (!statsEl && retryCount < 10) {
        setTimeout(() => trackSearchWithParams(retryCount + 1), 200);
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query') || '';
    // Extract all facets and parameters
    const facets = {};
    const allParams = {};
    urlParams.forEach((value, key) => {
        allParams[key] = value;
        if (key !== 'query' && key !== 'page' && key !== 'sortBy' && key !== 'hitsPerPage') {
            if (!facets[key]) facets[key] = [];
            facets[key].push(value);
        }
    });
    const resultsCount = statsEl?.textContent?.match(/[\d,]+/)?.[0]?.replace(/,/g, '');
    if (query) {
        $matomo?.trackSiteSearch(query, 'Films', resultsCount ? parseInt(resultsCount) : false);
    }
    $matomo?.trackEvent(
        'Search',
        'Filter Applied',
        JSON.stringify({ query, facets, allParams }),
        Object.keys(facets).length
    );
    // Log for debugging (detailed)
    console.log('[Matomo] Event payload:', {
        query,
        facets,
        allParams,
        resultsCount,
        url: window.location.href
    });
};

const updateSearchValue = () => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const newValue = urlParams.get('query') || null;
    
    if (newValue !== searchValue.value) {
        searchValue.value = newValue;
        // Force document title update
        if (process.client) {
            document.title = newValue ? t('seo.search.titleWithQuery', { query: newValue }) : t('seo.search.title');
        }
    }
    
    // Track search parameters
    trackSearchWithParams();
};

function sendFacetCustomDimensions(facets) {
    if (typeof window === 'undefined' || !window._paq) return;
    // Map facet keys to Matomo custom dimension IDs
    const facetDimensionMap = {
        has_form: 1, // Dimension 1
        has_issuer: 2, // Dimension 2
    // Add more mappings as needed
    };
    facets.forEach(facet => {
        const dimId = facetDimensionMap[facet.label];
        if (dimId) {
            // Send each value (if array)
            facet.values.forEach(val => {
                window._paq.push(['setCustomDimension', dimId, val]);
                console.log(`[Matomo] Custom Dimension ${dimId}:`, facet.label, val);
            });
        }
    });
}

function onFacetsChanged(facets) {
    console.log('[Matomo] facetsChanged event received:', facets);
    sendFacetCustomDimensions(facets);
    // Always send a test event for debugging
    $matomo?.trackEvent('Test', 'Debug', JSON.stringify(facets), Array.isArray(facets) ? facets.length : 0);
    // Only track if facets actually changed
    if (JSON.stringify(facets) !== JSON.stringify(lastTrackedFacets.value)) {
        lastTrackedFacets.value = facets;
        $matomo?.trackEvent(
            'Search',
            'Filter Applied',
            JSON.stringify({ facets }),
            Array.isArray(facets) ? facets.length : 0
        );
        console.log('[Matomo] facets sent to Matomo:', facets);
    }
}

function sendFacetEventsFromUrl() {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
    // Only send for facet/filter params (not query, page, etc.)
        if (key !== 'query' && key !== 'page' && key !== 'sortBy' && key !== 'hitsPerPage') {
            $matomo?.trackEvent('Search', 'Facet', key, value);
            console.log('[Matomo] Facet event:', key, value);
        }
    });
}

onMounted(() => {
    updateSearchValue();
    pollInterval = setInterval(updateSearchValue, 300);
    window.addEventListener('popstate', updateSearchValue);
    // Track initial search on mount (debounced)
    trackSearchWithParams();
    // Also send custom dimensions from URL on initial load
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        Object.entries({ has_form: 1, has_issuer: 2 }).forEach(([key, dimId]) => {
            const value = urlParams.get(key);
            if (value) {
                window._paq.push(['setCustomDimension', dimId, value]);
                console.log(`[Matomo] Custom Dimension ${dimId} (from URL):`, key, value);
            }
        });
    }
    sendFacetEventsFromUrl();
});

onBeforeUnmount(() => {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
    window.removeEventListener('popstate', updateSearchValue);
});

useHead({
    title: computed(() => 
        searchValue.value ? t('seo.search.titleWithQuery', { query: searchValue.value }) : t('seo.search.title')
    ),
    meta: [
        {
            name: 'description',
            content: computed(() => 
                searchValue.value 
                    ? t('seo.search.descriptionWithQuery', { query: searchValue.value })
                    : t('seo.search.description')
            )
        },
        {
            property: 'og:url',
            content: 'https://www.av-efi.net/search'
        }
    ],
    link: [
        { rel: 'canonical', href: 'https://www.av-efi.net/search' }
    ]
});


</script>
<style>
.ais-SearchBox-form,
.ais-SearchBox-input,
.ais-SortBy-select {
    background-color: transparent !important;
}

.ais-SearchBox-input:focus {
    border-color: var(--primary);
}

.ais-Pagination-item--selected {
    background-color: var(--primary);
    color: white;
}
</style>