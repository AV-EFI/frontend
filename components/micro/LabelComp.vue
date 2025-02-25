<template>
  <label 
    class="tracking-wide text-xs font-bold dark:text-slate-300 text-slate-500 uppercase"
    :class="fontSize"
  >
    {{ $t($props.labelText) }}:
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