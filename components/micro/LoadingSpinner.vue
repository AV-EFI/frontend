<template>
    <!--
        Standardised accessible spinner.
        Replaces all bare DaisyUI `loading loading-spinner` usages.

        Usage:
          <MicroLoadingSpinner />
          <MicroLoadingSpinner size="lg" :label="$t('loadingResults')" />
          <MicroLoadingSpinner size="sm" color="text-secondary" />
    -->
    <span role="status" class="inline-flex items-center gap-2">
        <span
            class="loading loading-spinner"
            :class="[sizeClass, color]"
            aria-hidden="true"
        />
        <span class="sr-only">{{ resolvedLabel }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
    defineProps<{
        /** DaisyUI size modifier */
        size?: 'xs' | 'sm' | 'md' | 'lg'
        /** Tailwind text-colour class applied to the spinner */
        color?: string
        /** Screen-reader label; falls back to $t('loading') */
        label?: string
    }>(),
    {
        size: 'md',
        color: 'text-primary',
        label: undefined,
    },
)

const { t } = useI18n()

const sizeClass = computed(
    () =>
        ({
            xs: 'loading-xs',
            sm: 'loading-sm',
            md: 'loading-md',
            lg: 'loading-lg',
        })[props.size],
)

const resolvedLabel = computed(() => props.label ?? t('loading'))
</script>
