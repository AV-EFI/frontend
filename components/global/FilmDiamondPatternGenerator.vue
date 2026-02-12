<template>
  <ClientOnly>
    <AsyncFilmDiamondPatternGenerator />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
const AsyncFilmDiamondPatternGenerator = defineAsyncComponent(() => import('./FilmDiamondPatternGeneratorInner.vue'));
</script>

/* No style needed for wrapper */