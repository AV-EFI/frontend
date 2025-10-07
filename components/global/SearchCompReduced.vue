<template>
  <div
    class="w-full min-w-48 lg:min-w-64 min-h-24 flex justify-center mx-auto"
    role="search"
    :aria-label="$t('mainSearch')"
  >
    <ClientOnly>
      <span
        id="search-input-label"
        class="sr-only"
      >
        {{ $t('mainSearch') }}
      </span>
      <FormKit
        v-if="searchDataStore && searchDataStore.formData"
        id="searchComp"
        v-model="searchDataStore.formData"
        type="form"
        :actions="false"
        name="searchComp"
        role="search"
        :aria-label="$t('searchForm')"
        @submit="redirectToSearchScreen"
      >
        <div
          class="flex w-full mx-auto !max-w-none lg:w-96 xl:w-128 justify-center relative"
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
              inner-class="!rounded-l-xl rounded-r-none dark:!bg-slate-950 dark:!text-white  !h-[56px] w-full"
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
              v-if="suggestionsData && suggestionsData.length > 0 && showSuggestions"
              class="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto"
            >
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

        <p
          v-if="showValidationWarning"
          role="alert"
          aria-live="assertive"
          class="slide-down text-center text-error-800 dark:text-error-200 bg-white dark:bg-gray-800 text-xs mt-2 p-2 rounded-lg"
        >
          {{ $t('enterSearchTermFirst') }}
        </p>
      </FormKit>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSearchParamsStore } from '../../stores/searchParams';
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
  showDropdownSuggestions
} = useSearchSuggestions();
const searchDataStore = useSearchParamsStore();

// Event handlers using composable
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

function redirectToSearchScreen() {
    const redirectLink =  '/' + useRuntimeConfig().public.AVEFI_SEARCH_URL + '/index?' + useRuntimeConfig().public.ELASTIC_INDEX + '[query]=' + encodeURIComponent(searchTerm.value);
    console.log('redirecting to search screen with term:', redirectLink);
    navigateTo(redirectLink);
}

function handleClick(event: MouseEvent) {
    if (searchTerm.value.trim().length === 0) {
        event.preventDefault();
        showValidationWarning.value = true;

        setTimeout(() => {
            showValidationWarning.value = false;
        }, 2500);
    }
}
</script>

<style scoped>
.btn-secondary {
  height: 100%;
}
</style>
