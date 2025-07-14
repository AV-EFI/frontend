<script setup lang="ts">

const props = defineProps({
    'alt': {
        type: String,
        default: 'Disambiguation'
    }
});
</script>
<template>
  <Icon name="carbon:compare" />
</template>