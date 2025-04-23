<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('multiResults')]
      ]"
    />
    <NuxtLayout name="partial-layout-1-center">
      <template #title>
        <h2>{{ $t('multiResults') }}</h2>
      </template>
      <template #cardBody>
        <p>{{ $t('multihelptext', {'name': itemId}) }}</p>
        <DetailWorksMultiView
          :work-ids="workIds"
          :item-id="itemId"
        />
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const queryParams = route.query;
const workIds = queryParams.ids;
const itemId = queryParams.itemid;
console.log('Work IDs:', workIds);
</script>