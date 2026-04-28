<template>
    <!--
        Standardised error state block.
        Drop into any section that may fail to load or produce an error.

        Usage:
          <!-- Simple, no retry -->
          <GlobalErrorStateComp :description="$t('searchLoadFailed')" show-contact />

          <!-- With retry -->
          <GlobalErrorStateComp
            :title="$t('resultsLoadFailed')"
            :description="$t('resultsLoadFailedDesc')"
            show-retry
            show-contact
            @retry="reload"
          />
    -->
    <div class="flex flex-col items-center gap-4 p-8 text-center" role="alert">
        <Icon
            :name="iconName"
            class="h-12 w-12"
            :class="iconClass"
            aria-hidden="true"
        />

        <h3 class="text-lg font-semibold">
            {{ title ?? $t('errorOccurred') }}
        </h3>

        <p
            v-if="description"
            class="max-w-md text-sm text-base-content/70"
        >
            {{ description }}
        </p>

        <div class="flex flex-wrap justify-center gap-3">
            <button
                v-if="showRetry"
                class="btn btn-primary btn-sm"
                @click="emit('retry')"
            >
                <Icon name="tabler:refresh" class="h-4 w-4" aria-hidden="true" />
                {{ retryLabel ?? $t('tryAgain') }}
            </button>

            <NuxtLink
                v-if="showHome"
                to="/"
                class="btn btn-ghost btn-sm"
            >
                <Icon name="tabler:home" class="h-4 w-4" aria-hidden="true" />
                {{ $t('backToHome') }}
            </NuxtLink>

            <button
                v-if="showContact"
                class="btn btn-ghost btn-sm"
                @click="openContactDrawer"
            >
                {{ $t('contactUs') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string
        description?: string
        retryLabel?: string
        /** Show a retry button — wire @retry to your reload logic. */
        showRetry?: boolean
        /** Show a "Back to Home" link (default true). */
        showHome?: boolean
        /** Show a "Contact us" button that opens the ContactDrawer. */
        showContact?: boolean
        variant?: 'error' | 'warning' | 'info'
    }>(),
    {
        showRetry: false,
        showHome: true,
        showContact: false,
        variant: 'error',
    },
)

const emit = defineEmits<{ (e: 'retry'): void }>()

const iconName = computed(
    () =>
        ({ error: 'tabler:alert-circle', warning: 'tabler:alert-triangle', info: 'tabler:info-circle' })[
            props.variant
        ],
)

const iconClass = computed(() => ({
    'text-error': props.variant === 'error',
    'text-warning': props.variant === 'warning',
    'text-info': props.variant === 'info',
}))

/** Opens the ContactDrawer via its global custom event. */
function openContactDrawer() {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('toggle-contact-drawer'))
    }
}
</script>
