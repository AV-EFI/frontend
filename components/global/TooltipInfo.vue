<template>
  <span
    class="ml-1 text-neutral-500 text-sm cursor-help inline-flex items-center align-text-middle max-w-8"
    role="img"
    aria-label="Info"
    tabindex="0"
    :title="text"
  >
    <Icon
      name="tabler:info-circle"
      class="w-4 h-4"
      aria-hidden="true"
    />
  </span>
</template>

<script setup lang="ts">
defineProps<{ text: string }>();
</script>
