<template>
  <div class="drawer w-0 md:w-[20em] drawer-start md:drawer-open">
    <input
      id="facet_drawer"
      type="checkbox"
      class="drawer-toggle"
      :checked="objectListStore.facetDrawerOpen"
    >
    <div class="drawer-side z-20 h-full">
      <label
        aria-label="close sidebar"
        class="drawer-overlay z-99"
        @click="toggleDrawer"
      />
      <div class="menu p-4 w-[100vw] md:w-80 min-h-full bg-neutral text-base-content">
        <div class="flex flex-row justify-end">
          <button 
            class="btn btn-outline btn-ghost w-16 md:hidden"
            title="Close drawer"
            @click="$toggleFacetDrawerState"
          >
            <Icon name="formkit:caretleft" />
          </button>
        </div>
        <div class="w-100 flex flex-row p-2">
          <div class="search-panel__filters md:mr-1">
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400 mb-4">
                  {{ $t('facetyear') }}
                </p>
              </template>
              <template #default="{ hasRefinements }">
                <!-- https://www.algolia.com/doc/api-reference/widgets/range-slider/vue/?client=Vue+3 -->
                
                <!--
                 <ais-range-input
                  attribute="has_record.has_event.has_date.keyword"
                  class="mt-4 p-4 md:mr-4"
                >
                  <template
                    #default="{
                      currentRefinement,
                      range,
                      canRefine,
                      refine,
                      sendEvent,
                    }"
                  >
                    <pre>{{ range }}</pre>
                    <pre class="mb-4">{{ currentRefinement }}</pre>
                    <InputVueSlider 
                      v-model:valueLow="currentRefinement.min"
                      v-model:valueHigh="currentRefinement.max"
                      class="mt-4"
                      :min="range.min > 0?range.min:1850"
                      :max="range.max > 0?range.max:new Date().getFullYear()"                     
                    />
                    <button
                      type="submit"
                      class="btn btn-sm btn-primary btn-block"
                      @click="refine(currentRefinement.min, currentRefinement.max)"
                    >
                      Filtern
                    </button>
                  </template>
                  <template #submitLabel>
                    Submit
                  </template>
                </ais-range-input>
                
                 -->
                <ais-range-input
                  attribute="has_record.has_event.has_date"
                  :precision="0"
                  :min="1850"
                  :max="2024"
                  :class-names="{
                    'ais-RefinementList-label': 'p-0',
                    'ais-RefinementList-labelText': 'dark:text-primary-50',
                    'ais-SearchBox-input': 'appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent !text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:text-zinc-400 group-data-[disabled]:!cursor-not-allowed dark:placeholder-zinc-400/50 dark:text-zinc-300 border-none p-0 focus:ring-0 formkit-input !text-lg p-2',
                    'ais-RangeInput-input':'max-w-20 dark:bg-transparent',
                    'ais-RangeInput-form': 'flex justify-between',
                    'ais-RangeInput-submit': 'btn btn-sm btn-primary'
                  }"
                >
                  <template #submitLabel>
                    {{ $t('filter') }}
                  </template>
                </ais-range-input>
              </template>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  {{ $t('avefi:Subject') }}
                </p>
              </template>
              
              <ais-refinement-list
                attribute="has_record.has_subject.has_name"
                :searchable="true"
              >
                <template
                  #default="{
                    items,
                    isFromSearch,
                    refine,
                    createURL,
                    searchForItems
                  }"
                >
                  <input
                    class="ais-SearchBox-input appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 group-data-[disabled]:!cursor-not-allowed dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none focus:ring-0 formkit-input !p-3 !rounded-3xl"
                    :placeholder="$t('search')"
                    @input="searchForItems($event?.currentTarget?.value)"
                  >
                  <ul>
                    <li v-if="isFromSearch && !items.length">
                      No results.
                    </li>
                    <li
                      v-for="item in items"
                      :key="item.value"
                    >
                      <a
                        :href="createURL(item)"
                        :style="{ fontWeight: item.isRefined ? 'bold' : '' }"
                        @click.prevent="refine(`${item.value.replace('avefi:','*')}`)"
                      >
                        <span>{{ $t(item.label) }}</span>
                        <div class="badge text-white badge-secondary">{{ item.count.toLocaleString() }}</div>
                      </a>
                    </li>
                  </ul>
                </template>
              </ais-refinement-list>
            </ais-panel>
            
            <div class="pb-4">
              <p class="text-base text-primary-400">
                TBD:
              </p>
              <p class="text-base text-primary-400">
                Filmh. Institution / Herausgeber
              </p>
              <p class="text-base text-primary-400">
                Produktionsland
              </p>
              <p class="text-base text-primary-400">
                Produktionsjahr
              </p>
              <p class="text-base text-primary-400">
                Materialart (z.B. Dupnegativ)
              </p>
              <p class="text-base text-primary-400">
                Manifestationstyp
              </p>
              <p class="text-base text-primary-400">
                Materialformat (z.B. 35mm)
              </p>
              <p class="text-base text-primary-400">
                Länge in Metern/Dauer in Minuten
              </p>
              <p class="text-base text-primary-400">
                Sprachangaben
              </p>
              <p class="text-base text-primary-400">
                Ton
              </p>
              <p class="text-base text-primary-400">
                Schlagwörter
              </p>
              <p class="text-base text-primary-400">
                Filmhaltende Institution?
              </p>
            </div>
            <!-- TBD -->
            <!--
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Produktionsland
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>

            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Produktionsjahr
                </p>
              </template>
              <p>TBD</p>
              <ais-range-input
                attribute="string"
                :min="1900"
                :max="2024"
                :precision="0"
              />
            </ais-panel>

            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Regie
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Manifestationstyp
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Materialart (z.B. Dupnegativ)
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Materialformat (z.B. 35mm)
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Länge in Metern/Dauer in Minuten
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Sprachangaben
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Farbigkeit
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
            <ais-panel>
              <template #header>
                <p class="text-base text-primary-400">
                  Ton
                </p>
              </template>
              <p>TBD</p>
            </ais-panel>
          -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useObjectListStore} from '../../stores/compareList';

const {$toggleFacetDrawerState}:any = useNuxtApp();
const objectListStore = useObjectListStore();

const toggleDrawer = (() => {
    objectListStore.facetDrawerOpen = !objectListStore.facetDrawerOpen;
});

const customRefine = (param1, param2) => {
    console.log(param1);
    console.log(param2);
};
const toValue = (value, range) => {
    return [
        typeof value.min === "number" ? value.min : range.min,
        typeof value.max === "number" ? value.max : range.max,
    ];
};

const formatMinValue = (minValue, minRange) => {
    return minValue !== null && minValue !== minRange ? minValue : '';
};
const formatMaxValue = (maxValue, maxRange) => {
    return maxValue !== null && maxValue !== maxRange ? maxValue : '';
};

</script>
<style scoped>
.ais-RangeInput-submit {
  background-color: none;
}
</style>