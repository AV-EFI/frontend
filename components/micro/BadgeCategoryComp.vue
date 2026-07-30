<template>
    <span v-if="category.indexOf('avefi:') > -1" :title="$t(category ?? '')" :aria-label="$t(category ?? '')"
          role="status" :class="[
              category === 'avefi:WorkVariant' ? 'badge-work' :
              category === 'avefi:Manifestation' ? 'badge-manifestation' :
              category === 'avefi:Item' ? 'badge-item' : 'badge-primary',
              category === 'avefi:WorkVariantPart' ? 'badge-work-part mx-auto' : '',
              'badge badge-xs font-semibold h-4',
          ]">
        <span class="mx-auto my-auto inline-flex items-center gap-0.5">
            <Icon v-if="category === 'avefi:Manifestation'" name="tabler:stack-2" class="w-2.5 h-2.5" aria-hidden="true" />
            <Icon v-else-if="category === 'avefi:Item'" name="tabler:stack-3" class="w-2.5 h-2.5" aria-hidden="true" />
            {{ dense ? $t(category ?? '').charAt(0) : $t(category ?? '') }}
        </span>
    </span>
    <span v-else-if="category.indexOf('Serial') > -1 || category.indexOf('AnthologyFilm') > -1"
          class="badge bg-base mx-auto font-semibold h-4" :title="$t(category ?? '')" :aria-label="$t(category ?? '')"
          role="status">
        {{ dense ? $t(category ?? '').charAt(0) : $t(category ?? '') }}
        <Icon v-if="icon" name="fa:caret-down" class="icon-inline ml-1" aria-hidden="true" />
    </span>
</template>

<script lang="ts" setup>
defineProps({
    category: {
        type: String,
        default: 'avefi:WorkVariant'
    },
    dense: {
        type: Boolean,
        default: false
    },
    icon: {
        type: Boolean,
        default: false
    }
});
</script>
