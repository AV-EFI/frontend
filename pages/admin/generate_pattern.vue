<template>

  <GlobalBreadcrumbsComp :breadcrumbs="[['Home','/'],[$t('userGlossary'),'admin/user_tooltips']]" />
  <NuxtLayout name="partial-layout-1-center" padding-class="p-0">
    <template #title>
      <h2 class="text-2xl font-bold pl-2">{{ $t('ut.pageTitle') }}</h2>
    </template>

    <template #cardBody>
      <div class="mx-auto p-2 space-y-4">
        <button v-if="!showGenerator" class="btn btn-primary" type="button" @click="loadGenerator">
          {{ $t('loadGenerator') || 'Open pattern generator' }}
        </button>
        <ClientOnly v-if="showGenerator">
          <Suspense>
            <template #default>
              <PatternGenerator />
            </template>
            <template #fallback>
              <div class="flex items-center gap-2 text-sm opacity-70">
                <span class="loading loading-spinner loading-sm" aria-hidden="true" />
                {{ $t('loading') }}
              </div>
            </template>
          </Suspense>
        </ClientOnly>
      </div>
    </template>
  </NuxtLayout>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const PatternGenerator = defineAsyncComponent(() => import('~/components/global/FilmDiamondPatternGenerator.vue'));
const showGenerator = ref(false);

function loadGenerator() {
    showGenerator.value = true;
}
</script>