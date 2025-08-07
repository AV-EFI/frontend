<!-- components/AuthProvider.vue -->
<template>
  <slot />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';

const auth = useAuth();

onMounted(() => {
    auth.startSessionPolling();
});

onBeforeUnmount(() => {
    auth.stopSessionPolling();
});
</script>
