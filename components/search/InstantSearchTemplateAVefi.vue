<template>
    <div>
        <div class="container rounded-lg border border-base-200 bg-white dark:bg-base-200 p-2 py-6 lg:px-4">
            <ais-instant-search :search-client="searchClient" :index-name="indexName" :show-loading-indicator="true"
                                :routing="extendedRouting" :insights="false" :future="{preserveSharedStateOnUnmount: true }">
                <ais-configure :hits-per-page.camel="20" />
                <h1 class="text-lg font-bold xl:text-2xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden content-center lg:ml-4 max-w-32" tabindex="0">
                    {{ $t('filmresearch') }}
                </h1>

                <div class="search-panel" role="region" :aria-label="$t('searchpanel')">
                    <ClientOnly>
                        <GlobalFacetDrawer :view-type-checked="viewTypeChecked" />
                    </ClientOnly>
                    <!-- Center -->
                    <div class="drawer-content w-full flex flex-col items-center justify-center max-md:w-screen" role="region"
                         :aria-label="$t('searchcontent')">
                        <div class="search-panel__results w-full p-2"
                             role="region" :aria-label="$t('searchresults')">
                            <div class="searchbox relative" role="search" :aria-label="$t('searchbox')">
                                <ais-search-box>
                                    <template #default="{ currentRefinement, refine, isSearchStalled }">
                                        <div class="flex flex-row mt-2">
                                            <div class="flex flex-row items-center h-12 w-full ">
                                                <SearchQueryAutocomplete v-model="localSearchValue" name="search"
                                                                         :placeholder="$t('searchplaceholder')" :clear-title="$t('resetQuery')"
                                                                         :show-info-tooltip="true" :info-tooltip-text="$t('exactSearchTip')" :enforce-list="false"
                                                                         :recent-searches="recentSearchesWithUrl" class="flex-1"
                                                                         @submit="handleSearchSubmit($event, refine)" @clear="handleSearchClear(refine)"
                                                                         @recent-search-click="handleRecentSearchClick" @remove-recent="handleRemoveRecentSearch"
                                                                         @clear-history="handleClearAllHistory" />
                                            </div>

                                            <button type="button" class="btn btn-primary lg:btn-lg h-12 rounded-xl rounded-l-none"
                                                    :title="$t('search')" @click="handleSearchSubmit(localSearchValue, refine)">
                                                <Icon class="text-lg" name="formkit:search" />
                                                <span class="hidden md:inline ml-2">{{ $t('Search') }}</span>
                                            </button>
                                            <!-- Context menu button -->
                                            <div class="relative ml-2" ref="searchMenuRef">
                                                <button type="button" class="btn btn-ghost btn-circle btn-outline lg:btn-lg w-12 h-12"
                                                        @click="toggleSearchMenu" :aria-expanded="String(searchMenuOpen)"
                                                        :title="$t('searchOptions')">
                                                    <Icon name="tabler:dots" />
                                                </button>

                                                <div v-if="searchMenuOpen"
                                                     class="absolute right-0 mt-2 p-2 bg-base-100 border rounded shadow-lg w-56 z-50" @click.stop>
                                                    <ul class="menu menu-compact">
                                                        <li>
                                                            <button @click="shareSearch">
                                                                <Icon name="tabler:share" class="w-4 h-4" />&nbsp;{{ $t('shareSearch') }}
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button @click="suggestSearch">
                                                                <Icon name="tabler:message-circle" class="w-4 h-4" />&nbsp;{{ $t('suggestSearchToAVefi') }}
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div v-if="contactFormOpen"
                                                     class="absolute right-0 mt-2 p-4 border rounded-lg bg-base-100 w-96 z-50" @click.stop>
                                                    <MicroContactForm :initialMessage="contactInitialMessage" @ContactFormClose="toggleForm()" />
                                                </div>
                                            </div>
                                        </div>

                                    </template>
                                </ais-search-box>
                            </div>

                            <div class="mt-2 mb-2 w-full">
                                <button class="btn btn-block btn-lg btn-primary lg:hidden" :title="$t('showFacetItems')"
                                        @click="$toggleFacetDrawerState">
                                    <Icon name="formkit:caretright" />&nbsp;{{ $t('showFacetItems') }}
                                </button>
                            </div>
                            <div class="w-full">
                                <div class="w-full grid grid-cols-1 lg:grid-cols-5 gap-1 flex-col md:flex-row justify-between"
                                     role="region" :aria-label="$t('filteringsection')">
                                    <div
                                        class="w-full flex flex-row justify-center col-span-2 bg-white dark:bg-gray-800 rounded-lg p-2 border-2 border-base-200">
                                        <ais-stats class="flex flex-row w-full">
                                            <template #default="{ nbHits = 0, results }">
                                                <span v-if="isSearchLoading" id="custom-spinner"
                                                      class="loading loading-spinner loading-md text-primary" />
                                                <div v-else class="stats stats-vertical w-full lg:stats-horizontal w-full shadow">
                                                    <div class="stat p-2 px-4">
                                                        <div class="stat-title">{{ $t('works') }}</div>
                                                        <div class="stat-value">{{ nbHits }}</div>
                                                    </div>

                                                    <div class="stat p-2 px-4">
                                                        <div class="stat-title">{{ $t('manifestations') }}</div>
                                                        <div class="stat-value">{{ results?._rawResults[0]?.nbManifestations }}</div>
                                                    </div>

                                                    <div class="stat p-2 px-4">
                                                        <div class="stat-title">{{ $t('items') }}</div>
                                                        <div class="stat-value">{{ results?._rawResults[0]?.nbItems }}</div>
                                                    </div>
                                                </div>
                                            </template>
                                        </ais-stats>
                                    </div>
                                    <div class="col-span-full md:col-span-3 border-base-200 border-2 rounded-lg bg-base-100" role="region"
                                         :aria-label="$t('activeFacets')">
                                        <div
                                            class="lg:col-span-full card p-2 flex flex-col md:flex-row justify-between w-full dark:bg-gray-800 rounded-t-lg rounded-b-none">
                                            <div class="w-full md:w-1/2 flex flex-row justify-start">
                                                <h2 id="active-facets-heading" class="font-bold text-gray-800 dark:text-gray-200" tabindex="-1">
                                                    {{ $t('activeFacets') }}
                                                </h2>
                                            </div>
                                            <div class="w-full md:w-1/2 flex flex-row justify-end">
                                                <ais-clear-refinements :class-names="{
                                                    'ais-ClearRefinements-button': 'btn btn-outline btn-sm border-neutral text-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                                                    'ais-CurrentRefinements-delete': 'ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                                }">
                                                    <template #resetLabel>
                                                        <Icon name="formkit:trash" /> <span class="accent">{{ $t('clearallfilters') }}</span>
                                                    </template>
                                                </ais-clear-refinements>
                                            </div>
                                        </div>
                                        <div class="w-full bg-white dark:bg-gray-800 rounded-t-none rounded-b-lg p-2" role="list"
                                             aria-labelledby="active-facets-heading">
                                            <ais-current-refinements :class-names="{
                                                'ais-CurrentRefinements-list': 'flex flex-row flex-wrap gap-2',
                                                'ais-CurrentRefinements-item': 'border border-base-200 text-gray-700 dark:text-gray-200 dark:border-gray-600 w-full rounded-lg p-1 md:w-auto md:max-w-xs',
                                                'ais-CurrentRefinements-delete': 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                                'ais-ClearRefinements-button': 'btn btn-error bg-red-500 hover:bg-red-600 text-white',
                                            }">
                                                <template v-slot="{ items }">
                                                    <div v-if="items.length === 0 && !hasProductionYearRefinement" class="text-gray-500 text-sm dark">
                                                        {{ $t('nofacetsselected') }}
                                                    </div>
                                                </template>
                                                <template #item="{ item, refine, createURL }">
                                                    <div role="listitem" class="flex flex-col gap-1">
                                                        <span class="text-left w-full">
                                                            <strong class="font-bold text-sm dark:text-primary-100">
                                                                {{ $t(item.label.split(".").at(-1)) }}:
                                                            </strong>
                                                        </span>
                                                        <ul class="list-none p-0 m-0" role="list">
                                                            <li v-for="refinement in item.refinements"
                                                                :key="[refinement.attribute, refinement.type, refinement.value, refinement.operator].join(':')"
                                                                class="flex items-center" role="listitem">
                                                                <a :href="createURL(refinement)"
                                                                   class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 accent"
                                                                   :aria-label="`${$t('remove')} ${$t(item.label.split('.').at(-1))} ${$t(refinement.label)}`"
                                                                   @click.prevent="refine(refinement)">
                                                                    {{ $t(refinement.label) }}
                                                                    <Icon class="text-lg my-auto p-2" name="formkit:trash" aria-hidden="true" />
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </template>
                                                <template #noRefinement>
                                                    <div class="text-gray-500 dark:text-gray-400 text-sm italic p-2">
                                                        {{ $t('nofacetsselected') }}
                                                    </div>
                                                </template>
                                            </ais-current-refinements>
                                            <!-- Custom chip for production year slider -->
                                            <div v-if="hasProductionYearRefinement" class="flex flex-row flex-wrap gap-2 mt-2">
                                                <div class="border flex flex-col items-start border-base-200 text-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-lg p-1 md:w-auto md:max-w-xs">
                                                    <strong class="font-bold text-sm mb-2 dark:text-primary-100 mr-2">
                                                        {{ $t('productionyear') }}:
                                                    </strong>
                                                    <div class="flex flex-row items-start cursor-pointer" @click="clearProductionYearRefinement" :aria-label="`${$t('remove')} ${$t('productionyear')} ${productionYearLabel}`">
                                                        <span class="text-sm">{{ productionYearLabel }}</span>
                                                        <div class="ml-2 my-auto">
                                                            <Icon class="text-lg my-auto p-2" name="formkit:trash" aria-hidden="true" />                                                        
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        class="form-control w-full border-base-200 border-2 col-span-2 flex flex-col justify-end bg-white dark:bg-gray-800 rounded-lg p-2 my-auto gap-y-1 h-full">
                                        <label class="label cursor-pointer text-sm flex justify-between items-center gap-2"
                                               :aria-label="$t('toggleViewType')">
                                            <Icon name="tabler:info-circle" class="text-gray-500 dark:text-gray-300 shrink-0 w-4!"
                                                  :title="$t('viewTypeCheckedWarning')" />
                                            <span class="label-text text-gray-800 dark:text-gray-200 flex-1 text-left">
                                                {{ $t('viewType') }}
                                            </span>
                                            <select v-model="viewTypeChecked" class="select select-primary select-sm w-auto my-auto">
                                                <option value="accordion">{{ $t('accordionView') }}</option>
                                                <option value="flat">{{ $t('flatView') }}</option>
                                                <option value="table">{{ $t('tableView') }}</option>
                                            </select>
                                        </label>
                                        <label v-if="viewTypeChecked === 'accordion'"
                                               class="label cursor-pointer text-sm flex justify-between items-center gap-2 my-auto"
                                               :aria-label="$t('toggleExpandAllHandles')">
                                            <Icon v-if="!expandAllHandlesChecked" class="dark:text-white shrink-0 !w-4"
                                                  name="tabler:layout-navbar-expand" />
                                            <Icon v-else class="dark:text-white shrink-0 !w-4" name="tabler:layout-navbar-collapse" />
                                            <span v-if="!expandAllHandlesChecked"
                                                  class="label-text text-gray-800 dark:text-gray-200 flex-1 text-left">
                                                {{ $t('expandAll') }}
                                            </span>
                                            <span v-else class="label-text text-gray-800 dark:text-gray-200 flex-1 text-left">
                                                {{ $t('collapseAll') }}
                                            </span>

                                            <input v-model="expandAllHandlesChecked" type="checkbox" class="toggle toggle-primary shrink-0">
                                        </label>
                                    </div>

                                    <LazyDetailPaginationComp class="col-span-full md:col-span-3 border-base-200 border-2 rounded-lg" />
                                </div>
                                <div class="flex w-full flex-col">
                                    <div class="divider divider-base-300 w-full">
                                        <span class="text-xs" v-if="searchQuery">
                                            Suchergebnisse für '{{ searchQuery }}'
                                        </span>
                                    </div>
                                </div>
                                <div class="overflow-x-auto w-full" style="overflow-y:hidden;">
                                    <ais-hits class="">
                                        <template #default="{ items }">
                                            <SearchNoResultsComp v-if="items.length === 0" class="text-center text-gray-500 py-6" />
                                            <SearchHitsComp v-else :items="items" :view-type-checked="viewTypeChecked"
                                                            :production-details-checked="productionDetailsChecked" :expanded-handles="expandedHandles"
                                                            :expand-all-handles-checked="expandAllHandlesChecked" :is-search-loading="isSearchLoading"
                                                            :current-refinements="currentRefinements" />
                                        </template>
                                    </ais-hits>
                                </div>
                                <LazyDetailPaginationComp />
                            </div>
                        </div>
                    </div>
                </div>
            </ais-instant-search>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const preservedSliderParams = ref<Record<string, string | string[]>>({});

function syncPreservedSliderParamsFromRoute() {
    const next: Record<string, string | string[]> = {};

    const sliderKeys = [
        'numericRefinement[production_in_year][>=]',
        'numericRefinement[production_in_year][<=]',
        'numericRefinement[prodYearsOnly][=]',
    ];

    for (const key of sliderKeys) {
        const value = route.query[key];

        if (Array.isArray(value)) {
            next[key] = value;
        } else if (typeof value === 'string') {
            next[key] = value;
        }
    }

    preservedSliderParams.value = next;
}


function getProductionYearRefinement() {
    const uiState = aisState?.uiState?.[props.indexName] || {};
    const num = uiState.numericRefinements || {};

    let from = num.production_in_year?.['>='];
    let to = num.production_in_year?.['<='];

    from = Array.isArray(from) ? from[0] : from;
    to = Array.isArray(to) ? to[0] : to;

    if (from === undefined || to === undefined) {
        const q = route.query;

        from =
            q['numericRefinement[production_in_year][>=]'] ??
            q[`[numericRefinement][production_in_year][>=]`] ??
            (q.numericRefinement as any)?.production_in_year?.['>='];

        to =
            q['numericRefinement[production_in_year][<=]'] ??
            q[`[numericRefinement][production_in_year][<=]`] ??
            (q.numericRefinement as any)?.production_in_year?.['<='];

        from = Array.isArray(from) ? from[0] : from;
        to = Array.isArray(to) ? to[0] : to;
    }

    return { from, to };
}

const hasProductionYearRefinement = computed(() => {
    const { from, to } = getProductionYearRefinement();
    return from !== undefined || to !== undefined;
});

const productionYearLabel = computed(() => {
    const { from, to } = getProductionYearRefinement();
    if (from && to) {
        return `${from} – ${to}`;
    } else if (from) {
        return `≥ ${from}`;
    } else if (to) {
        return `≤ ${to}`;
    } 
    return '';
    
});

function clearProductionYearRefinement() {
    const updatedQuery: Record<string, any> = { ...route.query };

    delete updatedQuery['numericRefinement[production_in_year][>=]'];
    delete updatedQuery['numericRefinement[production_in_year][<=]'];
    delete updatedQuery['numericRefinement[prodYearsOnly][=]'];

    router.replace({
        path: route.path,
        query: updatedQuery,
    });

    if (process.client) {
        window.dispatchEvent(new CustomEvent('avefi:clear-production-year'));
    }
}

import { ref, computed, inject, watch, onMounted, onBeforeUnmount } from 'vue';
import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi';
import { history as defaultRouter } from 'instantsearch.js/es/lib/routers';

const {$toggleFacetDrawerState, $toast}:any = useNuxtApp();

// toggle top right 
const VIEW_TYPE_KEY = 'avefi-search-viewTypeChecked';
const viewTypeChecked = ref<'accordion' | 'flat' | 'table'>('accordion');

onMounted(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(VIEW_TYPE_KEY);
        if (stored === 'accordion' || stored === 'flat' || stored === 'table') {
            viewTypeChecked.value = stored as typeof viewTypeChecked.value;
        }
    }
});

watch(viewTypeChecked, (newValue) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(VIEW_TYPE_KEY, newValue);
    }
});

const expandAllChecked = ref(false);

const expandAllHandlesChecked = ref(false);

const productionDetailsChecked = ref(true);

const expandedHandles = ref<Set<string>>(new Set());

const searchQuery = ref('');
const localSearchValue = ref('');

// Search history
const { addToSearchHistory, getSearchHistory, removeFromHistory, clearSearchHistory } = useSearchHistory();
const showRecentSearches = ref(false);
const historyTrigger = ref(0);

// Get full history items with URLs
const recentSearchesWithUrl = computed(() => {
    historyTrigger.value; // Make reactive
    const history = getSearchHistory();
    return history;
});

// Sync localSearchValue with URL query parameter
const syncSearchValueFromUrl = () => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('query');
    
    if (queryParam) {
        localSearchValue.value = queryParam;
        searchQuery.value = queryParam;
    }
};


// Use <ais-state-results> to access the raw search response
// Example usage in template:
// <ais-state-results v-slot="{ results }">
//   <pre>{{ results }}</pre>
// </ais-state-results>

// Load recent searches on mount
onMounted(() => {
    // Sync search value from URL
    syncSearchValueFromUrl();

    // Close recent searches dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
        const searchbox = document.querySelector('.searchbox');
        if (searchbox && !searchbox.contains(event.target as Node)) {
            showRecentSearches.value = false;
        }
    };

    document.addEventListener('click', handleClickOutside);
    
    // Watch for URL changes (browser back/forward)
    const handlePopState = () => {
        syncSearchValueFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    
    // Watch for changes in latest-search-query
    const updateFromStorage = () => {
        syncSearchValueFromUrl();
    };

    window.addEventListener('storage', updateFromStorage);
    
    // Polling removed - using computed property recentSearchesWithUrl instead
    
    onBeforeUnmount(() => {
        document.removeEventListener('click', handleClickOutside);
        window.removeEventListener('popstate', handlePopState);
        window.removeEventListener('storage', updateFromStorage);
    });
});

// URL updates are now handled by InstantSearch router
// No need for manual window.history manipulation

// Search handlers
const handleSearchSubmit = (value: string, refine: (value: string) => void) => {
    if (value && value.trim() !== '') {
        const searchUrl = `?query=${encodeURIComponent(value.trim())}`;
        addToSearchHistory(value, searchUrl);
        historyTrigger.value++;
    }

    refine(value);
    searchQuery.value = value;
    showRecentSearches.value = false;
};

const handleSearchClear = (refine: (value: string) => void) => {
    refine('');
    searchQuery.value = '';
    localSearchValue.value = '';
};

const handleRecentSearchClick = (item: any) => {
    if (item.url && item.url.trim()) {
        window.location.href = `/search/${item.url}`;
    } else if (item.query) {
        window.location.href = `/search/?query=${encodeURIComponent(item.query)}`;
    } else {
        console.error('No query or url found in item:', item);
    }

    showRecentSearches.value = false;
};

const handleRemoveRecentSearch = (query: string) => {
    removeFromHistory(query);
    historyTrigger.value++;
};

const handleClearAllHistory = () => {
    clearSearchHistory();
    historyTrigger.value++;
};

// Context menu + contact form state
const searchMenuOpen = ref(false);
const contactFormOpen = ref(false);
const contactInitialMessage = ref('');
const searchMenuRef = ref<HTMLElement | null>(null);

const toggleForm = () => { contactFormOpen.value = !contactFormOpen.value; };


const toggleSearchMenu = (e?: Event) => {
    if (e) e.stopPropagation();
    searchMenuOpen.value = !searchMenuOpen.value;
};

function shareSearch() {
    searchMenuOpen.value = false;
    const q = searchQuery.value || localSearchValue.value || '';
    const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}${window.location.search}` : '';

    // Try native Web Share API first
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
        try {
            (navigator as any).share({
                title: q || document.title,
                text: q ? `Search: ${q}` : document.title,
                url
            });
            return;
        } catch (err) {
            // fallthrough to clipboard fallback
            console.warn('Web Share failed:', err);
        }
    }

    // Fallback: copy URL to clipboard and notify
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            $toast?.success?.($t('linkCopied') as string || 'Link copied to clipboard');
        }).catch(() => {
            // Last resort: show prompt
            window.prompt($t('copyLinkPrompt') as string || 'Copy this link', url);
        });
    } else {
        // older browsers
        try {
            window.prompt($t('copyLinkPrompt') as string || 'Copy this link', url);
        } catch (e) {
            console.warn('Unable to copy link', e);
        }
    }
}

function suggestSearch() {
    searchMenuOpen.value = false;
    const q = searchQuery.value || localSearchValue.value || '';
    const url = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}${window.location.search}` : '';
    contactInitialMessage.value = $t('share.suggestTemplate', { query: q, url: url }) as string;
    contactFormOpen.value = true;
}

// Close menus on outside click
const onDocClickForMenu = (ev: MouseEvent) => {
    if (!searchMenuRef.value) return;
    if (!searchMenuRef.value.contains(ev.target as Node)) {
        searchMenuOpen.value = false;
        contactFormOpen.value = false;
    }
};

onMounted(() => document.addEventListener('click', onDocClickForMenu));
onBeforeUnmount(() => document.removeEventListener('click', onDocClickForMenu));

// --- Algolia current refinements (active facets) ---
const aisState = inject<any>('$_ais_state');

const currentRefinements = computed(() => {
    if (!aisState || !aisState.results) return [];
    // Algolia InstantSearch exposes current refinements in the UI state
    const uiState = aisState.results._rawResults?.[0]?.userData?.[0]?.uiState || aisState.uiState;
    if (!uiState) return [];
    // Try to extract all refinements (facets, numeric, etc.)
    const refinements: any[] = [];
    Object.entries(uiState).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            Object.entries(value).forEach(([facet, facetValue]) => {
                if (Array.isArray(facetValue) && facetValue.length) {
                    refinements.push({ label: facet, values: facetValue });
                } else if (typeof facetValue === 'object' && facetValue !== null) {
                    // Numeric or other refinements
                    Object.entries(facetValue).forEach(([op, val]) => {
                        refinements.push({ label: facet, values: [`${op}: ${val}`] });
                    });
                } else if (facetValue) {
                    refinements.push({ label: facet, values: [facetValue] });
                }
            });
        }
    });
    console.log('Current refinements:', refinements);
    return refinements;
});

const baseSearchClient = Client({
    config: config,
    url: `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_ELASTIC_API_SEARCH_ENDPOINT}`,
});

function convertNumericFiltersToNumericRefinements(numericFilters: unknown) {
    const result: Record<string, Record<string, number>> = {};

    if (!Array.isArray(numericFilters)) {
        return result;
    }

    for (const rawFilter of numericFilters) {
        if (typeof rawFilter !== 'string') continue;

        const match = rawFilter.match(/^(.+?)(<=|>=|=|<|>)(-?\d+(?:\.\d+)?)$/);
        if (!match) continue;

        const [, rawField, operator, rawValue] = match;
        const field = rawField.trim();
        const value = Number(rawValue);

        if (!field || !Number.isFinite(value)) continue;

        if (!result[field]) {
            result[field] = {};
        }

        result[field][operator] = value;
    }

    return result;
}

const searchClient = {
    ...baseSearchClient,

    async search(requests: any[]) {
        const rewrittenRequests = requests.map((request) => {
            const params = { ...(request.params || {}) };

            if (params.numericFilters) {
                const converted = convertNumericFiltersToNumericRefinements(params.numericFilters);

                if (Object.keys(converted).length > 0) {
                    params['numeric-refinements'] = {
                        ...(params['numeric-refinements'] || {}),
                        ...converted,
                    };
                }

                delete params.numericFilters;
            }

            return {
                ...request,
                params,
            };
        });

        return baseSearchClient.search(rewrittenRequests);
    },
};

const props = defineProps({
    indexName: {
        type: String,
        required: true,
        default: useRuntimeConfig().public.ELASTIC_INDEX,
    },
});

watch(expandAllChecked, () => {
    expandAllItems();
});

watch(viewTypeChecked, () => {
    expandAllChecked.value = false;

    // Reset all facets/refinements
    // Find the clear refinements button and click it
    setTimeout(() => {
        const clearBtn = document.querySelector('.ais-ClearRefinements-button');
        if (clearBtn instanceof HTMLElement) {
            clearBtn.click();
        }
    }, 0);
});

const expandAllItems = () => {
    const expandIcons = document.querySelectorAll('.expand-icon');
    expandIcons.forEach(icon => {
        icon.click();
    });
    setTimeout(() => {
        const checkboxes = document.querySelectorAll('.manifestation-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = !checkbox.checked;
        });
    }, 300);
};

const isSearchLoading = ref(false);

let observer: MutationObserver | null = null;

const updateState = () => {
    const el = document.getElementById('search-loading');
    if (!el) {
        isSearchLoading.value = false; // fallback if not found
        return;
    }
    isSearchLoading.value = !el.classList.contains('hidden');
};

onMounted(() => {
    const el = document.getElementById('search-loading');

    if (el) {
        observer = new MutationObserver(updateState);
        observer.observe(el, {
            attributes: true,
            attributeFilter: ['class'],
        });
        updateState(); // initial read
    } else {
        // fallback polling in case the spinner is created later
        const poll = setInterval(() => {
            const el = document.getElementById('search-loading');
            if (el) {
                clearInterval(poll);
                updateState();
                observer = new MutationObserver(updateState);
                observer.observe(el, { attributes: true, attributeFilter: ['class'] });
            }
        }, 100);
    }
});

onBeforeUnmount(() => {
    if (observer) observer.disconnect();
});

const routerInstance = process.client
    ? defaultRouter({
        cleanUrlOnDispose: false,

        createURL({ qsModule, location, routeState }) {
            const mergedRouteState = {
                ...routeState,
                ...preservedSliderParams.value,
            };

            const queryString = qsModule.stringify(mergedRouteState, {
                addQueryPrefix: true,
                arrayFormat: 'indices',
                encode: true,
            });

            return `${location.pathname}${queryString}${location.hash}`;
        },
        parseURL({ qsModule, location }) {
            return qsModule.parse(location.search.slice(1));
        },
    })
    : null;


const stateMapping = {
    stateToRoute(uiState) {
        try {
            const indexUiState = uiState[props.indexName] || {};
            const route: any = {};

            if (indexUiState.query) {
                route.query = indexUiState.query;
            }

            if (indexUiState.refinementList) {
                Object.entries(indexUiState.refinementList).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        route[key] = value;
                    } else if (value !== undefined && value !== null) {
                        route[key] = [value];
                        console.warn(`[stateToRoute] Facet "${key}" was not an array. Value was wrapped in array.`);
                    }
                });
            }

            /*
            if (indexUiState.numericRefinements && Object.keys(indexUiState.numericRefinements).length > 0) {
                route.numericRefinement = {};

                Object.entries(indexUiState.numericRefinements).forEach(([attr, ops]) => {
                    route.numericRefinement[attr] = {};

                    Object.entries(ops as Record<string, any>).forEach(([op, val]) => {
                        route.numericRefinement[attr][op] = Array.isArray(val) ? val[0] : val;
                    });
                });
            }
                */

            if (indexUiState.range) {
                Object.keys(indexUiState.range).forEach(key => {
                    route[`range_${key}`] = indexUiState.range[key];
                });
            }

            if (indexUiState.page && indexUiState.page > 1) {
                route.page = indexUiState.page;
            }

            return route;
        } catch (error) {
            console.error('Error in stateToRoute:', error);
            return {};
        }
    },

    routeToState(routeState) {
        try {
            const uiState: any = {};
            uiState[props.indexName] = {
                query: routeState?.query || '',
            };

            const refinementList: any = {};
            Object.keys(routeState || {}).forEach(key => {
                if (
                    key !== 'query' &&
                    key !== 'numericRefinement' &&
                    !key.startsWith('numericRefinement[') &&
                    key !== 'page' &&
                    !key.startsWith('range_')
                ) {
                    const value = routeState[key];

                    if (Array.isArray(value)) {
                        refinementList[key] = value;
                    } else if (value !== undefined && value !== null) {
                        refinementList[key] = [value];
                        console.warn(`[routeToState] Facet "${key}" was not an array. Value was wrapped in array.`);
                    }
                }
            });

            if (Object.keys(refinementList).length > 0) {
                uiState[props.indexName].refinementList = refinementList;
            }

            const numericRefinements: any = {};

            // Preferred nested object form
            if (routeState.numericRefinement && typeof routeState.numericRefinement === 'object') {
                Object.entries(routeState.numericRefinement).forEach(([attr, ops]) => {
                    if (typeof ops === 'object' && ops !== null) {
                        Object.entries(ops as Record<string, any>).forEach(([op, val]) => {
                            if (!numericRefinements[attr]) numericRefinements[attr] = {};
                            numericRefinements[attr][op] = Array.isArray(val) ? val : [val];
                        });
                    }
                });
            }

            // Fallback: flat bracket keys
            Object.keys(routeState || {}).forEach((key) => {
                const flatMatch = key.match(/^numericRefinement\[([^\]]+)\]\[([^\]]+)\]$/);

                if (flatMatch) {
                    const attr = flatMatch[1];
                    const op = flatMatch[2];
                    const value = routeState[key];

                    if (!numericRefinements[attr]) numericRefinements[attr] = {};
                    numericRefinements[attr][op] = Array.isArray(value) ? value : [value];
                }
            });

            // Also handle index-prefixed keys if needed
            Object.keys(routeState || {}).forEach(key => {
                const indexPrefixMatch = key.match(
                    new RegExp(`^${props.indexName}\\[numericRefinement\\]\\[([^\\]]+)\\]\\[([^\\]]+)\\]$`)
                );

                if (indexPrefixMatch) {
                    const attr = indexPrefixMatch[1];
                    const op = indexPrefixMatch[2];
                    const value = routeState[key];

                    if (!numericRefinements[attr]) numericRefinements[attr] = {};
                    numericRefinements[attr][op] = Array.isArray(value) ? value : [value];
                }
            });

            if (Object.keys(numericRefinements).length > 0) {
                uiState[props.indexName].numericRefinements = numericRefinements;
            }

            const range: any = {};
            Object.keys(routeState || {}).forEach(key => {
                if (key.startsWith('range_')) {
                    const rangeKey = key.replace('range_', '');
                    range[rangeKey] = routeState[key];
                }
            });

            if (Object.keys(range).length > 0) {
                uiState[props.indexName].range = range;
            }

            if (routeState?.page) {
                uiState[props.indexName].page = Number(routeState.page);
            }

            return uiState;
        } catch (error) {
            console.error('Error in routeToState:', error);
            return { [props.indexName]: { query: '' } };
        }
    }
};

// Only use routing on client-side
const extendedRouting = process.client ? {
    router: routerInstance,
    stateMapping: stateMapping,
} : undefined;


</script>
<style scoped lang="scss">
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
</style>