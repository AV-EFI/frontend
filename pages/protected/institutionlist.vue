<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('myDatasets'), `/protected/institutionlist`],
      ]"
    />
    <div>
      <NuxtLayout name="partial-layout-1-full">
        <template #heading>
          <div class="lg:px-4">
            <h1
              class="text-xl font-bold dark:text-zinc-300"
            >
              {{ $t('myDatasets') }}
            </h1>
            <h2>{{ authData?.user?.institution }}</h2>
          </div>
        </template>
        <template #content>
          <LazyDetailInstitutionListComp 
            :search-client="searchClient"
            :index-name="useRuntimeConfig().public.ELASTIC_INDEX"
            :routing="true"
          />
        </template>
      </NuxtLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
import SearchkitInstantSearchClient from '@searchkit/instantsearch-client';
import { config } from '@/searchConfig_avefi.ts';

const uiState = {
    refinementList: {
        category_clean: 'avefi:WorkVariant',
    }
};

const searchClient = SearchkitInstantSearchClient({
    url: "/api/elastic/msearch_inst",
    uiState: uiState,
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

