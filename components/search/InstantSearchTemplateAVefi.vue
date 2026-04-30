<template>
    <div>
        <div class="container rounded-lg border border-base-200 bg-white dark:bg-base-200 p-2 py-6 lg:px-4">
            <ais-instant-search :search-client="effectiveSearchClient" :index-name="indexName" :show-loading-indicator="true"
                                :routing="extendedRouting" :insights="false" :future="{preserveSharedStateOnUnmount: true }">
                <ais-configure :hits-per-page.camel="20" />
                <ais-clear-refinements ref="clearRefinementsRef" style="display:none" />
                <h1 class="text-lg font-bold xl:text-xl dark:text-white max-w-32 text-left ml-2" tabindex="0">
                    {{ $t('filmresearch') }}
                </h1>
                <div class="divider" />
                <div class="search-panel" role="region" :aria-label="$t('searchpanel')">
                    <ClientOnly>
                        <GlobalFacetDrawer :view-type-checked="viewTypeChecked" :is-search-loading="isSearchLoading" />
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
                                                <SearchQueryAutocomplete ref="queryAutocompleteRef" v-model="localSearchValue" name="search"
                                                                         :placeholder="$t('searchplaceholder')" :clear-title="$t('resetQuery')"
                                                                         :show-info-tooltip="true" :info-tooltip-text="$t('exactSearchTip')" :enforce-list="false"
                                                                         :recent-searches="recentSearchesWithUrl" :autofocus="true" class="flex-1"
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
                            <div
                                v-if="searchBackendError"
                                class="alert alert-error mb-3 text-left"
                                role="alert"
                                aria-live="assertive"
                            >
                                <Icon name="tabler:alert-triangle" aria-hidden="true" />
                                <span>{{ $t('searchBackendError') }}</span>
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
                                                        <div class="stat-value">{{ getDisplayedWorksCount(results?._rawResults[0], nbHits) }}</div>
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
                                                <button
                                                    type="button"
                                                    class="btn btn-outline btn-sm border-neutral text-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    @click="handleClearAllRefinements"
                                                    :aria-label="$t('clearallfilters')"
                                                >
                                                    <Icon name="formkit:trash" /> <span class="accent">{{ $t('clearallfilters') }}</span>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="w-full bg-white dark:bg-gray-800 rounded-t-none rounded-b-lg p-2" role="list"
                                             aria-labelledby="active-facets-heading">
                                            <ais-current-refinements :class-names="{
                                                'ais-CurrentRefinements-list': 'flex flex-row flex-wrap gap-2',
                                                'ais-CurrentRefinements-item': 'border border-base-200 text-gray-700 dark:text-gray-200 dark:border-gray-600 w-full rounded-lg p-1 md:w-auto md:max-w-xs',
                                                'ais-CurrentRefinements-delete': 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                                                'ais-ClearRefinements-button': 'btn hover:bg-red-600 text-white',
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
                                                                   @click.prevent="handleCurrentRefinementRemove(refine, refinement)">
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
                                            <div v-if="hasProductionYearRefinement && productionYearLabel" class="flex flex-row flex-wrap gap-2 mt-2">
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

                                    <LazyDetailPaginationComp
                                        class="col-span-full md:col-span-3 border-base-200 border-2 rounded-lg"
                                        :is-search-loading="isSearchLoading"
                                    />
                                </div>
                                <div class="flex w-full flex-col">
                                    <div class="divider divider-base-300 w-full">
                                        <span class="text-xs" v-if="searchQuery">
                                            {{ $t('searchResultsFor', { query: searchQuery }) }}
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
                                <LazyDetailPaginationComp :is-search-loading="isSearchLoading" />
                            </div>
                        </div>
                    </div>
                </div>
            </ais-instant-search>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SEARCH_REFINEMENT_COORDINATOR_KEY, type SearchRefinementAction } from '~/composables/searchRefinementCoordinator';
import { useMatomoTracking } from '~/composables/useMatomoTracking';
import { getDisplayedWorksCount } from '~/utils/searchResultCounts';
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

const {
    trackSearchSubmitted,
    trackFacetUsed,
    trackEvent,
    trackResultViewChanged,
} = useMatomoTracking();

const preservedSliderParams = ref<Record<string, string | string[]>>({});


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
    if (forceHideProductionYearChip.value) return false;

    const { from, to } = getProductionYearRefinement();
    return from !== undefined || to !== undefined;
});

const productionYearLabel = computed(() => {
    if (forceHideProductionYearChip.value) return '';

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

const isClearingAllRefinements = ref(false);
const clearRefinementsRef = ref<any>(null);

function triggerInstantSearchRequest() {
    const runDeferred = (operation: () => void) => {
        if (typeof window !== 'undefined') {
            window.setTimeout(operation, 0);
            return;
        }

        setTimeout(operation, 0);
    };

    // Run after the current refinement operation has fully propagated.
    if (instantSearchInstance?.scheduleSearch) {
        runDeferred(() => {
            instantSearchInstance.scheduleSearch();
        });
        return;
    }

    const helper = instantSearchInstance?.helper || instantSearchInstance?.mainHelper;
    if (helper?.search) {
        runDeferred(() => {
            helper.search();
        });
        return;
    }

    if (instantSearchInstance?.setUiState && instantSearchInstance?.uiState) {
        try {
            instantSearchInstance.setUiState({ ...instantSearchInstance.uiState });
            return;
        } catch {
            // fall through to refresh
        }
    }

    if (instantSearchInstance?.refresh) {
        instantSearchInstance.refresh();
    }
}

function notifyRefinementAction(action: SearchRefinementAction, triggerSearch = true) {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('avefi:search-refinement-action', {
            detail: {
                action,
                timestamp: Date.now(),
            },
        }));
    }

    if (triggerSearch) {
        triggerInstantSearchRequest();
    }
}

function runRefinementAction(action: SearchRefinementAction, operation: () => void) {
    operation();
    notifyRefinementAction(action, true);
}

provide(SEARCH_REFINEMENT_COORDINATOR_KEY, {
    runRefinementAction,
    notifyRefinementAction,
});

function handleCurrentRefinementRemove(refine: (refinement: unknown) => void, refinement: unknown) {
    runRefinementAction('current-refinement-remove', () => {
        refine(refinement);
    });
}

async function clearProductionYearRefinement() {
    forceHideProductionYearChip.value = true;

    const updatedQuery: Record<string, any> = { ...route.query };

    delete updatedQuery['numericRefinement[production_in_year][>=]'];
    delete updatedQuery['numericRefinement[production_in_year][<=]'];
    delete updatedQuery['numericRefinement[prodYearsOnly][=]'];
    delete updatedQuery['range_production_in_year'];

    const nextPreserved = { ...preservedSliderParams.value };
    delete nextPreserved['numericRefinement[production_in_year][>=]'];
    delete nextPreserved['numericRefinement[production_in_year][<=]'];
    delete nextPreserved['numericRefinement[prodYearsOnly][=]'];
    preservedSliderParams.value = nextPreserved;

    if (aisState?.uiState?.[props.indexName]) {
        const indexUiState = { ...aisState.uiState[props.indexName] };

        if (indexUiState.numericRefinements) {
            const numericRefinements = { ...indexUiState.numericRefinements };
            delete numericRefinements.production_in_year;
            delete numericRefinements.prodYearsOnly;
            indexUiState.numericRefinements = numericRefinements;
        }

        if (indexUiState.range) {
            const range = { ...indexUiState.range };
            delete range.production_in_year;
            indexUiState.range = range;
        }

        aisState.uiState[props.indexName] = indexUiState;
    }

    trackEvent('Facet', 'Production Year Cleared');

    await router.replace({
        path: route.path,
        query: updatedQuery,
    });

    await nextTick();

    if (process.client) {
        window.dispatchEvent(new CustomEvent('avefi:clear-production-year'));
    }

    notifyRefinementAction('clear-production-year', true);
}

async function handleClearAllRefinements() {
    isClearingAllRefinements.value = true;

    try {
        trackEvent('Facets', 'Clear All Clicked');

        if (hasProductionYearRefinement.value) {
            await clearProductionYearRefinement();
        }

        await nextTick();

        const nextQuery: Record<string, unknown> = {};
        if (route.query?.query !== undefined) {
            nextQuery.query = route.query.query;
        }

        await router.replace({
            path: route.path,
            query: nextQuery,
        });

        const clearBtn = clearRefinementsRef.value?.$el?.querySelector('button');
        if (clearBtn instanceof HTMLElement) {
            clearBtn.click();
        }

        if (instantSearchInstance?.setUiState) {
            const rawQuery = Array.isArray(nextQuery.query) ? nextQuery.query[0] : nextQuery.query;
            const nextIndexState = rawQuery ? { query: String(rawQuery) } : {};
            instantSearchInstance.setUiState({
                [props.indexName]: nextIndexState,
            });
        }

        await nextTick();
        notifyRefinementAction('clear-all-refinements', true);
    } finally {
        isClearingAllRefinements.value = false;
    }
}

import { ref, computed, inject, watch, onMounted, onBeforeUnmount, provide } from 'vue';
import { history as defaultRouter } from 'instantsearch.js/es/lib/routers';

const {$toggleFacetDrawerState, $toast}:any = useNuxtApp();

const props = defineProps({
    searchClient: {
        type: Object,
        required: true,
    },
    indexName: {
        type: String,
        required: true,
        default: useRuntimeConfig().public.ELASTIC_INDEX,
    },
});

// toggle top right 
const VIEW_TYPE_KEY = 'avefi-search-viewTypeChecked';
const viewTypeChecked = ref<'accordion' | 'flat' | 'table'>('accordion');

const hasInitializedViewType = ref(false);

import { nextTick } from 'vue';

const isRestoringViewType = ref(true);

onMounted(async () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(VIEW_TYPE_KEY);
        if (stored === 'accordion' || stored === 'flat' || stored === 'table') {
            viewTypeChecked.value = stored as typeof viewTypeChecked.value;
        }
    }

    await nextTick();
    isRestoringViewType.value = false;
});

watch(viewTypeChecked, (newValue) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(VIEW_TYPE_KEY, newValue);
    }

    if (isRestoringViewType.value) return;

    trackResultViewChanged(newValue);
});

const forceHideProductionYearChip = ref(false);

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
const queryAutocompleteRef = ref<{ focusInput?: () => void } | null>(null);

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

    localSearchValue.value = queryParam || '';
    searchQuery.value = queryParam || '';
};

// Use <ais-state-results> to access the raw search response
// Example usage in template:
// <ais-state-results v-slot="{ results }">
//   <pre>{{ results }}</pre>
// </ais-state-results>

// Load recent searches on mount
const handleClickOutside = (event: MouseEvent) => {
    const searchbox = document.querySelector('.searchbox');
    if (searchbox && !searchbox.contains(event.target as Node)) {
        showRecentSearches.value = false;
    }
};

const handlePopState = () => {
    syncSearchValueFromUrl();
};

const updateFromStorage = () => {
    syncSearchValueFromUrl();
};

onMounted(() => {
    syncSearchValueFromUrl();
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', updateFromStorage);

    nextTick(() => {
        setTimeout(() => {
            queryAutocompleteRef.value?.focusInput?.();
        }, 80);
    });
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('storage', updateFromStorage);
});

// URL updates are now handled by InstantSearch router
// No need for manual window.history manipulation

// Search handlers
const handleSearchSubmit = (value: string, refine: (value: string) => void) => {
    const trimmed = value?.trim() || '';

    if (trimmed !== '') {
        const searchUrl = `?query=${encodeURIComponent(trimmed)}`;
        addToSearchHistory(trimmed, searchUrl);
        historyTrigger.value++;

        trackSearchSubmitted('main_search');
        trackEvent('Search', 'Query Length', String(trimmed.length));
    }

    refine(value);
    searchQuery.value = value;
    showRecentSearches.value = false;
};

const handleSearchClear = (refine: (value: string) => void) => {
    refine('');
    searchQuery.value = '';
    localSearchValue.value = '';

    trackEvent('Search', 'Cleared');
};

const handleRecentSearchClick = (item: any) => {
    trackEvent('Search History', 'Recent Search Clicked');

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
const searchMenuRef = ref<HTMLElement | null>(null);

const toggleForm = (e?: Event, initialMessage = '') => {
    if (e) e.stopPropagation();
    if (typeof window === 'undefined') return;

    window.dispatchEvent(
        new CustomEvent('open-contact-drawer', {
            detail: { initialMessage }
        })
    );
};

const toggleSearchMenu = (e?: Event) => {
    if (e) e.stopPropagation();
    searchMenuOpen.value = !searchMenuOpen.value;
};

function shareSearch() {
    searchMenuOpen.value = false;
    const q = searchQuery.value || localSearchValue.value || '';
    const url = typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${window.location.search}`
        : '';

    trackEvent('Search', 'Share Clicked');

    if (typeof navigator !== 'undefined' && (navigator as any).share) {
        try {
            (navigator as any).share({
                title: q || document.title,
                text: q ? `Search: ${q}` : document.title,
                url
            });

            trackEvent('Search', 'Shared Native');
            return;
        } catch (err) {
            console.warn('Web Share failed:', err);
            trackEvent('Search', 'Share Failed');
        }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
            $toast?.success?.($t('linkCopied') as string || 'Link copied to clipboard');
            trackEvent('Search', 'Share Link Copied');
        }).catch(() => {
            window.prompt($t('copyLinkPrompt') as string || 'Copy this link', url);
            trackEvent('Search', 'Share Prompt Fallback');
        });
    } else {
        try {
            window.prompt($t('copyLinkPrompt') as string || 'Copy this link', url);
            trackEvent('Search', 'Share Prompt Fallback');
        } catch (e) {
            console.warn('Unable to copy link', e);
        }
    }
}

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

function suggestSearch() {
    searchMenuOpen.value = false;

    const q = searchQuery.value || localSearchValue.value || '';
    const url = typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}${window.location.search}`
        : '';

    const initialMessage = $t('share.suggestTemplate', { query: q, url }) as string;

    window.dispatchEvent(
        new CustomEvent('open-contact-drawer', {
            detail: { initialMessage }
        })
    );

    trackEvent('Search', 'Suggest Search Opened');
}


// Close menus on outside click
const onDocClickForMenu = (ev: MouseEvent) => {
    if (!searchMenuRef.value) return;
    if (!searchMenuRef.value.contains(ev.target as Node)) {
        searchMenuOpen.value = false;
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
    return refinements;
});

watch(
    () => route.query,
    (query) => {
        const hasProdYearInRoute =
            query['numericRefinement[production_in_year][>=]'] !== undefined ||
            query['numericRefinement[production_in_year][<=]'] !== undefined ||
            query['numericRefinement[prodYearsOnly][=]'] !== undefined ||
            query['range_production_in_year'] !== undefined;

        if (!hasProdYearInRoute) {
            forceHideProductionYearChip.value = false;
        }
    },
    { deep: true, immediate: true }
);

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

function mapFacetAttributeForBackend(attribute: string) {
    return attribute;
}

function mapFacetAttributeForUi(attribute: string) {
    return attribute;
}

function mapFacetFilterForBackend(filter: unknown): unknown {
    if (Array.isArray(filter)) {
        return filter.map(mapFacetFilterForBackend);
    }

    if (typeof filter !== 'string') {
        return filter;
    }

    const separatorIndex = filter.indexOf(':');
    if (separatorIndex === -1) {
        return filter;
    }

    const attribute = filter.slice(0, separatorIndex);
    return `${mapFacetAttributeForBackend(attribute)}${filter.slice(separatorIndex)}`;
}

function mapFacetsForBackend(facets: unknown): unknown {
    if (Array.isArray(facets)) {
        return facets.map((facet) => typeof facet === 'string' ? mapFacetAttributeForBackend(facet) : facet);
    }

    if (typeof facets === 'string') {
        return mapFacetAttributeForBackend(facets);
    }

    return facets;
}

function mapRenderingContentForUi(renderingContent: any) {
    const facetOrdering = renderingContent?.facetOrdering;
    if (!facetOrdering) {
        return renderingContent;
    }

    const nextFacetOrdering = {
        ...facetOrdering,
        facets: facetOrdering.facets
            ? {
                ...facetOrdering.facets,
                order: Array.isArray(facetOrdering.facets.order)
                    ? facetOrdering.facets.order.map(mapFacetAttributeForUi)
                    : facetOrdering.facets.order,
            }
            : facetOrdering.facets,
        values: facetOrdering.values
            ? Object.fromEntries(
                Object.entries(facetOrdering.values).map(([key, value]) => [mapFacetAttributeForUi(key), value])
            )
            : facetOrdering.values,
    };

    return {
        ...renderingContent,
        facetOrdering: nextFacetOrdering,
    };
}

function mapSearchResponseForUi(response: any) {
    if (!response || !Array.isArray(response.results)) {
        return response;
    }

    return {
        ...response,
        results: response.results.map((result: any) => {
            const facets = result?.facets && typeof result.facets === 'object'
                ? { ...result.facets }
                : result?.facets;

            return {
                ...result,
                facets,
                renderingContent: mapRenderingContentForUi(result?.renderingContent),
            };
        }),
    };
}

function normalizeEmptySearchQuery(params: Record<string, any>) {
    if (!Object.prototype.hasOwnProperty.call(params, 'query')) {
        return params;
    }

    const rawQuery = params.query;
    const normalizedQuery = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery;

    if (normalizedQuery === undefined || normalizedQuery === null || String(normalizedQuery).trim() === '') {
        delete params.query;
        return params;
    }

    params.query = String(normalizedQuery);
    return params;
}

function createEmptySearchResult(request: any) {
    const params = request?.params || {};
    const page = Number(params.page ?? 0);
    const hitsPerPage = Number(params.hitsPerPage ?? 20);

    return {
        hits: [],
        nbHits: 0,
        nbSortedHits: 0,
        nbPages: 0,
        page: Number.isFinite(page) ? page : 0,
        hitsPerPage: Number.isFinite(hitsPerPage) ? hitsPerPage : 20,
        processingTimeMS: 0,
        exhaustiveNbHits: true,
        exhaustiveFacetsCount: true,
        query: params.query || '',
        params: '',
        facets: {},
        renderingContent: {
            facetOrdering: {
                facets: { order: [] },
                values: {},
            },
        },
        nbManifestations: 0,
        nbItems: 0,
    };
}

function createFallbackSearchResponse(requests: any[]) {
    return {
        results: requests.map(createEmptySearchResult),
    };
}

function isValidSearchResponse(response: any) {
    return response && Array.isArray(response.results);
}

const searchBackendError = ref(false);

function emitSearchUpdated(ok: boolean, requestCount: number) {
    if (!process.client) return;

    window.dispatchEvent(new CustomEvent('avefi:search-updated', {
        detail: {
            ok,
            requestCount,
            timestamp: Date.now(),
        },
    }));
}

const effectiveSearchClient = {
    ...props.searchClient,

    async search(requests: any[]) {
        const rewrittenRequests = requests.map((request) => {
            const params = { ...(request.params || {}) };
            normalizeEmptySearchQuery(params);

            if (params.facetFilters) {
                params.facetFilters = mapFacetFilterForBackend(params.facetFilters);
            }

            if (params.facets) {
                params.facets = mapFacetsForBackend(params.facets);
            }

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

        try {
            const response = await (props.searchClient as any).search(rewrittenRequests);

            if (!isValidSearchResponse(response)) {
                console.error('[search] Backend returned an invalid search response', response);
                searchBackendError.value = true;
                emitSearchUpdated(false, rewrittenRequests.length);
                return createFallbackSearchResponse(rewrittenRequests);
            }

            searchBackendError.value = false;
            emitSearchUpdated(true, rewrittenRequests.length);
            return mapSearchResponseForUi(response);
        } catch (error) {
            console.error('[search] Backend search request failed', error);
            searchBackendError.value = true;
            emitSearchUpdated(false, rewrittenRequests.length);
            return createFallbackSearchResponse(rewrittenRequests);
        }
    },
};

watch(expandAllChecked, () => {
    expandAllItems();
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

const instantSearchInstance = inject<any>('$_ais_instantSearchInstance', null);
const isSearchLoading = ref(false);

let statusPollId: number | null = null;

const syncSearchLoading = () => {
    const status = instantSearchInstance?.status;
    isSearchLoading.value = status === 'loading' || status === 'stalled';
};

onMounted(() => {
    syncSearchLoading();

    if (instantSearchInstance?.addListener) {
        instantSearchInstance.addListener('render', syncSearchLoading);
        instantSearchInstance.addListener('error', syncSearchLoading);
    }

    statusPollId = window.setInterval(syncSearchLoading, 120);
});

onBeforeUnmount(() => {
    if (instantSearchInstance?.removeListener) {
        instantSearchInstance.removeListener('render', syncSearchLoading);
        instantSearchInstance.removeListener('error', syncSearchLoading);
    }

    if (statusPollId !== null) {
        clearInterval(statusPollId);
        statusPollId = null;
    }
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

// Central sync point: InstantSearch's defaultRouter calls window.history.pushState/
// replaceState directly, which bypasses Vue Router and leaves route.query stale.
// Patching write() here ensures every IS-driven URL change (facet click, clear all,
// pagination, …) automatically keeps Vue Router in sync — no per-callsite workarounds.
if (routerInstance) {
    const _origWrite = routerInstance.write.bind(routerInstance);
    routerInstance.write = (routeState: any) => {
        _origWrite(routeState);
        const href = window.location.href.replace(window.location.origin, '');
        router.replace(href).catch(() => { /* ignore same-location errors */ });
    };
}

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

            if (indexUiState.numericRefinements) {
                Object.entries(indexUiState.numericRefinements).forEach(([attr, ops]) => {
                    Object.entries(ops as Record<string, any>).forEach(([op, val]) => {
                        const normalized = Array.isArray(val) ? val[0] : val;

                        if (normalized !== undefined && normalized !== null && normalized !== '') {
                            route[`numericRefinement[${attr}][${op}]`] = normalized;
                        }
                    });
                });
            }

            if (indexUiState.range?.production_in_year) {
                const rawRange = String(indexUiState.range.production_in_year);
                const [from, to] = rawRange.split(':');

                if (from !== undefined && from !== '') {
                    route['numericRefinement[production_in_year][>=]'] = from;
                }

                if (to !== undefined && to !== '') {
                    route['numericRefinement[production_in_year][<=]'] = to;
                }
            }

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
            const rawQuery = Array.isArray(routeState?.query) ? routeState.query[0] : routeState?.query;
            const normalizedQuery = rawQuery === undefined || rawQuery === null ? '' : String(rawQuery).trim();

            uiState[props.indexName] = {};

            if (normalizedQuery) {
                uiState[props.indexName].query = normalizedQuery;
            }

            const refinementList: any = {};
            Object.keys(routeState || {}).forEach(key => {
                if (
                    key !== 'query' &&
                    key !== 'numericRefinement' &&
                    !key.startsWith('numericRefinement[') &&
                    key !== 'page' &&
                    !key.startsWith('range_')

                ) {
                    const refinementKey = key;
                    const value = routeState[key];

                    if (Array.isArray(value)) {
                        refinementList[refinementKey] = value;
                    } else if (value !== undefined && value !== null) {
                        refinementList[refinementKey] = [value];
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

watch(
    () => route.query,
    (newQuery, oldQuery) => {
        syncPreservedSliderParamsFromRoute();

        if (isClearingAllRefinements.value) return;
        if (!oldQuery) return;

        const changedKeys = new Set([
            ...Object.keys(newQuery || {}),
            ...Object.keys(oldQuery || {})
        ]);

        for (const key of changedKeys) {
            const newVal = (newQuery as any)?.[key];
            const oldVal = (oldQuery as any)?.[key];

            if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
                if (
                    key !== 'query' &&
                    key !== 'page' &&
                    key !== 'numericRefinement' &&
                    (!key.startsWith('range_') || key === 'range_production_in_year')
                ) {
                    trackFacetUsed(key);
                }
            }
        }
    },
    { deep: true, immediate: true }
);

onMounted(() => {
    syncPreservedSliderParamsFromRoute();
});

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
