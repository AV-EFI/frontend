<script setup lang="ts">
definePageMeta({
    auth: false,
});
const route = useRoute();
const items = new Array();
items[0] = route.query.prev;
items[1] = route.query.next;

</script>
<template>
  <div class="scroll-auto">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('comparison'), ''],
      ]"
    />
    <div class="container mt-4 snap-y snap-mandatory md:px-4">
      <div
        role="tablist"
        class="tabs tabs-bordered"
      >
        <input
          type="radio"
          name="compare_tabs"
          role="tab"
          class="tab min-w-48"
          :aria-label="$t('compareRegular')"
          checked="true"
        >
        <div
          role="tabpanel"
          class="tab-content bg-base-100 border-base-300 rounded-box p-2 md:p-6 snap-always snap-start"
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
          class="tab min-w-48"
          :aria-label="$t('compareRaw')"
        >
        <div
          role="tabpanel"
          class="tab-content bg-base-100 border-base-300 p-6 snap-always snap-start"
        >
          <div>
            <ClientOnly
              fallback-tag="span"
              fallback="Loading datasets ..."
            >
              <LazyGlobalCompareViewRaw :items="items" />
            </ClientOnly>
          </div>  
        </div>
      </div>
    </div>
  </div>
</template>
