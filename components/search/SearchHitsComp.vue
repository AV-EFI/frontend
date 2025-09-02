<template>
  <div v-if="state && state.searchMetadata.isSearchStalled">
    <GlobalSkeletonLoaderComp
      v-for="index in 5"
      :key="index"
    />
  </div>
  <div v-else>
    <SearchTableViewComp
      v-if="viewTypeChecked && items"
      :items="items"
      :production-details-checked="productionDetailsChecked"
      :show-admin-stats="showAdminStats"
    />
    <SearchListViewComp
      v-else-if="!alternateView && items"
      :items="items"
      :production-details-checked="productionDetailsChecked"
      :show-admin-stats="showAdminStats"
      :expanded-handles="expandedHandles"
      :facets-active="facetsActive"
      :nr-of-facets-active="nrOfFacetsActive"
      :expand-all-handles-checked="expandAllHandlesChecked"
    />
    <SearchKVViewComp
      v-else-if="alternateView && items"
      :items="items"
      :labels="labels"
      :tooltips="tooltips"
    />
    <div v-else>
      <pre>error</pre>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ElasticMSearchResponse } from '@/models/interfaces/generated/IElasticResponses';
import type { PropType } from 'vue';
import { createWidgetMixin } from 'vue-instantsearch/vue3/es';
import SearchKVViewComp from './SearchKVViewComp.vue';

// ✅ Component name without export default
defineOptions({
    name: 'AisStateResults',
});

const props = defineProps({
    items: {
        type: Array as PropType<ElasticMSearchResponse[]>,
        required: true,
    },
    viewTypeChecked: Boolean,
    productionDetailsChecked: Boolean,
    showAdminStats: {
        type: Boolean,
        default: false,
    },
    expandedHandles: {
        type: Object as PropType<Set<string>>,
        required: true,
    },
    expandAllHandlesChecked: {
        type: Boolean,
        default: false,
    },
    facetsActive: {
      type: Object as PropType<Record<string, Set<string | number | boolean>>>,
      default: () => ({}),
    },
    nrOfFacetsActive: {
      type: Number,
      default: 0,
    },
    alternateView: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    },
    tooltips: {
      type: Object as PropType<Record<string, string>>,
      default: () => ({}),
    }
});

function isFacetActive(attribute: string, value: string | number | boolean) {
  return props.facetsActive?.[attribute]?.has(value) ?? false
}

// ✅ Connector definition
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
const connectSearchMetaData =
  (renderFn: any, unmountFn: any) =>
      (widgetParams = {}) => ({
          init() {
              renderFn({ searchMetadata: {} }, true);
          },
          render({ searchMetadata }: any) {
              renderFn({ searchMetadata }, false);
          },
          dispose() {
              unmountFn();
          },
      });

// ✅ Use mixin inside script setup
defineExpose({
    mixins: [createWidgetMixin({ connector: connectSearchMetaData })],
});
</script>