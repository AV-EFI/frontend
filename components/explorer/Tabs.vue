<template>
    <div role="tablist" class="tabs tabs-border explorer-tabs" :aria-label="text.nav.view" @keydown="onKeydown">
        <button
            v-for="tab in tabs"
            :id="`explorer-tab-${tab.id}`"
            :key="tab.id"
            type="button"
            role="tab"
            class="tab explorer-tab"
            :class="{ 'tab-active': store.view === tab.id }"
            :aria-selected="store.view === tab.id"
            :aria-controls="'explorer-panel'"
            :tabindex="store.view === tab.id ? 0 : -1"
            @click="store.setView(tab.id)"
        >
            {{ tab.name }}
            <span v-if="tab.hint" class="explorer-tab-hint" :class="{ 'has-dot': tab.attention }">{{ tab.hint }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { useExplorerStore, type ExplorerView } from '~/stores/explorerStore';

const store = useExplorerStore();
const { text, fill } = useExplorerTexts();

const tabs = computed(() => [
    { id: 'model' as ExplorerView, name: text.value.nav.model.name, hint: '', attention: false },
    {
        id: 'cases' as ExplorerView,
        name: text.value.nav.cases.name,
        hint: store.openCaseCount > 0 ? fill(text.value.nav.cases.open, { n: store.openCaseCount }) : text.value.nav.cases.done,
        attention: store.openCaseCount > 0,
    },
]);

/** Arrow keys, Home and End move between the tabs and select the one they reach. */
function onKeydown(event: KeyboardEvent) {
    const ids = tabs.value.map((tab) => tab.id);
    const focused = (event.target as HTMLElement).id.replace('explorer-tab-', '') as ExplorerView;
    const current = Math.max(ids.indexOf(focused), 0);
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % ids.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + ids.length) % ids.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = ids.length - 1;
    else return;
    event.preventDefault();
    store.setView(ids[next]!);
    document.getElementById(`explorer-tab-${ids[next]}`)?.focus();
}
</script>

<style scoped>
.explorer-tabs {
    margin-bottom: 0.9rem;
}

.explorer-tab {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
}

.explorer-tab-hint {
    font-size: 0.8rem;
    font-weight: 400;
    color: var(--ex-muted);
}

.explorer-tab-hint.has-dot::before {
    content: '';
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.4rem;
    border-radius: 50%;
    background: var(--color-primary);
}
</style>
