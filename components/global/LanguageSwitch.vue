<template>
  <div class="mx-auto">
    <label class="swap swap-flip">
      <!-- this hidden checkbox controls the state -->
      <input v-model="$i18n.locale" type="checkbox" true-value="de" false-value="en" :value="$i18n.locale"
        class="checkbox theme-controller hidden">
      <div class="swap-off animated" alt="Deutsche Sprache" title="Deutsche Sprache">
        <div class="avatar placeholder">
          <div
            class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
            <span class="flex text-xs flex-row items-center justify-center w-full h-full">
              <Icon class="text-md" name="tabler:language" />De
            </span>
          </div>
        </div>
      </div>
      <div class="swap-on animated circle" alt="Switch to English language" title="Switch to English language">
        <div class="avatar placeholder">
          <div
            class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
            <span class="flex text-xs flex-row items-center justify-center w-full h-full">
              <Icon class="text-md" name="tabler:language" />En
            </span>
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
const i18n:any = useNuxtApp().$i18n;
i18n.setLocale(i18n.getLocaleCookie() || i18n.getBrowserLocale());
watch(() => i18n.locale.value, (newLocale) => {
    i18n.setLocale(newLocale);
    i18n.setLocaleCookie(newLocale);
});
</script>