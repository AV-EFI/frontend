<template>
    <main class="schema-explorer-page">
        <GlobalBreadcrumbsComp :breadcrumbs="[
            ['Home', '/'],
            ['Schema Explorer', '/schema-explorer'],
        ]" />
        <SchemaExplorer />
    </main>
</template>

<script setup lang="ts">
import SchemaExplorer from '~/components/schema/SchemaExplorer.vue';

definePageMeta({ auth: false });

(useSeoMeta as (meta: Record<string, unknown>) => void)({
    title: 'AVefi Schema Explorer',
    description: 'Interactive exploration of the AVefi metadata schema, classes, slots, relationships, ranges, and controlled vocabularies.',
    ogTitle: 'AVefi Schema Explorer',
    ogDescription: 'Explore the AVefi schema as a visual and structured meta-model.',
    ogImage: '/img/avefi-og-image.png',
});
</script>

<style scoped>
.schema-explorer-page {
  width: min(100% - 1.5rem, 1280px);
  margin: 0 auto;
  padding: 0.75rem 0 2rem;
}
</style>
