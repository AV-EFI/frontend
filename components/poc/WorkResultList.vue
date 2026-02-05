<template>
    <div class="flex flex-col gap-2">
        <h2 class="text-sm font-semibold uppercase tracking-wide">Treffer</h2>
        <div v-if="loading" class="flex flex-col gap-2" role="status" aria-live="polite">
            <div class="skeleton h-10 w-full" />
            <div class="skeleton h-10 w-full" />
            <div class="skeleton h-10 w-full" />
        </div>
        <p v-else-if="results.length === 0" class="text-sm text-base-content/70">
            Keine Treffer. Bitte passen Sie Ihre Suche an.
        </p>
        <ul v-else class="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            <li v-for="result in enhancedResults" :key="result.handle">
                <button type="button" class="result-button" :class="[
                    result.meta.buttonModifier,
                    { 'result-button--selected': result.handle === selectedHandle },
                ]" :title="result.title ? `${result.title} (${result.handle})` : result.handle"
                    @click="onSelect(result.handle)">
                    <span class="result-level-bar" :style="{
                        backgroundColor: result.meta.barColor,
                        width: result.meta.barWidth,
                    }" aria-hidden="true" />
                    <span class="flex w-full flex-col gap-1">
                        <span class="flex items-start justify-between gap-2">
                            <span class="result-title" :class="result.meta.titleClass">{{ result.title ?? result.handle
                                }}</span>
                            <span class="result-level-badge" :style="{
                                backgroundColor: result.meta.badgeBg,
                                color: result.meta.badgeFg,
                            }">
                                {{ result.meta.label }}
                            </span>
                        </span>
                        <span v-if="result.issuer" class="text-xs text-base-content/70">
                            {{ result.issuer }}
                        </span>
                    </span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WorkSearchHit } from '~/composables/poc/usePocApi';

const props = defineProps<{
    results: WorkSearchHit[];
    selectedHandle: string | null;
    loading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'select', handle: string): void;
}>();

const loading = computed(() => props.loading === true);

const { t } = useI18n();

interface LevelMeta {
    label: string;
    badgeBg: string;
    badgeFg: string;
    barColor: string;
    barWidth: string;
    titleClass: string;
    buttonModifier: string;
    priority: number;
}

interface DisplayResult extends WorkSearchHit {
    meta: LevelMeta;
    originalIndex: number;
}

const LEVEL_STYLES = {
    workvariant: {
        labelKey: 'avefi_WorkVariant',
        colorVar: '--work',
        textVar: '--neutral',
        buttonModifier: 'result-button--workvariant',
        barWidth: '6px',
        priority: 0,
    },
    manifestation: {
        labelKey: 'avefi_Manifestation',
        colorVar: '--manifestation',
        textVar: '--neutral',
        buttonModifier: 'result-button--manifestation',
        barWidth: '4px',
        priority: 1,
    },
    item: {
        labelKey: 'avefi_Item',
        colorVar: '--item',
        textVar: '--neutral',
        buttonModifier: 'result-button--item',
        barWidth: '4px',
        priority: 2,
    },
    unknown: {
        defaultLabel: 'Ebene unbekannt',
        colorVar: '--neutral',
        textVar: '--neutral-content',
        buttonModifier: 'result-button--unknown',
        barWidth: '3px',
        priority: 3,
    },
} as const;

type LevelKey = keyof typeof LEVEL_STYLES;

const normaliseLevelKey = (level?: string | null): LevelKey => {
    if (!level) {
        return 'workvariant';
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
};

const buildMeta = (level?: string | null): LevelMeta => {
    const key = normaliseLevelKey(level);
    const style = LEVEL_STYLES[key];
    const label = 'labelKey' in style
        ? t(style.labelKey as string)
        : style.defaultLabel;

    return {
        label,
        badgeBg: `var(${style.colorVar})`,
        badgeFg: `var(${style.textVar})`,
        barColor: `var(${style.colorVar})`,
        barWidth: style.barWidth,
        titleClass: key === 'workvariant' ? 'font-semibold text-base-content' : 'font-medium text-base-content',
        buttonModifier: style.buttonModifier,
        priority: style.priority,
    };
};

const enhancedResults = computed<DisplayResult[]>(() => props.results
    .map((result, index) => ({
        ...result,
        meta: buildMeta(result.level),
        originalIndex: index,
    }))
    .sort((a, b) => {
        if (a.meta.priority === b.meta.priority) {
            return a.originalIndex - b.originalIndex;
        }
        return a.meta.priority - b.meta.priority;
    }));

const onSelect = (handle: string) => {
    emit('select', handle);
};
</script>

<style scoped>
.result-button {
    display: flex;
    align-items: stretch;
    width: 100%;
    gap: 0.75rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid var(--base-300, #d1d5db);
    background-color: var(--b1, var(--base-100, #f9fafb));
    transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.result-button:hover,
.result-button:focus-visible {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 25%, transparent);
    transform: translateY(-1px);
}

.result-button--selected {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary) 35%, transparent);
}

.result-button--workvariant {
    box-shadow: 0 2px 6px color-mix(in srgb, var(--primary) 18%, transparent);
}

.result-level-bar {
    border-radius: 9999px;
}

.result-level-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    border-radius: 9999px;
    padding: 0.125rem 0.5rem;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.result-title {
    display: inline-flex;
    flex: 1 1 auto;
    min-width: 0;
    color: inherit;
}

.result-button--manifestation .result-level-bar,
.result-button--item .result-level-bar,
.result-button--unknown .result-level-bar {
    opacity: 0.8;
}

.result-button--manifestation .result-level-badge,
.result-button--item .result-level-badge,
.result-button--unknown .result-level-badge {
    border: 1px solid rgba(54, 71, 84, 0.12);
}
</style>
