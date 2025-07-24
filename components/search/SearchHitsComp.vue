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
      v-else-if="items"
      :items="items"
      :production-details-checked="productionDetailsChecked"
      :show-admin-stats="showAdminStats"
      :expanded-handles="expandedHandles"
      :expand-all-handles-checked="expandAllHandlesChecked"
    />
    <div v-else>
      <pre>error</pre>
    </div>
  </div>
</template>
<script setup lang="ts">

defineProps({
    items: {
        type: Array,
        required: true,
    },
    viewTypeChecked: {
        type: Boolean,
        required: true,
    },
    productionDetailsChecked: {
        type: Boolean,
        required: true,
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    },
    expandedHandles: {
        type: Object as PropType<Set<string>>,
        required: true,
    },
    expandAllHandlesChecked: {
        type: Boolean,
        required: false,
        default: false,
    },

});

</script>

<script lang="ts">

import { expand } from '@formkit/icons';
import { createWidgetMixin } from 'vue-instantsearch/vue3/es';

const connectSearchMetaData =
  (renderFn, unmountFn) =>
      (widgetParams = {}) => ({
          init() {
              renderFn({ searchMetadata: {} }, true);
          },

          render({ searchMetadata }) {
              renderFn({ searchMetadata }, false);
          },

          dispose() {
              unmountFn();
          },
      });

export default {
    name: 'AisStateResults',
    mixins: [createWidgetMixin({ connector: connectSearchMetaData })],
};

</script>