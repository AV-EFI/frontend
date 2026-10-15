<template>
    <aside class="explorer-side" :aria-label="text.nav.label">
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

        <p class="explorer-note">{{ text.nav.note }}</p>
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
    gap: 0.75rem;
    padding: 0.25rem 0.5rem 0.5rem 0;
}

.explorer-nav-caption {
    margin: 0 0 0.15rem;
    font-size: 0.8rem;
    font-weight: 600;
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
    padding: 0.55rem 0 0.5rem;
    text-align: left;
    background: transparent;
    border: 0;
    cursor: pointer;
}

.explorer-nav-name {
    display: block;
    font-size: 0.95rem;
    font-weight: 700;
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
    background: var(--color-primary);
}

.explorer-more {
    border-top: 1px solid var(--ex-line);
}

.explorer-more summary {
    display: flex;
    justify-content: space-between;
    padding: 0.55rem 0 0.5rem;
    font-size: 0.95rem;
    font-weight: 700;
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

.explorer-note {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    color: var(--ex-muted);
}
</style>
