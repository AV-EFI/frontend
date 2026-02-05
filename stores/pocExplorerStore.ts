import { defineStore } from 'pinia';
import type { GraphNode, GraphSlice, PocWorkDocument } from '~/utils/poc/graphSlice';
import type { AgentFacetResponse, ChatChip, WorkSearchHit } from '~/composables/poc/usePocApi';

export type ChatAuthor = 'user' | 'assistant';

export interface ChatMessage {
    id: string;
    author: ChatAuthor;
    text: string;
    timestamp: number;
    sources?: Array<{ id: string; label: string }>;
}

export const usePocExplorerStore = defineStore('pocExplorer', {
    state: () => ({
        searchQuery: '' as string,
        searchResults: [] as WorkSearchHit[],
        selectedWorkHandle: null as string | null,
        selectedWorkDoc: null as PocWorkDocument | null,
        graphSlice: null as GraphSlice | null,
        selectedNodeId: null as string | null,
        contextChips: [] as ChatChip[],
        chatMessages: [] as ChatMessage[],
        agentFacets: [] as AgentFacetResponse['buckets'],
        isSearching: false as boolean,
        isLoadingWork: false as boolean,
        isSendingMessage: false as boolean,
    }),
    getters: {
        selectedNode(state): GraphNode | null {
            if (!state.graphSlice || !state.selectedNodeId) {
                return null;
            }
            return state.graphSlice.nodes.find((node) => node.id === state.selectedNodeId) ?? null;
        },
        graphStats(state) {
            return state.graphSlice?.stats ?? null;
        },
        nodeList(state): GraphNode[] {
            return state.graphSlice?.nodes ?? [];
        },
    },
    actions: {
        setSearchQuery(query: string) {
            this.searchQuery = query;
        },
        setSearchResults(results: WorkSearchHit[]) {
            this.searchResults = results;
        },
        setAgentFacets(buckets: AgentFacetResponse['buckets']) {
            this.agentFacets = buckets ?? [];
        },
        beginSearch() {
            this.isSearching = true;
        },
        finishSearch() {
            this.isSearching = false;
        },
        beginLoadWork() {
            this.isLoadingWork = true;
        },
        finishLoadWork() {
            this.isLoadingWork = false;
        },
        setSelectedWork(payload: { handle: string; workDoc: PocWorkDocument; graphSlice: GraphSlice }) {
            this.selectedWorkHandle = payload.handle;
            this.selectedWorkDoc = payload.workDoc;
            this.graphSlice = payload.graphSlice;
            this.selectedNodeId = payload.graphSlice.nodes[0]?.id ?? null;
        },
        clearSelectedWork() {
            this.selectedWorkHandle = null;
            this.selectedWorkDoc = null;
            this.graphSlice = null;
            this.selectedNodeId = null;
        },
        selectNode(nodeId: string | null) {
            this.selectedNodeId = nodeId;
        },
        addContextChip(chip: ChatChip) {
            if (!chip?.id) {
                return;
            }
            const exists = this.contextChips.some((existing) => existing.id === chip.id);
            if (!exists) {
                this.contextChips.push(chip);
            }
        },
        removeContextChip(chipId: string) {
            this.contextChips = this.contextChips.filter((chip) => chip.id !== chipId);
        },
        clearContextChips() {
            this.contextChips = [];
        },
        pushChatMessage(message: ChatMessage) {
            this.chatMessages.push(message);
        },
        setIsSendingMessage(value: boolean) {
            this.isSendingMessage = value;
        },
        reset() {
            this.searchQuery = '';
            this.searchResults = [];
            this.clearSelectedWork();
            this.clearContextChips();
            this.chatMessages = [];
            this.agentFacets = [];
            this.isSearching = false;
            this.isLoadingWork = false;
            this.isSendingMessage = false;
        },
    },
});
