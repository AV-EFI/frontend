<template>
  <div>    
    <div class="container">
      <ais-instant-search
        :search-client="searchClient"
        :index-name="indexName"
        :show-loading-indicator="true"
        :routing="extendedRouting"
        :insights="false"
        :future="{preserveSharedStateOnUnmount: true }"
      >
        <ais-configure :hits-per-page.camel="20" />        
        <div
          class="search-panel"
          role="region"
          :aria-label="$t('searchpanel')"
        >
          <ClientOnly>
            <GlobalFacetDrawer
              :view-type-checked="viewTypeChecked"
            />
          </ClientOnly>
          <!-- Center -->
          <div
            class="drawer-content w-full flex flex-col items-center justify-center max-md:w-screen"
            role="region"
            :aria-label="$t('searchcontent')"
          >
            <div
              class="search-panel__results w-full py-2 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md px-2"
              role="region"
              :aria-label="$t('searchresults')"
            >
              <div
                class="searchbox relative"
                role="search"
                :aria-label="$t('searchbox')"
              >
                <ais-search-box>
                  <template #default="{ currentRefinement, refine, isSearchStalled }">
                    <div class="flex flex-row mt-2">
                      <div
                        class="flex flex-row items-center w-full "
                      >
                        <SearchQueryAutocomplete
                          ref="qaRef"
                          v-model="localSearchValue"
                          name="search"
                          :placeholder="$t('searchplaceholder')"
                          :clear-title="$t('resetQuery')"
                          :show-info-tooltip="true"
                          :info-tooltip-text="$t('exactSearchTip')"
                          :enforce-list="false"
                          :recent-searches="recentSearchesWithUrl"
                          class="flex-1"
                          @submit="handleSearchSubmit($event, refine)"
                          @clear="handleSearchClear(refine)"
                          @recent-search-click="handleRecentSearchClick"
                          @remove-recent="handleRemoveRecentSearch"
                          @clear-history="handleClearAllHistory"
                        />                      
                        <span
                          id="search-loading"
                          :class="[!isSearchStalled ? 'hidden' : '','loading loading-spinner loading-sm ml-2']"
                        />
                      </div>
                      
                      <button
                        type="button"
                        class="btn btn-primary btn-lg h-[56px] rounded-xl rounded-l-none"
                        :title="$t('search')"
                        @click="$refs.qaRef?.submit()"
                      >
                        <Icon
                          class="text-lg"
                          name="formkit:search"
                        />
                        <span class="hidden md:inline ml-2">{{ $t('search') }}</span>
                      </button>
                    </div>
                  </template>
                </ais-search-box>
              </div>
              
              <div class="mt-2 mb-2 w-full">
                <button
                  class="btn btn-primary lg:hidden"
                  :title="$t('showFacetItems')"
                  @click="$toggleFacetDrawerState"
                >
                  <Icon name="formkit:caretright" />&nbsp;{{ $t('showFacetItems') }}
                </button>
              </div>
              <div class="w-full">
                <div
                  class="w-full grid grid-cols-1 lg:grid-cols-4 gap-1 flex-col md:flex-row justify-between"
                  role="region"
                  :aria-label="$t('filteringsection')"
                >
                  <div class="w-full flex flex-col justify-center bg-white dark:bg-gray-800 rounded-lg p-2 border-2 border-base-200">
                    <ais-stats>
                      <template #default="{ nbHits = 0 }">
                        <div class="flex items-center justify-center h-10">
                          <span
                            v-if="isSearchLoading"
                            id="custom-spinner"
                            class="loading loading-spinner loading-md text-primary"
                          />
                          <h2
                            v-else
                            class="text-xl font-bold text-center text-gray-800 dark:text-gray-200"
                          >
                            {{ nbHits }} {{ $t('results') }}
                          </h2>
                        </div>
                      </template>
                    </ais-stats>
                  </div>
                  <div class="md:col-span-2 w-full flex flex-col justify-center border-base-200 border-2 bg-white dark:bg-gray-800 rounded-lg p-2">
                    <p class="text-gray-800 dark:text-gray-200 text-center">
                      sorting
                    </p>
                    <ais-sort-by
                      :items="sortItems"
                      :class-names="{
                        'ais-SortBy-select': 'hidden',
                      }"
                      aria-disabled="true"
                    />
                  </div>
                  <div class="form-control w-full border-base-200 border-2 flex flex-col justify-end bg-white dark:bg-gray-800 rounded-lg p-2">
                    <label 
                      class="label cursor-pointer text-sm flex justify-between items-center gap-2"
                      :aria-label="$t('toggleViewType')"
                    >
                      <Icon
                        name="tabler:info-circle"
                        class="text-gray-500 dark:text-gray-300 shrink-0"
                        :title="$t('viewTypeCheckedWarning')"
                      />
                      <span class="label-text text-gray-800 dark:text-gray-200 flex-1">
                        {{ `${$t('accordionView')} / ${$t('flatView')}` }}
                      </span>
                      <input
                        v-model="viewTypeChecked"
                        type="checkbox"
                        class="toggle toggle-primary shrink-0"
                      >
                    </label>                    
                    <label
                      v-if="!viewTypeChecked"
                      class="label cursor-pointer text-sm flex justify-between items-center gap-2"
                      :aria-label="$t('toggleExpandAllHandles')"
                    >
                      <Icon
                        v-if="!expandAllHandlesChecked"
                        class="dark:text-white shrink-0"
                        name="tabler:layout-navbar-expand"
                      />
                      <Icon
                        v-else
                        class="dark:text-white shrink-0"
                        name="tabler:layout-navbar-collapse"
                      />
                      <span
                        v-if="!expandAllHandlesChecked"
                        class="label-text text-gray-800 dark:text-gray-200 flex-1"
                      >
                        {{ $t('expandAll') }}
                      </span>
                      <span
                        v-else
                        class="label-text text-gray-800 dark:text-gray-200 flex-1"
                      >
                        {{ $t('collapseAll') }}
                      </span>

                      <input
                        v-model="expandAllHandlesChecked"
                        type="checkbox"
                        class="toggle toggle-primary shrink-0"
                      >
                    </label>
                  </div>
                  <div class="col-span-full md:col-span-2 border-base-200 border-2 rounded-lg bg-base-100">
                    <div class="lg:col-span-full card p-2 flex flex-col md:flex-row justify-between w-full dark:bg-gray-800 rounded-lg">
                      <div class="w-full md:w-1/2 flex flex-row justify-start">
                        <h2 class="font-bold text-gray-800 dark:text-gray-200">
                          {{ $t('activeFacets') }}
                        </h2>
                      </div>
                      <div class="w-full md:w-1/2 flex flex-row justify-end">
                        <ais-clear-refinements 
                          :class-names="{
                            'ais-ClearRefinements-button': 'btn btn-outline btn-sm border-neutral text-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                            'ais-CurrentRefinements-delete': 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }"
                        >
                          <template #resetLabel>
                            <Icon name="formkit:trash" /> <span class="accent">{{ $t('clearallfilters') }}</span>
                          </template>
                        </ais-clear-refinements>
                      </div>
                    </div>
                    <div class="w-full bg-white dark:bg-gray-800 rounded-lg p-2">
                      <ais-current-refinements 
                        :class-names="{
                          'ais-CurrentRefinements-list': 'flex flex-row flex-wrap gap-2',
                          'ais-CurrentRefinements-item': 'border border-neutral text-gray-700 dark:text-gray-200 dark:border-gray-600 w-full rounded-lg p-1 md:w-auto md:max-w-xs',
                          'ais-CurrentRefinements-delete': 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                          'ais-ClearRefinements-button': 'btn btn-error bg-red-500 hover:bg-red-600 text-white',
                        }"
                      >
                        <template #item="{ item, refine, createURL }">
                          <strong class="font-bold text-sm dark:text-primary-100">
                            {{ $t(item.label.split(".").at(-1)) }}:
                          </strong>
                          <ul class="list-none p-0 m-0">
                            <li
                              v-for="refinement in item.refinements"
                              :key="[refinement.attribute, refinement.type, refinement.value, refinement.operator].join(':')"
                              class="flex items-center"
                            >
                              <a
                                :href="createURL(refinement)"
                                class="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 accent"
                                @click.prevent="refine(refinement)"
                              >
                                {{ $t(refinement.label) }}
                                <Icon
                                  class="text-lg"
                                  name="formkit:trash"
                                />
                              </a>
                            </li>
                          </ul>
                        </template>
                      </ais-current-refinements>
                    </div>
                  </div>
                  <LazyDetailPaginationComp class="col-span-full md:col-span-2 border-base-200 border-2 rounded-lg" />
                </div>
                <div
                  class="flex w-full flex-col"
                >
                  <div class="divider divider-neutral w-full">
                    <span v-if="searchQuery">
                      Suchergebnisse für '{{ searchQuery }}'
                    </span>
                  </div>
                </div>
                <div
                  class="overflow-x-auto w-full"
                  style="overflow-y:hidden;"
                >
                  <ais-hits
                    class=""
                  >
                    <template #default="{ items }">
                      <SearchNoResultsComp
                        v-if="items.length === 0"
                        class="text-center text-gray-500 py-6"
                      />
                      <SearchHitsComp
                        v-else
                        :items="items"
                        :view-type-checked="viewTypeChecked"
                        :production-details-checked="productionDetailsChecked"
                        :expanded-handles="expandedHandles"
                        :expand-all-handles-checked="expandAllHandlesChecked"
                        :is-search-loading="isSearchLoading"
                        :current-refinements="currentRefinements"
                      />
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
import { ref, computed, inject, watch, onMounted, onBeforeUnmount } from 'vue';
import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi.ts';
import { history as defaultRouter } from 'instantsearch.js/es/lib/routers';

const {$toggleFacetDrawerState}:any = useNuxtApp();

// toggle top right 
const viewTypeChecked = ref(false);

const expandAllChecked = ref(false);

const expandAllHandlesChecked = ref(false);

const productionDetailsChecked = ref(true);

const expandedHandles = ref<Set<string>>(new Set());

const searchQuery = ref('');
const localSearchValue = ref('');

// Search history
const { addToSearchHistory, getSearchHistory, removeFromHistory, clearSearchHistory } = useSearchHistory();
const recentSearches = ref<string[]>([]);
const showRecentSearches = ref(false);
const historyTrigger = ref(0);

// Get full history items with URLs
const recentSearchesWithUrl = computed(() => {
    historyTrigger.value; // Make reactive
    const history = getSearchHistory();
    console.log('recentSearchesWithUrl computed:', history);
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

// Update URL query parameter
const updateUrlQueryParam = (query: string) => {
    if (typeof window === 'undefined') return;
    
    const url = new URL(window.location.href);
    if (query && query.trim()) {
        url.searchParams.set('query', query.trim());
    } else {
        url.searchParams.delete('query');
    }
    
    // Update URL without triggering page reload
    window.history.replaceState({}, '', url.toString());
};

// Search handlers
const handleSearchSubmit = (value: string, refine: (value: string) => void) => {
    console.log('handleSearchSubmit called with:', value);
    if (value && value.trim() !== '') {
        // Update URL first, then save to history with the correct URL
        updateUrlQueryParam(value);
        const searchUrl = `?query=${encodeURIComponent(value.trim())}`;
        addToSearchHistory(value, searchUrl);
        historyTrigger.value++;
        console.log('Search history after add:', getSearchHistory());
    }
    refine(value);
    searchQuery.value = value;
    showRecentSearches.value = false;
};

const handleSearchClear = (refine: (value: string) => void) => {
    refine('');
    searchQuery.value = '';
    localSearchValue.value = '';
    updateUrlQueryParam('');
};

const handleRecentSearchClick = (item: any) => {
    console.log('handleRecentSearchClick called with:', item);
    // Navigate to the search page with the saved query
    if (item.url && item.url.trim()) {
        // item.url contains the full query string (e.g., "?query=something")
        const fullUrl = `/search/${item.url}`;
        console.log('Navigating to:', fullUrl);
        window.location.href = fullUrl;
    } else if (item.query) {
        // Fallback: construct URL from query if url is missing
        const fullUrl = `/search/?query=${encodeURIComponent(item.query)}`;
        console.log('Fallback - Navigating to:', fullUrl);
        window.location.href = fullUrl;
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

const searchClient = Client({
    config: config,
    url: `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_ELASTIC_API_SEARCH_ENDPOINT}`,
});
/*
        sorting: {
            default: [
                { field: "_score", order: "desc" },
                { field: "has_record.has_primary_title.has_name.keyword", order: "asc" },
            ],
            _title_asc: {
                field: "has_record.has_primary_title.has_name",
                order: "asc",
            },
            _title_desc: {
                field: "has_record.has_primary_title.has_name",
                order: "desc",
            },
            _country_asc: {
                field: "country",
                order: "asc",
            },
            _country_desc: {
                field: "country",
                order: "desc",
            },
            _year_asc: {
                field: "year",
                order: "asc",
            },
            _year_desc: {
                field: "year",
                order: "desc",
            },
            _directors_asc: {
                field: "directors_or_editors",
                order: "asc",
            },
            _directors_desc: {
                field: "directors_or_editors",
                order: "desc",
            },
            _production_asc: {
                field: "production",
                order: "asc",
            },
            _production_desc: {
                field: "production",
                order: "desc",
            },
        },
*/
const sortingConfig = config?.search_settings?.sorting;
let sortItems = [];
if (sortingConfig && typeof sortingConfig === 'object') {
    sortItems = Object.entries(sortingConfig)
        .map(([key, value]: [string, any]) => ({
            value: key,
            label: value.field,
        }));
}
console.log('Sorting items:', sortItems);
/*
const sortItems = config?.search_settings?.sorting?.map((option: any) => ({
    value: option.index_name,
    label: option.label,
}));
*/

onMounted(() => {

    useCurrentUrlState();
    const saveSearchQuery = () => {
        const search = window?.location?.search;
        if (search) {
            localStorage.setItem('latest-search-query', search);
        }
    };

    // 1. Handle browser history nav
    window.addEventListener('popstate', saveSearchQuery);

    // 2. Fallback polling (for InstantSearch internal router updates)
    const interval = setInterval(saveSearchQuery, 500);

    // Clean up
    onBeforeUnmount(() => {
        window.removeEventListener('popstate', saveSearchQuery);
        clearInterval(interval);
    });
});


const props = defineProps({
    indexName: {
        type: String,
        required: true,
        default: useRuntimeConfig().public.ELASTIC_INDEX,
    },
});

watch(expandAllChecked, (newValue) => {
    expandAllItems();
});

watch(viewTypeChecked, (newValue) => {
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

const routerInstance = defaultRouter();


const stateMapping = {
    stateToRoute(uiState) {
        const indexUiState = uiState[props.indexName] || {};
        
        const route: any = {};
        
        // Add query if present
        if (indexUiState.query) {
            route.query = indexUiState.query;
        }
        
        // Add refinement lists (facets)
        if (indexUiState.refinementList) {
            Object.keys(indexUiState.refinementList).forEach(key => {
                if (indexUiState.refinementList[key].length > 0) {
                    route[key] = indexUiState.refinementList[key];
                }
            });
        }
        
        // Add numeric refinements
        if (indexUiState.numericRefinements && Object.keys(indexUiState.numericRefinements).length > 0) {
            route.numericRefinement = indexUiState.numericRefinements;
        }
        
        // Add range
        if (indexUiState.range) {
            Object.keys(indexUiState.range).forEach(key => {
                route[`range_${key}`] = indexUiState.range[key];
            });
        }
        
        // Add page
        if (indexUiState.page && indexUiState.page > 1) {
            route.page = indexUiState.page;
        }

        return route;
    },

    routeToState(routeState) {
        const uiState: any = {
            query: routeState.query || '',
        };
        
        // Reconstruct refinement lists
        const refinementList: any = {};
        Object.keys(routeState).forEach(key => {
            if (key !== 'query' && key !== 'numericRefinement' && key !== 'page' && !key.startsWith('range_')) {
                refinementList[key] = Array.isArray(routeState[key]) ? routeState[key] : [routeState[key]];
            }
        });
        
        if (Object.keys(refinementList).length > 0) {
            uiState.refinementList = refinementList;
        }
        
        // Reconstruct numeric refinements
        if (routeState.numericRefinement) {
            uiState.numericRefinements = routeState.numericRefinement;
        }
        
        // Reconstruct range
        const range: any = {};
        Object.keys(routeState).forEach(key => {
            if (key.startsWith('range_')) {
                const rangeKey = key.replace('range_', '');
                range[rangeKey] = routeState[key];
            }
        });
        
        if (Object.keys(range).length > 0) {
            uiState.range = range;
        }
        
        // Add page
        if (routeState.page) {
            uiState.page = Number(routeState.page);
        }

        return {
            [props.indexName]: uiState,
        };
    },
};


/*
routerInstance.write = (routeState) => {
    try {
        console.log('Router write:', routeState);
        // Check if the route state is empty
        if (Object.keys(routeState).length === 0) {
            console.error('Route state is empty, not saving to localStorage.');
            return;
        }

        const indexKey = useRuntimeConfig().public.ELASTIC_INDEX;
        if (!routeState[indexKey] || !routeState[indexKey].query) {
            console.error('No search query in route state, not saving to localStorage.');
            return;
        }

        //console.log('Structured state:', structuredState);
        // Convert route state to URL
        const url = routerInstance.createURL(routeState);
        const search = url.includes('?') ? url.slice(url.indexOf('?')) : '';

        // Save the query part only
        localStorage.setItem('latest-search-query', search);
        window.dispatchEvent(new StorageEvent('storage', { key: 'latest-search-query' }));
        //useCurrentUrlState().updateFromStorage();
        console.log('Saved latest-search-query:', localStorage.getItem('latest-search-query'));
    } catch (e) {
        console.error('Failed to store latest-search-query:', e);
    }

    // Still do the default routing update
    defaultRouter().write(routeState);
};
*/
const extendedRouting = {
    router: routerInstance,
    stateMapping: stateMapping,
};


</script>
<style scoped lang="scss">
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
</style>