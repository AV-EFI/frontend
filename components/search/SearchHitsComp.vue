<template>
  <div v-if="isSearchLoading">
    <GlobalSkeletonLoaderComp
      v-for="index in 5"
      :key="index"
    />
  </div>
  <div v-else>
    <SearchListFlatComp
      v-if="viewTypeChecked && items"
      :datasets="items"
      :production-details-checked="productionDetailsChecked"
      :show-admin-stats="showAdminStats"
      :current-refinements="currentRefinements"
    />
    <SearchListViewComp
      v-else-if="items"
      :items="items"
      :production-details-checked="productionDetailsChecked"
      :show-admin-stats="showAdminStats"
      :expanded-handles="expandedHandles"
      :facets-active="facetsActive"
      :nr-of-facets-active="nrOfFacetsActive"
      :expand-all-handles-checked="expandAllHandlesChecked"
      :current-refinements="currentRefinements"
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
        type: Object,
        required: true,
    },
    expandAllHandlesChecked: {
        type: Boolean,
        default: false,
    },
    isSearchLoading: {
        type: Boolean,
        required: false,
        default: false,
    },
    currentRefinements: {
        type: Array,
        required: false,
        default: () => []
    }
});
</script>