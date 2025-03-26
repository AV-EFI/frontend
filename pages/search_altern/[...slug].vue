<template>
  <div class="container mx-auto p-2">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`],
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
definePageMeta({
    auth: false,
    ssr: false,
});

import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi.ts';

const searchClient = Client({
    config: config,
    url: `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_SEARCH}`,  
});

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