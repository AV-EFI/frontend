<template>
  <div class="container mx-auto p-2">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`],
      ]"
    />
    <keep-alive>
      <SearchSection
        v-if="searchClient"
        :search-client="searchClient"
      />
      <div v-else class="text-center py-4">
        <span class="loading loading-spinner loading-lg text-primary" />
      </div>
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import Client from '@searchkit/instantsearch-client';
import { config } from '../../searchConfig_avefi';

import { useCurrentUrlState } from '../../composables/useCurrentUrlState';

definePageMeta({
    auth: false,
});

// Initialize search client only on client-side
const searchClient = process.client ? Client({
    config: config,
    url: `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_SEARCH}`,  
}) : null;

const { currentUrlState } = useCurrentUrlState();
const { t } = useI18n();
const route = useRoute();

// Extract the value from query parameter (SSR-compatible)
const searchValue = ref<string | null>(route.query.query as string || null);

const updateSearchValue = () => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const newValue = urlParams.get('query') || null;
    
    if (newValue !== searchValue.value) {
        searchValue.value = newValue;
        // Force document title update
        if (process.client) {
            document.title = newValue ? t('seo.search.titleWithQuery', { query: newValue }) : t('seo.search.title');
        }
    }
};

// Poll for URL changes
let pollInterval: NodeJS.Timeout;

onMounted(() => {
    updateSearchValue();
    pollInterval = setInterval(updateSearchValue, 300);
    
    // Also listen to popstate
    window.addEventListener('popstate', updateSearchValue);
});

onBeforeUnmount(() => {
    if (pollInterval) {
        clearInterval(pollInterval);
    }
    window.removeEventListener('popstate', updateSearchValue);
});

useHead({
    title: computed(() => 
        searchValue.value ? t('seo.search.titleWithQuery', { query: searchValue.value }) : t('seo.search.title')
    ),
    meta: [
        {
            name: 'description',
            content: computed(() => 
                searchValue.value 
                    ? t('seo.search.descriptionWithQuery', { query: searchValue.value })
                    : t('seo.search.description')
            )
        },
        {
            property: 'og:url',
            content: 'https://www.av-efi.net/search'
        }
    ],
    link: [
        { rel: 'canonical', href: 'https://www.av-efi.net/search' }
    ]
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
