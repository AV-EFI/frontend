<template>
  <div class="container mx-auto p-2">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`],
      ]"
    />
    <keep-alive>
      <ClientOnly>      
        <SearchSection
          :search-client="searchClient"
        />
      </ClientOnly>
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi.ts';

import { useCurrentUrlState } from '../../composables/useCurrentUrlState';

definePageMeta({
    auth: false,
    ssr: false,
});

const searchClient = Client({
    config: config,
    url: `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_SEARCH}`,  
});
const { currentUrlState } = useCurrentUrlState();


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