<template>
  <div
    class="w-full min-w-48 lg:min-w-64 min-h-24 flex justify-center mx-auto"
    role="search"
    :aria-label="$t('mainSearch')"
  >
    <ClientOnly>
      <span id="search-input-label" class="sr-only">
        {{ $t('mainSearch') }}
      </span>

      <FormKit
        v-if="searchDataStore && searchDataStore.formData"
        id="searchCompReduced"
        v-model="searchDataStore.formData"
        type="form"
        :actions="false"
        name="searchCompReduced"
        role="search"
        :aria-label="$t('searchForm')"
        @submit="redirectToSearchScreen"
      >
        <div
          class="flex w-full mx-auto !max-w-none lg:w-96 xl:w-128 justify-center"
          role="group"
          :aria-labelledby="'search-input-label'"
        >
          <div class="flex-grow relative">
            <SearchQueryAutocomplete
              :model-value="searchTerm"
              name="searchTerm"
              :placeholder="$t('searchplaceholder')"
              :aria-label="$t('searchInputAria')"
              :help-text="$t('exactSearchTip')"
              :dropdown-aria-label="$t('showSuggestions')"
              :no-results-text="$t('noSuggestionsFound')"
              @select="(v) => { searchTerm = v }"
            />
          </div>

          <FormKit
            type="submit"
            :label="$t('search')"
            :title="$t('search')"
            outer-class="!rounded-l-none !mb-0 !rounded-r-xl !h-full flex items-center justify-start"
            inner-class="!rounded-l-3xl !h-full"
            input-class="!text-lg !h-14 !btn-primary !rounded-l-none !rounded-r-xl flex items-center justify-center border-3 border-primary !my-auto"
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
import { ref } from 'vue'
import { useSearchParamsStore } from '~/stores/searchParams'

const showTooltip = ref(false)
const searchTerm = ref('')
const showValidationWarning = ref(false)
const searchDataStore = useSearchParamsStore()

function redirectToSearchScreen() {
  try {
    const pub = useRuntimeConfig().public
    const idx = pub.ELASTIC_INDEX

    // Build base (support absolute or relative AVEFI_SEARCH_URL)
    const rawBase = pub.AVEFI_SEARCH_URL || 'search'
    const isAbsolute = /^https?:\/\//i.test(rawBase)
    const base = isAbsolute ? `${rawBase.replace(/\/+$/, '')}/index`
                            : `/${rawBase.replace(/^\/+|\/+$/g, '')}/index`

    // Params
    const params = new URLSearchParams()
    const q = (searchTermLocal?.value ?? searchTerm?.value ?? '').trim()
    if (q) params.append(`${idx}[query]`, q)

    if (Array.isArray(facetFilters?.value)) {
      facetFilters.value.forEach(f => {
        if (f?.facet && f?.value) {
          params.append(`${idx}[refinementList][${f.facet}][0]`, f.value)
        }
      })
    }

    const url = params.toString() ? `${base}?${params.toString()}` : base

    // Navigate (external vs internal)
    if (isAbsolute) {
      return navigateTo(url, { external: true })
    } else {
      return navigateTo(url)
    }
  } catch (err) {
    console.error('redirectToSearchScreen failed:', err)
  }
}


function handleClick(event: MouseEvent) {
  console.log('handleClick', { searchTerm: searchTerm.value })
  if (searchTerm.value.trim().length === 0) {
    event.preventDefault()
    showValidationWarning.value = true
    setTimeout(() => { showValidationWarning.value = false }, 2500)
  }
}
</script>

<style scoped>
.btn-secondary { height: 100%; }
</style>
