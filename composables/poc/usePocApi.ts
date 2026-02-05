import { useRequestHeaders, useRuntimeConfig } from 'nuxt/app';
import type { GraphSlice, PocWorkDocument } from '~/utils/poc/graphSlice';

export interface WorkSearchHit {
    handle: string;
    title?: string;
    issuer?: string;
    level?: string;
}

export interface WorkSearchResponse {
    hits: WorkSearchHit[];
    tookMs?: number;
    error?: string;
}

export interface WorkDetailResponse {
    workDoc: PocWorkDocument;
    graphSlice: GraphSlice;
    tookMs?: number;
    error?: string;
}

export interface ChatChip {
    id: string;
    type: string;
    label: string;
}

export interface ChatResponse {
    answer: string;
    sources: Array<{ id: string; label: string }>;
}

export interface AgentFacetResponse {
    buckets: Array<{ key: string; doc_count: number }>;
    error?: string;
}

export function usePocApi() {
    const runtimeConfig = useRuntimeConfig();
    const requestHeaders = useRequestHeaders(['cookie']);

    const normalizeBase = (value: string | undefined | null): string => {
        if (!value) {
            return '';
        }
        if (value === '/') {
            return '';
        }
        return value.endsWith('/') ? value.slice(0, -1) : value;
    };

    const internalBase = normalizeBase(runtimeConfig.public?.AVEFI_INTERNAL_API) || '/api';
    const pocBase = `${normalizeBase(internalBase)}/poc`;
    const buildUrl = (path: string) => `${pocBase}${path}`;

    const searchWorks = async (query: string, size = 10): Promise<WorkSearchResponse> => {
        if (!query || query.trim().length === 0) {
            return { hits: [], tookMs: 0 };
        }

        try {
            return await $fetch<WorkSearchResponse>(buildUrl('/works/search'), {
                method: 'POST',
                body: { q: query, size },
                headers: requestHeaders,
            });
        } catch (error) {
            console.error('[usePocApi.searchWorks] error', error);
            return { hits: [], error: 'Search failed' };
        }
    };

    const fetchWorkByHandle = async (handle: string): Promise<WorkDetailResponse | null> => {
        if (!handle || handle.trim().length === 0) {
            return null;
        }

        try {
            return await $fetch<WorkDetailResponse>(buildUrl('/works/by-handle'), {
                method: 'GET',
                query: { handle },
                headers: requestHeaders,
            });
        } catch (error) {
            console.error('[usePocApi.fetchWorkByHandle] error', error);
            return null;
        }
    };

    const sendChatMessage = async (message: string, chips: ChatChip[]): Promise<ChatResponse> => {
        if (!message || message.trim().length === 0) {
            return { answer: 'Bitte geben Sie eine Nachricht ein.', sources: [] };
        }

        try {
            return await $fetch<ChatResponse>(buildUrl('/chat'), {
                method: 'POST',
                body: { message, context: { chips } },
                headers: requestHeaders,
            });
        } catch (error) {
            console.error('[usePocApi.sendChatMessage] error', error);
            return {
                answer: 'Die Nachricht konnte nicht gesendet werden.',
                sources: [],
            };
        }
    };

    const fetchAgentFacets = async (query: string): Promise<AgentFacetResponse> => {
        if (!query || query.trim().length === 0) {
            return { buckets: [] };
        }

        try {
            return await $fetch<AgentFacetResponse>(buildUrl('/facets/agents'), {
                method: 'POST',
                body: { q: query },
                headers: requestHeaders,
            });
        } catch (error) {
            console.error('[usePocApi.fetchAgentFacets] error', error);
            return { buckets: [], error: 'Facet fetch failed' };
        }
    };

    return {
        searchWorks,
        fetchWorkByHandle,
        sendChatMessage,
        fetchAgentFacets,
    };
}
