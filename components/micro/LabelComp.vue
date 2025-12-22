<template>
  <label 
    v-if="translateKey"
    class="tracking-wide text-xs font-bold dark:text-slate-300 text-neutral h-4"
    :class="fontSize"
    :aria-label="$t($props.labelText)"
  >
    <span class="sr-only">{{ $t($props.labelText) }}</span>
    <span aria-hidden="true">{{ $t($props.labelText) }}:</span>
  </label>
  <label 
    v-else
    class="tracking-wide text-xs font-bold dark:text-slate-300 text-neutral h-4"
    :class="fontSize"
    :aria-label="labelText"
  >
    <span class="sr-only">{{ labelText }}</span>
    <span aria-hidden="true">{{ labelText }}:</span>
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
        default: "text-xs"
    },
    translateKey: {
        type: Boolean,
        default: true
    }
});
</script>