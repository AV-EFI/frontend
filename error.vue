<script setup lang="ts">
import type { NuxtError } from 'nuxt/app';


const props = defineProps({
    error: Object as () => NuxtError
});

const handleError = () => {
    clearError({ redirect: '/' });
};
</script>

<template>
  <div>
    <h2>{{ error?.statusCode }}</h2>
    <pre wrap="">{{ error }}</pre>
    <button @click="handleError">
      Clear errors
    </button>
  </div>
</template>