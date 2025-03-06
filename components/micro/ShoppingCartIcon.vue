<script setup lang="ts">

const props = defineProps({
    'alt': {
        type: String,
        default: 'Shopping cart'
    }
});
</script>
<template>
  <Icon
    :alt="alt"
    name="i-fa:heart-o"
  />
</template>