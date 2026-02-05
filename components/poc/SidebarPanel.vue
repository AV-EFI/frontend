<template>
    <aside class="flex h-full flex-col gap-4">
        <section class="rounded-box bg-base-200 p-4">
            <h2 class="text-base font-semibold">Ausgewählter Knoten</h2>
            <div v-if="selectedNode" class="mt-2 space-y-1">
                <p class="text-sm font-medium">{{ selectedNode.label }}</p>
                <p class="text-xs uppercase tracking-wide text-base-content/70">{{ selectedNode.type }}</p>
                <button type="button" class="btn btn-outline btn-xs mt-3" @click="emitAddContext(selectedNode)">
                    In Kontext übernehmen
                </button>
            </div>
            <p v-else class="text-sm text-base-content/70 mt-2">
                Wählen Sie einen Knoten im Graphen oder in der Liste aus.
            </p>
        </section>

        <section class="rounded-box bg-base-200 p-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide">Knotenliste</h3>
            <p class="text-xs text-base-content/70">Zur Tastaturbedienung auswählbar.</p>
            <ul class="mt-3 flex max-h-40 flex-col gap-1 overflow-y-auto">
                <li v-for="node in nodeList" :key="node.id">
                    <button type="button" class="btn btn-sm w-full justify-start"
                        :class="node.id === selectedNode?.id ? 'btn-active' : 'btn-ghost'" @click="emitSelect(node.id)">
                        <span class="truncate">{{ node.label }}</span>
                        <span class="badge badge-outline badge-xs ml-2 uppercase">{{ node.type }}</span>
                    </button>
                </li>
            </ul>
        </section>

        <section class="rounded-box bg-base-200 p-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide">Explore</h3>
            <div v-if="stats" class="mt-3 space-y-2 text-sm">
                <p><span class="font-semibold">Knoten:</span> {{ stats.nodes }}</p>
                <p><span class="font-semibold">Kanten:</span> {{ stats.edges }}</p>
                <p><span class="font-semibold">Akteure:</span> {{ stats.agents }}</p>
                <p><span class="font-semibold">Themen:</span> {{ stats.subjects }}</p>
                <p><span class="font-semibold">Manifestationen:</span> {{ stats.manifestations }}</p>
                <p><span class="font-semibold">Items:</span> {{ stats.items }}</p>
                <div v-if="roleEntries.length" class="pt-2">
                    <p class="font-semibold">Rollen</p>
                    <ul class="mt-2 space-y-1 text-sm">
                        <li v-for="role in roleEntries" :key="role.key" class="flex justify-between">
                            <span>{{ role.key }}</span>
                            <span class="badge badge-sm">{{ role.count }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <p v-else class="text-sm text-base-content/70 mt-3">
                Wählen Sie ein Werk aus, um Kennzahlen zu sehen.
            </p>
        </section>

        <section class="rounded-box bg-base-200 p-4">
            <h3 class="text-sm font-semibold uppercase tracking-wide">Top AkteurInnen (Suche)</h3>
            <ul v-if="agentFacets?.length" class="mt-3 space-y-2 text-sm">
                <li v-for="bucket in agentFacets" :key="bucket.key" class="flex justify-between">
                    <span class="truncate">{{ bucket.key }}</span>
                    <span class="badge badge-sm">{{ bucket.doc_count }}</span>
                </li>
            </ul>
            <p v-else class="text-sm text-base-content/70 mt-3">
                Noch keine aggregierten Akteur:innen vorhanden.
            </p>
        </section>
    </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { GraphNode, GraphSlice } from '~/utils/poc/graphSlice';
import type { AgentFacetResponse } from '~/composables/poc/usePocApi';

const props = defineProps<{
    selectedNode: GraphNode | null;
    nodeList: GraphNode[];
    stats: GraphSlice['stats'] | null;
    agentFacets: AgentFacetResponse['buckets'];
}>();

const emit = defineEmits<{
    (e: 'select-node', nodeId: string): void;
    (e: 'add-context', node: GraphNode): void;
}>();

const roleEntries = computed(() => {
    if (!props.stats?.agentRoles) {
        return [] as Array<{ key: string; count: number }>;
    }
    return Object.entries(props.stats.agentRoles)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);
});

const emitSelect = (nodeId: string) => {
    emit('select-node', nodeId);
};

const emitAddContext = (node: GraphNode) => {
    emit('add-context', node);
};
</script>
