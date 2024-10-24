<template>
  <div>
    <div class="container">
      <div class="breadcrumbs text-sm">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <span class="text-accent">
              {{ $t('filmresearch') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <SearchSection :search-term="searchTerm" />
  </div>
</template>
<script setup lang="ts">
//can be deleted?
//use for index search?
const route = useRoute();
const params = ref(route.params);
const searchTerm = ref('');
if(params.value.slug) {
    searchTerm.value = params.value.slug[0];
}
</script>
<style>
.ais-SearchBox-form, .ais-SearchBox-input, .ais-SortBy-select {
  background-color:transparent!important;
}

.ais-SearchBox-input:focus {
  border-color:var(--primary);
}
</style>