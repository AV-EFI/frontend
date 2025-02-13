<template>
  <label 
    class="tracking-wide font-bold dark:text-primary-100 text-primary-500 uppercase"
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