<template>
  <div
    class="join join-vertical"
    role="group"
    :aria-label="$t('toggleColorMode')"
  >
    <ClientOnly>
      <label class="swap swap-rotate">
        <!-- Hidden checkbox controlling the theme -->
        <input
          v-model="colorMode"
          type="checkbox"
          true-value="avefi_light"
          false-value="dark"
          class="checkbox theme-controller hidden"
          role="switch"
          :aria-checked="colorMode === 'avefi_light' ? 'true' : 'false'"
          :aria-label="$t('toggleColorMode')"
        >

        <!-- Light mode icon -->
        <svg
          class="swap-off h-10 w-10 fill-current theme-controller white transition-transform duration-500 ease-in-out transform rotate-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>{{ $t('lightMode') }}</title>
          <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41...Z"
          />
        </svg>

        <!-- Dark mode icon -->
        <svg
          class="swap-on h-10 w-10 fill-current theme-controller white transition-transform duration-500 ease-in-out transform rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <title>{{ $t('darkMode') }}</title>
          <path
            d="M21.64,13a1,1,0,0,0-1.05-.14...Z"
          />
        </svg>
      </label>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core';

const colorMode = useColorMode({
    attribute: 'data-theme',
    initialValue: 'avefi_light',
    modes: {
        avefi_light: 'avefi_light',
        dark: 'dark',
    },
    storageKey: 'avefi-color-mode'
});
</script>
