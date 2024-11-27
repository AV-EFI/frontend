<template>
  <div>    
    <div class="container">
      <ais-instant-search
        :search-client="searchClient"
        :index-name="indexName"
        :stalled-search-delay="1000"
        :show-loading-indicator="true"
        :routing="routing"
        :future="{preserveSharedStateOnUnmount: true}"
      >
        <pre>{{ indexName }}</pre>
        <ais-configure :hits-per-page.camel="20" />
        <ais-menu attribute="categories" />
        <div class="search-panel">
          <GlobalFacetDrawer />
          
          <!-- Center -->
          <div class="drawer-content w-full flex flex-col items-center justify-center">
            <div class="search-panel__results w-full">
              <div class="searchbox">
                <ais-search-box
                  class="p-1"
                >
                  <template #default="{ currentRefinement, isSearchStalled, refine }">
                    <div
                      class="text-sm flex items-center w-full py-1.5 px-2.5 rounded-xl border border-zinc-300 bg-white focus-within:ring-1 focus-within:!ring-primary-400 focus-within:!border-primary-400 group-data-[invalid]:border-red-400 group-data-[invalid]:ring-1 group-data-[invalid]:ring-red-400 group-data-[disabled]:bg-zinc-100 group-data-[disabled]:!cursor-not-allowed shadow-sm group-[]/repeater:shadow-none group-[]/multistep:shadow-none dark:bg-transparent dark:border-zinc-300 dark:group-data-[disabled]:bg-zinc-800/5 dark:group-data-[invalid]:border-red-400 dark:group-data-[invalid]:ring-red-400 formkit-inner !rounded-3xl"
                    >
                      <label
                        class="flex items-center -ml-0.5 mr-1.5 text-sm h-[1em] w-[1em] shrink-0 [&amp;>svg]:w-full text-zinc-600 dark:text-zinc-300 formkit-prefixIcon formkit-icon"
                        for="input_0"
                      ><svg
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
                      <input
                        type="search"
                        class="appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 group-data-[disabled]:!cursor-not-allowed dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none p-0 focus:ring-0 formkit-input !text-lg p-2 !rounded-3xl"
                        :value="currentRefinement"
                        @input="refine($event.currentTarget.value)"
                      >
                      <span
                        :class="[!isSearchStalled ? 'hidden' : '','loading loading-spinner loading-sm']"
                      />
                    </div>
                  </template>
                </ais-search-box>
              </div>
              
              <div
                class="w-full flex flex-col md:flex-row justify-between md:justify-between"
                mb-2
              >
                <div class="w-full md:w-1/3 mb-1 flex flex-col justify-center">
                  <ais-stats>
                    <template #default="{ nbHits }">
                      <h3 class="text-lg">
                        {{ nbHits }} {{ $t('results') }}
                      </h3>
                    </template>
                  </ais-stats>
                </div>
                <div class="w-full md:w-1/3 mb-1">
                  <FormKit
                    type="select"
                    :label="$t('sorting')"
                    :disabled="true"
                    name="sort"
                    :options="[
                      'Standard',
                      'Titel aufst.',
                      'Titel abst.',
                    ]"
                  />
                  <!--
                  <p class="label text-xs font-bold">
                    Sortierung (nicht aktiv)
                  </p>
                  <ais-sort-by
                    class="input-md text-md w-full p-0 dark:bg-transparent"
                    :classes="{
                      'ais-SortBy-select': '!dark:bg-transparent'
                    }"
                    aria-disabled="true"
                    disabled="disabled"
                    :select="{'disabeld': 'disabled'}"
                    :items="[
                      { value: 'imdb_movies', label: 'Standard' },
                    ]"
                  />
                -->
                </div>
              </div>
              <div class="mt-2 mb-2">
                <button
                  class="btn btn-primary md:hidden"
                  title="Show facet items"
                  @click="$toggleFacetDrawerState"
                >
                  <Icon name="formkit:caretright" />&nbsp;Show Facet Items
                </button>
              </div>
              <div class="mb-4">
                <h2 class="mb-2">
                  {{ $t('activefiltering') }}
                </h2>
                <ais-current-refinements 
                  :class-names="{
                    'ais-CurrentRefinements-list': 'flex flex-row',
                    'ais-CurrentRefinements-item': 'border-2 border-primary-200 text-primary-600 dark:text-primary-200 dark:border-primary-400 w-full !rounded-2xl p-2 md:w-fit md:p-4 md:max-w-1/4 md:mr-1',
                    'ais-CurrentRefinements-delete': 'text-white',
                    'ais-ClearRefinements-button': 'btn btn-error bg-error',
                  }"
                >
                  <template #item="{ item, refine, createURL }">
                    <strong>{{ $t(item.label.split(".").at(-1)) }}:</strong>
                    <ul>
                      <li
                        v-for="refinement in item.refinements"
                        :key="[
                          refinement.attribute,
                          refinement.type,
                          refinement.value,
                          refinement.operator
                        ].join(':')"
                        class="flex-start"
                      >
                        <a
                          :href="createURL(refinement)"
                          @click.prevent="refine(refinement)"
                        >
                          &nbsp;{{ refinement.label }}&nbsp;
                          |&nbsp;
                          <Icon
                            class="!align-middle text-lg"
                            name="formkit:trash"
                          />
                        </a>
                      </li>
                    </ul>
                  </template>
                </ais-current-refinements>
              </div>
              <div class="mb-4">
                <ais-clear-refinements 
                  :class-names="{
                    'ais-ClearRefinements-button': 'btn !btn-error',
                    'ais-CurrentRefinements-delete': '!text-white'
                  }"
                >
                  <template #resetLabel>
                    {{ $t('clearallfilters') }}
                  </template>
                </ais-clear-refinements>
              </div>
              <div class="w-full">
                <div class="form-control float-right w-36">
                  <label class="label cursor-pointer">
                    <span class="label-text">Tabelle / Liste</span>
                    <input
                      v-model="checked"
                      type="checkbox"
                      class="toggle"
                    >
                  </label>
                </div>
              </div>
              <div class="overflow-x-auto w-full">
                <ais-hits>
                  <template #default="{ items }">          
                    <SearchTableViewComp
                      v-if="!checked"
                      :items="items"
                    />
                    <SearchListViewComp
                      v-else
                      :items="items"
                    />
                  </template>
                </ais-hits>
              </div>

              <div class="pagination flex justify-center">
                <ais-pagination
                  :class-names="{
                    'ais-Pagination-list': 'join',
                    'ais-Pagination-item': 'join-item max-w-8 md:max-w-24',
                    'ais-Pagination-link': 'p-1 md:p-4'
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </ais-instant-search>
    </div>
  </div>
</template>


<script setup lang="ts">
import { history } from 'instantsearch.js/es/lib/routers';
const {$toggleFacetDrawerState}:any = useNuxtApp();
const checked = ref(false);

const routing = {
    stateMapping: {
        stateToRoute(uiState) {
            const indexUiState = uiState[props.indexName];
            return {
                q: indexUiState.query,
                categories: indexUiState.menu && indexUiState.menu.categories,
                type: indexUiState.refinementList && indexUiState.refinementList.type,
                page: indexUiState.page,
            };
        },
        routeToState(routeState) {
            return {
                [props.indexName]: {
                    query: routeState.q,
                    menu: {
                        categories: routeState.categories,
                    },
                    refinementList: {
                        type: routeState.type,
                    },
                    page: routeState.page,
                },
            };
        },
    },
    router: history({
        cleanUrlOnDispose: false,
    })
};

const props = defineProps({
    searchClient: {
        type: Object,
        required: true,
    },
    indexName: {
        type: String,
        required: true,
        default: '21.11155-dev-runtime'
    },
});
</script>
<style>

html[data-theme="avefi_dark"] .ais-Pagination-link {
  background-color: var(--primary-800)!important;
  background-image: none!important;
  color:#fefefe;
}

html[data-theme="avefi_dark"] .ais-Pagination-item--disabled .ais-Pagination-link {
  background-image: none!important;
}

</style>