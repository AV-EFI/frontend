<template>
    <li :class="nodeClasses">
        <details v-if="isExpandable" :open="isOpen" @toggle="handleToggle">
            <summary class="json-node-summary">
                <span class="json-node-key">{{ label }}</span>
                <span class="json-node-type">{{ typeLabel }}</span>
                <span class="json-node-count">{{ childCountLabel }}</span>
                <span class="sr-only">{{ path }}</span>
            </summary>

            <ol class="json-node-children">
                <GlobalJsonTreeNode
                    v-for="entry in childEntries"
                    :key="entry.path"
                    :label="entry.label"
                    :value="entry.value"
                    :path="entry.path"
                    :depth="depth + 1"
                    :open-depth="openDepth"
                    :expand-signal="expandSignal"
                    :collapse-signal="collapseSignal"
                />
            </ol>
        </details>

        <div v-else class="json-node-leaf">
            <span class="json-node-key">{{ label }}</span>
            <span class="json-node-value" :class="valueClasses">
                {{ formattedValue }}
            </span>
            <span class="sr-only">{{ path }}</span>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type JsonValue = null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue } | unknown;

const props = withDefaults(defineProps<{
    label: string;
    value: JsonValue;
    path: string;
    depth?: number;
    openDepth?: number;
    expandSignal?: number;
    collapseSignal?: number;
}>(), {
    depth: 0,
    openDepth: 2,
    expandSignal: 0,
    collapseSignal: 0,
});

const isOpen = ref(props.depth < props.openDepth);

const valueType = computed(() => {
    if (Array.isArray(props.value)) return 'array';
    if (props.value === null) return 'null';
    return typeof props.value;
});

const isExpandable = computed(() =>
    (Array.isArray(props.value) && props.value.length > 0) ||
    (Boolean(props.value) && typeof props.value === 'object' && !Array.isArray(props.value) && Object.keys(props.value as Record<string, unknown>).length > 0)
);

const childEntries = computed(() => {
    if (Array.isArray(props.value)) {
        return props.value.map((value, index) => ({
            label: `[${index}]`,
            value,
            path: `${props.path}[${index}]`,
        }));
    }

    if (props.value && typeof props.value === 'object') {
        return Object.entries(props.value as Record<string, unknown>).map(([key, value]) => ({
            label: key,
            value,
            path: props.path ? `${props.path}.${key}` : key,
        }));
    }

    return [];
});

const typeLabel = computed(() => valueType.value);
const childCountLabel = computed(() => {
    const count = childEntries.value.length;
    return count === 1 ? '1 entry' : `${count} entries`;
});

const formattedValue = computed(() => {
    if (typeof props.value === 'string') return JSON.stringify(props.value);
    if (props.value === undefined) return 'undefined';
    return String(props.value);
});

const valueClasses = computed(() => ({
    'json-node-value-string': typeof props.value === 'string',
    'json-node-value-number': typeof props.value === 'number',
    'json-node-value-boolean': typeof props.value === 'boolean',
    'json-node-value-null': props.value === null || props.value === undefined,
}));

const nodeClasses = computed(() => [
    'json-node',
    `json-node-depth-${Math.min(props.depth, 6)}`,
]);

function handleToggle(event: Event) {
    isOpen.value = (event.currentTarget as HTMLDetailsElement).open;
}

watch(() => props.expandSignal, () => {
    if (isExpandable.value) isOpen.value = true;
});

watch(() => props.collapseSignal, () => {
    if (isExpandable.value) isOpen.value = props.depth < props.openDepth;
});
</script>
