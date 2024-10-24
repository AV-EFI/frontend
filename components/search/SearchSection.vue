<template>
  <div>
    <ClientOnly>
      <SearchInstantSearchTemplateAVefi
        :search-client="searchClient"
        :index-name="useRuntimeConfig().public.ELASTIC_INDEX"
        :routing="true"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import SearchkitInstantSearchClient from '@searchkit/instantsearch-client';
import {config} from '@/searchConfig_avefi.ts';
</script>

<script>
const searchClient = SearchkitInstantSearchClient({
    url: "/api/elastic/msearch",

});
export default {
    data() {
        return {
            searchClient,
            routing: true
        };
    }
};
</script>




<style>
@import url("https://cdn.jsdelivr.net/npm/instantsearch.css@8.2.1/themes/satellite-min.css");
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
  background: var(--accenttwo-200);
  color: var(--primary-900);
  padding: .1rem;
  font-weight: 700;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
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