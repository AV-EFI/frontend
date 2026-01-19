<template>

<GlobalBreadcrumbsComp
    :breadcrumbs="[['Home','/'],[$t('userGlossary'),'admin/user_tooltips']]"
  />
  <NuxtLayout name="partial-layout-1-center" padding-class="p-0">
    <template #title>
      <h2 class="text-2xl font-bold pl-2">{{ $t('ut.pageTitle') }}</h2>
    </template>

    <template #cardBody>
      <div class="mx-auto p-2">
        <GlobalFilmDiamondPatternGenerator />
        </div>
    </template>
    </NuxtLayout>
</template>
<script setup lang="ts">
import GlobalFilmDiamondPatternGenerator from '@/components/global/FilmDiamondPatternGenerator.vue';
</script>