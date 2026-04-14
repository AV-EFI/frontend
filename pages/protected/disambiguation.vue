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
const items = [];
items[0] = route.query.prev;
items[1] = route.query.next;

</script>
