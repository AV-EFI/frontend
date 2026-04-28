<template>
    <!--
        Shows active InstantSearch refinements as removable chips.
        Place below the search bar / above the results on both desktop and mobile.
        Disappears automatically when no refinements are active.

        Usage (inside an <ais-instant-search> tree):
          <SearchActiveFiltersBar />
    -->
    <ais-current-refinements :excluded-attributes="excludedAttributes">
        <template #default="{ items, createURL }">
            <div
                v-if="items.length > 0"
                class="flex flex-wrap items-center gap-2 px-2 py-1.5"
                role="region"
                :aria-label="$t('activeFilters')"
            >
                <!-- Label -->
                <span class="text-xs font-semibold uppercase tracking-wide text-base-content/60 shrink-0">
                    {{ $t('activeFilters') }}:
                </span>

                <!-- Individual refinement chips -->
                <template v-for="facet in items" :key="facet.attribute">
                    <button
                        v-for="refinement in facet.refinements"
                        :key="`${facet.attribute}::${refinement.value}`"
                        class="badge badge-primary gap-1 cursor-pointer transition-colors hover:badge-error focus:badge-error focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                        :aria-label="`${$t('removeFilter')}: ${$t(facet.attribute)} ${refinement.label}`"
                        @click.prevent="facet.refine(refinement)"
                    >
                        {{ refinement.label }}
                        <Icon name="tabler:x" class="h-3 w-3" aria-hidden="true" />
                    </button>
                </template>

                <!-- Clear-all button, only when more than one facet is active -->
                <button
                    v-if="items.length > 1"
                    class="badge badge-ghost gap-1 cursor-pointer text-xs transition-colors hover:badge-error focus:badge-error focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    :aria-label="$t('clearAllFilters')"
                    @click="clearAll(items)"
                >
                    {{ $t('clearAllFilters') }}
                    <Icon name="tabler:trash" class="h-3 w-3" aria-hidden="true" />
                </button>
            </div>
        </template>
    </ais-current-refinements>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        /**
         * Attributes to exclude from the chip row.
         * 'query' is always excluded — the search box is the natural place to clear it.
         */
        excludedAttributes?: string[]
    }>(),
    {
        excludedAttributes: () => ['query'],
    },
)

/**
 * Clear all refinements by calling each facet's refine() on every active item.
 * ais-current-refinements does not expose a single clearAll; we iterate instead.
 */
function clearAll(items: Array<{ refine: (r: unknown) => void; refinements: unknown[] }>) {
    // Collect all refinement calls first to avoid mutating while iterating.
    const calls: Array<() => void> = []
    for (const facet of items) {
        for (const refinement of facet.refinements) {
            calls.push(() => facet.refine(refinement))
        }
    }
    calls.forEach((fn) => fn())
}
</script>
