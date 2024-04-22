<template>
  <div>I'm always public, even when the global auth middleware is enabled!</div>
</template>

<script setup lang="ts">
definePageMeta({
    auth: false
});
</script>