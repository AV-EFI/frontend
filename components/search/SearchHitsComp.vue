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
import type { PropType } from 'vue';
import { createWidgetMixin } from 'vue-instantsearch/vue3/es';

// ✅ Component name without export default
defineOptions({
  name: 'AisStateResults',
});

// ✅ Props
const props = defineProps({
  items: {
    type: Array as PropType<any[]>,
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
});

console.log('SearchHitsComp.vue loaded');
console.log('items:', props.items);

// ✅ Connector definition
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