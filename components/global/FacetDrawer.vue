<template>
  <div class="drawer w-0 lg:w-[20em] drawer-start lg:drawer-open">
    <div class="w-full flex flex-col items-center py-2 bg-slate-100 dark:bg-slate-900">
      <div class="flex justify-center items-center mb-2">
        <button
          :class="['btn', mode==='simple' ? 'btn-primary' : 'btn-outline']"
          @click="mode='simple'"
          style="margin-right: 0.5em; display: flex; align-items: center;"
        >
          <img src="/img/normalMode.png" alt="Normal Mode" style="width: 1.5em; height: 1.5em; margin-right: 0.3em; border-radius: 50%;" />
          {{ $t('simpleMode') }}
        </button>
        <button
          :class="['btn', mode==='expert' ? 'btn-primary' : 'btn-outline']"
          @click="mode='expert'"
          style="display: flex; align-items: center;"
        >
          <img src="/img/expertMode.png" alt="Expert Mode" style="width: 1.5em; height: 1.5em; margin-right: 0.3em; border-radius: 50%;" />
          {{ $t('expertMode') }}
        </button>
      </div>
      <div class="flex justify-center items-center">
        <button
          :class="['btn', detailView==='default' ? 'btn-primary' : 'btn-outline']"
          @click="detailView='default'"
          style="margin-right: 0.5em; display: flex; align-items: center;"
        >
          <img src="/img/normalMode.png" alt="Normal Mode" style="width: 1.5em; height: 1.5em; margin-right: 0.3em; border-radius: 50%;" />
          {{ $t('defaultDetailView') }}
        </button>
        <button
          :class="['btn', detailView==='exemplar' ? 'btn-primary' : 'btn-outline']"
          @click="detailView='exemplar'"
          style="display: flex; align-items: center;"
        >
          <img src="/img/expertMode.png" alt="Expert Mode" style="width: 1.5em; height: 1.5em; margin-right: 0.3em; border-radius: 50%;" />
          {{ $t('exemplarDetailView') }}
        </button>
      </div>
    </div>
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
            <template v-if="detailView==='default'">
              <template v-if="mode==='simple'">
                <SearchPanelRefinementListComp
                  header-text="Genre"
                  attribute-name="has_genre_has_name"
                  category="avefi:WorkVariant"
                  :tab-index="1"
                  :aria-label="$t('Genre')"
                />
                <InputVueSlider
                  header-text="productionyear"
                  category="avefi:WorkVariant"
                  :tab-index="7"
                  :aria-label="$t('productionyear')"
                />
                <SearchPanelRefinementListComp
                  header-text="in_language_code"
                  attribute-name="in_language_code"
                  category="avefi:Manifestation"
                  :tab-index="10"
                  :aria-label="$t('in_language_code')"
                />
              </template>
              <template v-else>
                <!-- Experten-Modus: alle Filter -->
                <SearchPanelRefinementListComp header-text="Genre" attribute-name="has_genre_has_name" category="avefi:WorkVariant" :tab-index="1" :aria-label="$t('Genre')" />
                <SearchPanelRefinementListComp header-text="has_form" attribute-name="has_form" category="avefi:WorkVariant" :tab-index="2" :aria-label="$t('has_form')" />
                <SearchPanelRefinementListComp header-text="place" attribute-name="located_in_has_name" category="avefi:WorkVariant" :tab-index="3" :aria-label="$t('place')" />
                <SearchPanelRefinementListComp header-text="directors_or_editors" attribute-name="directors_or_editors" category="avefi:WorkVariant" :tab-index="4" :aria-label="$t('directors_or_editors')" />
                <SearchPanelRefinementListComp header-text="CastMember" attribute-name="castmembers" category="avefi:WorkVariant" :tab-index="5" :aria-label="$t('CastMember')" />
                <SearchPanelRefinementListComp header-text="avefi:ProductionEvent" attribute-name="production" category="avefi:WorkVariant" :tab-index="6" :aria-label="$t('avefi:ProductionEvent')" />
                <InputVueSlider header-text="productionyear" category="avefi:WorkVariant" :tab-index="7" :aria-label="$t('productionyear')" />
                <SearchPanelRefinementListComp header-text="avefi:Subject" attribute-name="subjects" category="avefi:WorkVariant" :tab-index="8" :aria-label="$t('avefi:Subject')" />
                <SearchPanelRefinementListComp header-text="dataholding" attribute-name="has_issuer_name" category="avefi:Manifestation" :is-searchable="false" :tab-index="9" :aria-label="$t('dataholding')" />
                <SearchPanelRefinementListComp header-text="in_language_code" attribute-name="in_language_code" category="avefi:Manifestation" :tab-index="10" :aria-label="$t('in_language_code')" />
                <SearchPanelRefinementListComp header-text="has_sound_type" attribute-name="has_sound_type" category="avefi:Manifestation" :is-searchable="false" :tab-index="11" :aria-label="$t('has_sound_type')" />
                <SearchPanelRefinementListComp header-text="has_duration" attribute-name="has_duration_has_value" category="avefi:Manifestation" :is-searchable="false" :tab-index="12" :aria-label="$t('has_duration')" />
                <SearchPanelRefinementListComp header-text="manifestation_event_type" attribute-name="manifestation_event_type" category="avefi:Manifestation" :is-searchable="false" :tab-index="13" :aria-label="$t('manifestation_event_type')" />
                <SearchPanelRefinementListComp header-text="has_colour" attribute-name="has_colour_type" category="avefi:Manifestation" :is-searchable="false" :tab-index="15" :aria-label="$t('has_colour')" />
                <SearchPanelRefinementListComp header-text="has_format" attribute-name="has_format_type" category="avefi:Item" :is-searchable="false" :tab-index="14" :aria-label="$t('has_format')" />
                <SearchPanelRefinementListComp header-text="item_element_type" attribute-name="item_element_type" category="avefi:Item" :is-searchable="false" :tab-index="16" :aria-label="$t('item_element_type')" />
              </template>
            </template>
            <template v-else>
              <!-- Alternativer Detail-View: Exemplar direkt unter WorkVariant, durchsuchbar nach Feldwerten -->
              <ExemplarDetailView :search-query="searchQuery" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useObjectListStore } from '../../stores/compareList';
const { t:$t } = useI18n();
/* eslint-disable @typescript-eslint/no-explicit-any */
const { $toggleFacetDrawerState }: any = useNuxtApp();
const objectListStore = useObjectListStore();

const mode = ref('simple');
const detailView = ref('default');
const searchQuery = ref('');

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
