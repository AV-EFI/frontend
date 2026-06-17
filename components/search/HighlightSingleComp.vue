<template>
    <div v-if="item">
        <SearchClickableFacetValue
            v-if="facetAttribute"
            :attribute="facetAttribute"
            :value="item"
            :label="$t(item)"
            :class="{ 'bg-secondary-200 font-bold dark:text-secondary-900': ishiliteed(item), [fontSize]: true }"
        >
            {{ $t(item) }}
        </SearchClickableFacetValue>

        <p
            v-else
            :class="{ 'bg-secondary-200 font-bold dark:text-secondary-900': ishiliteed(item), [fontSize]: true }"
            role="text"
            :aria-label="$t(item)"
            :aria-current="ishiliteed(item) ? 'true' : undefined"
        >
            {{ $t(item) }}
        </p>
    </div>
    <div v-else>
        -
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    item?: string | null;
    hilite?: string | string[] | null;
    fontSize?: string;
    facetAttribute?: string;
}>(), {
    item: null,
    hilite: null,
    fontSize: 'text-sm',
    facetAttribute: '',
});

function ishiliteed(item: string) {
    if (!props.hilite) return false;
    const hilites = Array.isArray(props.hilite) ? props.hilite : [props.hilite];
    return hilites.includes(item);
}
</script>
