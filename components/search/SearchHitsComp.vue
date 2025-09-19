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
      :expand-all-handles-checked="expandAllHandlesChecked"
      :current-refinements="currentRefinements"
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
        type: Object,
        required: true,
    },
    expandAllHandlesChecked: {
        type: Boolean,
        required: false,
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