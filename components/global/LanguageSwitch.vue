<template>
  <div>
    <pre class="hidden">{{ $i18n.locale }}</pre>
    <label class="swap swap-flip">
      <!-- this hidden checkbox controls the state -->
      <input
        v-model="$i18n.locale"
        type="checkbox"
        true-value="de"
        false-value="en"
        :value="$i18n.locale"
        class="checkbox theme-controller hidden"
      >
      <div
        class="swap-off animated"
        alt="Deutsche Sprache"
        title="Deutsche Sprache"
        @click="toggleLocale"
      >
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span class="flex flex-row items-center"><Icon
              class="text-lg"
              name="mdi:language"
            />De</span>
          </div>
        </div>
      </div>
      <div
        class="swap-on animated circle"
        alt="Switch to English language"
        title="Switch to English language"
        @click="toggleLocale"
      >
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span class="flex flex-row items-center"><Icon
              class="text-lg"
              name="mdi:language"
            />En</span>
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
const i18n:any = useNuxtApp().$i18n;
i18n.setLocale(i18n.getLocaleCookie() || i18n.getBrowserLocale());
watch(() => i18n.locale.value, (newLocale) => {
    i18n.setLocale(newLocale);
    i18n.setLocaleCookie(newLocale);
});
</script>

<style scoped>
</style>