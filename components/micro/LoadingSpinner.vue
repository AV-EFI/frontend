<template>
    <div class="inline-flex flex-col items-center gap-2" role="status" aria-live="polite">
        <span
            class="loading loading-spinner text-primary"
            :class="sizeClass"
            aria-hidden="true"
        />
        <span :class="showLabel ? 'text-sm text-base-content/70' : 'sr-only'">
            {{ label || $t('loading') }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
    label?: string
    size?: 'sm' | 'md' | 'lg'
    showLabel?: boolean
}>(), {
    label: '',
    size: 'md',
    showLabel: false,
});

const sizeClass = computed(() => `loading-${props.size}`);
</script>
