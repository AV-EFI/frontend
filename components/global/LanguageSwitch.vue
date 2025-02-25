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
        <Suspense>
          <Icon
            id="localeGerman"
            class="h-6 w-6"
            alt="Anzeige in deutscher Sprache"
            title="Anzeige in deutscher Sprache"
            name="emojione:flag-for-germany"
          />
        </Suspense>
      </div>
      <div
        class="swap-on animated"
        alt="Switch to English language"
        title="Switch to English language"
        @click="toggleLocale"
      >
        <Suspense>
          <Icon
            id="localeEnglish"
            name="emojione:globe-showing-europe-africa"
            class="h-6 w-6"
            alt="English language"
            title="English language"
          />
        </Suspense>
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