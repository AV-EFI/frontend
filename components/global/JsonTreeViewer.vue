<template>
    <section class="json-viewer" :aria-labelledby="headingId">
        <div class="json-viewer-toolbar">
            <div>
                <h2 :id="headingId" class="json-viewer-title">{{ title }}</h2>
                <p class="json-viewer-meta">
                    {{ rootTypeLabel }} · {{ rootCountLabel }}
                </p>
            </div>

            <div class="json-viewer-actions" role="group" :aria-label="`${title} actions`">
                <button type="button" class="btn btn-xs btn-outline" @click="expandAll">
                    {{ expandLabel }}
                </button>
                <button type="button" class="btn btn-xs btn-outline" @click="collapseAll">
                    {{ collapseLabel }}
                </button>
                <button type="button" class="btn btn-xs btn-primary" @click="copyJson">
                    {{ copyLabel }}
                </button>
            </div>
        </div>

        <p class="sr-only">
            Nested JSON data. Use Tab to move through expandable keys, Enter or Space to open and close sections.
        </p>
        <p v-if="copyStatus" class="json-viewer-status" role="status" aria-live="polite">
            {{ copyStatus }}
        </p>

        <ol class="json-tree" :aria-label="title">
            <GlobalJsonTreeNode
                label="root"
                :value="value"
                path="root"
                :open-depth="openDepth"
                :expand-signal="expandSignal"
                :collapse-signal="collapseSignal"
            />
        </ol>

        <details class="json-source">
            <summary>{{ sourceLabel }}</summary>
            <pre tabindex="0"><code>{{ prettyJson }}</code></pre>
        </details>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
    value: unknown;
    title: string;
    expandLabel?: string;
    collapseLabel?: string;
    copyLabel?: string;
    copiedLabel?: string;
    copyFailedLabel?: string;
    sourceLabel?: string;
    openDepth?: number;
}>(), {
    expandLabel: 'Expand all',
    collapseLabel: 'Collapse all',
    copyLabel: 'Copy JSON',
    copiedLabel: 'Copied JSON.',
    copyFailedLabel: 'Could not copy JSON.',
    sourceLabel: 'Formatted source',
    openDepth: 2,
});

const headingId = `json-viewer-${Math.random().toString(36).slice(2)}`;
const expandSignal = ref(0);
const collapseSignal = ref(0);
const copyStatus = ref('');

const prettyJson = computed(() => JSON.stringify(props.value ?? null, null, 2));
const rootTypeLabel = computed(() => {
    if (Array.isArray(props.value)) return 'array';
    if (props.value === null) return 'null';
    return typeof props.value;
});
const rootCountLabel = computed(() => {
    const count = Array.isArray(props.value)
        ? props.value.length
        : props.value && typeof props.value === 'object'
            ? Object.keys(props.value).length
            : 0;
    return count === 1 ? '1 top-level entry' : `${count} top-level entries`;
});

function expandAll() {
    expandSignal.value += 1;
}

function collapseAll() {
    collapseSignal.value += 1;
}

async function copyJson() {
    copyStatus.value = '';

    try {
        await navigator.clipboard.writeText(prettyJson.value);
        copyStatus.value = props.copiedLabel;
    } catch {
        copyStatus.value = props.copyFailedLabel;
    }
}
</script>

<style scoped>
.json-viewer {
  --json-meta-color: color-mix(in srgb, var(--color-base-content, #111827) 65%, transparent);
  --json-hover-bg: var(--color-base-200, #f3f4f6);
  --json-key-color: var(--color-primary, #4d768d);
  --json-string-color: var(--color-success, #166534);
  --json-number-color: var(--color-warning, #854d0e);
  --json-boolean-color: var(--color-info, #7c3aed);
  border: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem;
  background: var(--color-base-100, #fff);
  color: var(--color-base-content, #111827);
}

.json-viewer-toolbar {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid var(--color-base-300, #d1d5db);
  border-radius: 0.5rem 0.5rem 0 0;
  background: inherit;
  padding: 0.75rem;
}

.json-viewer-title {
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.25rem;
}

.json-viewer-meta,
.json-viewer-status {
  font-size: 0.75rem;
  color: var(--json-meta-color);
}

.json-viewer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.json-tree {
  max-height: min(70vh, 48rem);
  overflow: auto;
  padding: 0.75rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.78rem;
  line-height: 1.45;
}

.json-source {
  border-top: 1px solid var(--color-base-300, #d1d5db);
  padding: 0.75rem;
}

.json-source summary {
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

.json-source pre {
  margin-top: 0.75rem;
  max-height: 28rem;
  overflow: auto;
  border-radius: 0.375rem;
  background: var(--color-base-200, #f3f4f6);
  padding: 0.75rem;
  white-space: pre;
}

:deep(.json-node) {
  list-style: none;
}

:deep(.json-node + .json-node) {
  margin-top: 0.125rem;
}

:deep(.json-node-summary),
:deep(.json-node-leaf) {
  display: flex;
  min-width: 0;
  align-items: baseline;
  gap: 0.5rem;
  border-radius: 0.25rem;
  padding: 0.125rem 0.25rem;
}

:deep(.json-node-summary) {
  cursor: pointer;
}

:deep(.json-node-summary:hover),
:deep(.json-node-leaf:hover) {
  background: var(--json-hover-bg);
}

:deep(.json-node-key) {
  color: var(--json-key-color);
  font-weight: 700;
}

:deep(.json-node-type),
:deep(.json-node-count) {
  font-size: 0.7rem;
  color: var(--json-meta-color);
}

:deep(.json-node-value) {
  min-width: 0;
  overflow-wrap: anywhere;
}

:deep(.json-node-value-string) {
  color: var(--json-string-color);
}

:deep(.json-node-value-number) {
  color: var(--json-number-color);
}

:deep(.json-node-value-boolean) {
  color: var(--json-boolean-color);
}

:deep(.json-node-value-null) {
  color: #6b7280;
  font-style: italic;
}

:deep(.json-node-children) {
  margin-left: 0.625rem;
  border-left: 1px solid var(--color-base-300, #d1d5db);
  padding-left: 0.625rem;
}

:deep(.json-node-depth-3 .json-node-children),
:deep(.json-node-depth-4 .json-node-children),
:deep(.json-node-depth-5 .json-node-children),
:deep(.json-node-depth-6 .json-node-children) {
  margin-left: 0.5rem;
  padding-left: 0.5rem;
}

</style>
