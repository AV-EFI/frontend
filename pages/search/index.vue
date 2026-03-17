<template>
    <div class="container mx-auto p-2">
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                ['Home', '/'],
                [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}${currentUrlState}`],
            ]"
        />

        <div v-if="isClient">
            <client-only>
                <SearchSection
                    v-if="searchClient"
                    :search-client="searchClient"
                />
                <div v-else class="text-center py-4">
                    <span class="loading loading-spinner loading-lg text-primary" />
                </div>
            </client-only>
        </div>
        <div v-else class="text-center py-4">
            <span class="loading loading-spinner loading-lg text-primary" />
        </div>
    </div>
</template>

<script setup lang="ts">
import Client from '@searchkit/instantsearch-client';
import { config as searchkitConfig } from '~/searchConfig_avefi';
import { useCurrentUrlState } from '~/composables/useCurrentUrlState';

definePageMeta({ auth: false });

const runtime = useRuntimeConfig();
const { currentUrlState } = useCurrentUrlState();
const isClient = import.meta.client;
const searchClient = isClient
    ? Client({
        config: searchkitConfig as any,
        url: `${runtime.public.elasticApiBase}/${runtime.public.searchApiPath}`,
    })
    : null;
</script>

<style>
.ais-SearchBox-form,
.ais-SearchBox-input,
.ais-SortBy-select {
  background-color: transparent !important;
}

.ais-SearchBox-input:focus {
  border-color: var(--primary);
}

.ais-Pagination-item--selected {
  background-color: var(--primary);
  color: white;
}
</style>




