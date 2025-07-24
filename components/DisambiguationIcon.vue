<script setup lang="ts">

const props = defineProps({
    'alt': {
        type: String,
        default: 'Disambiguation'
    }
});
</script>
<template>
  <Icon name="material-symbols:compare" />
</template>