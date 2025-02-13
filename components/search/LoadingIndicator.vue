<!-- components/LoadingIndicator.vue -->
<template>
  <div v-if="state && state.searchMetadata.isSearchStalled">
    <GlobalSkeletonLoaderComp />
  </div>
</template>

<script lang="ts">
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