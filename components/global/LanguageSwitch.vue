<template>
    <div class="lg:mx-auto">
        <label class="swap swap-flip" :aria-label="currentLocale === 'de' ? t('switchToEnglishLanguage') : t('switchToGermanLanguage')">
            <!-- this hidden checkbox controls the state -->
            <input v-model="$i18n.locale" type="checkbox" true-value="de" false-value="en" :value="$i18n.locale"
                   class="checkbox theme-controller hidden">
            <div class="swap-off animated" :aria-label="t('switchToGermanLanguage')" :title="t('switchToGermanLanguage')">
                <div class="avatar placeholder">
                    <div
                        class="bg-base-100 dark:bg-gray-600 dark:text-white text-neutral w-8 h-8 rounded-full flex items-center justify-center">
                        <span class="flex text-xs flex-row items-center justify-center w-full h-full">
                            <Icon class="text-md" name="tabler:language" />De
                        </span>
                    </div>
                </div>
            </div>
            <div class="swap-on animated circle" :aria-label="t('switchToEnglishLanguage')" :title="t('switchToEnglishLanguage')">
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
import { computed } from 'vue';
const { t } = useI18n();
const i18n:any = useNuxtApp().$i18n;
i18n.setLocale(i18n.getLocaleCookie() || i18n.getBrowserLocale());
watch(() => i18n.locale.value, (newLocale) => {
    i18n.setLocale(newLocale);
    i18n.setLocaleCookie(newLocale);
});
const currentLocale = computed(() => i18n.locale.value);
</script>
