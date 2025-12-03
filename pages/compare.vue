<script setup lang="ts">
definePageMeta({
    auth: false,
});
const route = useRoute();
const { t } = useI18n();

const items = [];
items[0] = route.query.prev;
items[1] = route.query.next;

const hasValidParams = computed(() => {
    return items[0] && items[1];
});

const errorMessage = computed(() => {
    if (!items[0] && !items[1]) {
        return t('missingBothDatasets');
    } else if (!items[0]) {
        return t('missingDataset1');
    } else if (!items[1]) {
        return t('missingDataset2');
    }
    return null;
});

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
      <div v-if="!hasValidParams" class="alert alert-error mb-4 w-96">
        <Icon name="tabler:alert-circle" class="w-6 h-6" />
        <div>
          <h3 class="font-bold">{{ $t('invalidComparisonUrl') }}</h3>
          <div class="text-sm">{{ errorMessage }}</div>
          <div class="text-xs mt-2">{{ $t('comparisonUrlHelp') }}</div>
        </div>
      </div>
      
      <div
        v-else
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
          class="tab min-w-48 hidden"
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
