<template>
    <div class="w-full space-y-3 py-2" role="status" aria-live="polite">
        <div
            v-for="n in normalizedCount"
            :key="`skeleton-${n}`"
            :class="containerClasses"
            aria-hidden="true"
        >
            <div
                v-for="(widthClass, idx) in normalizedLinePattern"
                :key="`${n}-${idx}`"
                class="h-3 rounded bg-base-300/80 dark:bg-gray-700/80"
                :class="[widthClass, idx === 0 ? 'h-4' : '']"
            />

            <div v-if="showChips" class="mt-3 flex gap-2">
                <div class="h-5 w-16 rounded-full bg-base-300/70 dark:bg-gray-700/70" />
                <div class="h-5 w-20 rounded-full bg-base-300/60 dark:bg-gray-700/60" />
            </div>
        </div>

        <span class="sr-only">{{ resolvedLabel }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
    defineProps<{
        /** Number of skeleton rows/cards to render. */
        count?: number
        /** Preset layout variant for spacing/shape. */
        variant?: 'list' | 'card' | 'compact'
        /** Tailwind width classes for placeholder lines. */
        linePattern?: string[]
        /** Show chip/badge placeholders under text lines. */
        showChips?: boolean
        /** Accessible loading label for screen readers. */
        label?: string
    }>(),
    {
        count: 6,
        variant: 'list',
        linePattern: () => ['w-2/3', 'w-full', 'w-5/6'],
        showChips: true,
        label: undefined,
    },
);

const { t } = useI18n();

const normalizedCount = computed(() => (props.count > 0 ? props.count : 1));
const normalizedLinePattern = computed(() =>
    props.linePattern.length > 0 ? props.linePattern : ['w-2/3', 'w-full', 'w-5/6'],
);
const resolvedLabel = computed(() => props.label ?? t('loading'));

const containerClasses = computed(() => {
    const base = [
        'animate-pulse',
        'border',
        'border-base-200',
        'bg-base-100',
        'dark:border-gray-700',
        'dark:bg-gray-800',
    ];

    if (props.variant === 'compact') {
        return [...base, 'rounded-md', 'p-2', 'space-y-2'];
    }

    if (props.variant === 'card') {
        return [...base, 'rounded-xl', 'p-4', 'space-y-3'];
    }

    return [...base, 'rounded-lg', 'p-3', 'space-y-2'];
});
</script>
