<template>
  <div class="container mx-auto p-4">
    <GlobalBreadcrumbsComp
      :breadcrumbs="[
        ['Home', '/'],
        [$t('mergeTool'), `/protected/mergetool`],
      ]"
    />
    <div class="mt-4">
      <NuxtLayout
        name="partial-layout-1-center"
        :show-expand-toggle="true"
      >
        <template #title>
          <h2 class="font-semibold">
            Merges {{ authData?.user?.name }} | {{ authData?.user?.institution }}
          </h2>
        </template>
        <template #cardBody>
            <!-- MergeTool-Komponente fehlt. Hier kann eine alternative Info oder ein Platzhalter stehen. -->
            <div class="text-red-500">MergeTool-Komponente nicht verfügbar.</div>
        </template>
      </NuxtLayout>
    </div>
  </div>
</template>
<script lang="ts" setup>
const { data:authData } = useAuth();
</script>