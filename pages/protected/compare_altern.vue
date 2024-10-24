<script setup lang="ts">
definePageMeta({
    //middleware: 'auth'
});
const route = useRoute();
const items = new Array();
items[0] = route.query.prev;
items[1] = route.query.next;

</script>
<template>
  <div class="scroll-auto">
    <div class="container">
      <div class="breadcrumbs text-sm">
        <ul>
          <li><a href="/">Home</a></li>
          <li>
            <span class="text-accent">
              {{ $t('filmidentification') }}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container mt-4 snap-y snap-mandatory">
      <div
        role="tablist"
        class="tabs tabs-bordered"
      >
        <input
          type="radio"
          name="compare_tabs"
          role="tab"
          class="tab min-w-24"
          aria-label="Regular"
        >
        <div
          role="tabpanel"
          class="tab-content bg-base-100 border-base-300 rounded-box p-6 snap-always snap-start"
        >
          <ClientOnly
            fallback-tag="span"
            fallback="Loading datasets ..."
          >
            <LazyGlobalCompareViewProps :items="items" />
          </ClientOnly>
        </div>
        <input
          type="radio"
          name="compare_tabs"
          role="tab"
          class="tab min-w-24"
          aria-label="Raw"
          checked="true"
        >
        <div
          role="tabpanel"
          class="tab-content bg-base-100 border-base-300 rounded-box p-6 snap-always snap-start"
        >
          <div>
            <ClientOnly
              fallback-tag="span"
              fallback="Loading datasets ..."
            >
              <GlobalCompareViewRaw :items="items" />
            </ClientOnly>
          </div>  
        </div>
      </div>
    </div>
  </div>
</template>