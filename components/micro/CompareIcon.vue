<script setup lang="ts">
defineProps({
    'alt': {
        type: String,
        default: 'Comparison'
    }
});
</script>
<template>
  <Icon
    :alt="alt"
    :_aria-label="alt"
    name="tabler:plus"
  />
</template>