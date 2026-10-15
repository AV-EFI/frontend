<template>
    <div>
        <div class="explorer-headrow">
            <div>
                <h2 class="explorer-lead">{{ text.model.lead }}</h2>
                <p class="explorer-sub">{{ text.model.sub }}</p>
            </div>
            <button
                type="button"
                class="explorer-ghost"
                data-focus="overview"
                :aria-pressed="store.selection?.kind === 'overview'"
                @click="toggleOverview"
            >
                {{ text.model.overview }}
            </button>
        </div>

        <div class="explorer-stack">
            <template v-for="(level, index) in LEVELS" :key="level.id">
                <div v-if="level.upRule" class="explorer-link explorer-rise" :style="{ '--i': index * 2 - 1 }">
                    <div class="explorer-link-line" aria-hidden="true" />
                    <button
                        type="button"
                        :data-focus="`rule-${level.upRule}`"
                        :aria-pressed="store.selection?.kind === 'rule' && store.selection.id === level.upRule"
                        :aria-label="`${text.model.ruleRegion}: ${text.rules[level.upRule].title}`"
                        @click="store.select({ kind: 'rule', id: level.upRule })"
                    >
                        <span class="explorer-link-rule">{{ text.rules[level.upRule].title }}</span>
                        <span class="explorer-link-meta">
                            <b>{{ text.rules.required }}</b><code lang="en">{{ text.rules[level.upRule].code }}</code>
                        </span>
                    </button>
                </div>
                <ExplorerLevelBand class="explorer-rise" :style="{ '--i': index * 2 }" :level="level" :open="isOpen(level)" />
            </template>
        </div>

        <p v-if="!store.highlight && store.openLevels.length === 0" class="explorer-hint">{{ text.model.hint }}</p>

        <div class="explorer-shared">
            <span class="explorer-shared-caption">{{ text.model.sharedCaption }}</span>
            <button
                v-for="group in shared"
                :key="group.id"
                type="button"
                class="explorer-chip"
                :class="{ 'is-hit': isChipHit(group) }"
                :data-focus="`group-${group.id}`"
                :aria-pressed="store.selection?.kind === 'group' && store.selection.id === group.id"
                @click="store.select({ kind: 'group', id: group.id })"
            >
                {{ text.groups[group.id].title }}
                <span v-if="groupHasMatch(group) && store.highlight === 'match'" class="explorer-chip-match">
                    {{ text.model.matchBadge }}
                </span>
            </button>
            <span class="explorer-vsep" aria-hidden="true" />
            <button
                type="button"
                class="explorer-chip is-dashed"
                data-focus="imports"
                :aria-pressed="store.selection?.kind === 'imports'"
                @click="store.select({ kind: 'imports' })"
            >
                {{ text.model.importRules }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import {
    LEVELS,
    groupHasMatch,
    groupHasRequired,
    groupsOfLevel,
    sharedGroups,
    type FieldGroup,
    type LevelDef,
} from '~/utils/explorer/model';

const store = useExplorerStore();
const { text } = useExplorerTexts();

const shared = computed(() => sharedGroups());

function groupIsHit(group: FieldGroup): boolean {
    if (store.highlight === 'required') return groupHasRequired(group);
    if (store.highlight === 'match') return groupHasMatch(group);
    return false;
}

const isChipHit = groupIsHit;

/** A highlight opens every level that has something to show, so the visitor does not have to search for it. */
function isOpen(level: LevelDef): boolean {
    if (store.isLevelOpen(level.id)) return true;
    if (!store.highlight) return false;
    return [...groupsOfLevel(level.id), ...shared.value].some(groupIsHit);
}

function toggleOverview() {
    if (store.selection?.kind === 'overview') store.closeDrawer();
    else store.select({ kind: 'overview' });
}
</script>

<style scoped>
.explorer-headrow {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.explorer-stack {
    display: flex;
    flex-direction: column;
    margin-top: 1.4rem;
}

.explorer-link {
    display: grid;
    grid-template-columns: 4rem minmax(0, 1fr);
    gap: 1rem;
    min-height: 3.75rem;
    padding: 0 1.6rem;
}

.explorer-link-line {
    position: relative;
    justify-self: center;
    width: 0.4rem;
    /* Dashes run down the line, from the work to the item. */
    background: repeating-linear-gradient(180deg, var(--color-base-content) 0 0.6rem, transparent 0.6rem 1rem);
    background-size: 100% 1rem;
    opacity: 0.55;
    animation: explorer-flow 1.1s linear infinite;
}

@keyframes explorer-flow {
    to { background-position: 0 1rem; }
}

@media (prefers-reduced-motion: reduce) {
    .explorer-link-line {
        animation: none;
    }
}

.explorer-link-line::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -1px;
    transform: translateX(-50%);
    border: 0.7rem solid transparent;
    border-top: 0;
    border-bottom: 0.9rem solid var(--color-base-content);
}

.explorer-link button {
    align-self: center;
    margin: 0.25rem 0;
    padding: 0.4rem 0.75rem;
    text-align: left;
    background: transparent;
    border: 1px solid var(--ex-line);
    cursor: pointer;
}

.explorer-link button:hover {
    border-color: var(--ex-muted);
}

.explorer-link button[aria-pressed='true'] {
    border-color: var(--color-primary);
    box-shadow: inset 4px 0 0 var(--color-primary);
}

.explorer-link-rule {
    display: block;
    font-size: 0.95rem;
    font-weight: 700;
}

.explorer-link-meta {
    display: block;
    font-size: 0.75rem;
    color: var(--ex-muted);
}

.explorer-link-meta b {
    margin-right: 0.5rem;
    font-size: 0.78rem;
    color: var(--color-base-content);
}

.explorer-hint {
    margin: 0.8rem 0 0;
    font-size: 0.85rem;
    color: var(--ex-muted);
}

.explorer-shared {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.65rem;
    margin-top: 1.5rem;
    padding-top: 1.3rem;
    border-top: 1px dashed var(--ex-line);
}

.explorer-shared-caption {
    margin-right: 0.25rem;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--ex-muted);
}

.explorer-chip {
    position: relative;
    padding: 0.3rem 0.7rem;
    font-size: 0.8rem;
    font-weight: 600;
    background: transparent;
    border: 1px solid var(--ex-line);
    cursor: pointer;
}

.explorer-chip:hover {
    border-color: var(--ex-muted);
}

.explorer-chip[aria-pressed='true'],
.explorer-chip.is-hit {
    border-color: var(--color-primary);
    box-shadow: inset 0 -3px 0 var(--color-primary);
}

.explorer-chip.is-dashed {
    border-style: dashed;
}

.explorer-chip-match {
    margin-left: 0.4rem;
    padding: 0.05rem 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--color-accent-content);
    color: var(--color-highlight);
}

.explorer-vsep {
    align-self: stretch;
    width: 1px;
    margin: 0 0.4rem;
    background: var(--ex-line);
}

@media (max-width: 760px) {
    .explorer-link {
        grid-template-columns: 1fr;
        padding: 0 1rem;
    }

    .explorer-link-line {
        display: none;
    }
}
</style>
