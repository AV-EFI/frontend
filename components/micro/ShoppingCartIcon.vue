<script setup lang="ts">
defineProps({
    'alt': {
        type: String,
        default: 'Shopping cart'
    }
});
</script>
<template>
  <Icon
    :alt="alt"
    name="tabler:heart-plus"
  />
</template>