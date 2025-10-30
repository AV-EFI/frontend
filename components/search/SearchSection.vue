<template>
  <div>
    <ClientOnly>
      <SearchInstantSearchTemplateAVefi
        :search-client="searchClient"
        :index-name="indexName"
      />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
const indexName = useRuntimeConfig().public.ELASTIC_INDEX;
defineProps({
    searchClient: {
        type: Object,
        default: () => ({}),
    },
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

.ais-Highlight-highlighted, .ais-Snippet-highlighted {
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

.searchbox {
  margin-bottom: 2rem;
}
</style>