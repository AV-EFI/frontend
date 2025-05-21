<script setup lang="ts">

const props = defineProps({
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
    name="formkit:add"
  />
</template>