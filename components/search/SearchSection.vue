<template>
  <div>
    <ClientOnly>
      <template #fallback>
        <div class="py-8 flex justify-center">
          <span class="loading loading-spinner text-primary" aria-live="polite" aria-busy="true" />
        </div>
      </template>
      <SearchInstantSearchTemplateAVefi v-if="isInstantSearchReady" :search-client="searchClient"
        :index-name="indexName" @facetsChanged="(payload) => emit('facetsChanged', payload)" />
      <div v-else class="py-8 flex flex-col items-center gap-2 text-center">
        <span v-if="!instantSearchError" class="loading loading-spinner text-primary" aria-live="polite"
          aria-busy="true" />
        <p v-else class="text-error text-sm">
          {{ $t('error') }}
        </p>
      </div>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';

const indexName = useRuntimeConfig().public.ELASTIC_INDEX;
defineProps({
    searchClient: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['facetsChanged']);

const {isInstantSearchReady, instantSearchError, ensureInstantSearchReady} = useInstantSearchLoader();

onMounted(async () => {
    try {
        await ensureInstantSearchReady();
    }
    catch (error) {
        console.error('Failed to load InstantSearch', error);
    }
});


</script>
<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

em {
  background: var(--highlight);
  color: var(--highlight-content);
  padding: .125rem;
  font-style: normal;
}

.ais-Highlight-highlighted,
.ais-Snippet-highlighted {
  background: var(--highlight);
  color: var(--highlight-content);
  padding: .1rem;
}

.search-panel {
  display: flex;
}

.search-panel__filters {
  flex: 1;
}

.search-panel__results {
  flex: 3;
}
</style>