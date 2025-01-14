<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`],
      ]"
    />
    <SearchSection :search-term="searchTerm" />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
    auth: false
});

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

.ais-Pagination-item--selected
{
  background-color:var(--primary);
  color:white;
}
</style>