<script setup lang="ts">
// 301 Redirect to new /res/ route
const route = useRoute();
const id = route.params.id;

// Perform immediate redirect with 301 status, preserving hash fragment
await navigateTo(`/res/${id}${route.hash || ''}`, {
    redirectCode: 301,
    external: false
});
</script>

<template>
  <div>
    <!-- This template will not render due to immediate redirect -->
  </div>
</template>
