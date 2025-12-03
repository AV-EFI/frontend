<template>
  <div class="editor mt-8">
    <div v-if="loadingErrorKey" class="alert alert-error mx-auto w-96">
      <Icon name="tabler:alert-circle" class="w-6 h-6" />
      <div>
        <h3 class="font-bold">{{ $t('errorLoadingDatasets') }}</h3>
        <div class="text-sm">{{ $t(loadingErrorKey) }}</div>
      </div>
    </div>
    
    <div v-else-if="!prev || !current" class="alert alert-warning">
      <Icon name="tabler:alert-triangle" class="w-6 h-6" />
      <div>
        <h3 class="font-bold">{{ $t('incompleteData') }}</h3>
        <div class="text-sm">
          <span v-if="!prev">{{ $t('dataset1') }}: {{ $t('failedToLoad') }}</span>
          <span v-if="!current" class="ml-2">{{ $t('dataset2') }}: {{ $t('failedToLoad') }}</span>
        </div>
      </div>
    </div>
    
    <ViewsWorkViewReduced
      v-else
      v-model="prev"
      :title="$t('dataset1')"
      :compare-with="current"
      :compare-title="$t('dataset2')"
    />
  </div>
</template>

<script setup lang="ts">
import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses';

const props = defineProps({
    items: {
        type: Array as PropType<(ElasticGetByIdResponse | string)[]>,
        required: true,
        default: () => []
    }
});

const objectListStore = useObjectListStore();
const loadingErrorKey = ref<string | null>(null);
const prev = ref<ElasticGetByIdResponse | null>(null);
const current = ref<ElasticGetByIdResponse | null>(null);

try {
    if (!props.items[0] || !props.items[1]) {
        throw new Error('missingBothDatasets');
    }
    
    const [prevData, currentData] = await Promise.all([
        getDataSet(props.items[0]),
        getDataSet(props.items[1])
    ]);
    
    prev.value = prevData;
    current.value = currentData;
    
    if (!prevData && !currentData) {
        loadingErrorKey.value = 'missingBothDatasets';
    } else if (!prevData) {
        loadingErrorKey.value = 'missingDataset1';
    } else if (!currentData) {
        loadingErrorKey.value = 'missingDataset2';
    }
} catch (error) {
    console.error('Error loading comparison datasets:', error);
    loadingErrorKey.value = error instanceof Error && error.message ? error.message : 'errorLoadingDatasets';
}

onMounted(() => {
    if (objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});
</script>
