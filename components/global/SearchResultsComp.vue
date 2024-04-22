<template>
  <div>
    <!-- Toggl for view switch -->
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
    <!-- ListView -->
    <div>
      <div
        v-if="searchResultsStore.viewMode == 'list'"
      >
        <div
          v-if="typeof(searchResultsStore.searchResults?.data) !== 'undefined' && searchResultsStore.searchResults?.data.length > 0"
          class="flex flex-row flex-wrap"
        >
          <GlobalSearchResultsCardComp />
        </div>
        <div v-else>
          <span>Oh no 😢</span>
        </div>
      </div>
    </div>
    <!-- Grid -->
    <div>
      <div
        v-if="searchResultsStore.searchResults && searchResultsStore.viewMode == 'grid'"
        class="w-5/7 w-min-96"        
      >
        <GlobalSearchResultsTableComp />
      </div>
    </div>
    <GlobalRawDataCollapse :api-data="searchResultsStore.searchResults" />
    <GlobalComparisonDrawer />
  </div>
</template>
<script setup lang="ts">
const searchResultsStore = useSearchResultsStore();
</script>