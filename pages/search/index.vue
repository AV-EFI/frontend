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
import { config } from '../../searchConfig_avefi';

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
const { t } = useI18n();

// Extract the value from query parameter
const searchValue = ref<string | null>(null);

const updateSearchValue = () => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const newValue = urlParams.get('query') || null;
    
    if (newValue !== searchValue.value) {
        searchValue.value = newValue;
        // Force document title update
        document.title = newValue ? t('seo.search.titleWithQuery', { query: newValue }) : t('seo.search.title');
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
