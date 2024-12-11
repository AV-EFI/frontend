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
        class="drawer-overlay z-30"
        @click="toggleDrawer"
      />
      <div class="menu p-4 w-[100vw] md:w-80 overflow-hidden min-h-full bg-neutral dark:bg-slate-950 text-base-content">
        <div class="flex flex-row justify-end">
          <button 
            class="btn btn-outline btn-ghost w-16 md:hidden"
            title="Close drawer"
            @click="$toggleFacetDrawerState"
          >
            <Icon name="formkit:caretleft" />
          </button>
        </div>
        <div class="w-full flex flex-row p-2">
          <div class="search-panel__filters md:mr-1 max-w-full">
            <!--
            <ais-panel class="md:collapse md:collapse-arrow md:border-base-300 md:bg-base-200 md:border">
              <template #header>
                <p class="text-base text-primary-400 mb-4">
                  {{ $t('facetyear') }}
                </h4>
              </template>
              <template #default="{ hasRefinements }">
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
              </template>
            </ais-panel>
            -->
            <SearchPanelRefinementListComp
              header-text="category"
              attribute-name="category_clean"
              :translate-label="true"
              :is-searchable="false"
              tab-index="0"
            />
            <SearchPanelRefinementListComp
              header-text="country"
              attribute-name="countries"
              tab-index="1"
            />
            <SearchPanelRefinementListComp
              header-text="year"
              attribute-name="productionyears"
              tab-index="2"
            />
            <SearchPanelRefinementListComp
              header-text="Director"
              attribute-name="directors"
              tab-index="3"
            />
            <SearchPanelRefinementListComp
              header-text="CastMember"
              attribute-name="castmembers"
              tab-index="4"
            />
            <SearchPanelRefinementListComp
              header-text="avefi:ProductionEvent"
              attribute-name="producers"
              tab-index="5"
            />
            <SearchPanelRefinementListComp
              header-text="avefi:Subject"
              attribute-name="subjects"
              tab-index="6"
            />
                                                
            <div class="p-4 text-slate-600">
              <h4>
                TBD:
              </h4>
              <h4>
                Filmh. Institution / Herausgeber
              </h4>
              <h4>
                Materialart (z.B. Dupnegativ)
              </h4>
              <h4>
                Manifestationstyp
              </h4>
              <h4>
                Materialformat (z.B. 35mm)
              </h4>
              <h4>
                Länge in Metern/Dauer in Minuten
              </h4>
              <h4>
                Sprachangaben
              </h4>
              <h4>
                Ton
              </h4>
            </div>
            <!-- TBD -->
            <!--
            <ais-panel>
              <template #header>
                <h4>
                  Produktionsland
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>

            <ais-panel>
              <template #header>
                <h4>
                  Produktionsjahr
                </h4>
              </template>
              <h4>TBD</h4>
              <ais-range-input
                attribute="string"
                :min="1900"
                :max="2024"
                :precision="0"
              />
            </ais-panel>

            <ais-panel>
              <template #header>
                <h4>
                  Regie
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Manifestationstyp
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Materialart (z.B. Dupnegativ)
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Materialformat (z.B. 35mm)
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Länge in Metern/Dauer in Minuten
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Sprachangaben
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Farbigkeit
                </h4>
              </template>
              <h4>TBD</h4>
            </ais-panel>
            <ais-panel>
              <template #header>
                <h4>
                  Ton
                </h4>
              </template>
              <h4>TBD</h4>
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

onMounted(() => {
    console.log('mounted');
    (function() {
        function addCollapseCheckboxDom() {
            const collapsePanels = document.querySelectorAll('.ais-Panel');
            console.log(collapsePanels);
            collapsePanels.forEach((panel) => {
                const collapseCheckbox = document.createElement('input');
                collapseCheckbox.type = 'checkbox';
                collapseCheckbox.classList.add('collapse-checkbox');
                panel?.prepend(collapseCheckbox);
            });
        }

        addCollapseCheckboxDom();
    })();
});

function customCollapseToggle(e) {
    console.log(e.target.parentElement);
    if(e.target.parentElement.classList.contains('collapse-open')) {
        e.target.parentElement.classList.remove('collapse-open');
        e.target.parentElement.classList.add('collapse-close');
    } else {
        e.target.parentElement.classList.remove('collapse-close');
        e.target.parentElement.classList.add('collapse-open');
    }
}

</script>
<style scoped>
.ais-RangeInput-submit {
  background-color: none;
}

.ais-Panel {
  margin-bottom: .25rem!important;
}

.ais-Panel-header {
  margin-bottom: 0px!important;
}

.collapse-title {
  min-height: 1rem!important;
  padding-top: 0.25rem!important;
  padding-bottom: 0.25rem!important;
}
</style>