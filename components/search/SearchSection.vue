<template>
  <div>
    <ClientOnly>
      <SearchInstantSearchTemplateAVefi :search-client="searchClient" />
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">

const props = defineProps({
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

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
}

em {
  background: var(--accent);
  color: var(--white);
  padding: .125rem;
  font-style: normal;
}

.ais-Highlight-highlighted, .ais-Snippet-highlighted {
  background: var(--secondary);
  color: var(--primary-900);
  padding: .1rem;
  font-weight: 700;
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

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>