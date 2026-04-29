<template>
    <div v-if="isSearchLoading">
        <GlobalSkeletonLoaderComp
            v-for="index in 5"
            :key="index"
        />
    </div>
    <div v-else>
        <SearchListFlatComp
            v-if="viewTypeChecked === 'flat' && items"
            :key="`flat:${facetStateSignature}`"
            :datasets="items"
            :production-details-checked="productionDetailsChecked"
            :show-admin-stats="showAdminStats"
            :current-refinements="currentRefinements"
        />
        <SearchListViewComp
            v-else-if="viewTypeChecked === 'accordion' && items"
            :key="`accordion:${facetStateSignature}`"
            :items="items"
            :production-details-checked="productionDetailsChecked"
            :show-admin-stats="showAdminStats"
            :expanded-handles="expandedHandles"
            :facets-active="facetsActive"
            :nr-of-facets-active="nrOfFacetsActive"
            :expand-all-handles-checked="expandAllHandlesChecked"
            :current-refinements="currentRefinements"
        />
        <SearchTableViewComp
            v-else-if="viewTypeChecked === 'table' && items"
            :key="`table:${facetStateSignature}`"
            :datasets="items"
            :production-details-checked="productionDetailsChecked"
            :show-admin-stats="showAdminStats"
            :expanded-handles="expandedHandles"
            :expand-all-handles-checked="expandAllHandlesChecked"
            :current-refinements="currentRefinements"
        />
        <div v-else>
            <pre>{{ $t('error') }}</pre>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { ElasticMSearchResponse } from '@/models/interfaces/generated/IElasticResponses';
import type { PropType } from 'vue';

// ✅ Component name without export default
defineOptions({
    name: 'AisStateResults',
});

import { computed, ref, watch, onMounted } from 'vue';
const route = useRoute();

const props = defineProps({
    items: {
        type: Array as PropType<ElasticMSearchResponse[]>,
        required: true,
    },
    viewTypeChecked: {
        type: String,
        required: true,
        validator: (v: string) => ['accordion', 'flat', 'table'].includes(v),
    },
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
    facetsActive: {
        type: Boolean,
        default: false,
    },
    nrOfFacetsActive: {
        type: Number,
        default: 0,
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

const facetStateSignature = computed(() => {
    const routeFacetEntries = Object.entries(route.query)
        .filter(([key]) => key !== 'query' && key !== 'page')
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [
            key,
            Array.isArray(value)
                ? value.map(item => String(item ?? '')).sort()
                : [String(value ?? '')],
        ]);

    return JSON.stringify({
        currentRefinements: props.currentRefinements,
        routeFacets: routeFacetEntries,
        facetsActive: props.facetsActive,
        nrOfFacetsActive: props.nrOfFacetsActive,
    });
});

// SSR-safe localStorage for viewTypeChecked
const localViewType = ref(props.viewTypeChecked);
onMounted(() => {
    if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem('avefi-view-type');
        if (stored && ['accordion', 'flat', 'table'].includes(stored)) {
            localViewType.value = stored;
        } else {
            localViewType.value = props.viewTypeChecked;
        }
    }
});

watch(() => props.viewTypeChecked, (val) => {
    if (typeof window !== 'undefined' && ['accordion', 'flat', 'table'].includes(val)) {
        window.localStorage.setItem('avefi-view-type', val);
        localViewType.value = val;
    }
});
</script>
