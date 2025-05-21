<template>
  <span
    v-if="category.indexOf('avefi:') > -1"
    :title="$t(category ?? '')"
    :aria-label="$t(category ?? '')"
    role="status"
    :class="[
      category === 'avefi:WorkVariant' ? 'bg-work-variant' :
      category === 'avefi:Manifestation' ? 'bg-manifestation' :
      category === 'avefi:Item' ? 'bg-item' : 'bg-primary-500',
      'badge text-white'
    ]"
  >
    {{ dense ? $t(category ?? '').charAt(0) : $t(category ?? '') }}
    <Icon
      v-if="icon"
      name="fa:caret-down"
      class="w-2 h-2 text-white ml-1"
      aria-hidden="true"
    />
  </span>

  <span
    v-else-if="category.indexOf('Serial') > -1"
    class="badge badge-outline text-primary-500 dark:text-primary-200"
    :title="$t(category ?? '')"
    :aria-label="$t(category ?? '')"
    role="status"
  >
    {{ dense ? $t(category ?? '').charAt(0) : $t(category ?? '') }}
    <Icon
      v-if="icon"
      name="fa:caret-down"
      class="w-2 h-2 text-white ml-1"
      aria-hidden="true"
    />
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
