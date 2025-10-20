<template>
  <div class="drawer w-0 lg:w-[20em] drawer-start lg:drawer-open">
    <input
      id="facet_drawer"
      type="checkbox"
      class="drawer-toggle"
      :aria-label="$t('toggleFacetDrawer')"
      :checked="objectListStore.facetDrawerOpen"
    >
    <div class="drawer-side max-md:w-full z-30 lg:z-10 h-full max-md:h-screen">
      <label
        aria-label="close sidebar"
        class="drawer-overlay z-30"
        @click="toggleDrawer"
      />
      <div class="menu w-screen md:w-[100vw] lg:w-80 overflow-hidden min-h-full max-md:bg-white max-md:w-90vw dark:bg-slate-950 text-base-content dark:text-white z-30">
        <div class="flex flex-row justify-end">
          <button 
            class="btn btn-neutral w-16 lg:hidden"
            :title="`${$t('closeDrawer')}`"
            @click="$toggleFacetDrawerState"
          >
            <Icon
              class="text-xl"
              name="formkit:close"
            />
          </button>
        </div>
        <div class="w-full flex flex-row p-2">
          <div class="search-panel__filters lg:mr-1 max-w-full">
            <SearchPanelRefinementListComp
              header-text="Genre"
              attribute-name="has_genre_has_name"
              category="avefi:WorkVariant"
              :tab-index="1"
              :aria-label="$t('Genre')"
            />
            <SearchPanelRefinementListComp
              header-text="has_form"
              attribute-name="has_form"
              category="avefi:WorkVariant"
              :tab-index="2"
              :aria-label="$t('has_form')"
            />
            <SearchPanelRefinementListComp
              header-text="place"
              attribute-name="located_in_has_name"
              category="avefi:WorkVariant"
              :tab-index="3"
              :aria-label="$t('place')"
            />
            <SearchPanelRefinementListComp
              header-text="directors_or_editors"
              attribute-name="directors_or_editors"
              category="avefi:WorkVariant"
              :tab-index="4"
              :aria-label="$t('directors_or_editors')"
            />
            <SearchPanelRefinementListComp
              header-text="CastMember"
              attribute-name="castmembers"
              category="avefi:WorkVariant"
              :tab-index="5"
              :aria-label="$t('CastMember')"
            />
            <SearchPanelRefinementListComp
              header-text="avefi:ProductionEvent"
              attribute-name="production"
              category="avefi:WorkVariant"
              :tab-index="6"
              :aria-label="$t('avefi:ProductionEvent')"
            />
            <InputVueSlider
              header-text="productionyear"
              category="avefi:WorkVariant"
              :tab-index="7"
              :aria-label="$t('productionyear')"
            />
            <SearchPanelRefinementListComp
              header-text="avefi:Subject"
              attribute-name="subjects"
              category="avefi:WorkVariant"
              :tab-index="8"
              :aria-label="$t('avefi:Subject')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="dataholding"
              attribute-name="has_issuer_name"
              category="avefi:Manifestation"
              :is-searchable="false"
              :tab-index="9"
              :aria-label="$t('dataholding')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="manifestation_event_type"
              attribute-name="manifestation_event_type"
              category="avefi:Manifestation"
              :is-searchable="false"
              :tab-index="13"
              :aria-label="$t('manifestation_event_type')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="in_language_code"
              attribute-name="in_language_code"
              :is-searchable="false"
              category="avefi:Item"
              :tab-index="10"
              :aria-label="$t('in_language_code')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="has_sound_type"
              attribute-name="has_sound_type"
              category="avefi:Item"
              :is-searchable="false"
              :tab-index="11"
              :aria-label="$t('has_sound_type')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="item_duration_in_minutes"
              attribute-name="item_duration_in_minutes"
              input-type="numeric"
              category="avefi:Item"
              :is-searchable="false"
              :tab-index="12"
              :aria-label="$t('has_duration')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="has_colour"
              attribute-name="has_colour_type"
              category="avefi:Item"
              :is-searchable="false"
              :tab-index="15"
              :aria-label="$t('has_colour')"
            />
            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="has_format"
              attribute-name="has_format_type"
              category="avefi:Item"
              :is-searchable="false"
              :tab-index="14"
              :aria-label="$t('has_format')"
            />

            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="item_element_type"
              attribute-name="item_element_type"
              category="avefi:Item"
              :is-searchable="false"
              :tab-index="16"
              :aria-label="$t('item_element_type')"
            />

            <SearchPanelRefinementListComp
              :class="{ hidden: viewTypeChecked }"
              header-text="has_access_status"
              attribute-name="has_access_status"
              category="avefi:Item"
              :is-searchable="false"
              :tab-index="16"
              :aria-label="$t('has_access_status')"
            />

            <div
              :class="{ hidden: !viewTypeChecked }"
              class="alert shadow-sm mb-2 mt-2 lg:mt-0 lg:mb-0 p-2 text-sm"
              role="alert"
            >
              <Icon
                class="text-lg mr-2"
                name="tabler:info-circle"
              />
              <span>
                {{ $t('facetsInsideSearchResults') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useObjectListStore } from '../../stores/compareList';
const { t:$t } = useI18n();
/* eslint-disable @typescript-eslint/no-explicit-any */
const { $toggleFacetDrawerState }: any = useNuxtApp();
const objectListStore = useObjectListStore();

const toggleDrawer = () => {
    objectListStore.facetDrawerOpen = !objectListStore.facetDrawerOpen;
};

onMounted(() => {
    (function () {
        function addCollapseCheckboxDom() {
            const collapsePanels = document.querySelectorAll('.ais-Panel');
            collapsePanels.forEach((panel) => {
                const collapseCheckbox = document.createElement('input');
                collapseCheckbox.type = 'checkbox';
                collapseCheckbox.classList.add('collapse-checkbox');
                collapseCheckbox.setAttribute('aria-label', $t('togglePanel'));
                panel?.prepend(collapseCheckbox);
            });
        }
        addCollapseCheckboxDom();
    })();
});

/* eslint-disable @typescript-eslint/no-unused-vars */
const emit = defineEmits(['update:productionYear']);
defineProps({
    viewTypeChecked: {
        type: Boolean,
        default: false
    }
});
/*
const props = defineProps({
    productionYear: {
        type: Array as () => [number, number],
        required: true
    }
});
*/

const updateProductionYear = (newRange: [number, number]) => {
    emit('update:productionYear', newRange);
};

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
