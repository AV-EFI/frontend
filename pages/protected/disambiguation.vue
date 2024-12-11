<template>
  <div>
    <GlobalBreadcrumbsComp 
      :breadcrumbs="[
        ['Home', '/'],
        [$t('filmresearch'), `/${useRuntimeConfig().public.SEARCH_URL}/index?${useRuntimeConfig().public.SEARCH_INIT_URL_PARAMS}`],
        [$t('disambiguation'), '/protected/disambiguation']
      ]"
    />
    <div class="container mb-4">
      <ClientOnly
        fallback-tag="span"
        fallback="Loading datasets ..."
      >
        <LazyGlobalCompareViewEditor :items="items" />
      </ClientOnly>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
    //middleware: 'auth'
});
const route = useRoute();
const items = new Array();
items[0] = route.query.prev;
items[1] = route.query.next;

</script>