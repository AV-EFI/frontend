<template>
  <div>
    <GlobalBreadcrumbsComp :breadcrumbs="[
        ['Home', '/'],
        [$t('myDatasets'), `/protected/institutionlist`],
      ]" />
    <div>
      <NuxtLayout name="partial-layout-1-full">
        <template #heading>
          <div class="lg:px-4">
            <h1 class="text-xl font-bold dark:text-zinc-300">
              {{ $t('myDatasets') }}
            </h1>
            <h2>{{ authData?.user?.institution }}</h2>
          </div>
        </template>
        <template #content>
          <ClientOnly>
            <template #fallback>
              <div class="py-8 flex justify-center">
                <span class="loading loading-spinner loading-lg text-primary" />
              </div>
            </template>
            <LazyDetailInstitutionListComp v-if="searchClient && isInstantSearchReady" :search-client="searchClient"
              :index-name="useRuntimeConfig().public.ELASTIC_INDEX" :routing="true" />
            <div v-else class="py-8 flex flex-col items-center gap-2 text-center">
              <span v-if="!instantSearchError" class="loading loading-spinner loading-lg text-primary" />
              <p v-else class="text-error text-sm">
                {{ $t('error') }}
              </p>
            </div>
          </ClientOnly>
        </template>
      </NuxtLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import SearchkitInstantSearchClient from '@searchkit/instantsearch-client';
const { data:authData } = useAuth();

const uiState = {
    refinementList: {
        category_clean: 'avefi:WorkVariant',
    }
};

const searchClient = SearchkitInstantSearchClient({
  url: `${useRuntimeConfig().public.AVEFI_ELASTIC_INTERNAL}/frontend/search`,
  uiState: uiState,
});

const {isInstantSearchReady, instantSearchError, ensureInstantSearchReady} = useInstantSearchLoader();

onMounted(async () => {
  try {
    await ensureInstantSearchReady();
  }
  catch (error) {
    console.error('Failed to load InstantSearch', error);
  }
});

</script>

<style>
body,
h1 {
  margin: 0;
  padding: 0;
}

em {
  background: var(--accent);
  color: var(--white);
  padding: .125rem;
  font-style: normal;
}

.ais-Highlight-highlighted,
.ais-Snippet-highlighted {
  background: var(--accent);
  color: var(--white);
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

.pagination {
  margin: 2rem auto;
  text-align: center;
}
</style>
