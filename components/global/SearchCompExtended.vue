<template>
  <div
    class="w-full max-w-4xl mx-auto p-4 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg"
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
          <!-- Main Query Input -->
          <div
            class="flex w-full mx-auto mb-4 relative"
            role="group"
            :aria-labelledby="'search-input-label'"
          >
            <div class="flex-grow relative">
              <FormKit
                v-model="searchTerm"
                name="searchTerm"
                :placeholder="$t('searchplaceholder')"
                type="text"
                autocomplete="off"
                outer-class="!max-w-none w-full"
                inner-class="!rounded-l-xl rounded-r-none dark:!bg-slate-950 dark:!text-white !h-[56px] w-full"
                input-class="!text-lg p-2 w-full dark:!text-white"
                :aria-label="$t('searchInputAria')"
                aria-required="true"
                :aria-invalid="searchTerm.trim().length === 0 ? 'true' : 'false'"
                autofocus
                :help="showTooltip ? $t('exactSearchTip') : ''"
                :help-class="'absolute text-sm text-gray-800 bg-white p-2 rounded-md shadow dark:text-white dark:bg-gray-700'"
                @input="handleSearchTermInput"
                @focus="handleSearchInputFocus"
                @blur="handleSearchInputBlur"
              >
                <template #prefix>
                  <span
                    class="ml-2 cursor-pointer select-none text-neutral-500 dark:text-neutral-300 text-sm"
                    tabindex="0"
                    role="button"
                    aria-label="Info"
                    @mouseenter="showTooltip = true"
                    @mouseleave="showTooltip = false"
                    @focus="showTooltip = true"
                    @blur="showTooltip = false"
                  >
                    ⓘ
                  </span>
                  <button
                    type="button"
                    class="ml-2 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs hover:bg-gray-300 dark:hover:bg-gray-600"
                    aria-label="Show suggestions"
                    @click="showDropdownSuggestions"
                  >
                    ▼
                  </button>
                </template>
              </FormKit>
            
              <!-- Search Auto-suggestion dropdown -->
              <div
                v-if="showSuggestions"
                class="absolute z-[1050] w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
              >
                <template v-if="suggestionsData && suggestionsData.length > 0">
                  <div
                    v-for="(suggestion, suggestionIndex) in suggestionsData.slice(0, 8)"
                    :key="suggestionIndex"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between"
                    @mousedown.prevent="handleSuggestionSelect(suggestion.text)"
                  >
                    <span class="text-gray-800 dark:text-gray-200">{{ suggestion.text }}</span>
                    <span class="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {{ $t(`searchFieldType.${suggestion.type}`) }}
                    </span>
                  </div>
                </template>
                <template v-else-if="!searchTerm || searchTerm.trim().length === 0">
                  <div
                    v-for="(suggestion, suggestionIndex) in getFallbackSuggestions()"
                    :key="suggestionIndex"
                    class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm flex items-center justify-between"
                    @mousedown.prevent="handleSuggestionSelect(suggestion.text)"
                  >
                    <span class="text-gray-800 dark:text-gray-200">{{ suggestion.text }}</span>
                    <span class="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                      {{ $t(`searchFieldType.${suggestion.type}`) }}
                    </span>
                  </div>
                </template>
                <template v-else>
                  <div class="px-3 py-2 text-sm text-error-700 dark:text-error-300 text-center">
                    {{ $t('noSuggestionsFound') }}
                  </div>
                </template>
              </div>
            </div>

            <FormKit
              type="submit"
              :label="$t('search')"
              :title="$t('search')"
              outer-class="!rounded-l-none !mb-0 !rounded-r-xl !h-full flex items-center justify-start"
              inner-class="!rounded-l-3xl !h-full"
              input-class="!text-lg !h-14 btn-secondary !rounded-l-none !rounded-r-xl flex items-center justify-center border-3 border-primary !my-auto"
              :disabled="searchTerm.trim().length === 0"
              aria-disabled="false"
              :aria-label="$t('submitSearch')"
              @click="handleClick"
            />
          </div>

          <!-- Extended Search Section -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="mb-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                {{ $t('advancedSearch') || 'Advanced Search' }}
              </h3>
            </div>

            <div class="space-y-4">
              <!-- Dynamic Facet Filters -->
              <div
                v-for="(filter, index) in facetFilters"
                :key="`facet-${index}-${filter.facet}`"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <!-- Facet Selection -->
                <FormKit
                  v-model="filter.facet"
                  type="select"
                  :placeholder="$t('selectFacet') || 'Select Facet'"
                  :options="availableFacets"
                  outer-class="flex-1"
                  inner-class="dark:!bg-slate-950 dark:!text-white"
                  @input="onFacetChange(index)"
                />

                <!-- Value Input with Auto-suggestions -->
                <div class="flex-1 relative">
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
                
                  <!-- Auto-suggestion dropdown -->
                  <div
                    v-if="filter.suggestions && filter.suggestions.length > 0 && filter.showSuggestions"
                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
                  >
                    <div
                      v-for="(suggestion, suggestionIndex) in filter.suggestions.slice(0, 10)"
                      :key="suggestionIndex"
                      class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      @mousedown.prevent="selectSuggestion(index, suggestion)"
                    >
                      {{ suggestion }}
                    </div>
                  </div>
                </div>

                <!-- Remove Filter Button -->
                <button
                  type="button"
                  class="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  :aria-label="$t('remove') || 'Remove'"
                  @click="removeFacetFilter(index)"
                >
                  <Icon
                    name="tabler:x"
                    size="20"
                  />
                </button>
              </div>

              <!-- Add New Filter Button -->
              <button
                type="button"
                class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                @click="addFacetFilter"
              >
                <Icon
                  name="tabler:plus"
                  size="16"
                />
                {{ $t('addFilter') || 'Add Filter' }}
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
      
      <!-- Fallback when store is not available -->
      <template v-else>
        <div class="text-center text-gray-500 dark:text-gray-400 p-4">
          {{ $t('loadingSearch') || 'Loading search...' }}
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useSearchParamsStore } from '../../stores/searchParams';
import { config } from '../../searchConfig_avefi';
import { getFacetIcon } from '../../models/interfaces/manual/IFacetIconMapping';
import { useSearchSuggestions } from '../../composables/useSearchSuggestions';

const { t } = useI18n();
const showTooltip = ref(false);
const searchTerm = ref('');
const showValidationWarning = ref(false);
// Use search suggestions composable
const {
    searchSuggestions: suggestionsData,
    showSearchSuggestions: showSuggestions,
    selectSearchSuggestion,
    handleSearchFocus,
    handleSearchBlur,
    handleSearchInput,
    showDropdownSuggestions,
    loadSearchSuggestions,
    getFallbackSearchSuggestions
} = useSearchSuggestions();
let searchDataStore: any = null;

// Initialize store safely
onMounted(() => {
    try {
        searchDataStore = useSearchParamsStore();
        addFacetFilter();
    } catch (error) {
        console.error('Failed to initialize search store:', error);
    }
});

// Facet filters structure
interface FacetFilter {
  facet: string;
  value: string;
  suggestions?: string[];
  showSuggestions?: boolean;
}

// API Response interface
interface FacetSuggestionsResponse {
  success: boolean;
  facet?: string;
  query?: string;
  suggestions?: string[];
  message?: string;
}

const facetFilters = ref<FacetFilter[]>([]);

// Search options
const searchOptions = ref({
    resultsPerPage: 10
});

// Generate available facets from searchConfig_avefi.ts
const availableFacets = computed(() => {
    try {
        if (!config?.search_settings?.facet_attributes) return [];
    
        return config.search_settings.facet_attributes.map((facet: any) => {
            const attribute = facet.attribute || facet;
            const label = getFacetLabel(attribute);
      
            return {
                label: label,
                value: attribute
            };
        });
    } catch (error) {
        console.error('Error loading facets:', error);
        return [];
    }
});

// Helper function to get user-friendly facet labels
function getFacetLabel(attribute: string): string {
    try {
        const labelMap: Record<string, string> = {
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
        };
    
        return labelMap[attribute] || attribute;
    } catch (error) {
        console.error('Error in getFacetLabel:', error);
        return attribute;
    }
}

function addFacetFilter() {
    facetFilters.value.push({
        facet: '',
        value: '',
        suggestions: [],
        showSuggestions: false
    });
}

function removeFacetFilter(index: number) {
    facetFilters.value.splice(index, 1);
}

function onFacetChange(index: number) {
    // Reset value and suggestions when facet changes
    facetFilters.value[index].value = '';
    facetFilters.value[index].suggestions = [];
    facetFilters.value[index].showSuggestions = false;
  
    // Force Vue reactivity update to ensure UI reflects the changes
    nextTick(() => {
        facetFilters.value[index] = { ...facetFilters.value[index] };
    });
  
    // Load suggestions for the new facet after a brief delay
    if (facetFilters.value[index].facet) {
        setTimeout(async () => {
            await loadFacetSuggestions(index);
            // Show suggestions immediately when facet is selected
            if (facetFilters.value[index].suggestions && facetFilters.value[index].suggestions.length > 0) {
                facetFilters.value[index].showSuggestions = true;
            }
        }, 100);
    }
}

// Updated event handlers to use composable
async function handleSearchInputFocus() {
    await handleSearchFocus(searchTerm);
}

function handleSearchInputBlur() {
    handleSearchBlur();
}

function handleSearchTermInput() {
    handleSearchInput(searchTerm);
}

function handleSuggestionSelect(suggestion: string) {
    selectSearchSuggestion(suggestion, searchTerm);
}

async function loadFacetSuggestions(index: number) {
    const facet = facetFilters.value[index].facet;
    if (!facet) return;
  
    // Clear existing suggestions first
    facetFilters.value[index].suggestions = [];
    facetFilters.value[index].showSuggestions = false;
  
    try {
    // Call the new Elasticsearch API endpoint
        const response = await $fetch<FacetSuggestionsResponse>('/api/elastic/facet_suggestions', {
            method: 'POST',
            body: {
                facet: facet,
                size: 20 // Get more suggestions for better filtering
            }
        });
    
        // Double-check that the facet hasn't changed while we were loading
        if (facetFilters.value[index].facet !== facet) {
            console.log('Facet changed during loading, ignoring response');
            return;
        }
    
        if (response && response.success) {
            facetFilters.value[index].suggestions = response.suggestions || [];
        } else {
            console.warn('Failed to load suggestions:', response?.message || 'Unknown error');
            facetFilters.value[index].suggestions = [];
        }
    } catch (error) {
        console.error('Error loading facet suggestions:', error);
        // Double-check that the facet hasn't changed while we were loading
        if (facetFilters.value[index].facet !== facet) {
            return;
        }
        // Fallback to mock data in case of API failure
        facetFilters.value[index].suggestions = getFacetSuggestions(facet);
    }
}

function getFacetSuggestions(facet: string): string[] {
    // Fallback mock data - only used if API fails
    const suggestionMap: Record<string, string[]> = {
        'has_genre_has_name': ['Drama', 'Comedy', 'Documentary', 'Action', 'Horror', 'Romance', 'Thriller', 'Animation'],
        'subjects': ['Education', 'Science', 'History', 'Politics', 'Culture', 'Technology', 'Art', 'Music'],
        'directors_or_editors': ['Werner Herzog', 'Wim Wenders', 'Rainer Werner Fassbinder', 'Alexander Kluge'],
        'castmembers': ['Klaus Kinski', 'Bruno Ganz', 'Hanna Schygulla', 'Mario Adorf'],
        'production': ['Bavaria Film', 'Constantin Film', 'X Filme Creative Pool', 'Senator Entertainment'],
        'located_in_has_name': ['Germany', 'Berlin', 'Munich', 'Hamburg', 'Cologne', 'Austria', 'Switzerland'],
        'manifestation_event_type': ['Theatrical Release', 'Television Broadcast', 'DVD Release', 'Streaming'],
        'has_issuer_name': ['Deutsches Filminstitut', 'Filmmuseum Berlin', 'Bundesarchiv', 'SDK'],
        'has_format_type': ['35mm', '16mm', 'DCP', 'Betacam SP', 'DVD', 'Blu-ray'],
        'has_colour_type': ['Color', 'Black and White', 'Tinted', 'Hand Colored'],
        'has_sound_type': ['Sound', 'Silent', 'Mono', 'Stereo', 'Dolby Digital'],
        'in_language_code': ['German', 'English', 'French', 'Italian', 'Spanish'],
        'item_element_type': ['Film Reel', 'Digital File', 'Videotape', 'DVD', 'Hard Drive'],
        'has_form': ['Feature Film', 'Short Film', 'Documentary', 'News Film', 'Educational Film']
    };
  
    return suggestionMap[facet] || [];
}

async function onValueInput(index: number, event: any) {
    const value = event.target?.value || event;
    const currentFacet = facetFilters.value[index].facet;
  
    facetFilters.value[index].value = value;
  
    // Don't proceed if no facet is selected
    if (!currentFacet) {
        facetFilters.value[index].showSuggestions = false;
        return;
    }
  
    // If there's a query and a selected facet, fetch filtered suggestions from API
    if (value && value.length > 1) {
        try {
            const response = await $fetch<FacetSuggestionsResponse>('/api/elastic/facet_suggestions', {
                method: 'POST',
                body: {
                    facet: currentFacet,
                    query: value,
                    size: 10
                }
            });
      
            // Check that the facet hasn't changed during the API call
            if (facetFilters.value[index].facet !== currentFacet) {
                return;
            }
      
            if (response && response.success) {
                facetFilters.value[index].suggestions = response.suggestions || [];
                facetFilters.value[index].showSuggestions = true;
            }
        } catch (error) {
            console.error('Error filtering suggestions:', error);
            // Check that the facet hasn't changed during the error
            if (facetFilters.value[index].facet !== currentFacet) {
                return;
            }
            // Fallback to local filtering
            if (facetFilters.value[index].suggestions) {
                const filtered = facetFilters.value[index].suggestions!.filter(suggestion =>
                    suggestion.toLowerCase().includes(value.toLowerCase())
                );
                facetFilters.value[index].suggestions = filtered;
                facetFilters.value[index].showSuggestions = true;
            }
        }
    } else if (value.length === 0) {
    // If input is cleared, reload all suggestions
        await loadFacetSuggestions(index);
        facetFilters.value[index].showSuggestions = true;
    } else {
        facetFilters.value[index].showSuggestions = value.length > 0;
    }
}

function onValueFocus(index: number) {
    if (facetFilters.value[index].facet) {
    // If we don't have suggestions yet, load them
        if (!facetFilters.value[index].suggestions || facetFilters.value[index].suggestions.length === 0) {
            loadFacetSuggestions(index).then(() => {
                if (facetFilters.value[index].suggestions && facetFilters.value[index].suggestions.length > 0) {
                    facetFilters.value[index].showSuggestions = true;
                }
            });
        } else {
            // Show existing suggestions
            facetFilters.value[index].showSuggestions = true;
        }
    }
}

function onValueBlur(index: number) {
    // Delay hiding suggestions to allow for clicks
    // Use a longer delay to ensure mousedown events can fire
    setTimeout(() => {
        facetFilters.value[index].showSuggestions = false;
    }, 300);
}

function selectSuggestion(index: number, suggestion: string) {
    // Update the value
    facetFilters.value[index].value = suggestion;
  
    // Force Vue reactivity update
    nextTick(() => {
        facetFilters.value[index] = { ...facetFilters.value[index] };
    });
  
    // Hide suggestions
    facetFilters.value[index].showSuggestions = false;
  
    console.log('Selected suggestion:', suggestion, 'for index:', index);
}

function redirectToSearchScreen() {
    try {
    // Build query parameters for the search URL
        const params = new URLSearchParams();
    
        // Add main search term
        if (searchTerm.value.trim()) {
            params.append('query', searchTerm.value.trim());
        }
    
        // Add facet filters with proper facet refinement syntax
        facetFilters.value.forEach((filter) => {
            if (filter.facet && filter.value) {
                // Use the correct facet refinement syntax for the search interface
                params.append(`${useRuntimeConfig().public.ELASTIC_INDEX}[refinementList][${filter.facet}][0]`, filter.value);
            }
        });
    
        // Add results per page
        if (searchOptions.value.resultsPerPage !== 25) {
            params.append(`${useRuntimeConfig().public.ELASTIC_INDEX}[hitsPerPage]`, searchOptions.value.resultsPerPage.toString());
        }

        // Construct the search URL with proper format
        let redirectLink = '/' + useRuntimeConfig().public.AVEFI_SEARCH_URL + '/index';
    
        // Add the main query parameter if it exists
        if (searchTerm.value.trim()) {
            redirectLink += `?${useRuntimeConfig().public.ELASTIC_INDEX}[query]=${encodeURIComponent(searchTerm.value)}`;
        }
    
        // Add other parameters
        const additionalParams = new URLSearchParams();
        facetFilters.value.forEach((filter) => {
            if (filter.facet && filter.value) {
                additionalParams.append(`${useRuntimeConfig().public.ELASTIC_INDEX}[refinementList][${filter.facet}][0]`, filter.value);
            }
        });
    
        if (searchOptions.value.resultsPerPage !== 25) {
            additionalParams.append(`${useRuntimeConfig().public.ELASTIC_INDEX}[hitsPerPage]`, searchOptions.value.resultsPerPage.toString());
        }
    
        if (additionalParams.toString()) {
            redirectLink += (searchTerm.value.trim() ? '&' : '?') + additionalParams.toString();
        }
    
        console.log('redirecting to search screen:', redirectLink);
        navigateTo(redirectLink);
    } catch (error) {
        console.error('Error during search redirect:', error);
    }
}

function handleClick(event: MouseEvent) {
    if (searchTerm.value.trim().length === 0 && facetFilters.value.every(f => !f.facet || !f.value)) {
        event.preventDefault();
        showValidationWarning.value = true;

        setTimeout(() => {
            showValidationWarning.value = false;
        }, 2500);
    }
}

// Initialize with one empty facet filter
// onMounted(() => {
//   addFacetFilter();
// });

function getFallbackSuggestions() {
    return getFallbackSearchSuggestions();
}
</script>

<style scoped>
.btn-secondary {
  height: 100%;
}
</style>
