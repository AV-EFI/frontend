<template>
  <div>    
    <div class="container">
      <ais-instant-search
        :search-client="searchClient"
        :index-name="indexName"
        :show-loading-indicator="true"
        :routing="true"
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
                class="searchbox"
                role="search"
                :aria-label="$t('searchbox')"
              >
                <ais-search-box
                  :ignore-composition-events="true"
                  :submit-title="$t('submitQuery')"
                  :reset-title="$t('resetQuery')"
                  class="flex flex-row mt-2"
                >
                  <template #default="{ currentRefinement = '', refine = () => {}, isSearchStalled = false } = {}">
                    <div
                      class="flex flex-row items-center w-full py-1.5 px-2.5 rounded-l-xl rounded-r-none border border-primary-300 bg-white focus-within:ring-1 focus-within:!ring-primary-400 focus-within:!border-primary-400 group-data-[invalid]:border-red-400 group-data-[invalid]:ring-1 group-data-[invalid]:ring-red-400 group-data-[disabled]:bg-zinc-100 group-data-[disabled]:!cursor-not-allowed shadow-sm group-[]/repeater:shadow-none group-[]/multistep:shadow-none dark:bg-transparent dark:border-primary-200 dark:group-data-[disabled]:bg-zinc-700 dark:group-data-[invalid]:border-red-400 dark:group-data-[invalid]:ring-red-400 max-md:max-w-[calc(100%-52px)] formkit-inner"
                    >
                      <label
                        class="flex items-center -ml-0.5 mr-1.5 text-sm h-[1em] w-[1em] shrink-0 [&amp;>svg]:w-full text-zinc-600 dark:text-zinc-300 formkit-prefixIcon formkit-icon hidden"
                        for="input_0"
                        :aria-label="$t('search')"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 15 16"
                        ><path
                          d="M6.5,13.02c-1.41,0-2.82-.54-3.89-1.61-1.04-1.04-1.61-2.42-1.61-3.89s.57-2.85,1.61-3.89c2.14-2.14,5.63-2.14,7.78,0,1.04,1.04,1.61,2.42,1.61,3.89s-.57,2.85-1.61,3.89c-1.07,1.07-2.48,1.61-3.89,1.61Zm0-10c-1.15,0-2.3,.44-3.18,1.32-.85,.85-1.32,1.98-1.32,3.18s.47,2.33,1.32,3.18c1.75,1.75,4.61,1.75,6.36,0,.85-.85,1.32-1.98,1.32-3.18s-.47-2.33-1.32-3.18c-.88-.88-2.03-1.32-3.18-1.32Z"
                          fill="currentColor"
                        /><path
                          d="M13.5,15c-.13,0-.26-.05-.35-.15l-3.38-3.38c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l3.38,3.38c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z"
                          fill="currentColor"
                        /></svg>
                      </label>
                      <!-- Tooltip für exakte Suche -->
                      <span
                        class="relative ml-2 cursor-pointer select-none"
                        tabindex="0"
                        @mouseenter="showAlgoliaTooltip = true"
                        @mouseleave="showAlgoliaTooltip = false"
                        @focus="showAlgoliaTooltip = true"
                        @blur="showAlgoliaTooltip = false"
                      >
                        <span
                          class="text-neutral-500 dark:text-neutral-300 text-sm"
                          role="img"
                          aria-label="Info"
                        >
                          ⓘ
                        </span>
                        <span
                          v-if="showAlgoliaTooltip"
                          class="absolute top-full left-1/2 mt-2 -translate-x-1/2 z-10 w-64 p-2 text-sm leading-snug text-neutral-900 bg-white rounded-md shadow-lg dark:bg-zinc-800 dark:text-white"
                          role="tooltip"
                        >
                          {{ $t('exactSearchTip') }}
                        </span>
                      </span>

                      <input
                        type="search"
                        :aria-label="$t('search')"
                        class="appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 group-data-[disabled]:!cursor-not-allowed dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none p-0 focus:ring-0 formkit-input !text-lg p-2 !rounded-3xl"
                        :value="currentRefinement"
                        :placeholder="$t('searchplaceholder')"
                        @input="currentRefinement = $event.target.value"
                        @keyup.enter="refine(currentRefinement); searchQuery = currentRefinement ?? ''"
                      >
                      <span
                        id="search-loading"
                        :class="[!isSearchStalled ? 'hidden' : '','loading loading-spinner loading-sm']"
                      />
                      <!-- Reset button -->
                      <button
                        v-if="currentRefinement"
                        type="button"
                        class="btn"
                        :title="$t('resetQuery')"
                        :aria-label="$t('resetQuery')"

                        @click="
                          refine('');
                          currentRefinement = '';
                          searchQuery = '';
                        "
                      >
                        <Icon
                          class="p-2 text-xl my-auto dark:text-white"
                          name="mdi:clear-bold"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                    
                    <button
                      class="ais-SearchBox-submit btn btn-primary md:w-32 h-auto rounded-l-none !rounded-r-xl"
                      :title="$t('search')"
                      type="button"
                      @click="refine(currentRefinement); searchQuery = currentRefinement;"
                    >
                      <Icon
                        class="text-lg"
                        name="formkit:search"
                      />
                      <span class="sr-only">{{ $t('search') }}</span>
                    </button>
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
                  class="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 flex flex-col md:flex-row justify-between"
                  role="region"
                  :aria-label="$t('filteringsection')"
                >
                  <div class="w-full flex flex-col justify-center bg-white dark:bg-gray-800 rounded-lg p-2 border-2 border-base">
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
                  <div class="w-full flex flex-col justify-center border-base border-2 bg-white dark:bg-gray-800 rounded-lg p-2">
                    <FormKit
                      id="sort-select"
                      type="select"
                      name="sort"
                      :label="$t('sorting')"
                      :options="['Standard', 'Titel aufst.', 'Titel abst.']"
                      :disabled="true"
                      outer-class="!mb-0 flex items-center justify-center"
                      wrapper-class="!mb-0 mx-auto !rounded-lg !w-full"
                      input-class="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                  <div class="form-control w-full border-base border-2 flex flex-col justify-end bg-white dark:bg-gray-800 rounded-lg p-2">
                    <label 
                      class="label cursor-pointer text-sm w-64 mx-auto lg:ml-auto"
                      :aria-label="$t('toggleViewType')"
                    >
                      <Icon name="tabler:info-circle" class="text-gray-500 dark:text-gray-300" :title="$t('viewTypeCheckedWarning')" />
                      <span class="label-text text-gray-800 dark:text-gray-200">
                        {{ `${$t('accordionView')} / ${$t('flatView')}` }}&nbsp;
                      </span>
                      <input
                        v-model="viewTypeChecked"
                        type="checkbox"
                        class="toggle toggle-primary"
                      >
                    </label>
                    <label
                      v-if="!viewTypeChecked"
                      class="label cursor-pointer w-64 mx-auto lg:ml-auto hidden"
                      :aria-label="$t('toggleProductionDetails')"
                    >
                      <span class="label-text text-gray-800 dark:text-gray-200">
                        <LazyIcon
                          v-if="!productionDetailsChecked"
                          class="dark:text-white"
                          :title="$t('productionDetailsOn')"
                          name="mdi:list-box-outline"
                        />
                        <LazyIcon
                          v-else
                          class="dark:text-white"
                          :title="$t('productionDetailsOff')"
                          name="mdi:list-box" 
                        />
                    &nbsp;
                        <span v-if="!productionDetailsChecked">
                          {{ $t('productionDetailsOnShort') }}
                        </span>
                        <span v-else>
                          {{ $t('productionDetailsOffShort') }}
                        </span>
                      </span>
                      <input
                        v-model="productionDetailsChecked"
                        type="checkbox"
                        class="toggle toggle-primary"
                      >
                    </label>
                    <label
                      v-if="!viewTypeChecked"
                      class="label cursor-pointer w-64 mx-auto lg:ml-auto hidden"
                      :aria-label="$t('toggleExpandAll')"
                    >
                      <span class="label-text text-sm text-gray-800 dark:text-gray-200">
                        <LazyIcon
                          v-if="!expandAllChecked"
                          class="dark:text-white"
                          name="tabler:layout-navbar-expand"
                        />
                        <LazyIcon
                          v-else
                          class="dark:text-white"
                          name="tabler:layout-navbar-collapse"
                        />
                    &nbsp;
                        <span v-if="!expandAllChecked">
                          {{ $t('expandAll') }}
                        </span>
                        <span v-else>
                          {{ $t('collapseAll') }}
                        </span>
                      </span>
                      <input
                        v-model="expandAllChecked"
                        type="checkbox"
                        class="toggle toggle-primary"
                      >
                    </label>
                    <label
                    v-if="!viewTypeChecked"
                      class="label cursor-pointer text-sm w-64 mx-auto lg:ml-auto my-auto"
                      :aria-label="$t('toggleExpandAllHandles')"
                    >
                      <LazyIcon
                        v-if="!expandAllHandlesChecked"
                        class="dark:text-white"
                          name="tabler:layout-navbar-expand"
                      />
                      <LazyIcon
                        v-else
                        class="dark:text-white"
                        name="tabler:layout-navbar-collapse"
                      />
                    &nbsp;
                      <span v-if="!expandAllHandlesChecked">
                        {{ $t('expandAll') }}
                      </span>
                      <span v-else>
                        {{ $t('collapseAll') }}
                      </span>

                      <input
                        v-model="expandAllHandlesChecked"
                        type="checkbox"
                        class="toggle toggle-primary"
                      >
                    </label>
                  </div>
                  <div class="col-span-full border-base border-2 rounded-lg bg-base-100">
                    <div class="lg:col-span-full card p-2 flex flex-col md:flex-row justify-between w-full dark:bg-gray-800 rounded-lg">
                      <div class="w-full md:w-1/2 flex flex-row justify-start">
                        <h2 class="font-bold text-gray-800 dark:text-gray-200">
                          {{ $t('activefiltering') }}
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
                          'ais-CurrentRefinements-item': 'border border-neutral text-gray-700 dark:text-gray-200 dark:border-gray-600 w-full rounded-lg p-2 md:w-auto md:p-3 md:max-w-xs',
                          'ais-CurrentRefinements-delete': 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                          'ais-ClearRefinements-button': 'btn btn-error bg-red-500 hover:bg-red-600 text-white',
                        }"
                      >
                        <template #item="{ item, refine, createURL }">
                          <strong class="font-bold text-neutral dark:text-primary-100 ">
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
                  <LazyDetailPaginationComp class="col-span-full border-base border-2 rounded-lg" />
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
                        :currentRefinements="currentRefinements"
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

const {$toggleFacetDrawerState}:any = useNuxtApp();

// toggle top right 
const viewTypeChecked = ref(false);

const expandAllChecked = ref(false);

const expandAllHandlesChecked = ref(false);

const productionDetailsChecked = ref(true);

const expandedHandles = ref<Set<string>>(new Set());


const searchQuery = ref('');
import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi.ts';
// --- Algolia current refinements (active facets) ---
import { inject, computed } from 'vue';

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
    url: "/api/elastic/msearch",
    // Removed invalid property 'searchOnLoad'
});

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

import { history as defaultRouter } from 'instantsearch.js/es/lib/routers';
import { simple as defaultMapping } from 'instantsearch.js/es/lib/stateMappings';
import { expand } from '@formkit/icons';

const showAlgoliaTooltip = ref(false);
const routerInstance = defaultRouter();


const stateMapping = {
    stateToRoute(uiState) {
        const indexUiState = uiState[props.indexName] || {};
        const numericRefinements = indexUiState.numericRefinements || {};
        const prodYearsOnlyFlag = indexUiState.prodYearsOnly === true ? '1' : undefined;

        // Only serialize numeric refinements if not empty
        const hasNumeric = Object.keys(numericRefinements).length > 0;

        return {
            [`${props.indexName}[query]`]: indexUiState.query || '',
            ...(hasNumeric ? { [`${props.indexName}[numericRefinement]`]: numericRefinements } : {}),
            ...(prodYearsOnlyFlag ? { [`${props.indexName}[prodYearsOnly]`]: prodYearsOnlyFlag } : {}),
        };
    },

    routeToState(routeState) {
        const numericRefinements = routeState[`${props.indexName}[numericRefinement]`] || {};
        const prodYearsOnlyFlag = routeState[`${props.indexName}[prodYearsOnly]`] === '1';

        return {
            [props.indexName]: {
                query: routeState[`${props.indexName}[query]`] || '',
                numericRefinements,
                prodYearsOnly: prodYearsOnlyFlag,
            },
        };
    },
};


routerInstance.write = (routeState) => {
    try {
        console.log('Router write:', routeState);
        // Check if the route state is empty
        if (Object.keys(routeState).length === 0) {
            console.error('Route state is empty, not saving to localStorage.');
            return;
        }

        if (!routeState[useRuntimeConfig().public.ELASTIC_INDEX].query) {
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