// plugins/matomo.client.ts
import { defineNuxtPlugin, useRuntimeConfig, useRouter } from '#app';
import { watch } from 'vue';

// IMPORTANT: do NOT import vue-matomo at top-level if you want to avoid any eager init.
// We'll dynamic-import it only after consent.

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const router = useRouter();

    const matomoUrl = config.public.matomoUrl;
    const siteId = config.public.matomoSiteId;

    let isMatomoBooted = false;

    const bootMatomo = async () => {
        if (isMatomoBooted) return;
        isMatomoBooted = true;

        const { default: VueMatomo } = await import('vue-matomo');

        nuxtApp.vueApp.use(VueMatomo, {
            host: matomoUrl,
            siteId,
            router,

            // These two are the important bits when you care about consent:
            requireConsent: true,
            // If you want "cookie-less tracking" (still may do requests):
            disableCookies: true,

            enableLinkTracking: true,
            trackInitialView: true,
            enableHeartBeatTimer: true,
            heartBeatTimerInterval: 15,
            debug: process.env.NODE_ENV === 'development',
        })

        // Tell Matomo consent is granted
        // vue-matomo exposes $matomo on nuxtApp in many setups, but to be robust:
        ;(window as any)._paq = (window as any)._paq || []
        ;(window as any)._paq.push(['rememberConsentGiven']);
    };

    const stopMatomo = () => {
    // If you never loaded it, nothing to do.
        if (!isMatomoBooted) return

        // If user revokes later, you can request Matomo to forget consent + delete cookies.
        ;(window as any)._paq = (window as any)._paq || []
        ;(window as any)._paq.push(['forgetConsentGiven'])
        ;(window as any)._paq.push(['deleteCookies']);

    // NOTE: We do NOT try to "uninstall" the Vue plugin at runtime.
    // Practically, revocation means no tracking calls + cookies deleted.
    };

    // CookieControl composable
    const { cookiesEnabledIds } = useCookieControl();

    // React whenever the selection changes (initial load included)
    watch(
        cookiesEnabledIds,
        async (ids) => {
            const hasMatomoConsent = Array.isArray(ids) && ids.includes('matomo');

            if (hasMatomoConsent) {
                await bootMatomo();
            } else {
                stopMatomo();
            }
        },
        { immediate: true }
    );
});
