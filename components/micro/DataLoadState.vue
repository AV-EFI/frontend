<template>
    <div :aria-busy="showLoading ? 'true' : 'false'">
        <template v-if="showLoading">
            <slot name="loading">
                <MicroSkeletonLoader
                    :count="loadingCount"
                    :variant="loadingVariant"
                    :line-pattern="loadingLinePattern"
                    :show-chips="loadingShowChips"
                />
            </slot>
        </template>

        <template v-else-if="showError">
            <slot name="error" :error="error">
                <div class="text-center text-error py-4">
                    {{ $t('errorLoadingData') }}
                </div>
            </slot>
        </template>

        <template v-else-if="showEmpty">
            <slot name="empty">
                <div class="text-center text-base-content/70 py-4">
                    {{ emptyLabelResolved }}
                </div>
            </slot>
        </template>

        <template v-else>
            <slot />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useDataLoadState } from '~/composables/useDataLoadState';

const props = withDefaults(
    defineProps<{
        pending: boolean
        error?: unknown
        hasData: boolean
        minSkeletonMs?: number
        loadingCount?: number
        loadingVariant?: 'list' | 'card' | 'compact'
        loadingLinePattern?: string[]
        loadingShowChips?: boolean
        emptyLabel?: string
    }>(),
    {
        minSkeletonMs: 150,
        loadingCount: 4,
        loadingVariant: 'list',
        loadingLinePattern: () => ['w-2/3', 'w-full', 'w-5/6'],
        loadingShowChips: true,
        emptyLabel: undefined,
    },
);

const { showLoading, showError, showEmpty } = useDataLoadState({
    pending: toRef(props, 'pending'),
    error: toRef(props, 'error'),
    hasData: toRef(props, 'hasData'),
    minSkeletonMs: props.minSkeletonMs,
});

const emptyLabelResolved = computed(() => props.emptyLabel ?? $t('noDataAvailable'));
</script>
