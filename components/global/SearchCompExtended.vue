<template>
  <div
    class="w-full max-w-4xl mx-auto p-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg"
    role="search"
    :aria-label="$t('mainSearch')"
  >
    <ClientOnly>
      <template v-if="searchDataStore && searchDataStore.formData">
        <span id="search-input-label" class="sr-only">
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
          <div class="flex w-full mx-auto mb-4 relative" role="group" :aria-labelledby="'search-input-label'">
            <div class="flex-grow relative">
              <SearchQueryAutocomplete
                v-model="searchTerm"
                name="searchTerm"
                :placeholder="$t('searchplaceholder')"
                :aria-label="$t('searchInputAria')"
                :help-text="$t('exactSearchTip')"
                :dropdown-aria-label="$t('showSuggestions')"
                :no-results-text="$t('noSuggestionsFound')"
                @select="onMainSelect"
              />
            </div>

            <!-- Separate, stylable submit button -->
            <div class="ml-0">
              <button
                type="submit"
                class="!text-lg !h-14 btn-primary !rounded-l-none !rounded-r-xl flex items-center justify-center border-3 border-primary px-6 cursor-pointer"
                :class="{'btn-disabled opacity-50 cursor-not-allowed': !canSubmit}"
                :aria-label="$t('submitSearch')"
                @click="handleClick"
              >
                {{ $t('search') }}
              </button>
            </div>
          </div>

          <!-- Advanced Facets (unchanged UI) -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ $t('advancedSearch') || 'Advanced Search' }}
              </h3>
            </div>

            <div class="space-y-4">
              <div
                v-for="(filter, index) in facetFilters"
                :key="`facet-${index}-${filter.facet}`"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <FormKit
                  v-model="filter.facet"
                  type="select"
                  :placeholder="$t('selectFacet') || 'Select Facet'"
                  :options="availableFacetsFiltered"
                  outer-class="flex-1"
                  inner-class="dark:!bg-slate-950 dark:!text-white"
                  @input="onFacetChange(index)"
                />

                <div class="flex-1 relative" @mousedown.stop>
                  <div class="flex items-center gap-2">
                    <FormKit
                      v-model="filter.value"
                      type="text"
                      :placeholder="$t('enterValue') || 'Enter Value'"
                      outer-class="w-full"
                      inner-class="dark:!bg-slate-950 dark:!text-white"
                      :disabled="!filter.facet"
                      @input="onValueInput(index, $event)"
                      @focus="onValueFocus(index)"
                      @blur="onValueBlur(index)"
                    />
                    <button
                      type="button"
                      class="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
                      :aria-label="$t('showSuggestions')"
                      @mousedown.prevent.stop="onFacetDropdownClick(index)"
                      :disabled="!filter.facet"
                    >
                      ▼
                    </button>
                  </div>

                  <div
                    v-if="filter.suggestions && filter.suggestions.length > 0 && filter.showSuggestions"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
                    @mousedown.stop
                  >
                    <div
                      v-for="(s, si) in filter.suggestions.slice(0, 10)"
                      :key="`facet-sugg-${index}-${si}-${s}`"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      @mousedown.prevent.stop="selectSuggestion(index, s)"
                    >
                      {{ s }}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  :aria-label="$t('remove') || 'Remove'"
                  @click="removeFacetFilter(index)"
                >
                  <Icon name="tabler:x" size="20" />
                </button>
              </div>

              <button
                type="button"
                class="flex items-center gap-2 px-4 py-2 text-sm text-primary dark:text-white border border-primary-600 dark:border-primary-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                @click="addFacetFilter"
              >
                <Icon name="tabler:plus" size="16" />
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useSearchParamsStore } from '~/stores/searchParams'
import { config } from '~/searchConfig_avefi'

const { t } = useI18n()

const showValidationWarning = ref(false)
const searchDataStore = useSearchParamsStore()

// Ensure nested branch exists
if (!searchDataStore.formData.regularSearch) {
  searchDataStore.formData.regularSearch = { searchTerm: '', optionsList: [] }
}

const searchTerm = computed<string>({
  get: () => searchDataStore.formData.regularSearch?.searchTerm ?? '',
  set: (v: string) => {
    if (!searchDataStore.formData.regularSearch) {
      searchDataStore.formData.regularSearch = { searchTerm: '', optionsList: [] }
    }
    searchDataStore.formData.regularSearch.searchTerm = v ?? ''
  }
})

// Enable submit if there's a term OR a filled facet
const canSubmit = computed(() =>
  (searchTerm.value?.trim()?.length ?? 0) > 0 ||
  facetFilters.value.some(f => f.facet && f.value)
)

// Facets
interface FacetFilter {
  facet: string
  value: string
  suggestions?: string[]
  showSuggestions?: boolean
}
const facetFilters = ref<FacetFilter[]>([])

onMounted(() => {
  try { addFacetFilter() } catch (error) { console.error('init facets failed:', error) }
})

const FACET_BLACKLIST: string[] = []

const availableFacets = computed(() => {
  try {
    if (!config?.search_settings?.facet_attributes) return []
    return config.search_settings.facet_attributes.map((f: any) => {
      const attribute = f.attribute || f
      const label = getFacetLabel(attribute)
      return { label, value: attribute }
    })
  } catch {
    return []
  }
})
const availableFacetsFiltered = computed(() =>
  availableFacets.value.filter(opt => !FACET_BLACKLIST.includes(opt.value))
)

function getFacetLabel(attribute: string): string {
  const m: Record<string, string> = {
    'has_genre_has_name': t('avefi:Genre') || 'Genre',
    'subjects': t('subjects') || 'Subjects',
    'directors_or_editors': t('directors_or_editors') || 'Directors',
    'castmembers': t('castmembers') || 'Cast',
    'production': t('production') || 'Production',
    'located_in_has_name': t('location') || 'Location',
    'manifestation_event_type': t('eventType') || 'Event Type',
    'has_issuer_name': t('has_issuer_name') || 'Data Holder',
    'has_format_type': t('has_format_type') || 'Format',
    'has_colour_type': t('colorType') || 'Color Type',
    'has_sound_type': t('soundType') || 'Sound Type',
    'in_language_code': t('has_language') || 'Language',
    'has_duration_has_value': t('has_duration_has_value') || 'Duration',
    'has_extent_has_value': t('extent') || 'Extent',
    'item_duration_in_minutes': t('item_duration_in_minutes') || 'Duration (Minutes)',
    'item_element_type': t('elementType') || 'Element Type',
    'has_form': t('form') || 'Form',
    'production_year_start': t('productionYearStart') || 'Production Year (From)',
    'production_year_end': t('productionYearEnd') || 'Production Year (To)'
  }
  return m[attribute] || attribute
}

function addFacetFilter() {
  facetFilters.value.push({ facet: '', value: '', suggestions: [], showSuggestions: false })
}
function removeFacetFilter(index: number) {
  facetFilters.value.splice(index, 1)
}
function onFacetChange(index: number) {
  facetFilters.value[index].value = ''
  facetFilters.value[index].suggestions = []
  facetFilters.value[index].showSuggestions = false
  nextTick(() => { facetFilters.value[index] = { ...facetFilters.value[index] } })
  const attr = facetFilters.value[index].facet
  if (attr) {
    setTimeout(async () => {
      await fetchFacetSuggestions(attr, '')
      facetFilters.value[index].suggestions = facetCache[attr] || []
      facetFilters.value[index].showSuggestions = (facetFilters.value[index].suggestions.length > 0)
    }, 100)
  }
}
async function onValueInput(index: number, event: any) {
  const value = event?.target?.value ?? event
  const attr = facetFilters.value[index].facet
  facetFilters.value[index].value = value
  if (!attr) {
    facetFilters.value[index].showSuggestions = false
    return
  }
  await fetchFacetSuggestions(attr, value)
  facetFilters.value[index].suggestions = facetCache[attr] || []
  facetFilters.value[index].showSuggestions = (facetFilters.value[index].suggestions.length > 0)
}
async function onValueFocus(index: number) {
  const attr = facetFilters.value[index].facet
  if (!attr) return
  await fetchFacetSuggestions(attr, '')
  facetFilters.value[index].suggestions = facetCache[attr] || []
  facetFilters.value[index].showSuggestions = (facetFilters.value[index].suggestions.length > 0)
}
function onValueBlur(index: number) {
  setTimeout(() => { facetFilters.value[index].showSuggestions = false }, 300)
}
function selectSuggestion(index: number, suggestion: string) {
  facetFilters.value[index].value = suggestion
  nextTick(() => { facetFilters.value[index] = { ...facetFilters.value[index] } })
  facetFilters.value[index].showSuggestions = false
}
async function onFacetDropdownClick(index: number) {
  const attr = facetFilters.value[index].facet
  if (!attr) return
  await fetchFacetSuggestions(attr, '')
  facetFilters.value[index].suggestions = facetCache[attr] || []
  facetFilters.value[index].showSuggestions = (facetFilters.value[index].suggestions.length > 0)
}

function onMainSelect(v: string) {
  searchTerm.value = v
}

const facetCache: Record<string, string[]> = {}
async function fetchFacetSuggestions(attr: string, query = '') {
  try {
    const res = await $fetch<{ success: boolean; suggestions: { text: string; type: string }[] }>(
      '/api/elastic/suggestions',
      { method: 'POST', body: { mode: 'facet', facetAttr: attr, query, size: 20 } }
    )
    const arr = (res?.success && res?.suggestions) ? res.suggestions.map(s => s.text) : []
    facetCache[attr] = arr
  } catch {
    facetCache[attr] = facetCache[attr] || []
  }
}

function redirectToSearchScreen() {
  try {
    const pub = useRuntimeConfig().public
    const idx = pub.ELASTIC_INDEX
    const rawBase = pub.AVEFI_SEARCH_URL || 'search_altern'
    const isAbsolute = /^https?:\/\//i.test(rawBase)
    const base = isAbsolute ? `${rawBase.replace(/\/+$/, '')}/index`
                            : `/${rawBase.replace(/^\/+|\/+$/g, '')}/index`

    const params = new URLSearchParams()
    const q = (searchTerm?.value ?? '').trim()
    if (q) params.append(`${idx}[query]`, q)
    if (Array.isArray(facetFilters?.value)) {
      facetFilters.value.forEach(f => {
        if (f?.facet && f?.value) {
          params.append(`${idx}[refinementList][${f.facet}][0]`, f.value)
        }
      })
    }
    const url = params.toString() ? `${base}?${params.toString()}` : base
    return isAbsolute ? navigateTo(url, { external: true }) : navigateTo(url)
  } catch (err) {
    console.error('redirectToSearchScreen failed:', err)
  }
}

function handleClick(event: MouseEvent) {
  if (!canSubmit.value) {
    // keep your current UX
    event.preventDefault()
    showValidationWarning.value = true
    setTimeout(() => { showValidationWarning.value = false }, 2500)
  }
}
</script>

<style scoped>
.btn-secondary { height: 100%; }
</style>
