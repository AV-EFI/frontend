<script setup lang="ts">
// All imports below are auto-imported by Nuxt
const { locale, t: $t } = useI18n();

useSeoMeta({
    titleTemplate: '%s | AVefi',
    ogSiteName: `AVefi - ${$t('avefiClaim')}`,
    twitterCard: 'summary_large_image',
});

// Optimize critical resource loading - preload fonts to prevent FOUT
useHead({
    link: [
    // Preload critical fonts (Inter is used for body text)
        { rel: 'preload', href: '/fonts/Inter.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/BreeSerif-Regular.ttf', as: 'font', type: 'font/ttf', crossorigin: 'anonymous' },
    ],
    // Use media="print" trick to load non-critical CSS without blocking
    style: [],
});

const auth = useAuth();

onMounted(() => {
    auth.startSessionPolling();
});

onBeforeUnmount(() => {
    auth.stopSessionPolling();
});

const {
    cookiesEnabledIds
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
            // Only reload on client side
            if (import.meta.client) {
                window.location.reload();
            }
        }
    },
    { deep: true },
);
</script>

<template>
  <div id="app" v-cloak class="">
    <GlobalLoadingScreen />
    <NuxtLoadingIndicator />
    <NuxtLayout
      class="layouts"
    >
      <div class="mt-2 container grow mx-auto dark:text-white dark:border-gray-700 lg:px-2 xl:border-base-200 xl:border-2 xl:px-4">
        <NuxtPage />
      </div>
      <ClientOnly>
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
        </template>
        <template #cookie="{ cookie }">
          <span
            :key="cookie.id"
            v-text="cookie"
          />
        </template>
        <GlobalAuthProvider />
      </LazyCookieControl>
      </ClientOnly>
    </NuxtLayout>
  </div>
</template>

<style>
[v-cloak] { display: none !important; }
</style>