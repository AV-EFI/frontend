<template>
  <div>
    <pre class="hidden">{{ $i18n.locale }}</pre>
    <label
      class="swap swap-flip"
      role="radiogroup"
      :aria-label="$t('languageToggle')"
    >
      <!-- this hidden checkbox controls the state -->
      <input
        v-model="$i18n.locale"
        type="checkbox"
        true-value="de"
        false-value="en"
        :value="$i18n.locale"
        class="checkbox theme-controller hidden"
        role="radio"
        :aria-checked="$i18n.locale === 'de'"
        :aria-label="$t('languageGerman')"
      >
      <div
        class="swap-off animated"
        :aria-hidden="$i18n.locale !== 'en'"
        role="radio"
        :aria-checked="$i18n.locale === 'en'"
        :aria-label="$t('languageGerman')"
        @click="toggleLocale"
      >
        <div class="avatar placeholder">
          <div class="bg-neutral dark:bg-slate-800 dark:text-white text-neutral-content w-12 rounded-full">
            <span class="flex flex-row items-center">
              <Icon
                class="text-lg"
                name="mdi:language"
              />De
            </span>
          </div>
        </div>
      </div>
      <div
        class="swap-on animated circle"
        :aria-hidden="$i18n.locale !== 'de'"
        role="radio"
        :aria-checked="$i18n.locale === 'de'"
        :aria-label="$t('languageEnglish')"
        @click="toggleLocale"
      >
        <div class="avatar placeholder">
          <div class="bg-neutral dark:bg-slate-800 dark:text-white text-neutral-content w-12 rounded-full">
            <span class="flex flex-row items-center">
              <Icon
                class="text-lg"
                name="mdi:language"
              />En
            </span>
          </div>
        </div>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
const i18n: any = useNuxtApp().$i18n;
i18n.setLocale(i18n.getLocaleCookie() || i18n.getBrowserLocale());

watch(() => i18n.locale.value, (newLocale) => {
    i18n.setLocale(newLocale);
    i18n.setLocaleCookie(newLocale);
});

const toggleLocale = () => {
    i18n.locale.value = i18n.locale.value === 'de' ? 'en' : 'de';
};
</script>
