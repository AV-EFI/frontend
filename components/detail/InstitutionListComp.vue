<template>
  <div>
    <ais-instant-search
      :search-client="searchClient"
      index-name="21.11155-denormalised-work"
      :show-loading-indicator="true"
      :routing="true"
      :future="{preserveSharedStateOnUnmount: true}"
    >
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="form-control w-full md:w-2/3">
          <div class="searchbox p-2">
            <ais-search-box>
              <template #default="{ currentRefinement, isSearchStalled, refine }">
                <div
                  class="text-sm flex items-center w-full py-1.5 px-2.5 rounded-xl border border-zinc-300 bg-white focus-within:ring-1 focus-within:!ring-primary-400 focus-within:!border-primary-400 group-data-[invalid]:border-red-400 group-data-[invalid]:ring-1 group-data-[invalid]:ring-red-400 group-data-[disabled]:bg-zinc-100 group-data-[disabled]:!cursor-not-allowed shadow-sm group-[]/repeater:shadow-none group-[]/multistep:shadow-none dark:bg-zinc-800 dark:border-zinc-600 dark:group-data-[disabled]:bg-zinc-700 dark:group-data-[invalid]:border-red-400 dark:group-data-[invalid]:ring-red-400 formkit-inner !rounded-3xl"
                >
                  <label
                    class="flex items-center -ml-0.5 mr-1.5 text-sm h-[1em] w-[1em] shrink-0 [&>svg]:w-full text-zinc-600 dark:text-zinc-300 formkit-prefixIcon formkit-icon"
                    for="input_0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 15 16"
                    >
                      <path
                        d="M6.5,13.02c-1.41,0-2.82-.54-3.89-1.61-1.04-1.04-1.61-2.42-1.61-3.89s.57-2.85,1.61-3.89c2.14-2.14,5.63-2.14,7.78,0,1.04,1.04,1.61,2.42,1.61,3.89s-.57,2.85-1.61,3.89c-1.07,1.07-2.48,1.61-3.89,1.61Zm0-10c-1.15,0-2.3,.44-3.18,1.32-.85,.85-1.32,1.98-1.32,3.18s.47,2.33,1.32,3.18c1.75,1.75,4.61,1.75,6.36,0,.85-.85,1.32-1.98,1.32-3.18s-.47-2.33-1.32-3.18c-.88-.88-2.03-1.32-3.18-1.32Z"
                        fill="currentColor"
                      />
                      <path
                        d="M13.5,15c-.13,0-.26-.05-.35-.15l-3.38-3.38c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l3.38,3.38c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z"
                        fill="currentColor"
                      />
                    </svg>
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
        </div>
      </div>
      <ais-configure :hits-per-page.camel="10" />
      <div class="w-full flex flex-col md:flex-row">
        <div class="w-full md:w-1/3 flex flex-col justify-end">
          <ais-stats>
            <template #default="{ nbHits }">
              <h2 class="text-zinc-700 font-bold dark:text-zinc-300">
                {{ nbHits }} {{ $t('results') }}
              </h2>
            </template>
          </ais-stats>
        </div>
        <div class="form-control w-full md:w-2/3 flex flex-col justify-end">
          <label class="label cursor-pointer w-40 ml-auto">
            <span class="label-text text-zinc-700 dark:text-zinc-300">{{ `${$t('list')} / ${$t('grid')}` }}&nbsp;</span>
            <input
              v-model="viewTypeChecked"
              type="checkbox"
              class="toggle"
            >
          </label>
        </div>
      </div>
      <ais-hits
        class="p-2 overflow-x-auto hover:overflow-x-scroll"
        style="overflow-y:hidden;"
      >
        <template #default="{ items }">          
          <SearchTableViewComp
            v-if="viewTypeChecked"
            :items="items"
          />
          <SearchListViewComp
            v-else
            :items="items"
          />
        </template>
      </ais-hits>
      <div class="pagination flex justify-center">
        <ais-pagination
          :class-names="{
            'ais-Pagination-list': 'join w-full md:w-auto',
            'ais-Pagination-item': 'join-item bg-slate-200 dark:bg-slate-800 w-9 md:max-w-28 p-1 md:p-2',
            'ais-Pagination-link': ''
          }"
        />
      </div>
    </ais-instant-search>
  </div>
</template>

<script setup lang="ts">
import type { Header } from 'vue3-easy-data-table';
import SearchkitInstantSearchClient from '@searchkit/instantsearch-client';
const viewTypeChecked = ref(false);
const searchClient = SearchkitInstantSearchClient({
    url: "/api/elastic/msearch_inst",
    
});
const headers: Header[] = [
    { text: "Title", value: "_source.has_record.has_primary_title.has_ordering_name", sortable:true },
    { text: "ID", value: "_id", sortable:true },
    { text: 'Category', value: '_source.has_record.category', sortable: true},
    { text: 'Countries', value: 'fields.countries', sortable: true},
    { text: 'Year', value: 'fields.productionyears', sortable: true},
    { text: 'Directors', value: 'fields.directors', sortable: true},
    { text: 'CastMembers', value: 'fields.castmembers', sortable: true},
    { text: 'Producers', value: 'fields.producers', sortable: true},
];
</script>