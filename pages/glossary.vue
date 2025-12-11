<template>
  <NuxtLayout name="partial-layout-1-center">
    <template #navigation>
      <GlobalBreadcrumbsComp
        :breadcrumbs="[
          ['Home', '/'],
          [$t('glossary.title'), '/glossary'],
        ]"
      />
    </template>
    <template #title>
      <h2 class="text-lg font-bold mb-2">
        {{ $t('glossary.title') }}
      </h2>
    </template>
    <template #cardBody>
      <div class="container" role="region" :aria-label="$t('glossary.title')">
        <GlobalGlossaryViewer
          :init-query="glossaryQuery"
          :init-anchor="glossaryHash"
          @update-query="(q, letter) => router.replace({ query: { ...route.query, q, letter } })"
        />
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ auth: false });
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
useSeoMeta({
    title: t('seo.glossary.title'),
    description: t('seo.glossary.description'),
    ogTitle: t('seo.glossary.ogTitle'),
    ogDescription: t('seo.glossary.ogDescription'),
    ogImage: '/img/avefi-og-image.png'
});
// Pass query and hash to GlossaryViewer
const glossaryQuery = computed(() => route.query.q || '');
const glossaryHash = computed(() => route.hash ? route.hash.replace('#','') : '');
</script>
