<script setup lang="ts">
const colorMode = useColorMode();

</script>

<template>
  <div class="join join-vertical">
    <input
      v-model="colorMode.preference"
      type="radio"
      name="theme-buttons"
      class="btn theme-controller join-item"
      aria-label="Default"
      value="avefi_light"
    >
    <input
      v-model="colorMode.preference"
      type="radio"
      name="theme-buttons"
      class="btn theme-controller join-item"
      aria-label="Dark"
      value="dark"
    >
  </div>
</template>