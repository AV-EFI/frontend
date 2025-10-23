<template>
  <div
    class="w-full max-w-4xl mx-auto p-4backdrop-blur-sm rounded-lg"
    role="search"
    :aria-label="$t('mainSearch')"
  >
    <ClientOnly>
      <template v-if="searchDataStore && searchDataStore.formData">
        <span
          id="search-input-label"
          class="sr-only"
        >
          {{ $t('mainSearch') }}
        </span>

        <FormKit
          id="searchComp"
          v-model="searchDataStore.formData"
          type="form"
          :actions="false"
          name="searchComp"
          role="search"
          :aria-label="$t('searchForm')"
          @submit="redirectToSearchScreen"
        >
          <!-- Query input + submit -->
          <div
            class="flex w-full mx-auto mb-4 relative"
            role="group"
            :aria-labelledby="'search-input-label'"
          >
            <div class="flex-grow relative">
              <SearchQueryAutocomplete
                ref="qaRef"
                v-model="searchTerm"
                name="search"
                :placeholder="$t('searchplaceholder')"
                :aria-label="ariaLabel"
                :icon-map="iconMap"
                :help-text="$t('exactSearchTip')"
                :dropdown-aria-label="$t('showSuggestions')"
                :no-results-text="$t('noSuggestionsFound')"
                @submit="onSubmit"
                @select="onMainSelect"
              />
            </div>

            <!-- Separate, stylable submit button -->
            <div class="ml-0">
              <button
                type="submit"
                class="!rounded-l-none !rounded-r-xl flex btn btn-primary btn-lg h-[56px]"
                :class="{'btn-disabled opacity-50 cursor-not-allowed': !canSubmit}"
                :aria-label="$t('submitSearch')"
                @click="handleClick"
              >
                {{ $t('search') }}
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
              <div
                v-for="(filter, index) in facetFilters"
                :key="filter.uid"
                class="flex items-start gap-1 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <!-- Facet icon (reflects currently selected facet) -->
                <div class="">
                  <span
                    v-if="facetMeta(filter.facet)?.icon"
                    class="inline-flex items-center justify-center size-8 rounded-md bg-base-100 border border-base-300 dark:bg-slate-900 dark:border-slate-700"
                    :title="facetMeta(filter.facet)?.label || filter.facet"
                    aria-hidden="true"
                  >
                    <Icon
                      :name="facetMeta(filter.facet)?.icon"
                      size="18"
                    />
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center justify-center size-8 rounded-md bg-base-100 border border-base-300 dark:bg-slate-900 dark:border-slate-700"
                    :title="$t('selectFacet')"
                    aria-hidden="true"
                  >
                    <Icon
                      name="i-mdi:tag-outline"
                      size="18"
                    />
                  </span>
                </div>

                <!-- Facet select -->
                <FormKit
                  v-model="filter.facet"
                  type="select"
                  :placeholder="$t('selectFacet') || 'Select Facet'"
                  :options="availableFacetsFiltered"
                  outer-class="flex-[0.9]"
                  inner-class="dark:!bg-slate-950 dark:!text-white"
                  @input="onFacetChange(index)"
                />

                <!-- Value input + dropdown -->
                <div
                  class="flex-1 relative"
                  @mousedown.stop
                >
                  <div class="flex justify-items-start items-start gap-2">
                    <!-- We bind to valueDisplay for UI, and keep valueRaw separately -->
                    <FormKit
                      :model-value="filter.valueDisplay"
                      type="text"
                      :placeholder="$t('enterValue') || 'Enter Value'"
                      outer-class="w-full"
                      inner-class="dark:!bg-slate-950 dark:!text-white"
                      :disabled="!filter.facet"
                      autocomplete="off"
                      @input="onValueInput(index, $event)"
                      @focus="onValueFocus(index)"
                      @blur="onValueBlur(index)"
                    />
                    <button
                      type="button"
                      class="h-8 px-2 py-1 mt-0 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
                      :aria-label="$t('showSuggestions')"
                      :disabled="!filter.facet"
                      @mousedown.prevent.stop="onFacetDropdownClick(index)"
                    >
                      <Icon
                        name="tabler:chevron-down"
                        size="16"
                      />
                    </button>
                  </div>

                  <!-- Suggestions -->
                  <div
                    v-if="filter.showSuggestions && filter.suggestions.length"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
                    @mousedown.stop
                  >
                    <div
                      v-for="(s, si) in filter.suggestions.slice(0, 10)"
                      :key="`facet-sugg-${filter.uid}-${si}-${s.raw}`"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      @mousedown.prevent.stop="selectSuggestion(index, s)"
                    >
                      <!-- Show translated display text, keep raw in state -->
                      {{ s.display }}
                    </div>
                  </div>
                </div>

                <!-- Remove row -->
                <button
                  type="button"
                  class="btn btn-outline btn-error p-2"
                  :aria-label="$t('remove') || 'Remove'"
                  @click="removeFacetFilter(index)"
                >
                  <Icon
                    name="tabler:x"
                    size="20"
                  />
                </button>
              </div>

              <button
                type="button"
                class="flex items-center gap-2 px-4 py-2 text-sm text-primary dark:text-white border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                @click="addFacetFilter"
              >
                <Icon
                  name="tabler:plus"
                  size="16"
                />
                {{ $t('addFacet') || 'Add Facet' }}
              </button>
            </div>
          </div>

          <p
            v-if="showValidationWarning"
            role="alert"
            aria-live="assertive"
            class="slide-down text-center text-error-800 dark:text-error-200 bg-white dark:bg-gray-800 text-xs mt-2 p-2 rounded-lg"
          >
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

const iconMap = FACET_ICON_MAP;

const { t, locale } = useI18n();

const showValidationWarning = ref(false);
const searchDataStore = useSearchParamsStore();

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
            const facetIcon = FACET_ICON_MAP[attribute] || 'i-mdi:tag-outline';
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
}
interface FacetFilter {
  uid: string
  facet: string
  valueRaw: string
  valueDisplay: string
  suggestions: FacetSuggestion[]
  showSuggestions: boolean
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
        uid: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
        facet: '',
        valueRaw: '',
        valueDisplay: '',
        suggestions: [],
        showSuggestions: false,
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
/** Per-row cache (attr -> [raw]) */
const facetCache: Record<string, string[]> = {};

async function fetchFacetSuggestions(rowIndex: number, attr: string, query = '') {
    // cancel previous in-flight
    const row = facetFilters.value[rowIndex];
    if (!row) return;

    if (row._abort) row._abort.abort();
    row._abort = new AbortController();

    try {
        const res = await $fetch<{ success: boolean; suggestions: { text: string; type: string }[] }>(
            '/api/elastic/suggestions',
            { method: 'POST', body: { mode: 'facet', facetAttr: attr, query, size: 20 }, signal: row._abort.signal }
        );

        const arr = (res?.success && res?.suggestions) ? res.suggestions.map(s => s.text) : [];
        facetCache[attr] = arr;

        // Only apply if the row is still on the same facet
        const still = facetFilters.value[rowIndex];
        if (!still || still.facet !== attr) return;

        still.suggestions = (facetCache[attr] || []).map(raw => ({
            raw,
            display: translateValue(attr, raw)
        }));
        still.showSuggestions = still.suggestions.length > 0;
    } catch (e: any) {
        if (e?.name === 'AbortError') return;
        // keep previous cache if any
        const still = facetFilters.value[rowIndex];
        if (still && still.facet === attr) {
            const cached = facetCache[attr] || [];
            still.suggestions = cached.map(raw => ({ raw, display: translateValue(attr, raw) }));
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
        row.suggestions = facetCache[attr].map(raw => ({ raw, display: translateValue(attr, raw) }));
        row.showSuggestions = row.suggestions.length > 0;
    }
}

function onValueBlur(index: number) {
    const row = facetFilters.value[index];
    if (!row) return;
    setTimeout(() => { row.showSuggestions = false; }, 250);
}

function selectSuggestion(index: number, s: FacetSuggestion) {
    const row = facetFilters.value[index];
    if (!row) return;
    row.valueRaw = s.raw;
    row.valueDisplay = s.display;
    row.showSuggestions = false;
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
        row.suggestions = facetCache[attr].map(raw => ({ raw, display: translateValue(attr, raw) }));
    }
    row.showSuggestions = row.suggestions.length > 0;
}

// ---------------------- Main search select passthrough ----------------------
function onMainSelect(v: string) {
    searchTerm.value = v;
}

// ---------------------- Redirect (uses RAW values) ----------------------
function redirectToSearchScreen() {
    try {
        const pub = useRuntimeConfig().public;
        const idx = pub.ELASTIC_INDEX;
        const rawBase = pub.AVEFI_SEARCH_URL || 'search_altern';
        const isAbsolute = /^https?:\/\//i.test(rawBase);
        const base = isAbsolute ? `${rawBase.replace(/\/+$/, '')}/index`
            : `/${rawBase.replace(/^\/+|\/+$/g, '')}/index`;

        const params = new URLSearchParams();
        const q = (searchTerm?.value ?? '').trim();
        if (q) params.append(`${idx}[query]`, q);

        if (Array.isArray(facetFilters?.value)) {
            facetFilters.value.forEach(f => {
                if (f?.facet && f?.valueRaw) {
                    params.append(`${idx}[refinementList][${f.facet}][0]`, f.valueRaw);
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
.btn-secondary { height: 100%; }
</style>
