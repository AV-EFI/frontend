<template>
    <aside class="explorer-side" :aria-label="text.nav.label">
        <a class="explorer-brand" href="/" :aria-label="$t('home.breadcrumbs')" :title="$t('home.breadcrumbs')">
            <img src="/img/AV-EFI-Logo.svg" alt="AVefi Logo" class="dark:hidden" width="78" height="30">
            <img src="/img/AV-EFI-Logo-dark.svg" alt="AVefi Logo" class="hidden dark:block" width="78" height="30">
            <span class="bree explorer-claim" v-html="$t('avefiClaimHtml').replace('. ', '<br/>')" />
        </a>

        <h1 class="explorer-title">AVefi <em>Explorer</em></h1>

        <nav :aria-label="text.nav.view">
            <p class="explorer-nav-caption">{{ text.nav.view }}</p>
            <ul class="explorer-nav-list">
                <li>
                    <button type="button" :aria-current="store.view === 'model'" @click="store.setView('model')">
                        <span class="explorer-nav-name">{{ text.nav.model.name }}</span>
                        <span class="explorer-nav-hint">{{ text.nav.model.hint }}</span>
                    </button>
                </li>
                <li>
                    <button type="button" :aria-current="store.view === 'cases'" @click="store.setView('cases')">
                        <span class="explorer-nav-name" :class="{ 'has-dot': store.openCaseCount > 0 }">{{ text.nav.cases.name }}</span>
                        <span class="explorer-nav-hint">
                            {{ store.openCaseCount > 0 ? fill(text.nav.cases.open, { n: store.openCaseCount }) : text.nav.cases.done }}
                        </span>
                    </button>
                </li>
            </ul>
        </nav>

        <details v-if="store.view === 'model'" class="explorer-more" :open="store.highlight !== null">
            <summary>{{ text.nav.highlight.summary }}</summary>
            <ul class="explorer-nav-list">
                <li v-for="entry in highlights" :key="entry.id ?? 'all'">
                    <button type="button" :aria-pressed="store.highlight === entry.id" @click="chooseHighlight(entry.id)">
                        <span class="explorer-nav-name">{{ entry.name }}</span>
                        <span class="explorer-nav-hint">{{ entry.hint }}</span>
                    </button>
                </li>
            </ul>
        </details>

        <details class="explorer-more">
            <summary>{{ text.links.heading }}</summary>
            <ExplorerFurtherLinks compact />
        </details>

        <div class="explorer-foot">
            <div class="explorer-switches" role="group" :aria-label="text.theme">
                <GlobalThemeSwitch />
                <GlobalLanguageSwitch />
            </div>
            <p>{{ text.nav.note }}</p>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { useExplorerStore, type ExplorerHighlight } from '~/stores/explorerStore';
import { matchFieldCount, requiredFieldCount } from '~/utils/explorer/model';

const store = useExplorerStore();
const { text, fill } = useExplorerTexts();

const highlights = computed(() => [
    { id: null as ExplorerHighlight, name: text.value.nav.highlight.all.name, hint: text.value.nav.highlight.all.hint },
    {
        id: 'required' as ExplorerHighlight,
        name: text.value.nav.highlight.required.name,
        hint: fill(text.value.nav.highlight.required.hint, { n: requiredFieldCount() }),
    },
    {
        id: 'match' as ExplorerHighlight,
        name: text.value.nav.highlight.match.name,
        hint: fill(text.value.nav.highlight.match.hint, { n: matchFieldCount() }),
    },
]);

function chooseHighlight(id: ExplorerHighlight) {
    if (id === null) store.highlight = null;
    else store.toggleHighlight(id);
}
</script>

<style scoped>
.explorer-side {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem 1.25rem 0.9rem;
    overflow: auto;
    background: var(--color-base-100);
    border-right: 1px solid var(--ex-line);
}

.explorer-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: inherit;
    text-decoration: none;
}

.explorer-claim {
    font-size: 0.8rem;
    line-height: 1.15;
}

.explorer-title {
    margin: 0;
    font-family: 'BreeSerif', Georgia, 'Times New Roman', serif;
    font-size: 2.1rem;
    font-weight: 400;
    line-height: 0.95;
    text-transform: uppercase;
}

.explorer-title em {
    display: block;
    font-style: normal;
    color: var(--color-primary-text);
}

.explorer-nav-caption {
    margin: 0.4rem 0 0.15rem;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--ex-muted);
}

.explorer-nav-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.explorer-nav-list li {
    border-top: 1px solid var(--ex-line);
}

.explorer-nav-list button {
    display: block;
    width: 100%;
    padding: 0.6rem 0 0.55rem;
    text-align: left;
    background: transparent;
    border: 0;
    cursor: pointer;
}

.explorer-nav-name {
    display: block;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
}

.explorer-nav-hint {
    display: block;
    font-size: 0.8rem;
    color: var(--ex-muted);
}

.explorer-nav-list button[aria-current='true'] .explorer-nav-name,
.explorer-nav-list button[aria-pressed='true'] .explorer-nav-name {
    color: var(--color-primary-text);
}

.explorer-nav-list button:hover .explorer-nav-name {
    text-decoration: underline;
    text-underline-offset: 3px;
}

.explorer-nav-name.has-dot::after {
    content: '';
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    margin-left: 0.5rem;
    border-radius: 50%;
    background: var(--color-accent);
}

.explorer-more {
    border-top: 1px solid var(--ex-line);
}

.explorer-more summary {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0 0.55rem;
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    list-style: none;
}

.explorer-more summary::-webkit-details-marker {
    display: none;
}

.explorer-more summary::after {
    content: '+';
    font-weight: 600;
    color: var(--ex-muted);
}

.explorer-more[open] summary::after {
    content: '\2212';
}

.explorer-foot {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: auto;
    font-size: 0.72rem;
    color: var(--ex-muted);
}

.explorer-foot p {
    margin: 0;
}

.explorer-switches {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
}

.explorer-switches :deep(button) {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.25rem 0;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-base-content);
    cursor: pointer;
}

.explorer-switches :deep(button:hover) {
    text-decoration: underline;
    text-underline-offset: 3px;
}
</style>
