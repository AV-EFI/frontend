<template>
    <div class="w-full xs:max-w-xs md:w-full lg:max-w-4xl mx-auto p-4 backdrop-blur-sm rounded-lg" role="search"
        :aria-label="$t('mainSearch')">
        <ClientOnly>
            <template v-if="searchDataStore && searchDataStore.formData">
                <span id="search-input-label" class="sr-only">
                    {{ $t('mainSearch') }}
                </span>

                <FormKit id="searchComp" v-model="searchDataStore.formData" type="form" :actions="false"
                    name="searchComp" role="search" :aria-label="$t('searchForm')" @submit="redirectToSearchScreen">
                    <!-- Query input + submit -->
                    <div class="flex w-full mx-auto mb-4 relative" role="group" :aria-labelledby="'search-input-label'">
                        <div class="flex-grow relative">
                            <SearchQueryAutocomplete ref="qaRef" v-model="searchTerm" name="search"
                                :placeholder="$t('searchplaceholder')" :aria-label="ariaLabel" :icon-map="iconMap"
                                :help-text="$t('exactSearchTip')" :dropdown-aria-label="$t('showSuggestions')"
                                :no-results-text="$t('noSuggestionsFound')" :recent-searches="recentSearchesWithUrl"
                                :autofocus="false" @submit="onSubmit" @clear="searchTerm = ''" @select="onMainSelect"
                                @recent-search-click="handleRecentSearchClick" @remove-recent="handleRemoveRecentSearch"
                                @clear-history="handleClearAllHistory" @keydown.enter="redirectToSearchScreen" />
                        </div>

                        <!-- Separate, stylable submit button -->
                        <div class="ml-0">
                            <button type="submit"
                                class="!rounded-l-none !rounded-r-xl flex btn btn-primary lg:btn-lg h-[56px]"
                                :class="{'btn-disabled opacity-50 cursor-not-allowed': !canSubmit}"
                                :aria-label="$t('submitSearch')" @click="handleClick">
                                {{ buttonText }}
                            </button>
                        </div>
                    </div>

                    <!-- Advanced Facets -->
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div class="mb-4">
                            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {{ $t('advancedSearch') || 'Advanced Search' }}
                            </h3>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(filter, index) in facetFilters" :key="filter.uid"
                                class="flex-col lg:flex-row flex items-start lg:gap-1 p-1 lg:p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <!-- Facet icon (reflects currently selected facet) -->
                                <div class="flex flex-row items-center gap-2 mb-2 lg:mb-0">
                                    <span v-if="facetMeta(filter.facet)?.icon"
                                        class="inline-flex items-center justify-center size-8 rounded-md bg-base-100 border border-base-300 dark:bg-gray-900 dark:border-slate-700"
                                        :title="facetMeta(filter.facet)?.label || filter.facet" aria-hidden="true">
                                        <Icon :name="facetMeta(filter.facet)?.icon" size="18" />
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center justify-center size-8 rounded-md bg-base-100 border border-base-300 dark:bg-gray-900 dark:border-slate-700"
                                        :title="$t('selectFacet')" aria-hidden="true">
                                        <Icon name="tabler:tag" size="18" />
                                    </span>
                                </div>

                                <!-- Facet select -->
                                <FormKit v-model="filter.facet" type="select"
                                    :placeholder="$t('selectFacet') || 'Select Facet'"
                                    :options="availableFacetsFiltered" outer-class="flex-[0.9]"
                                    inner-class="dark:!bg-gray-950 dark:!text-white" @input="onFacetChange(index)" />

                                <!-- Value input + dropdown -->
                                <div class="flex-1 relative" @mousedown.stop>
                                    <div class="flex justify-items-start items-start gap-2">
                                        <!-- We bind to valueDisplay for UI, and keep valueRaw separately -->
                                        <FormKit :model-value="filter.valueDisplay" type="text"
                                            :placeholder="$t('enterValue') || 'Enter Value'" outer-class="w-full"
                                            inner-class="dark:!bg-gray-950 dark:!text-white" :disabled="!filter.facet"
                                            autocomplete="off" :aria-autocomplete="'list'" :aria-haspopup="'listbox'"
                                            :aria-expanded="filter.showSuggestions ? 'true' : 'false'"
                                            :aria-activedescendant="filter.highlighted >= 0 ? `facet-sugg-${filter.uid}-${filter.highlighted}` : undefined"
                                            @input="onValueInput(index, $event)" @focus="onValueFocus(index)"
                                            @blur="onValueBlur(index)" @keydown="onFacetKeydown($event, index)" />
                                        <button type="button"
                                            class="h-8 px-2 py-1 mt-0 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
                                            :aria-label="$t('showSuggestions')" :disabled="!filter.facet"
                                            @mousedown.prevent.stop="onFacetDropdownClick(index)">
                                            <Icon name="tabler:chevron-down" size="16" />
                                        </button>
                                    </div>

                                    <!-- Suggestions -->
                                    <div v-if="filter.showSuggestions && filter.suggestions.length"
                                        class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
                                        role="listbox" @mousedown.stop>
                                        <div v-for="(s, si) in filter.suggestions.slice(0, 10)"
                                            :id="`facet-sugg-${filter.uid}-${si}`"
                                            :key="`facet-sugg-${filter.uid}-${si}-${s.raw}`" :class="[
                        'px-3 py-2 cursor-pointer text-sm flex items-center gap-2',
                        filter.highlighted === si 
                          ? 'bg-blue-100 dark:bg-blue-900/40' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      ]" role="option" :aria-selected="filter.highlighted === si"
                                            @mousedown.prevent.stop="selectSuggestion(index, s)">
                                            <!-- Show translated display text, keep raw in state -->
                                            <span class="flex-grow">{{ s.display }}</span>
                                            <span v-if="s.count && s.count > 1"
                                                class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                                                ({{ s.count }})
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-full lg:w-auto flex justify-end lg:justify-start">
                                    <button type="button" class="btn btn-outline btn-error p-2"
                                        :aria-label="$t('remove') || 'Remove'" @click="removeFacetFilter(index)">
                                        <Icon name="tabler:x" size="20" />
                                    </button>
                                </div>
                            </div>

                            <button type="button"
                                class="flex items-center gap-2 px-4 py-2 text-sm text-primary dark:text-white border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                @click="addFacetFilter">
                                <Icon name="tabler:plus" size="16" />
                                {{ $t('addFacet') || 'Add Facet' }}
                            </button>
                        </div>
                    </div>

                    <p v-if="showValidationWarning" role="alert" aria-live="assertive"
                        class="slide-down text-center text-error-800 dark:text-error-200 bg-white dark:bg-gray-800 text-xs mt-2 p-2 rounded-lg">
                        {{ $t('enterSearchTermFirst') }}
                    </p>
                </FormKit>
            </template>

            <template v-else>
                <div class="text-center text-gray-500 dark:text-gray-400 p-4">
                    {{ $t('loadingSearch') || 'Loading search...' }}
                </div>
            </template>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { useSearchParamsStore } from '~/stores/searchParams.js';
import { config } from '~/searchConfig_avefi.js';
import { FACET_ICON_MAP } from '~/models/interfaces/manual/IFacetIconMapping.js';
import { useFormKitLoader } from '~/composables/useFormKitLoader';

const { ensureFormKitReady } = useFormKitLoader();

await ensureFormKitReady();

const iconMap = FACET_ICON_MAP;

const { t, locale } = useI18n();

const showValidationWarning = ref(false);
const searchDataStore = useSearchParamsStore();

// Search history
const { addToSearchHistory, getSearchHistory, removeFromHistory, clearSearchHistory } = useSearchHistory();
const historyTrigger = ref(0);
const recentSearchesWithUrl = computed(() => {
    historyTrigger.value; // Make reactive
    return getSearchHistory();
});

// Ensure nested branch exists
if (!searchDataStore.formData.regularSearch) {
    searchDataStore.formData.regularSearch = { searchTerm: '', optionsList: [] };
}

const searchTerm = computed<string>({
    get: () => searchDataStore.formData.regularSearch?.searchTerm ?? '',
    set: (v: string) => {
        if (!searchDataStore.formData.regularSearch) {
            searchDataStore.formData.regularSearch = { searchTerm: '', optionsList: [] };
        }
        searchDataStore.formData.regularSearch.searchTerm = v ?? '';
    }
});

// --- Submit enabled if a term OR any filled facet (raw) ---
const canSubmit = computed(() =>
    (searchTerm.value?.trim()?.length ?? 0) > 0 ||
  facetFilters.value.some(f => f.facet && (f.valueRaw?.toString()?.trim()?.length ?? 0) > 0)
);

// --- Button text changes based on search term ---
const buttonText = computed(() => 
    searchTerm.value?.trim() ? t('Search') : t('showEntireCollection')
);

// ---------------------- Facets meta & options ----------------------
interface FacetOption { label: string; value: string; icon?: string }
const FACET_BLACKLIST: string[] = [
    'production_year_start',
    'has_duration_has_value',
    'production_year_end',
    'has_extent',
    'has_extent_has_value',
    'item_duration_in_minutes',
    'has_access_status',
    'manifestation_event_type',
];

const availableFacets = computed<FacetOption[]>(() => {
    try {
        if (!config?.search_settings?.facet_attributes) return [];
        return config.search_settings.facet_attributes.map((f: any) => {
            const attribute = f.attribute || f;
            const facetIcon = FACET_ICON_MAP[attribute] || 'tabler:tag';
            const label = `${t(attribute)}`;
            return { label, value: attribute, icon: facetIcon };
        });
    } catch {
        return [];
    }
});

const availableFacetsFiltered = computed<FacetOption[]>(() =>
    availableFacets.value.filter(opt => !FACET_BLACKLIST.includes(opt.value))
);

function facetMeta(value?: string | null) {
    if (!value) return null;
    return availableFacets.value.find(v => v.value === value) || null;
}

// ---------------------- Facet row model ----------------------
interface FacetSuggestion {
  raw: string
  display: string
  count?: number
}
interface FacetFilter {
  uid: string
  facet: string
  valueRaw: string
  valueDisplay: string
  suggestions: FacetSuggestion[]
  showSuggestions: boolean
  highlighted: number
  // runtime helpers
  _abort?: AbortController | null
  _debounce?: ReturnType<typeof setTimeout> | null
}

const facetFilters = ref<FacetFilter[]>([]);

onMounted(() => {
    try { addFacetFilter(); } catch (error) { console.error('init facets failed:', error); }
});

function newFacetRow(): FacetFilter {
    return {
        uid: crypto.randomUUID(),
        facet: '',
        valueRaw: '',
        valueDisplay: '',
        suggestions: [],
        showSuggestions: false,
        highlighted: -1,
        _abort: null,
        _debounce: null
    };
}

function addFacetFilter() {
    facetFilters.value.push(newFacetRow());
}
function removeFacetFilter(index: number) {
    const row = facetFilters.value[index];
    if (row?._abort) row._abort.abort();
    if (row?._debounce) clearTimeout(row._debounce);
    facetFilters.value.splice(index, 1);
}

// ---------------------- Translations for values ----------------------
/** Translate a raw suggestion text for display (fallback to raw). */
function translateValue(attr: string, raw: string): string {
    // convention: keys like `facetValue.{attr}.{raw}`
    // or fall back to a direct `t(raw)` if you already have message keys matching raw values.
    const keyConvention = `facetValue.${attr}.${raw}`;
    const translated = t(keyConvention);
    if (translated !== keyConvention) return translated;
    // Try direct
    const direct = t(raw);
    if (direct !== raw) return direct;
    return raw;
}

// ---------------------- Suggestions (debounced + abortable) ----------------------
/** Per-row cache (attr -> suggestions with count) */
const facetCache: Record<string, FacetSuggestion[]> = {};

async function fetchFacetSuggestions(rowIndex: number, attr: string, query = '') {
    // cancel previous in-flight
    const row = facetFilters.value[rowIndex];
    if (!row) return;

    if (row._abort) row._abort.abort();
    row._abort = new AbortController();

    try {
        const res = await $fetch<{ success: boolean; suggestions: { text: string; type: string; count?: number }[] }>(
            '/api/elastic/suggestions',
            { method: 'POST', body: { mode: 'facet', facetAttr: attr, query, size: 20 }, signal: row._abort.signal }
        );

        const suggestions = (res?.success && res?.suggestions) 
            ? res.suggestions.map(s => ({
                raw: s.text,
                display: translateValue(attr, s.text),
                count: s.count
            }))
            : [];
        facetCache[attr] = suggestions;

        // Only apply if the row is still on the same facet
        const still = facetFilters.value[rowIndex];
        if (!still || still.facet !== attr) return;

        still.suggestions = facetCache[attr] || [];
        still.showSuggestions = still.suggestions.length > 0;
    } catch (e: any) {
        if (e?.name === 'AbortError') return;
        // keep previous cache if any
        const still = facetFilters.value[rowIndex];
        if (still && still.facet === attr) {
            const cached = facetCache[attr] || [];
            still.suggestions = cached;
            still.showSuggestions = still.suggestions.length > 0;
        }
    } finally {
        const still = facetFilters.value[rowIndex];
        if (still) still._abort = null;
    }
}

function debounceFetch(rowIndex: number, attr: string, query = '') {
    const row = facetFilters.value[rowIndex];
    if (!row) return;
    if (row._debounce) clearTimeout(row._debounce);
    row._debounce = setTimeout(() => fetchFacetSuggestions(rowIndex, attr, query), 220);
}

// ---------------------- Facet & value handlers ----------------------
function onFacetChange(index: number) {
    const row = facetFilters.value[index];
    if (!row) return;

    // reset value/display and suggestions
    row.valueRaw = '';
    row.valueDisplay = '';
    row.suggestions = [];
    row.showSuggestions = false;
    row.highlighted = -1;

    // fetch initial suggestions for the newly selected facet
    const attr = row.facet;
    if (attr) {
    // immediate (not debounced) initial fetch to populate dropdown quickly
        fetchFacetSuggestions(index, attr, '');
    }
}

function onValueInput(index: number, evt: any) {
    const row = facetFilters.value[index];
    if (!row) return;
    const attr = row.facet;
    const value = typeof evt === 'string' ? evt : (evt?.target?.value ?? '');
    row.valueDisplay = value;

    if (!attr) {
        row.showSuggestions = false;
        return;
    }
    // debounced fetch
    debounceFetch(index, attr, value);
}

async function onValueFocus(index: number) {
    const row = facetFilters.value[index];
    if (!row) return;
    const attr = row.facet;
    if (!attr) return;

    // If we already have cache, use it; otherwise fetch
    if (!facetCache[attr] || !facetCache[attr].length) {
        await fetchFacetSuggestions(index, attr, '');
    } else {
        row.suggestions = facetCache[attr];
        row.showSuggestions = row.suggestions.length > 0;
    }
}

function onValueBlur(index: number) {
    const row = facetFilters.value[index];
    if (!row) return;
    setTimeout(() => { row.showSuggestions = false; }, 250);
}

function onFacetKeydown(event: KeyboardEvent, index: number) {
    const row = facetFilters.value[index];
    if (!row) return;

    const key = event.key;

    // Tab: close dropdown, reset highlight, allow default focus behavior
    if (key === 'Tab') {
        if (row.showSuggestions) {
            row.showSuggestions = false;
            row.highlighted = -1;
        }
        return; // allow default Tab behavior
    }

    // Escape: close dropdown, reset highlight
    if (key === 'Escape') {
        if (row.showSuggestions) {
            event.preventDefault();
            row.showSuggestions = false;
            row.highlighted = -1;
        }
        return;
    }

    // ArrowDown: open dropdown if closed, or navigate down if open
    if (key === 'ArrowDown') {
        event.preventDefault();
        
        if (!row.showSuggestions) {
            // Open dropdown and fetch suggestions if needed
            const attr = row.facet;
            if (attr) {
                if (!facetCache[attr] || !facetCache[attr].length) {
                    fetchFacetSuggestions(index, attr, row.valueRaw || '');
                } else {
                    row.suggestions = facetCache[attr];
                    row.showSuggestions = row.suggestions.length > 0;
                }
            }
        } else {
            // Navigate down in suggestions
            if (row.suggestions.length > 0) {
                row.highlighted = Math.min(row.highlighted + 1, row.suggestions.length - 1);
            }
        }
        return;
    }

    // ArrowUp: navigate up in suggestions
    if (key === 'ArrowUp') {
        event.preventDefault();
        if (row.showSuggestions && row.suggestions.length > 0) {
            row.highlighted = Math.max(row.highlighted - 1, 0);
        }
        return;
    }

    // Enter: select highlighted suggestion if any
    if (key === 'Enter') {
        if (row.showSuggestions && row.highlighted >= 0 && row.highlighted < row.suggestions.length) {
            event.preventDefault();
            const suggestion = row.suggestions[row.highlighted];
            selectSuggestion(index, suggestion);
        }
        // Otherwise allow default behavior (form submission, etc.)
        return;
    }
}

function selectSuggestion(index: number, s: FacetSuggestion) {
    const row = facetFilters.value[index];
    if (!row) return;
    row.valueRaw = s.raw;
    row.valueDisplay = s.display;
    row.showSuggestions = false;
    row.highlighted = -1;
}

async function onFacetDropdownClick(index: number) {

    const row = facetFilters.value[index];
    console.log('onFacetDropdownClick for row:', index, row);
    if (!row) return;
    if(row.showSuggestions) {
    // already open
        row.showSuggestions = false;
        return;
    }
    const attr = row.facet;
    console.log('  facet attr:', attr);
    if (!attr) return;
    // If empty, fetch; else just open
    if (!facetCache[attr] || !facetCache[attr].length) {
        console.log('  fetching suggestions for facet:', attr);
        await fetchFacetSuggestions(index, attr, '');
    } else {
        row.suggestions = facetCache[attr];
    }
    row.showSuggestions = row.suggestions.length > 0;
}

// ---------------------- Recent search handlers ----------------------
function handleRecentSearchClick(item: any) {
    if (item.url) {
        window.location.href = `/search/${item.url}`;
    }
}

function handleRemoveRecentSearch(query: string) {
    removeFromHistory(query);
    historyTrigger.value++;
}

function handleClearAllHistory() {
    clearSearchHistory();
    historyTrigger.value++;
}

function handleSearchSubmit(value: string) {
    if (value && value.trim() !== '') {
        addToSearchHistory(value);
        historyTrigger.value++;
    }
}

// ---------------------- Main search select passthrough ----------------------
function onMainSelect(v: string) {
    searchTerm.value = v;
}

function onSubmit(v: string) {
    searchTerm.value = v;
    handleSearchSubmit(v);
    redirectToSearchScreen();
}

// ---------------------- Redirect (uses RAW values) ----------------------
function redirectToSearchScreen() {
    try {
        const pub = useRuntimeConfig().public;
        //const idx = pub.ELASTIC_INDEX;
        const rawBase = pub.AVEFI_SEARCH_URL || 'search';
        const isAbsolute = /^https?:\/\//i.test(rawBase);
        const base = isAbsolute ? `${rawBase.replace(/\/+$/, '')}/`
            : `/${rawBase.replace(/^\/+|\/+$/g, '')}/`;

        const params = new URLSearchParams();
        const q = (searchTerm?.value ?? '').trim();
        if (q) params.append(`query`, q);

        if (Array.isArray(facetFilters?.value)) {
            facetFilters.value.forEach(f => {
                if (f?.facet && f?.valueRaw) {
                    params.append(`[${f.facet}][0]`, f.valueRaw);
                }
            });
        }
        const url = params.toString() ? `${base}?${params.toString()}` : base;
        return isAbsolute ? navigateTo(url, { external: true }) : navigateTo(url);
    } catch (err) {
        console.error('redirectToSearchScreen failed:', err);
    }
}

// ---------------------- Submit protection ----------------------
function handleClick(event: MouseEvent) {
    if (!canSubmit.value) {
        event.preventDefault();
        showValidationWarning.value = true;
        setTimeout(() => { showValidationWarning.value = false; }, 2500);
    }
}
</script>

<style scoped>
.btn-secondary {
    height: 100%;
}
</style>
