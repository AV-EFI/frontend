<template>
    <aside class="explorer-side" :aria-label="text.nav.label">
        <section v-if="store.view === 'model'" aria-labelledby="explorer-highlight-heading">
            <h2 id="explorer-highlight-heading" class="explorer-side-heading px-2">{{ text.nav.highlight.heading }}</h2>

            <div class="explorer-filter">
                <button
                    type="button"
                    class="btn btn-ghost btn-block justify-start h-auto px-2 py-2 text-left"
                    :class="{ 'btn-active': store.highlight === 'required' }"
                    :aria-pressed="store.highlight === 'required'"
                    @click="store.toggleHighlight('required')"
                >
                    <span class="flex flex-col items-start whitespace-normal">
                        <span class="explorer-filter-name">{{ text.nav.highlight.required.name }}</span>
                        <span class="explorer-filter-hint">{{ fill(text.nav.highlight.required.hint, { n: required.length }) }}</span>
                    </span>
                </button>
                <ul class="explorer-fieldlist">
                    <li v-for="field in required" :key="`${field.level}.${field.slot}`">
                        <button type="button" class="btn btn-ghost btn-sm justify-start px-2 font-normal" @click="store.showField(field.level, field.group, field.slot)">
                            <Icon name="tabler:info-circle" size="14" aria-hidden="true" />
                            {{ requiredLabel(field) }}
                            <span class="explorer-fieldlist-level">{{ text.levels[field.level].word }}</span>
                        </button>
                    </li>
                </ul>
            </div>

            <div class="explorer-filter">
                <button
                    type="button"
                    class="btn btn-ghost btn-block justify-start h-auto px-2 py-2 text-left"
                    :class="{ 'btn-active': store.highlight === 'match' }"
                    :aria-pressed="store.highlight === 'match'"
                    @click="store.toggleHighlight('match')"
                >
                    <span class="flex flex-col items-start whitespace-normal">
                        <span class="explorer-filter-name">{{ text.nav.highlight.match.name }}</span>
                        <span class="explorer-filter-hint">{{ fill(text.nav.highlight.match.hint, { n: compared.length }) }}</span>
                    </span>
                </button>
                <ul class="explorer-fieldlist">
                    <li v-for="field in compared" :key="field.ref">
                        <button type="button" class="btn btn-ghost btn-sm justify-start px-2 font-normal" @click="store.showField('work', field.group, splitFieldRef(field.ref).slotName)">
                            <Icon name="tabler:info-circle" size="14" aria-hidden="true" />
                            {{ text.match[field.kind] }}
                        </button>
                    </li>
                </ul>
            </div>
        </section>

        <details class="explorer-more">
            <summary>{{ text.links.heading }}</summary>
            <ExplorerFurtherLinks compact />
        </details>

        <p class="explorer-note">{{ text.nav.note }}</p>
    </aside>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import { fieldTerm } from '~/utils/explorer/fieldTerms';
import { matchFields, requiredFields, type LevelField } from '~/utils/explorer/model';
import { LEVEL_CLASS, getSlot, splitFieldRef } from '~/utils/explorer/schemaModel';

const store = useExplorerStore();
const { text, language, fill } = useExplorerTexts();

const required = requiredFields();
const compared = matchFields();

function requiredLabel(field: LevelField): string {
    const classId = LEVEL_CLASS[field.level];
    return fieldTerm(classId, getSlot(classId, field.slot), language.value) ?? field.slot;
}
</script>

<style scoped>
.explorer-side {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 0.5rem 0.75rem 0.75rem 0.75rem;
}

.explorer-side-heading {
    margin: 0 0 0.3rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--ex-muted);
}

.explorer-filter {
    border-top: 1px solid var(--ex-line);
    padding: 0.35rem 0 0.7rem;
}

.explorer-filter-name {
    display: block;
    font-size: 0.95rem;
    font-weight: 700;
}

.explorer-filter-hint {
    display: block;
    font-size: 0.8rem;
    color: var(--ex-muted);
}

.explorer-fieldlist {
    margin: 0.2rem 0 0;
    padding: 0;
    list-style: none;
}

.explorer-fieldlist-level {
    color: var(--ex-muted);
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
