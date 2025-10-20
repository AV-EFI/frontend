<template>
  <div>
    <div class="container">
      <ais-instant-search
        :search-client="searchClient"
        :index-name="indexName"
        :show-loading-indicator="true"
        :routing="false"
        :insights="false"
        :future="{preserveSharedStateOnUnmount: true }"
      >
        <!-- always trigger at least one query -->
        <ais-configure :hits-per-page.camel="20" />
        <ais-hits class="hidden">
          <template #default="s"><!-- noop --></template>
        </ais-hits>

        <div class="search-panel" role="region" :aria-label="$t('searchpanel')">
          <ClientOnly>
            <GlobalFacetDrawer :view-type-checked="viewTypeChecked" />
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
              <div class="searchbox" role="search" :aria-label="$t('searchbox')">
                <ais-search-box
                  :ignore-composition-events="true"
                  :submit-title="$t('submitQuery')"
                  :reset-title="$t('resetQuery')"
                  class="flex flex-row mt-2"
                >
                  <template #default="{ currentRefinement = '', refine = () => {}, isSearchStalled = false } = {}">
                    <div
                      class="flex flex-row items-center w-full py-1.5 px-2.5 rounded-l-xl rounded-r-none border border-primary-300 bg-white focus-within:ring-1 focus-within:!ring-primary-400 focus-within:!border-primary-400 dark:bg-transparent dark:border-primary-200 max-md:max-w-[calc(100%-52px)] formkit-inner"
                    >
                      <!-- tooltip -->
                      <span
                        class="relative ml-2 cursor-pointer select-none"
                        tabindex="0"
                        @mouseenter="showAlgoliaTooltip = true"
                        @mouseleave="showAlgoliaTooltip = false"
                        @focus="showAlgoliaTooltip = true"
                        @blur="showAlgoliaTooltip = false"
                      >
                        <span class="text-neutral-500 dark:text-neutral-300 text-sm" role="img" aria-label="Info">ⓘ</span>
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
                        class="appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none p-0 focus:ring-0 formkit-input !text-lg p-2 !rounded-3xl"
                        :value="currentRefinement"
                        :placeholder="$t('searchplaceholder')"
                        @input="currentRefinement = $event.target.value"
                        @keyup.enter="refine(currentRefinement); searchQuery = currentRefinement ?? ''"
                      >
                      <span id="search-loading" :class="[!isSearchStalled ? 'hidden' : '','loading loading-spinner loading-sm']" />

                      <!-- Reset -->
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
                        <Icon class="p-2 text-xl my-auto dark:text-white" name="mdi:clear-bold" aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      class="ais-SearchBox-submit btn btn-primary md:w-32 h-auto rounded-l-none !rounded-r-xl"
                      :title="$t('search')"
                      type="button"
                      @click="refine(currentRefinement); searchQuery = currentRefinement;"
                    >
                      <Icon class="text-lg" name="formkit:search" />
                      <span class="sr-only">{{ $t('search') }}</span>
                    </button>
                  </template>
                </ais-search-box>
              </div>

              <div class="mt-2 mb-2 w-full">
                <button class="btn btn-primary lg:hidden" :title="$t('showFacetItems')" @click="$toggleFacetDrawerState">
                  <Icon name="tabler:chevron-right" />&nbsp;{{ $t('showFacetItems') }}
                </button>
              </div>

              <div class="w-full">
                <div
                  class="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 flex flex-col md:flex-row justify-between"
                  role="region"
                  :aria-label="$t('filteringsection')"
                >
                  <div class="w-full flex flex-col justify-center bg-white dark:bg-gray-800 rounded-lg p-2 border-2 border-base-200">
                    <ais-stats>
                      <template #default="{ nbHits = 0 } = {}">
                        <div class="flex items-center justify-center h-10">
                          <span v-if="isSearchLoading" id="custom-spinner" class="loading loading-spinner loading-md text-primary" />
                          <h2 v-else class="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
                            {{ nbHits }} {{ $t('results') }}
                          </h2>
                        </div>
                      </template>
                    </ais-stats>
                  </div>

                  <div class="w-full flex flex-col justify-center border-base-200 border-2 bg-white dark:bg-gray-800 rounded-lg p-2">
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

                  <div class="form-control w-full border-base-200 border-2 flex flex-col justify-end bg-white dark:bg-gray-800 rounded-lg p-2">
                    <label class="label cursor-pointer text-sm w-64 mx-auto lg:ml-auto" :aria-label="$t('toggleViewType')">
                      <Icon name="tabler:info-circle" class="text-gray-500 dark:text-gray-300" :title="$t('viewTypeCheckedWarning')" />
                      <span class="label-text text-gray-800 dark:text-gray-200">
                        {{ `${$t('accordionView')} / ${$t('flatView')}` }}&nbsp;
                      </span>
                      <input v-model="viewTypeChecked" type="checkbox" class="toggle toggle-primary">
                    </label>

                    <label
                      v-if="!viewTypeChecked"
                      class="label cursor-pointer text-sm w-64 mx-auto lg:ml-auto my-auto"
                      :aria-label="$t('toggleExpandAllHandles')"
                    >
                      <LazyIcon v-if="!expandAllHandlesChecked" class="dark:text-white" name="tabler:layout-navbar-expand" />
                      <LazyIcon v-else class="dark:text-white" name="tabler:layout-navbar-collapse" />
                      &nbsp;
                      <span v-if="!expandAllHandlesChecked">{{ $t('expandAll') }}</span>
                      <span v-else>{{ $t('collapseAll') }}</span>
                      <input v-model="expandAllHandlesChecked" type="checkbox" class="toggle toggle-primary">
                    </label>
                  </div>

                  <!-- Active facets -->
                  <div class="col-span-full border-base-200 border-2 rounded-lg bg-base-100">
                    <div class="lg:col-span-full card p-2 flex flex-col md:flex-row justify-between w-full dark:bg-gray-800 rounded-lg">
                      <div class="w-full md:w-1/2 flex flex-row justify-start">
                        <h2 class="font-bold text-gray-800 dark:text-gray-200">{{ $t('activeFacets') }}</h2>
                      </div>
                      <div class="w-full md:w-1/2 flex flex-row justify-end">
                        <ais-clear-refinements
                          :class-names="{
                            'ais-ClearRefinements-button': 'btn btn-outline btn-sm border-neutral text-gray-700 hover:bg-gray-600 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700',
                            'ais-CurrentRefinements-delete': 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                          }"
                        >
                          <template #resetLabel>
                            <Icon name="tabler:trash" /> <span class="accent">{{ $t('clearallfilters') }}</span>
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
                            {{ $t(item.label.split('.').at(-1)) }}:
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
                                <Icon class="text-lg" name="formkit:trash" />
                              </a>
                            </li>
                          </ul>
                        </template>
                      </ais-current-refinements>
                    </div>
                  </div>

                  <LazyDetailPaginationComp class="col-span-full border-base-200 border-2 rounded-lg" />
                </div>

                <div class="flex w-full flex-col">
                  <div class="divider divider-neutral w-full">
                    <span v-if="searchQuery">Suchergebnisse für '{{ searchQuery }}'</span>
                  </div>
                </div>

                <ClientOnly>
                  <div class="overflow-x-auto w-full" style="overflow-y:hidden;">
                    <ais-hits v-slot="s">
                      <SearchNoResultsComp
                        v-if="(s?.items ?? []).length === 0"
                        class="text-center text-gray-500 py-6"
                      />
                      <SearchHitsComp
                        v-else
                        :items="s?.items ?? []"
                        :view-type-checked="viewTypeChecked"
                        :production-details-checked="productionDetailsChecked"
                        :expanded-handles="expandedHandles"
                        :expand-all-handles-checked="expandAllHandlesChecked"
                        :is-search-loading="isSearchLoading"
                        :current-refinements="currentRefinements"
                      />
                    </ais-hits>
                  </div>
                  <LazyDetailPaginationComp />
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </ais-instant-search>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false }) // client-only keeps InstantSearch happy

const { $toggleFacetDrawerState }: any = useNuxtApp()

// toggles
const viewTypeChecked = ref(false)
const expandAllChecked = ref(false)
const expandAllHandlesChecked = ref(false)
const productionDetailsChecked = ref(true)
const expandedHandles = ref<Set<string>>(new Set())
const searchQuery = ref('')

// InstantSearch client (LOCAL)
import Client from '@searchkit/instantsearch-client'
import { config } from '../../searchConfig_avefi'
import { inject, computed } from 'vue'
import { history as defaultRouter } from 'instantsearch.js/es/lib/routers'

const runtime = useRuntimeConfig()
const indexName = runtime.public.ELASTIC_INDEX
const searchClient = Client({
  config,
  url: `${runtime.public.AVEFI_ELASTIC_API}/${runtime.public.AVEFI_SEARCH}`,
})
console.log('[IS] index:', indexName, 'client ok:', !!searchClient?.search)

// current refinements (defensive)
const aisState = inject<any>('$_ais_state')
const currentRefinements = computed(() => {
  if (!aisState || !aisState.results) return []
  const uiState =
    aisState.results._rawResults?.[0]?.userData?.[0]?.uiState ||
    aisState.uiState
  if (!uiState) return []

  const refinements: any[] = []
  Object.entries(uiState).forEach(([_, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([facet, facetValue]) => {
        if (Array.isArray(facetValue) && facetValue.length) {
          refinements.push({ label: facet, values: facetValue })
        } else if (typeof facetValue === 'object' && facetValue !== null) {
          Object.entries(facetValue).forEach(([op, val]) => {
            refinements.push({ label: facet, values: [`${op}: ${val}`] })
          })
        } else if (facetValue) {
          refinements.push({ label: facet, values: [facetValue] })
        }
      })
    }
  })
  return refinements
})

// expandAll util (unchanged)
const expandAllItems = () => {
  const expandIcons = document.querySelectorAll('.expand-icon')
  expandIcons.forEach(icon => { (icon as HTMLElement).click() })
  setTimeout(() => {
    const checkboxes = document.querySelectorAll('.manifestation-checkbox') as NodeListOf<HTMLInputElement>
    checkboxes.forEach(checkbox => { checkbox.checked = !checkbox.checked })
  }, 300)
}
watch(expandAllChecked, () => { expandAllItems() })

// reset facets on view type change
watch(viewTypeChecked, () => {
  setTimeout(() => {
    const clearBtn = document.querySelector('.ais-ClearRefinements-button')
    if (clearBtn instanceof HTMLElement) clearBtn.click()
  }, 0)
})

// loading spinner observer
const isSearchLoading = ref(false)
let observer: MutationObserver | null = null
const updateState = () => {
  const el = document.getElementById('search-loading')
  if (!el) { isSearchLoading.value = false; return }
  isSearchLoading.value = !el.classList.contains('hidden')
}
onMounted(() => {
  const el = document.getElementById('search-loading')
  if (el) {
    observer = new MutationObserver(updateState)
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    updateState()
  } else {
    const poll = setInterval(() => {
      const el2 = document.getElementById('search-loading')
      if (el2) {
        clearInterval(poll)
        updateState()
        observer = new MutationObserver(updateState)
        observer.observe(el2, { attributes: true, attributeFilter: ['class'] })
      }
    }, 100)
  }
})
onBeforeUnmount(() => { if (observer) observer.disconnect() })

// (Optional) your extended router if you want later; currently not used
const routerInstance = defaultRouter()
const stateMapping = {
  stateToRoute(uiState:any) {
    const s = uiState[indexName] || {}
    const numericRefinements = s.numericRefinements || {}
    const prodYearsOnlyFlag = s.prodYearsOnly === true ? '1' : undefined
    return {
      [`${indexName}[query]`]: s.query || '',
      ...(Object.keys(numericRefinements).length ? { [`${indexName}[numericRefinement]`]: numericRefinements } : {}),
      ...(prodYearsOnlyFlag ? { [`${indexName}[prodYearsOnly]`]: prodYearsOnlyFlag } : {}),
    }
  },
  routeToState(routeState:any) {
    const numericRefinements = routeState[`${indexName}[numericRefinement]`] || {}
    const prodYearsOnlyFlag = routeState[`${indexName}[prodYearsOnly]`] === '1'
    return {
      [indexName]: {
        query: routeState[`${indexName}[query]`] || '',
        numericRefinements,
        prodYearsOnly: prodYearsOnlyFlag,
      },
    }
  },
}
const extendedRouting = { router: routerInstance, stateMapping }
</script>

<style scoped lang="scss">
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
</style>
