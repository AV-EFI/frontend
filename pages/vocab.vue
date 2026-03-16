<template>
    <NuxtLayout name="partial-layout-1-center">
        <template #navigation>
            <GlobalBreadcrumbsComp :breadcrumbs="[
                ['Home', '/'],
                [$t('vocab.title'), '/vocab'],
            ]" />
        </template>
        <template #title>
            <h1 class="text-lg font-bold xl:text-xl dark:text-white col-span-full text-ellipsis text-wrap overflow-hidden content-center lg:ml-4">
                {{ $t('vocab.title') }}
            </h1>
        </template>
        <template #cardBody>
            <div class="container" role="region" :aria-label="$t('vocab.title')">
                <GlobalVocabViewer :init-query="glossaryQuery" :init-anchor="glossaryHash"
                                   @update-query="(q, letter) => router.replace({ query: { ...route.query, q, letter } })" />
            </div>
        </template>
    </NuxtLayout>x
</template>

<script setup lang="ts">
definePageMeta({ auth: false });
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
useSeoMeta({
    title: t('seo.vocab.title'),
    description: t('seo.vocab.description'),
    ogTitle: t('seo.vocab.title'),
    ogDescription: t('seo.vocab.description'),
    ogImage: '/img/avefi-og-image.png',
    keywords: [
        'Glossar',
        'Vokabular',
        'Begriffserklärungen',
        'Filmfachbegriffe',
        'Metadatenbegriffe',
        'Thesaurus',
        'Controlled Vocabulary',
        'Definitionen',
        'Filmwissenschaft',
        'Archivwesen',
        'Normdatenbegriffe',
        'AV-Metadaten',
        'Hilfeseiten',
    ].join(', '),
});
// Pass query and hash to GlossaryViewer
const glossaryQuery = computed(() => route.query.q || '');
const glossaryHash = computed(() => route.hash ? route.hash.replace('#','') : '');
</script>
