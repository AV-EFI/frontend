<template>
    <ul class="explorer-further" :class="{ 'is-compact': compact }">
        <li v-for="link in FURTHER_LINKS" :key="link.id">
            <a
                v-if="link.external"
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="explorer-further-link"
            >
                <span>{{ text.links[link.id] }}</span>
                <Icon name="tabler:external-link" size="14" aria-hidden="true" />
                <span class="sr-only"> ({{ text.links.newTab }})</span>
            </a>
            <NuxtLink v-else :to="link.href" class="explorer-further-link">
                <span>{{ text.links[link.id] }}</span>
            </NuxtLink>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { FURTHER_LINKS } from '~/utils/explorer/links';

defineProps<{ compact?: boolean }>();

const { text } = useExplorerTexts();
</script>

<style scoped>
.explorer-further {
    margin: 0;
    padding: 0;
    list-style: none;
}

.explorer-further li {
    border-top: 1px solid var(--ex-line);
}

.explorer-further-link {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0;
    font-size: 0.85rem;
    color: var(--color-primary-text);
    text-decoration: underline;
    text-underline-offset: 3px;
}

.explorer-further-link:hover {
    text-decoration-thickness: 2px;
}

.is-compact .explorer-further-link {
    font-size: 0.8rem;
    padding: 0.3rem 0;
}
</style>
