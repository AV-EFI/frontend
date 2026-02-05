<template>
    <main class="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:flex-row">
        <section class="flex w-full flex-col gap-4 md:w-1/4">
            <ExplorerSearchBox v-model="searchQueryRef" :loading="isSearching" @search="handleSearch" />
            <p v-if="searchError" class="alert alert-error text-sm">{{ searchError }}</p>
            <WorkResultList :results="searchResultsRef" :selected-handle="selectedWorkHandleRef"
                :loading="isSearching || isLoadingWork" @select="handleSelectWork" />
            <div v-if="selectedWorkLevelLabel" class="selected-level-callout" role="status">
                <span class="selected-level-heading">Aktuelle Ebene</span>
                <span class="selected-level-value">
                    <span class="selected-level-indicator" :style="{ backgroundColor: selectedWorkLevelColor }"
                        aria-hidden="true" />
                    <span>{{ selectedWorkLevelLabel }}</span>
                </span>
            </div>
            <p v-if="workError" class="alert alert-error text-sm">{{ workError }}</p>
        </section>

        <section class="w-full md:w-1/2">
            <ClientOnly>
                <GraphView v-if="graphNodes.length" :nodes="graphNodes" :edges="graphEdges"
                    :selected-node-id="selectedNodeIdRef" :aria-label="graphAriaLabel"
                    @node-selected="onNodeSelected" />
                <template #fallback>
                    <div class="flex h-96 items-center justify-center rounded-box bg-base-200">
                        <p class="text-sm text-base-content/70">Graph wird geladen...</p>
                    </div>
                </template>
            </ClientOnly>
            <p v-if="!graphNodes.length" class="mt-4 text-sm text-base-content/70">
                Wählen Sie ein Werk, um die Beziehungen anzuzeigen.
            </p>
        </section>

        <section class="flex w-full flex-col gap-4 md:w-1/4">
            <SidebarPanel :selected-node="selectedNodeRef" :node-list="nodeListRef" :stats="graphStats"
                :agent-facets="agentFacetsRef" @select-node="onNodeSelected" @add-context="addNodeToContext" />
            <ContextTray :chips="contextChipsRef" @remove="removeContextChip" @clear="clearContextChips" />
            <ChatPanel :messages="chatMessagesRef" :sending="isSendingMessageRef" @send="handleChatMessage" />
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import ExplorerSearchBox from '~/components/poc/ExplorerSearchBox.vue';
import WorkResultList from '~/components/poc/WorkResultList.vue';
import GraphView from '~/components/poc/GraphView.vue';
import SidebarPanel from '~/components/poc/SidebarPanel.vue';
import ContextTray from '~/components/poc/ContextTray.vue';
import ChatPanel from '~/components/poc/ChatPanel.vue';
import { usePocApi } from '~/composables/poc/usePocApi';
import { usePocExplorerStore } from '~/stores/pocExplorerStore';
import type { GraphNode } from '~/utils/poc/graphSlice';

const { searchWorks, fetchWorkByHandle, sendChatMessage, fetchAgentFacets } = usePocApi();
const explorerStore = usePocExplorerStore();
const { t } = useI18n();

const {
    searchQuery: searchQueryRef,
    searchResults: searchResultsRef,
    selectedWorkHandle: selectedWorkHandleRef,
    selectedWorkDoc: selectedWorkDocRef,
    graphSlice,
    nodeList: nodeListRef,
    selectedNode: selectedNodeRef,
    selectedNodeId: selectedNodeIdRef,
    contextChips: contextChipsRef,
    chatMessages: chatMessagesRef,
    agentFacets: agentFacetsRef,
    isSearching,
    isLoadingWork,
    isSendingMessage: isSendingMessageRef,
} = storeToRefs(explorerStore);

const searchError = ref<string>('');
const workError = ref<string>('');

const graphNodes = computed(() => graphSlice.value?.nodes ?? []);
const graphEdges = computed(() => graphSlice.value?.edges ?? []);
const graphStats = computed(() => graphSlice.value?.stats ?? null);

const determineLevelKey = computed(() => {
    const level = selectedWorkDocRef.value?.has_record?.category
        ?? (selectedWorkDocRef.value as { category?: string | null } | null)?.category
        ?? null;

    if (!level) {
        return null;
    }

    const value = level.toLowerCase();
    if (value.includes('manifestation')) {
        return 'manifestation';
    }
    if (value.includes('item')) {
        return 'item';
    }
    if (value.includes('work')) {
        return 'workvariant';
    }
    return 'unknown';
});

const selectedWorkLevelLabel = computed(() => {
    switch (determineLevelKey.value) {
        case 'manifestation':
            return t('avefi_Manifestation');
        case 'item':
            return t('avefi_Item');
        case 'workvariant':
            return t('avefi_WorkVariant');
        case 'unknown':
            return 'Ebene unbekannt';
        default:
            return null;
    }
});

const selectedWorkLevelColor = computed(() => {
    switch (determineLevelKey.value) {
        case 'manifestation':
            return 'var(--manifestation)';
        case 'item':
            return 'var(--item)';
        case 'workvariant':
            return 'var(--work)';
        case 'unknown':
            return 'var(--neutral)';
        default:
            return 'transparent';
    }
});

const graphAriaLabel = computed(() => {
    const selectedLabel = selectedNodeRef.value?.label ?? 'keine Auswahl';
    return `Werk-Explorer mit ${graphNodes.value.length} Knoten. Aktuell ausgewählt: ${selectedLabel}`;
});

const handleSearch = async (query: string) => {
    explorerStore.setSearchQuery(query);
    explorerStore.beginSearch();
    searchError.value = '';

    try {
        const response = await searchWorks(query, 10);
        explorerStore.setSearchResults(response.hits ?? []);
        if (response.error) {
            searchError.value = response.error;
        }

        const facets = await fetchAgentFacets(query);
        explorerStore.setAgentFacets(facets.buckets ?? []);
    } catch (error) {
        console.error('[explorer-poc] search failed', error);
        searchError.value = 'Die Suche ist fehlgeschlagen.';
    } finally {
        explorerStore.finishSearch();
    }
};

const handleSelectWork = async (handle: string) => {
    if (!handle) {
        return;
    }

    explorerStore.beginLoadWork();
    workError.value = '';

    try {
        const response = await fetchWorkByHandle(handle);
        if (response?.workDoc && response?.graphSlice) {
            explorerStore.setSelectedWork({
                handle,
                workDoc: response.workDoc,
                graphSlice: response.graphSlice,
            });
        } else {
            workError.value = response?.error ?? 'Das Werk konnte nicht geladen werden.';
        }
    } catch (error) {
        console.error('[explorer-poc] load work failed', error);
        workError.value = 'Das Werk konnte nicht geladen werden.';
    } finally {
        explorerStore.finishLoadWork();
    }
};

const onNodeSelected = (nodeId: string | null) => {
    if (nodeId) {
        explorerStore.selectNode(nodeId);
    }
};

const addNodeToContext = (node: GraphNode) => {
    explorerStore.addContextChip({
        id: node.id,
        type: node.type,
        label: node.label,
    });
};

const removeContextChip = (chipId: string) => {
    explorerStore.removeContextChip(chipId);
};

const clearContextChips = () => {
    explorerStore.clearContextChips();
};

const handleChatMessage = async (message: string) => {
    if (!message) {
        return;
    }

    const userMessageId = crypto.randomUUID();
    explorerStore.pushChatMessage({
        id: userMessageId,
        author: 'user',
        text: message,
        timestamp: Date.now(),
    });

    explorerStore.setIsSendingMessage(true);

    try {
        const response = await sendChatMessage(message, contextChipsRef.value);
        explorerStore.pushChatMessage({
            id: crypto.randomUUID(),
            author: 'assistant',
            text: response.answer,
            timestamp: Date.now(),
            sources: response.sources,
        });
    } catch (error) {
        console.error('[explorer-poc] chat failed', error);
        explorerStore.pushChatMessage({
            id: crypto.randomUUID(),
            author: 'assistant',
            text: 'Die Antwort konnte nicht geladen werden.',
            timestamp: Date.now(),
        });
    } finally {
        explorerStore.setIsSendingMessage(false);
    }
};
</script>

<style scoped>
main {
    min-height: calc(100vh - 6rem);
}

.selected-level-callout {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid var(--base-300, #d1d5db);
    background-color: var(--base-200, #f3f4f6);
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    color: var(--base-content, #1e293b);
}

.selected-level-heading {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.selected-level-value {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.selected-level-indicator {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    border: 1px solid color-mix(in srgb, var(--neutral) 30%, transparent);
}
</style>
