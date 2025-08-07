<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('logList'), `/protected/loglist`],
      ]"
    />
    <div>
      <NuxtLayout name="partial-layout-1-center">
        <template #title>
          <h2>Institution {{ authData?.user?.institution }}</h2>
          <h2>User {{ authData?.user?.name }}</h2>
        </template>
        <template #cardBody>
          <LazyDetailLogListComp />
        </template>
      </NuxtLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
</script>