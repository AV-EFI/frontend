<template>
    <div>
        <div class="explorer-headrow">
            <div>
                <h2 class="explorer-lead">{{ text.model.lead }}</h2>
                <p class="explorer-sub">{{ text.model.sub }}</p>
            </div>
            <button
                type="button"
                class="btn btn-sm btn-outline"
                :class="{ 'btn-active': store.selection?.kind === 'overview' }"
                data-focus="overview"
                :aria-pressed="store.selection?.kind === 'overview'"
                @click="toggleOverview"
            >
                <Icon name="tabler:info-circle" size="18" aria-hidden="true" />
                {{ text.model.overview }}
            </button>
        </div>

        <div class="explorer-stack">
            <template v-for="(level, index) in LEVELS" :key="level.id">
                <div v-if="level.upRule" class="explorer-link explorer-rise" :style="{ '--i': index * 2 - 1 }">
                    <div class="explorer-link-line" aria-hidden="true">
                        <span class="explorer-link-stroke" />
                        <span class="explorer-link-ratio">{{ RULE_RATIO[level.upRule] }}</span>
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline justify-start h-auto py-2 text-left"
                        :class="{ 'btn-active': store.selection?.kind === 'rule' && store.selection.id === level.upRule }"
                        :data-focus="`rule-${level.upRule}`"
                        :aria-pressed="store.selection?.kind === 'rule' && store.selection.id === level.upRule"
                        :aria-label="`${text.model.ruleRegion}: ${text.rules[level.upRule].title}`"
                        @click="store.select({ kind: 'rule', id: level.upRule })"
                    >
                        <Icon name="tabler:info-circle" size="18" aria-hidden="true" />
                        <span class="flex min-w-0 flex-col items-start whitespace-normal">
                            <span class="explorer-link-rule">{{ text.rules[level.upRule].title }}</span>
                            <span class="explorer-link-meta">
                                <b>{{ text.rules.required }}</b><code lang="en">{{ text.rules[level.upRule].code }}</code>
                            </span>
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
                class="btn btn-sm btn-outline"
                :class="{ 'btn-highlight': isChipHit(group), 'btn-active': store.selection?.kind === 'group' && store.selection.id === group.id }"
                :data-focus="`group-${group.id}`"
                :aria-pressed="store.selection?.kind === 'group' && store.selection.id === group.id"
                @click="store.select({ kind: 'group', id: group.id })"
            >
                <Icon name="tabler:info-circle" size="16" aria-hidden="true" />
                {{ text.groups[group.id].title }}
                <span v-if="groupHasMatch(group) && store.highlight === 'match'" class="badge badge-neutral badge-xs">
                    {{ text.model.matchBadge }}
                </span>
            </button>
            <span class="explorer-vsep" aria-hidden="true" />
            <button
                type="button"
                class="btn btn-sm btn-outline"
                :class="{ 'btn-active': store.selection?.kind === 'imports' }"
                data-focus="imports"
                :aria-pressed="store.selection?.kind === 'imports'"
                @click="store.select({ kind: 'imports' })"
            >
                <Icon name="tabler:info-circle" size="16" aria-hidden="true" />
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
    type RuleId,
} from '~/utils/explorer/model';

/** Work to manifestation is n:m (is_manifestation_of, 1 bis n); manifestation to item is 1:n (is_item_of, genau 1). */
const RULE_RATIO: Record<RuleId, string> = {
    r_manifestation: 'n : m',
    r_item: '1 : n',
};

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
    align-items: stretch;
    min-height: 3.75rem;
    margin: 1.1rem 0;
    padding: 0 1.6rem;
}

/* Rule box and line belong together: pointing at one lights up both. */
.explorer-link:hover .explorer-link-stroke,
.explorer-link:focus-within .explorer-link-stroke {
    width: 0.3rem;
    opacity: 1;
}

.explorer-link:hover .btn,
.explorer-link:focus-within .btn {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primary);
}

.explorer-link-line {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* A static line with an arrowhead at each end: the relation reads in both directions. */
.explorer-link-stroke {
    position: relative;
    width: 0.2rem;
    height: 100%;
    background: var(--color-base-content);
    opacity: 0.55;
    transition: opacity 0.15s, width 0.15s;
}

.explorer-link-stroke::before,
.explorer-link-stroke::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border: 0.6rem solid transparent;
}

.explorer-link-stroke::before {
    bottom: 100%;
    border-top: 0;
    border-bottom: 0.8rem solid var(--color-base-content);
}

.explorer-link-stroke::after {
    top: 100%;
    border-bottom: 0;
    border-top: 0.8rem solid var(--color-base-content);
}

/* Ratio of the two levels, set on the line. */
.explorer-link-ratio {
    position: absolute;
    padding: 0.1rem 0.3rem;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
    color: var(--color-base-content);
    background-color: var(--color-base-200);
    border: 1px solid var(--ex-line);
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

.explorer-vsep {
    align-self: stretch;
    width: 1px;
    margin: 0 0.4rem;
    background: var(--ex-line);
}

@media (max-width: 760px) {
    .explorer-link {
        grid-template-columns: 1fr;
        min-height: 0;
        margin: 1rem 0;
        padding: 0 1rem;
    }

    .explorer-link-line {
        display: none;
    }
}
</style>
