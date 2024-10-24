<template>
  <div>
    <div class="container">
      <div class="breadcrumbs text-sm">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <span class="">
              <a href="/protected/filmedit">{{ $t('filmidentification') }}</a>
            </span>
          </li>
          <li>
            <span class="text-accent">
              {{ $t('disambiguation') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
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