<template>
  <div class="drawer w-0 md:w-[20em] drawer-start md:drawer-open">
    <input
      id="facet_drawer"
      type="checkbox"
      class="drawer-toggle"
      :checked="objectListStore.facetDrawerOpen"
    >
    <div class="drawer-side z-20 md:z-10 h-full">
      <label
        aria-label="close sidebar"
        class="drawer-overlay z-30"
        @click="toggleDrawer"
      />
      <div class="menu md:px-4 w-[100vw] md:w-80 overflow-hidden min-h-full bg-neutral dark:bg-slate-950 text-base-content dark:text-white">
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
            <SearchPanelRefinementListComp
              header-text="Genre"
              attribute-name="has_genre_has_name"
              category="avefi:WorkVariant"
              tab-index="1"
            />
            <SearchPanelRefinementListComp
              header-text="country"
              attribute-name="located_in_has_name"
              category="avefi:WorkVariant"
              tab-index="2"
            />
            <SearchPanelRefinementListComp
              header-text="years"
              attribute-name="years"
              category="avefi:WorkVariant"
              tab-index="2"
            />

            <SearchPanelRefinementListComp
              header-text="directors_or_editors"
              attribute-name="directors_or_editors"
              category="avefi:WorkVariant"
              tab-index="3"
            />
            <SearchPanelRefinementListComp
              header-text="CastMember"
              attribute-name="castmembers"
              category="avefi:WorkVariant"
              tab-index="4"
            />
            <SearchPanelRefinementListComp
              header-text="avefi:ProductionEvent"
              attribute-name="production"
              category="avefi:WorkVariant"
              tab-index="5"
            />
            <SearchPanelRefinementListComp
              header-text="avefi:Subject"
              attribute-name="subjects"
              category="avefi:WorkVariant"
              tab-index="6"
            />
            <SearchPanelRefinementListComp
              header-text="dataholding"
              attribute-name="has_issuer_name"
              category="avefi:Manifestation"
              :is-searchable="false"
              tab-index="2"
            />
            <SearchPanelRefinementListComp
              header-text="in_language_code"
              attribute-name="in_language_code"
              category="avefi:Manifestation"
              tab-index="1"
            />
            <SearchPanelRefinementListComp
              header-text="has_sound_type"
              attribute-name="has_sound_type"
              category="avefi:Manifestation"
              :is-searchable="false"
              tab-index="1"
            />
            <SearchPanelRefinementListComp
              header-text="has_duration"
              attribute-name="has_duration_has_value"
              category="avefi:Manifestation"
              :is-searchable="false"
              tab-index="2"
            />
            <SearchPanelRefinementListComp
              header-text="manifestation_event_type"
              attribute-name="manifestation_event_type"
              category="avefi:Manifestation"
              :is-searchable="false"
              tab-index="2"
            />
            <SearchPanelRefinementListComp
              header-text="has_format"
              attribute-name="has_format_type"
              category="avefi:Item"
              :is-searchable="false"
              tab-index="2"
            />
            <SearchPanelRefinementListComp
              header-text="has_colour"
              attribute-name="has_colour_type"
              :is-searchable="false"
              category="avefi:Item"
              tab-index="0"
            />
            <SearchPanelRefinementListComp
              header-text="item_element_type"
              attribute-name="item_element_type"
              category="avefi:Item"
              :is-searchable="false"
              tab-index="2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useObjectListStore } from '../../stores/compareList';

const { $toggleFacetDrawerState }: any = useNuxtApp();
const objectListStore = useObjectListStore();

const toggleDrawer = () => {
    objectListStore.facetDrawerOpen = !objectListStore.facetDrawerOpen;
};

const customRefine = (param1, param2) => {
    console.log(param1);
    console.log(param2);
};

const toValue = (value, range) => {
    return [
        typeof value.min === 'number' ? value.min : range.min,
        typeof value.max === 'number' ? value.max : range.max,
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
    (function () {
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
    if (e.target.parentElement.classList.contains('collapse-open')) {
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
  margin-bottom: 0.25rem !important;
}

.ais-Panel-header {
  margin-bottom: 0px !important;
}

.collapse-title {
  min-height: 1rem !important;
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}
</style>
