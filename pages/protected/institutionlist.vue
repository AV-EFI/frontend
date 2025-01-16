<template>
  <div>
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('myDatasets'), `/protected/institutionlist`],
      ]"
    />
    <div>
      <NuxtLayout
        name="partial-layout-1-center"
        :show-expand-toggle="true"
      >
        <template #title>
          <h2>Datensätze der Institution {{ authData?.user?.institution }}</h2>
        </template>
        <template
          #cardBody
        >
          <LazyDetailInstitutionListComp />
        </template>
      </NuxtLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
</script>