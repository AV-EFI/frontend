<template>
    <!-- The visible text names the action, so the accessible name matches what is shown. -->
    <button type="button" @click="toggleLocale">
        <Icon class="icon-action" name="tabler:language" aria-hidden="true" />
        <span>{{ currentLocale === 'de' ? t('switchToEnglishLanguage') : t('switchToGermanLanguage') }}</span>
    </button>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from 'vue';
const { t } = useI18n();
const i18n:any = useNuxtApp().$i18n;
i18n.setLocale(i18n.getLocaleCookie() || i18n.getBrowserLocale());
watch(() => i18n.locale.value, (newLocale) => {
    i18n.setLocale(newLocale);
    i18n.setLocaleCookie(newLocale);
});
const currentLocale = computed(() => i18n.locale.value);
const toggleLocale = () => {
    i18n.locale.value = currentLocale.value === 'de' ? 'en' : 'de';
};
</script>
