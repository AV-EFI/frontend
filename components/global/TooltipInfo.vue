<template>
  <span class="ml-1 badge badge-neutral badge-sm cursor-help inline-flex items-center align-text-middle max-w-8 text-sm"
    role="img" aria-label="Info" tabindex="0" :title="text">
    <Icon name="tabler:info-circle" aria-hidden="true" />
  </span>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
