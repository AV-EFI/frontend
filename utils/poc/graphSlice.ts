export type GraphNodeType = 'work' | 'agent' | 'subject' | 'manifestation' | 'item';

export interface GraphNode {
    id: string;
    type: GraphNodeType;
    label: string;
    meta?: Record<string, unknown>;
}

export interface GraphEdge {
    id: string;
    source: string;
    target: string;
    predicate: string;
}

export interface GraphStats {
    nodes: number;
    edges: number;
    agents: number;
    subjects: number;
    manifestations: number;
    items: number;
    agentRoles: Record<string, number>;
}

export interface GraphSlice {
    nodes: GraphNode[];
    edges: GraphEdge[];
    stats: GraphStats;
}

export interface PocWorkDocument {
    handle?: string;
    _id?: string;
    has_record?: {
        has_primary_title?: {
            has_name?: string;
        } | null;
        has_alternative_title?: Array<{
            has_name?: string;
        } | null> | null;
        described_by?: {
            has_issuer_name?: string;
        } | null;
        has_event?: Array<{
            has_activity?: Array<{
                type?: string | null;
                category?: string | null;
                has_agent?: Array<{
                    has_name?: string | null;
                    has_alternate_name?: Array<string | {
                        has_name?: string | null;
                    } | null> | null;
                    same_as?: {
                        id?: string | null;
                    } | null;
                } | null> | null;
            } | null> | null;
        } | null> | null;
    } | null;
    subjects?: Array<string | null> | null;
    manifestations?: Array<{
        handle?: string;
        has_record?: {
            has_primary_title?: {
                has_name?: string;
            } | null;
        } | null;
        items?: Array<{
            handle?: string;
            has_record?: {
                has_primary_title?: {
                    has_name?: string;
                } | null;
            } | null;
        } | null> | null;
    } | null> | null;
    [key: string]: unknown;
}

interface AgentAccumulator {
    id: string;
    label: string;
    roleCounts: Map<string, number>;
    occurrences: number;
    meta?: Record<string, unknown>;
}

function safeArray<T>(value: Array<T | null | undefined> | null | undefined): T[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter((item): item is T => item != null);
}

function normalizeIdSegment(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        || 'unknown';
}

function coerceString(value: unknown): string | undefined {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value.trim();
    }

    if (typeof value === 'object' && value !== null && 'has_name' in value) {
        const nested = (value as { has_name?: unknown }).has_name;
        if (typeof nested === 'string' && nested.trim().length > 0) {
            return nested.trim();
        }
    }

    return undefined;
}

const WORK_NODE_TYPE: GraphNodeType = 'work';
const AGENT_NODE_TYPE: GraphNodeType = 'agent';
const SUBJECT_NODE_TYPE: GraphNodeType = 'subject';
const MANIFESTATION_NODE_TYPE: GraphNodeType = 'manifestation';
const ITEM_NODE_TYPE: GraphNodeType = 'item';

const MAX_AGENT_NODES = 10;
const MAX_SUBJECT_NODES = 8;
const MAX_MANIFESTATION_NODES = 6;
const MAX_ITEM_NODES = 8;
const MAX_TOTAL_NODES = 30;

export function extractGraphSliceFromWorkDoc(workDoc: PocWorkDocument): GraphSlice {
    const workId = workDoc.handle?.trim()
        || (typeof workDoc._id === 'string' && workDoc._id.trim())
        || 'unknown-work';

    const workLabel = workDoc.has_record?.has_primary_title?.has_name?.trim()
        || workDoc.has_record?.has_alternative_title?.[0]?.has_name?.trim()
        || workDoc.handle?.trim()
        || (typeof workDoc._id === 'string' ? workDoc._id.trim() : undefined)
        || 'Unbekanntes Werk';

    const nodes: GraphNode[] = [{
        id: workId,
        type: WORK_NODE_TYPE,
        label: workLabel,
    }];

    const edges: GraphEdge[] = [];

    const agentMap = new Map<string, AgentAccumulator>();
    const agentEdges = new Map<string, GraphEdge>();

    const events = safeArray(workDoc.has_record?.has_event);
    events.forEach((event) => {
        const activities = safeArray(event?.has_activity);
        activities.forEach((activity) => {
            const roleRaw = activity?.type?.trim()
                || activity?.category?.trim()
                || 'hasAgent';
            const role = roleRaw || 'hasAgent';

            const agents = safeArray(activity?.has_agent);
            agents.forEach((agent) => {
                const primaryName = coerceString(agent?.has_name);
                const alternateNames = safeArray(agent?.has_alternate_name);
                const fallbackAlternate = alternateNames
                    .map((name) => coerceString(name))
                    .find((val): val is string => typeof val === 'string' && val.length > 0);

                const label = primaryName || fallbackAlternate || 'Unknown agent';

                const agentId = agent?.same_as?.id?.trim()
                    || `agent:${normalizeIdSegment(label)}|${normalizeIdSegment(role)}`;

                const existing = agentMap.get(agentId);
                if (existing) {
                    existing.occurrences += 1;
                    existing.roleCounts.set(role, (existing.roleCounts.get(role) ?? 0) + 1);
                } else {
                    agentMap.set(agentId, {
                        id: agentId,
                        label,
                        occurrences: 1,
                        roleCounts: new Map([[role, 1]]),
                        meta: {
                            primaryName,
                            alternateName: fallbackAlternate,
                        },
                    });
                }

                const edgeId = `${workId}::${role}::${agentId}`;
                if (!agentEdges.has(edgeId)) {
                    agentEdges.set(edgeId, {
                        id: edgeId,
                        source: workId,
                        target: agentId,
                        predicate: role,
                    });
                }
            });
        });
    });

    const sortedAgents = Array.from(agentMap.values()).sort((a, b) => {
        if (b.occurrences !== a.occurrences) {
            return b.occurrences - a.occurrences;
        }
        return a.label.localeCompare(b.label, 'en');
    });

    const selectedAgents = sortedAgents.slice(0, MAX_AGENT_NODES);
    const selectedAgentIds = new Set(selectedAgents.map((agent) => agent.id));

    selectedAgents.forEach((agent) => {
        nodes.push({
            id: agent.id,
            type: AGENT_NODE_TYPE,
            label: agent.label,
            meta: agent.meta,
        });
    });

    Array.from(agentEdges.values())
        .filter((edge) => selectedAgentIds.has(edge.target))
        .forEach((edge) => {
            edges.push(edge);
        });

    const subjectsRaw = safeArray(workDoc.subjects).map((subject) => subject?.trim()).filter((subject): subject is string => !!subject && subject.length > 0);
    const dedupSubjectMap = new Map<string, string>();
    subjectsRaw.forEach((subject) => {
        const subjectId = `subject:${normalizeIdSegment(subject)}`;
        if (!dedupSubjectMap.has(subjectId)) {
            dedupSubjectMap.set(subjectId, subject);
        }
    });

    const subjectEntries = Array.from(dedupSubjectMap.entries())
        .sort(([, a], [, b]) => a.localeCompare(b, 'en'))
        .slice(0, MAX_SUBJECT_NODES);

    const subjectNodes: GraphNode[] = subjectEntries.map(([id, label]) => ({
        id,
        type: SUBJECT_NODE_TYPE,
        label,
    }));
    const subjectEdges: GraphEdge[] = subjectEntries.map(([id]) => ({
        id: `${workId}::hasSubject::${id}`,
        source: workId,
        target: id,
        predicate: 'hasSubject',
    }));

    nodes.push(...subjectNodes);
    edges.push(...subjectEdges);

    const manifestationsRaw = safeArray(workDoc.manifestations);
    const manifestationNodes: GraphNode[] = [];
    const manifestationEdges: GraphEdge[] = [];
    const selectedManifestations = manifestationsRaw.slice(0, MAX_MANIFESTATION_NODES);

    selectedManifestations.forEach((manifestation, index) => {
        const manifestationId = manifestation?.handle?.trim()
            || `manifestation:${index}`;
        if (nodes.some((node) => node.id === manifestationId)) {
            return;
        }

        const label = manifestation?.has_record?.has_primary_title?.has_name?.trim()
            || manifestation?.handle?.trim()
            || `Manifestation ${index + 1}`;

        const node: GraphNode = {
            id: manifestationId,
            type: MANIFESTATION_NODE_TYPE,
            label,
        };
        manifestationNodes.push(node);
        nodes.push(node);

        const edge: GraphEdge = {
            id: `${workId}::hasManifestation::${manifestationId}`,
            source: workId,
            target: manifestationId,
            predicate: 'hasManifestation',
        };
        manifestationEdges.push(edge);
        edges.push(edge);
    });

    const itemNodes: GraphNode[] = [];
    const itemEdges: GraphEdge[] = [];

    let remainingItemSlots = MAX_ITEM_NODES;
    selectedManifestations.forEach((manifestation, manifestationIndex) => {
        if (remainingItemSlots <= 0) {
            return;
        }

        const manifestationId = manifestation?.handle?.trim()
            || `manifestation:${manifestationIndex}`;
        if (!nodes.some((node) => node.id === manifestationId)) {
            return;
        }

        const items = safeArray(manifestation?.items).slice(0, remainingItemSlots);
        items.forEach((item, itemIndex) => {
            const itemId = item?.handle?.trim()
                || `item:${manifestationIndex}:${itemIndex}`;
            if (nodes.some((node) => node.id === itemId)) {
                return;
            }

            const label = item?.has_record?.has_primary_title?.has_name?.trim()
                || itemId;

            const node: GraphNode = {
                id: itemId,
                type: ITEM_NODE_TYPE,
                label,
            };

            const edge: GraphEdge = {
                id: `${manifestationId}::hasItem::${itemId}`,
                source: manifestationId,
                target: itemId,
                predicate: 'hasItem',
            };

            nodes.push(node);
            edges.push(edge);

            itemNodes.push(node);
            itemEdges.push(edge);

            remainingItemSlots -= 1;
        });
    });

    // Enforce node limit: drop optional items first, then subjects, then agents.
    const nodeMap = new Map(nodes.map((node) => [node.id, node] as const));

    const removeNodeById = (id: string) => {
        if (!nodeMap.has(id)) {
            return;
        }
        nodeMap.delete(id);
    };

    const removeEdgesByNodeId = (id: string) => {
        for (let i = edges.length - 1; i >= 0; i -= 1) {
            if (edges[i].source === id || edges[i].target === id) {
                edges.splice(i, 1);
            }
        }
    };

    const pruneNodes = () => {
        while (nodeMap.size > MAX_TOTAL_NODES) {
            if (itemNodes.length) {
                const node = itemNodes.pop();
                if (node) {
                    removeNodeById(node.id);
                    removeEdgesByNodeId(node.id);
                }
                continue;
            }

            if (subjectNodes.length) {
                const node = subjectNodes.pop();
                if (node) {
                    removeNodeById(node.id);
                    removeEdgesByNodeId(node.id);
                }
                continue;
            }

            if (selectedAgents.length > 0) {
                const agent = selectedAgents.pop();
                if (agent) {
                    removeNodeById(agent.id);
                    removeEdgesByNodeId(agent.id);
                    selectedAgentIds.delete(agent.id);
                }
                continue;
            }

            break;
        }
    };

    pruneNodes();

    const finalNodes = Array.from(nodeMap.values());
    const finalNodeIds = new Set(finalNodes.map((node) => node.id));
    const finalEdges = edges.filter((edge) => finalNodeIds.has(edge.source) && finalNodeIds.has(edge.target));

    const finalNodeMap = new Map(finalNodes.map((node) => [node.id, node] as const));
    const agentRoles: Record<string, number> = {};
    finalEdges.forEach((edge) => {
        const targetNode = finalNodeMap.get(edge.target);
        if (edge.source === workId && targetNode?.type === AGENT_NODE_TYPE) {
            agentRoles[edge.predicate] = (agentRoles[edge.predicate] ?? 0) + 1;
        }
    });

    const stats: GraphStats = {
        nodes: finalNodes.length,
        edges: finalEdges.length,
        agents: finalNodes.filter((node) => node.type === AGENT_NODE_TYPE).length,
        subjects: finalNodes.filter((node) => node.type === SUBJECT_NODE_TYPE).length,
        manifestations: finalNodes.filter((node) => node.type === MANIFESTATION_NODE_TYPE).length,
        items: finalNodes.filter((node) => node.type === ITEM_NODE_TYPE).length,
        agentRoles,
    };

    return {
        nodes: finalNodes,
        edges: finalEdges,
        stats,
    };
}
