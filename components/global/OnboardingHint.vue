<template>
    <!--
        Dismissible first-visit hint that persists its dismissed state in localStorage.
        Use sparingly - one per non-obvious feature area.

        Usage examples:
          <GlobalOnboardingHint storage-key="search-filters" :text="$t('hints.searchFilters')" />
          <GlobalOnboardingHint storage-key="compare" :text="$t('hints.compare')" icon="tabler:git-compare" />
    -->
    <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
    >
        <aside
            v-if="!dismissed"
            role="note"
            class="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/10 p-3 text-sm dark:border-primary/30 dark:bg-primary/5"
        >
            <Icon
                :name="icon"
                class="mt-0.5 h-4 w-4 shrink-0 text-primary"
                aria-hidden="true"
            />
            <span class="flex-1 text-base-content">{{ text }}</span>
            <button
                class="btn btn-xs btn-ghost ml-1 shrink-0"
                :aria-label="$t('dismissHint')"
                @click="dismissed = true"
            >
                <Icon name="tabler:x" class="h-3 w-3" aria-hidden="true" />
            </button>
        </aside>
    </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        /** Unique key - determines the localStorage entry (`hint-<storageKey>`). */
        storageKey: string
        /** The hint text shown to the user. */
        text: string
        /** Tabler icon name; defaults to a lightbulb. */
        icon?: string
    }>(),
    {
        icon: 'tabler:bulb',
    },
);

// VueUse useLocalStorage is auto-imported via @vueuse/nuxt.
// The hint is shown until the user dismisses it; then never shown again.
const dismissed = useLocalStorage(`hint-${props.storageKey}`, false);
</script>
