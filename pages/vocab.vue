<template>
  <NuxtLayout name="partial-layout-1-center">
    <template #navigation>
      <GlobalBreadcrumbsComp
        :breadcrumbs="[
          ['Home', '/'],
          [$t('vocab.title'), '/vocab'],
        ]"
      />
    </template>
    <template #title>
      <h2 class="text-lg font-bold mb-2">
        {{ $t('vocab.title') }}
      </h2>
    </template>
    <template #cardBody>
      <div class="container" role="region" :aria-label="$t('vocab.title')">
        <GlobalVocabViewer
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
    title: t('seo.vocab.title'),
    description: t('seo.vocab.description'),
    ogTitle: t('seo.vocab.ogTitle'),
    ogDescription: t('seo.vocab.ogDescription'),
    ogImage: '/img/avefi-og-image.png'
});
// Pass query and hash to GlossaryViewer
const glossaryQuery = computed(() => route.query.q || '');
const glossaryHash = computed(() => route.hash ? route.hash.replace('#','') : '');
</script>
