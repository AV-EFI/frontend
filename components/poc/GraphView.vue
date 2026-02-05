<template>
    <div class="graph-wrapper">
        <div ref="graphContainer" class="graph-surface" role="application" :aria-label="ariaLabel" tabindex="0" />
        <transition name="tooltip-fade">
            <div v-if="tooltip" class="node-tooltip" :style="tooltipStyle">
                <p class="node-tooltip__title">{{ tooltip.label }}</p>
                <p class="node-tooltip__type">{{ tooltip.typeLabel }}</p>
                <p v-if="tooltipDetails.primary && tooltipDetails.primary !== tooltip.label" class="node-tooltip__meta">
                    Primär: {{ tooltipDetails.primary }}
                </p>
                <p v-if="tooltipDetails.alternate" class="node-tooltip__meta">
                    Alias: {{ tooltipDetails.alternate }}
                </p>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Core, CoreOptions, LayoutOptions, Stylesheet } from 'cytoscape';
import type { GraphEdge, GraphNode } from '~/utils/poc/graphSlice';

interface ColorVarReference {
    varName: string;
    fallback: string;
}

const CSS_VARIABLE_FALLBACKS: Record<string, string> = {
    '--color-base-100': '#f8fafc',
    '--color-base-200': '#e2e8f0',
    '--color-base-300': '#cbd5e1',
    '--color-base-content': '#141b1f',
    '--color-neutral': '#141b1f',
    '--color-neutral-content': '#f4f7fb',
    '--color-primary': '#4d768d',
    '--color-primary-content': '#f5fbff',
    '--color-accent': '#ff1d25',
    '--color-accent-content': '#ffffff',
    '--color-work': '#8ea1a1',
    '--color-work-content': '#141b1f',
    '--color-manifestation': '#7c949e',
    '--color-manifestation-content': '#141b1f',
    '--color-item': '#748599',
    '--color-item-content': '#141b1f',
};

const colorRef = (varName: string, fallback?: string): ColorVarReference => ({
    varName,
    fallback: fallback ?? CSS_VARIABLE_FALLBACKS[varName] ?? '#000000',
});

const colorCache: Record<string, string> = {};

const resetColorCache = () => {
    for (const key in colorCache) {
        if (Object.prototype.hasOwnProperty.call(colorCache, key)) {
            delete colorCache[key];
        }
    }
};

const resolveColorReference = (reference: ColorVarReference): string => {
    const cacheKey = `${reference.varName}|${reference.fallback}`;
    if (colorCache[cacheKey]) {
        return colorCache[cacheKey];
    }
    if (!process.client) {
        colorCache[cacheKey] = reference.fallback;
        return colorCache[cacheKey];
    }

    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.pointerEvents = 'none';
    probe.style.opacity = '0';
    probe.style.color = reference.fallback;
    probe.style.color = `var(${reference.varName}, ${reference.fallback})`;
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    document.body.removeChild(probe);
    const resolved = computed && computed !== '' && computed !== 'rgba(0, 0, 0, 0)' ? computed : reference.fallback;
    colorCache[cacheKey] = resolved;
    return resolved;
};

const parseColorToRgb = (color: string): [number, number, number] | null => {
    const trimmed = color.trim();
    const hexMatch = trimmed.match(/^#([a-f0-9]{3}|[a-f0-9]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        const expanded = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
        const intValue = parseInt(expanded, 16);
        return [
            (intValue >> 16) & 255,
            (intValue >> 8) & 255,
            intValue & 255,
        ];
    }

    const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
        return [
            Number(rgbMatch[1]),
            Number(rgbMatch[2]),
            Number(rgbMatch[3]),
        ];
    }

    return null;
};

const withAlpha = (color: string, alpha: number): string => {
    const rgb = parseColorToRgb(color);
    if (!rgb) {
        return color;
    }
    const [r, g, b] = rgb;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface ThemeColors {
    base100: string;
    base200: string;
    base300: string;
    baseContent: string;
    neutral: string;
    neutralContent: string;
    primary: string;
    primaryContent: string;
    accent: string;
    accentContent: string;
}

interface NodeVisualConfig {
    background: ColorVarReference;
    label: ColorVarReference;
    border: ColorVarReference;
    width: number;
    height: number;
    borderWidth: number;
    selectedBorderWidth: number;
    fontSize: string;
}

const DEFAULT_NODE_STYLE: NodeVisualConfig = {
    background: colorRef('--color-base-100'),
    label: colorRef('--color-neutral-content'),
    border: colorRef('--color-base-300'),
    width: 56,
    height: 56,
    borderWidth: 2,
    selectedBorderWidth: 4,
    fontSize: '12px',
};

const NODE_STYLE_MAP: Record<GraphNode['type'], NodeVisualConfig> = {
    work: {
        background: colorRef('--color-work'),
        label: colorRef('--color-base-content'),
        border: colorRef('--color-primary'),
        width: 80,
        height: 80,
        borderWidth: 3,
        selectedBorderWidth: 5,
        fontSize: '16px',
    },
    agent: {
        background: colorRef('--color-primary'),
        label: colorRef('--color-primary-content'),
        border: colorRef('--color-base-300'),
        width: 52,
        height: 52,
        borderWidth: 2,
        selectedBorderWidth: 4,
        fontSize: '14px',
    },
    subject: {
        background: colorRef('--color-accent'),
        label: colorRef('--color-accent-content'),
        border: colorRef('--color-base-300'),
        width: 48,
        height: 48,
        borderWidth: 2,
        selectedBorderWidth: 4,
        fontSize: '13px',
    },
    manifestation: {
        background: colorRef('--color-manifestation'),
        label: colorRef('--color-base-content'),
        border: colorRef('--color-base-300'),
        width: 52,
        height: 52,
        borderWidth: 2,
        selectedBorderWidth: 4,
        fontSize: '14px',
    },
    item: {
        background: colorRef('--color-item'),
        label: colorRef('--color-base-content'),
        border: colorRef('--color-base-300'),
        width: 46,
        height: 46,
        borderWidth: 2,
        selectedBorderWidth: 4,
        fontSize: '13px',
    },
};

const captureThemeColors = (): ThemeColors => ({
    base100: resolveColorReference(colorRef('--color-base-100')),
    base200: resolveColorReference(colorRef('--color-base-200')),
    base300: resolveColorReference(colorRef('--color-base-300')),
    baseContent: resolveColorReference(colorRef('--color-base-content')),
    neutral: resolveColorReference(colorRef('--color-neutral')),
    neutralContent: resolveColorReference(colorRef('--color-neutral-content')),
    primary: resolveColorReference(colorRef('--color-primary')),
    primaryContent: resolveColorReference(colorRef('--color-primary-content')),
    accent: resolveColorReference(colorRef('--color-accent')),
    accentContent: resolveColorReference(colorRef('--color-accent-content')),
});

const buildGraphStyles = (theme: ThemeColors): Stylesheet[] => ([
    {
        selector: 'node',
        style: {
            'label': 'data(label)',
            'color': 'data(labelColor)',
            'font-size': 'data(fontSize)',
            'text-wrap': 'wrap',
            'text-max-width': '140px',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-outline-width': 0,
            'text-outline-color': theme.base200,
            'width': 'data(width)',
            'height': 'data(height)',
            'border-width': 'data(borderWidth)',
            'border-color': 'data(borderColor)',
            'background-color': 'data(backgroundColor)',
            'padding': '12px',
        },
    },
    {
        selector: 'node:selected',
        style: {
            'background-color': 'data(backgroundColor)',
            'color': 'data(labelColor)',
            'border-color': 'data(borderColor)',
            'overlay-opacity': 0,
        },
    },
    {
        selector: 'node.selected',
        style: {
            'border-color': theme.accent,
            'border-width': 'data(selectedBorderWidth)',
            'shadow-blur': 20,
            'shadow-color': withAlpha(theme.accent, 0.4),
            'background-color': 'data(backgroundColor)',
            'color': 'data(labelColor)',
        },
    },
    {
        selector: 'edge',
        style: {
            'width': 2.5,
            'line-color': theme.neutral,
            'target-arrow-color': theme.neutral,
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(predicate)',
            'font-size': '11px',
            'color': theme.neutral,
            'text-background-color': theme.base100,
            'text-background-opacity': 0.95,
            'text-background-padding': 4,
            'text-border-width': 1,
            'text-border-color': withAlpha(theme.neutral, 0.2),
            'text-rotation': 'autorotate',
            'min-zoomed-font-size': 9,
        },
    },
    {
        selector: 'edge:selected',
        style: {
            'line-color': theme.accent,
            'target-arrow-color': theme.accent,
            'width': 3,
        },
    },
]);

const props = defineProps<{
    nodes: GraphNode[];
    edges: GraphEdge[];
    selectedNodeId: string | null;
    ariaLabel: string;
}>();

const emit = defineEmits<{
    (e: 'node-selected', nodeId: string | null): void;
    (e: 'edge-selected', edgeId: string | null): void;
}>();

const graphContainer = ref<HTMLDivElement | null>(null);
let cyInstance: Core | null = null;
let themeObserver: MutationObserver | null = null;

interface TooltipState {
    id: string;
    label: string;
    type: GraphNode['type'];
    typeLabel: string;
    meta?: Record<string, unknown> | null;
    x: number;
    y: number;
}

const tooltip = ref<TooltipState | null>(null);

const tooltipStyle = computed(() => {
    if (!tooltip.value || !graphContainer.value) {
        return { display: 'none' };
    }

    const margin = 16;
    const width = graphContainer.value.clientWidth;
    const height = graphContainer.value.clientHeight;
    const clampedX = Math.min(Math.max(tooltip.value.x, margin), Math.max(width - margin, margin));
    const clampedY = Math.min(Math.max(tooltip.value.y, margin), Math.max(height - margin, margin));

    return {
        left: `${clampedX}px`,
        top: `${clampedY}px`,
    };
});

const tooltipDetails = computed(() => {
    if (!tooltip.value?.meta) {
        return {
            primary: null as string | null,
            alternate: null as string | null,
        };
    }

    const meta = tooltip.value.meta as {
        primaryName?: unknown;
        alternateName?: unknown;
    };

    const primary = typeof meta.primaryName === 'string' && meta.primaryName.trim().length
        ? meta.primaryName.trim()
        : null;
    const alternate = typeof meta.alternateName === 'string' && meta.alternateName.trim().length
        ? meta.alternateName.trim()
        : null;

    return { primary, alternate };
});

const buildElements = () => {
    return {
        nodes: props.nodes.map((node) => ({
            data: (() => {
                const style = NODE_STYLE_MAP[node.type] ?? DEFAULT_NODE_STYLE;
                const backgroundColor = resolveColorReference(style.background);
                const labelColor = resolveColorReference(style.label);
                const borderColor = resolveColorReference(style.border);
                return {
                    id: node.id,
                    label: node.label,
                    type: node.type,
                    meta: node.meta ?? null,
                    backgroundColor,
                    labelColor,
                    borderColor,
                    width: style.width,
                    height: style.height,
                    borderWidth: style.borderWidth,
                    selectedBorderWidth: style.selectedBorderWidth,
                    fontSize: style.fontSize,
                };
            })(),
        })),
        edges: props.edges.map((edge) => ({
            data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                predicate: edge.predicate,
            },
        })),
    };
};

const applySelection = () => {
    if (!cyInstance) {
        return;
    }
    cyInstance.nodes().removeClass('selected');
    if (props.selectedNodeId) {
        const node = cyInstance.getElementById(props.selectedNodeId);
        if (node && node.isNode()) {
            node.addClass('selected');
        }
    }
};

const refreshGraph = () => {
    if (!cyInstance) {
        return;
    }

    const { nodes, edges } = buildElements();
    cyInstance.elements().remove();
    cyInstance.add([...nodes, ...edges]);

    const layoutOptions: LayoutOptions = {
        name: 'cose',
        animate: true,
        fit: true,
    };
    cyInstance.layout(layoutOptions).run();
    applySelection();
    tooltip.value = null;
};

const updateGraphTheme = () => {
    if (!cyInstance) {
        return;
    }
    resetColorCache();
    const theme = captureThemeColors();
    cyInstance.style().fromJson(buildGraphStyles(theme));
    cyInstance.style().update();
    refreshGraph();
};

const initGraph = async () => {
    if (!process.client || cyInstance || !graphContainer.value) {
        return;
    }

    const cytoscape = (await import('cytoscape')).default;

    const nodeTypeLabels: Record<GraphNode['type'], string> = {
        work: 'Werk',
        agent: 'Akteur',
        subject: 'Thema',
        manifestation: 'Manifestation',
        item: 'Exemplar',
    };

    resetColorCache();
    const theme = captureThemeColors();

    const options: CoreOptions = {
        container: graphContainer.value,
        wheelSensitivity: 0.2,
        style: buildGraphStyles(theme),
    };

    cyInstance = cytoscape(options);
    refreshGraph();

    if (!themeObserver) {
        themeObserver = new MutationObserver((mutations) => {
            if (mutations.some((mutation) => mutation.type === 'attributes' && mutation.attributeName === 'data-theme')) {
                updateGraphTheme();
            }
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    cyInstance.on('tap', 'node', (event) => {
        const node = event.target;
        const nodeType = (node.data('type') ?? 'work') as GraphNode['type'];
        emit('node-selected', node.id());
        emit('edge-selected', null);

        const position = event.renderedPosition;
        tooltip.value = {
            id: node.id(),
            label: node.data('label') ?? '',
            type: nodeType,
            typeLabel: nodeTypeLabels[nodeType] ?? nodeType,
            meta: node.data('meta') ?? null,
            x: position.x,
            y: position.y,
        };
    });

    cyInstance.on('tap', 'edge', (event) => {
        emit('edge-selected', event.target.id());
        tooltip.value = null;
    });

    cyInstance.on('tap', (event) => {
        if (event.target === cyInstance) {
            emit('node-selected', null);
            emit('edge-selected', null);
            tooltip.value = null;
        }
    });

    cyInstance.on('pan zoom', () => {
        tooltip.value = null;
    });

    cyInstance.on('drag', 'node', () => {
        tooltip.value = null;
    });
};

onMounted(() => {
    initGraph();
});

onBeforeUnmount(() => {
    if (cyInstance) {
        cyInstance.destroy();
        cyInstance = null;
    }
    if (themeObserver) {
        themeObserver.disconnect();
        themeObserver = null;
    }
    resetColorCache();
});

watch(
    () => [props.nodes, props.edges],
    () => {
        if (process.client) {
            nextTick(() => {
                refreshGraph();
            });
        }
    },
    { deep: true },
);

watch(
    () => props.selectedNodeId,
    () => {
        if (process.client) {
            nextTick(() => {
                applySelection();
            });
        }
    },
);
</script>

<style scoped>
.graph-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}

.graph-surface {
    height: 24rem;
    width: 100%;
    border-radius: 1rem;
    background-color: var(--color-base-200, #e5e7eb);
}

@media (min-width: 768px) {
    .graph-surface {
        height: 100%;
        min-height: 24rem;
    }
}

.node-tooltip {
    position: absolute;
    transform: translate(-50%, -120%);
    pointer-events: none;
    background-color: var(--color-base-100, #ffffff);
    border: 1px solid var(--color-base-300, #d1d5db);
    box-shadow: 0 12px 32px color-mix(in srgb, var(--color-neutral) 20%, transparent);
    border-radius: 0.75rem;
    padding: 0.5rem 0.75rem;
    max-width: 16rem;
    color: var(--color-base-content, #1f2937);
    z-index: 10;
}

.node-tooltip__title {
    font-weight: 600;
    font-size: 0.9rem;
    line-height: 1.2;
}

.node-tooltip__type {
    margin-top: 0.125rem;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-base-content, #1f2937);
    opacity: 0.7;
}

.node-tooltip__meta {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    line-height: 1.25;
    color: var(--color-base-content, #1f2937);
}

.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
    transition: opacity 120ms ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
    opacity: 0;
}
</style>
