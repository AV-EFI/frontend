// plugins/matomo.client.ts
import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app';
import { watch } from 'vue';
import { useMatomoTracking } from '~/composables/useMatomoTracking';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const router = useRouter();

  const matomoUrl = config.public.matomoUrl;
  const siteId = config.public.matomoSiteId;

  let isMatomoBooted = false;
  let removeAfterEachHook: (() => void) | null = null;

  const bootMatomo = async () => {
    if (isMatomoBooted) return;
    if (!matomoUrl || !siteId) return;

    const { default: VueMatomo } = await import('vue-matomo');

    nuxtApp.vueApp.use(VueMatomo, {
      host: matomoUrl,
      siteId,
      router,

      // Consent-aware setup
      requireConsent: true,
      disableCookies: true,

      // We will track page views manually so dimensions are applied first
      trackInitialView: false,

      enableLinkTracking: true,
      enableHeartBeatTimer: true,
      heartBeatTimerInterval: 15,
      debug: import.meta.dev,
    });

    isMatomoBooted = true;

    const {
      rememberConsentGiven,
      trackPageView,
      trackEvent,
      setPreferenceDimensions,
    } = useMatomoTracking();

    rememberConsentGiven();

    // Initial dimensions + initial pageview
    setPreferenceDimensions();
    trackPageView(document.title);

    // Optional initial event
    trackEvent('Preferences', 'Loaded', 'initial_state');

    // Track all SPA navigations manually
    removeAfterEachHook = router.afterEach(() => {
      setPreferenceDimensions();
      trackPageView(document.title);
    });
  };

  const stopMatomo = () => {
    if (!isMatomoBooted) return;

    const {
      clearPreferenceDimensions,
      forgetConsentGiven,
      deleteCookies,
    } = useMatomoTracking();

    clearPreferenceDimensions();
    forgetConsentGiven();
    deleteCookies();

    if (removeAfterEachHook) {
      removeAfterEachHook();
      removeAfterEachHook = null;
    }
  };

  const { cookiesEnabledIds } = useCookieControl();

  watch(
    cookiesEnabledIds,
    async (ids) => {
      const hasMatomoConsent =
        Array.isArray(ids) && ids.includes('matomo');

      if (hasMatomoConsent) {
        await bootMatomo();
      } else {
        stopMatomo();
      }
    },
    { immediate: true }
  );
});