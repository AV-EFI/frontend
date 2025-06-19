<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const locale = useNuxtApp().$i18n.locale;
const { t:$t } = useI18n();

useHead({
    title: "AVefi",
    meta: [
        { name: "description", content: $t('metaDescription') },
    ],
    htmlAttrs: {
        lang: useI18n().locale.value
    },
    bodyAttrs: {
    //class: 'test'
    },
    //script: [ { innerHTML: 'console.log(\'Hello world\')' } ]
});

useSeoMeta({
    title: "AVefi",
    ogTitle: "AVefi",
    description: $t('metaDescription'),
    ogDescription: $t('metaDescription'),
    ogImage: "https://www.av-efi.net/img/AV-EFI-Logo.png",
    ogUrl: "https://www.av-efi.net",});

const {
    cookiesEnabled,
    cookiesEnabledIds,
    isConsentGiven,
    isModalActive,
    moduleOptions,
} = useCookieControl();

// example: react to a cookie being accepted
watch(
    () => cookiesEnabledIds.value,
    (current, previous) => {
        if (
            !previous?.includes('google-analytics') &&
      current?.includes('google-analytics')
        ) {
            // cookie with id `google-analytics` got added
            window?.location?.reload(); // placeholder for your custom change handler
        }
    },
    { deep: true },
);
</script>

<template>
  <div class="">
    <NuxtLoadingIndicator />
    <NuxtLayout
      class="layouts"
    >
      <div class="container grow mx-auto dark:text-white dark:border-gray-700">
        <NuxtPage />
      </div>
      <LazyCookieControl :locale="locale">
        <template #bar>
          <h2>Cookies 🍪</h2>
          <!--
            This <p> tag is currently empty. It can be used to display text or other inline elements.
            Note: Ensure to handle cookies appropriately in your application. Cookies can be used to store user preferences, session information, or tracking data.
            - Use secure cookies for sensitive information.
            - Set appropriate expiration dates for cookies.
            - Be mindful of privacy regulations and user consent when using cookies.
          -->
          <p>{{ $t('cookiesDescription') }}</p>
          <GlobalLanguageSwitch />
          <NuxtLink
            to="https://datenschutz.gwdg.de/services/av-efi"
            target="_blank"
            class="dark:text-white link"
          >
            {{ $t('dataprotection') }}
          </NuxtLink>
          |
          <NuxtLink
            to="/imprint"
            class="dark:text-white link"
          >
            {{ $t('imprint') }}
          </NuxtLink>
        </template>
        <template #modal>
          <h3>{{ $t('dataprotection') }}</h3>
          <p>{{ $t('cookiesModalDescription') }}</p>
        </template><template #cookie="{config}">
          <span
            v-for="c in config"
            :key="c.id"
            v-text="c.cookies"
          />
        </template>
      </LazyCookieControl>
    </NuxtLayout>
  </div>
</template>