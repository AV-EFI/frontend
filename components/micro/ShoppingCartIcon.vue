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
    name="formkit:list"
  />
</template>