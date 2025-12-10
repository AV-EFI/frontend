/**
 * Matomo Analytics Plugin for Nuxt 3
 * Using vue-matomo package
 */
import VueMatomo from 'vue-matomo';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const router = useRouter();
    
    // Matomo configuration
    const matomoUrl = config.public.matomoUrl || 'http://localhost:8888';
    const siteId = config.public.matomoSiteId || 'AVefi';
    
    // Initialize vue-matomo
    nuxtApp.vueApp.use(VueMatomo, {
        host: matomoUrl,
        siteId: siteId,
        router: router,
        enableLinkTracking: true,
        requireConsent: false,
        trackInitialView: true,
        disableCookies: false,
        requireCookieConsent: false,
        enableHeartBeatTimer: true,
        heartBeatTimerInterval: 15,
        debug: process.env.NODE_ENV === 'development',
        userId: undefined,
        cookieDomain: undefined,
        domains: undefined,
        preInitActions: []
    });
    
    if (process.client) {
        // Matomo tracking script
        if (!window._paq) {
            window._paq = window._paq || [];
            window._paq.push(['enableLinkTracking']);
            window._paq.push(['setTrackerUrl', 'http://localhost:8888/matomo.php']);
            window._paq.push(['setSiteId', '1']);
            const d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='http://localhost:8888/matomo.js'; s.parentNode.insertBefore(g,s);
        }
        // Track pageview on every route change
        nuxtApp.$router.afterEach((to) => {
            window._paq.push(['setCustomUrl', window.location.href]);
            window._paq.push(['setDocumentTitle', document.title]);
            window._paq.push(['trackPageView']);
            // Track site search if query param exists
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('query');
            if (query) {
                window._paq.push(['trackSiteSearch', query]);
            }
        });
    }
});
