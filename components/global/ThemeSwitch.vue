<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
const colorMode = useColorMode(
    {
        attribute: 'data-theme',
        initialValue: 'avefi_light',
        modes: {
            // custom colors
            avefi_light: 'avefi_light',
            dark: 'dark',
        },
        storageKey: 'avefi-color-mode'
    },
);
</script>

<template>
  <ClientOnly>
    <div class="lg:mx-auto">
      <label class="swap swap-flip">
        <!-- this hidden checkbox controls the state -->
        <input v-model="colorMode" type="checkbox" true-value="avefi_light" false-value="avefi_dark" :value="colorMode"
          class="checkbox theme-controller hidden">
        <div class="swap-off animated" alt="Switch to dark mode" title="Switch to dark mode">
          <div class="avatar placeholder">
            <div
              class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
              <span class="flex flex-row items-center justify-center w-full h-full">
                <Icon class="text-lg" name="tabler:moon" />
              </span>
            </div>
          </div>
        </div>
        <div class="swap-on animated circle" alt="Switch to light mode" title="Switch to light mode"></div>
        <div class="avatar placeholder">
          <div
            class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
            <span class="flex flex-row items-center justify-center w-full h-full">
              <Icon class="text-lg" name="tabler:sun" />
            </span>
          </div>
        </div>
      </label>
    </div>
  </ClientOnly>
</template>