<template>
  <div>
    <div>
      <FormKit
        v-model="searchResultsStore.viewMode"
        type="toggle"
        off-value="list"
        on-value="grid"
        off-value-label="Liste"
        on-value-label="Tabelle"
        value-label-display="inner"
        thumb-icon="star"
        label="Ansicht wechseln"
      />
    </div>
  </div>
  <div v-if="searchResultsStore.viewMode == 'list' && results">
    <p>list</p>
    <ul class="sui-results-container search-section__search-results">
      <li
        v-for="result in results"
        :key="result.id.raw"
        class="search-section__search-result"
      >
        <SearchResult :result="result" />
      </li>
    </ul>
  </div>
  <div v-if="searchResultsStore.viewMode == 'grid' && results">
    <p>grid</p>
    <!---->
    <SearchResultsTableComp
      :result="results"
    />
  </div>
</template>

<script>
import SearchResult from "./SearchResult.vue";
import { mapStores } from 'pinia';

export default {
    components: {
        SearchResult
    },
    props: {
        results: {
            type: Array,
            required: true
        }
    },
    computed: {
        // note we are not passing an array, just one store after the other
        // each store will be accessible as its id + 'Store'
        ...mapStores(useSearchResultsStore)
    }
};
</script>

<style>
.search-section__search-results {
  display: flex;
  flex-wrap: wrap;
}

.search-section__search-result {
  width: 48%;
  margin: 1%;
  background: white;
}
</style>