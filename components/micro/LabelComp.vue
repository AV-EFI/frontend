<template>
  <label 
    class="tracking-wide text-xs font-bold dark:text-slate-300 text-neutral"
    :class="fontSize"
    :aria-label="$t($props.labelText)"
  >
    <span class="sr-only">{{ $t($props.labelText) }}</span>
    <span aria-hidden="true">{{ $t($props.labelText) }}:</span>
  </label>
</template>

<script lang="ts" setup>
defineProps({
    labelText: {
        type: String,
        required: true
    },
    fontSize: {
        type: String,
        required: false,
        default: "text-sm"
    }
});
</script>