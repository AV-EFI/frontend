<template>
    <button
        type="button"
        class="explorer-badge"
        :class="{ 'is-required': slotInfo.required, 'is-hit': hit, 'has-match': matchKind !== null }"
        :aria-pressed="selected"
        :title="slotInfo.name"
        @click="store.selectField(groupId, slotInfo.name)"
    >
        <span v-if="term" class="explorer-badge-label">{{ term }}</span>
        <code v-else class="explorer-badge-code" lang="en">{{ slotInfo.name }}</code>
        <span v-if="slotInfo.required" class="sr-only"> ({{ text.model.required }})</span>
        <span v-if="matchKind && highlight === 'match'" class="explorer-badge-match">{{ text.model.matchBadge }}</span>
    </button>
</template>

<script setup lang="ts">
import { useExplorerStore } from '~/stores/explorerStore';
import { fieldTerm } from '~/utils/explorer/fieldTerms';
import { MATCH_SLOT_KIND, type GroupId } from '~/utils/explorer/model';
import { getSlot } from '~/utils/explorer/schemaModel';

const props = defineProps<{
    /** Schema class of the level the badge is shown at. */
    classId: string;
    slotName: string;
    groupId: GroupId;
}>();

const store = useExplorerStore();
const { text, language } = useExplorerTexts();

const slotInfo = computed(() => getSlot(props.classId, props.slotName));
const term = computed(() => fieldTerm(props.classId, slotInfo.value, language.value));
const highlight = computed(() => store.highlight);
const matchKind = computed(() => (MATCH_SLOT_KIND as Record<string, string>)[props.slotName] ?? null);
const selected = computed(
    () => store.selection?.kind === 'group' && store.selection.id === props.groupId && store.selection.field === props.slotName,
);
const hit = computed(() => {
    if (highlight.value === 'required') return slotInfo.value.required;
    if (highlight.value === 'match') return matchKind.value !== null;
    return false;
});
</script>

<style scoped>
.explorer-badge {
    position: relative;
    padding: 0.25rem 0.65rem;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.3;
    color: var(--ex-ink);
    background: var(--ex-paper);
    box-shadow: var(--ex-shadow);
    border: 0;
    cursor: pointer;
}

.explorer-badge:hover {
    background: var(--color-highlight);
    color: var(--color-highlight-content);
}

.explorer-badge-code {
    font-size: 0.75rem;
}

.explorer-badge.is-required {
    padding-left: 1.1rem;
    font-weight: 800;
}

.explorer-badge.is-required::before {
    content: '';
    position: absolute;
    left: 0.45rem;
    top: 50%;
    width: 0.4rem;
    height: 0.4rem;
    margin-top: -0.2rem;
    border-radius: 50%;
    background: currentColor;
}

.explorer-badge[aria-pressed='true'],
.explorer-badge.is-hit {
    outline: 3px solid var(--ex-ink);
    outline-offset: 2px;
}

.explorer-badge-match {
    margin-left: 0.4rem;
    padding: 0.05rem 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    background: var(--color-accent-content);
    color: var(--color-highlight);
}
</style>
