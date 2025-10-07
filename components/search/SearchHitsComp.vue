<template>
  <div v-if="isSearchLoading">
    <GlobalSkeletonLoaderComp
      v-for="index in 5"
      :key="index"
    />
  </div>
  <div v-else>
    <!-- Tabs -->
    <div class="tabs tabs-bordered mb-4">
      <button 
        class="tab"
        :class="{ 'tab-active': currentTab === 'list' }"
        @click="currentTab = 'list'"
      >
        List View
      </button>
      <button 
        class="tab"
        :class="{ 'tab-active': currentTab === 'flat' }"
        @click="currentTab = 'flat'"
      >
        Flat View
      </button>
      <button 
        class="tab"
        :class="{ 'tab-active': currentTab === 'table' }"
        @click="currentTab = 'table'"
      >
        Table View
      </button>
    </div>

    <!-- Use your exact original logic but with currentTab instead of viewTypeChecked -->
    <SearchListFlatComp
      v-if="currentTab === 'flat' && items"
      :datasets="items"
      :production-details-checked="productionDetailsChecked"
      :show-admin-stats="showAdminStats"
      :current-refinements="currentRefinements"
    />
    <SearchTableViewComp
      v-else-if="currentTab === 'table' && items"
      :items="items"
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
import type { IAVefiWorkVariant } from '@/models/interfaces/generated';
import type { PropType } from 'vue';

defineOptions({
    name: 'AisStateResults',
});

const props = defineProps({
    items: {
        type: Array as PropType<IAVefiWorkVariant[]>,
        required: true,
    },
    viewTypeChecked: Boolean,
    productionDetailsChecked: Boolean,
    showAdminStats: {
        type: Boolean,
        default: false,
    },
    expandedHandles: {
        type: Array as PropType<string[]>,
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
    },
    facetsActive: {
        type: Boolean,
        required: false,
        default: false
    },
    nrOfFacetsActive: {
        type: Number,
        required: false,
        default: 0
    }
});

const currentTab = ref<'list' | 'flat' | 'table'>('list');
</script>