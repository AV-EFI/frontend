<template>
    <div>
        <GlobalBreadcrumbsComp
            :breadcrumbs="[
                [$t('home.breadcrumbs'), '/'],
                [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}/`],
                [$t('disambiguation'), '/protected/disambiguation']
            ]"
        />
        <div class="container mb-4">
            <ClientOnly
                fallback-tag="span"
                :fallback="$t('loadingDatasets')"
            >
                <LazyGlobalCompareViewEditor :items="items" />
            </ClientOnly>
        </div>
    </div>
</template>
<script setup lang="ts">
const route = useRoute();
const getQueryValue = (value: unknown) => Array.isArray(value) ? value[0] : value;
const items = [
    getQueryValue(route.query.prev),
    getQueryValue(route.query.next),
].filter((value): value is string => typeof value === 'string' && value.length > 0);

</script>
