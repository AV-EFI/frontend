<script setup lang="ts">
withDefaults(defineProps<{
    value: unknown;
    title?: string;
    expandLabel?: string;
    collapseLabel?: string;
    copyLabel?: string;
    copiedLabel?: string;
    copyFailedLabel?: string;
    sourceLabel?: string;
}>(), {
    title: 'Raw data',
    expandLabel: 'Expand all',
    collapseLabel: 'Collapse all',
    copyLabel: 'Copy to clipboard',
    copiedLabel: 'Copied to clipboard',
    copyFailedLabel: 'Copy failed',
    sourceLabel: 'Formatted source',
});
</script>

<template>
    <details class="detail-raw-data">
        <summary class="detail-raw-data__summary" :aria-label="title">
            <span class="detail-raw-data__label">
                <span class="detail-raw-data__icon" aria-hidden="true">
                    <Icon name="tabler:database" class="h-4 w-4" />
                </span>
                <span class="detail-raw-data__title">{{ title }}</span>
            </span>
            <span class="detail-raw-data__action" aria-hidden="true">
                <Icon name="tabler:chevron-down" class="detail-raw-data__chevron h-4 w-4" />
            </span>
        </summary>

        <div class="detail-raw-data__content">
            <GlobalJsonTreeViewer
                :value="value"
                :title="title"
                :expand-label="expandLabel"
                :collapse-label="collapseLabel"
                :copy-label="copyLabel"
                :copied-label="copiedLabel"
                :copy-failed-label="copyFailedLabel"
                :source-label="sourceLabel"
            />
        </div>
    </details>
</template>

<style scoped>
.detail-raw-data {
    width: min(92rem, calc(100% - 2rem));
    margin: 1.5rem auto 2rem;
    overflow: hidden;
    border: 1px solid var(--color-base-300);
    border-radius: 0.5rem;
    background: var(--color-base-100);
    box-shadow: 0 1px 2px rgb(20 27 31 / 0.08);
}

.detail-raw-data__summary {
    display: flex;
    min-height: 3rem;
    cursor: pointer;
    list-style: none;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1rem;
    color: var(--color-base-content);
    transition: background-color 120ms ease, border-color 120ms ease;
}

.detail-raw-data__summary::-webkit-details-marker {
    display: none;
}

.detail-raw-data__summary:hover,
.detail-raw-data__summary:focus-visible {
    background: var(--color-base-200);
}

.detail-raw-data__summary:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
}

.detail-raw-data__label,
.detail-raw-data__action {
    display: inline-flex;
    min-width: 0;
    align-items: center;
    gap: 0.5rem;
}

.detail-raw-data__icon {
    display: inline-grid;
    width: 2rem;
    height: 2rem;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid var(--color-base-300);
    border-radius: 0.375rem;
    background: var(--color-base-200);
    color: var(--color-primary);
}

.detail-raw-data__title {
    min-width: 0;
    font-size: 0.875rem;
    font-weight: 700;
    line-height: 1.25rem;
}

.detail-raw-data__action {
    flex: 0 0 auto;
    border: 1px solid var(--color-base-300);
    border-radius: 999px;
    padding: 0.375rem;
    background: var(--color-base-100);
}

.detail-raw-data__chevron {
    transition: transform 120ms ease;
}

.detail-raw-data[open] .detail-raw-data__summary {
    border-bottom: 1px solid var(--color-base-300);
}

.detail-raw-data[open] .detail-raw-data__chevron {
    transform: rotate(180deg);
}

.detail-raw-data__content {
    padding: 1rem;
}

@media (max-width: 48rem) {
    .detail-raw-data {
        width: calc(100% - 1rem);
        margin-top: 1rem;
    }

    .detail-raw-data__summary {
        padding: 0.75rem;
    }

    .detail-raw-data__content {
        padding: 0.75rem;
    }
}
</style>
