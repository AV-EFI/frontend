<template>
    <button
        type="button"
        class="btn btn-sm explorer-badge"
        :class="{ 'is-required': slotInfo.required, 'btn-highlight': hit, 'btn-active': selected }"
        :aria-pressed="selected"
        :title="slotInfo.name"
        @click="store.selectField(groupId, slotInfo.name)"
    >
        <span v-if="term">{{ term }}</span>
        <code v-else lang="en">{{ slotInfo.name }}</code>
        <span v-if="slotInfo.required" class="sr-only"> ({{ text.model.required }})</span>
        <span v-if="matchKind && highlight === 'match'" class="badge badge-neutral badge-xs">{{ text.model.matchBadge }}</span>
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
    font-weight: 600;
    transition: transform 0.12s ease;
}

.explorer-badge:hover {
    transform: translateY(-2px);
}

/* A required field carries a dot in front of its name, so it is not marked by weight or colour alone. */
.explorer-badge.is-required::before {
    content: '';
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    background: currentColor;
}

@media (prefers-reduced-motion: reduce) {
    .explorer-badge {
        transition: none;
    }

    .explorer-badge:hover {
        transform: none;
    }
}
</style>
