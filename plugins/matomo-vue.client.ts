//import { defineNuxtPlugin } from '#app';
//import VueMatomo from 'vue-matomo';

import VueMatomo from 'matomo-ts';

export default defineNuxtPlugin(() => {
    try {
        VueMatomo.default().init(useRuntimeConfig().public.analyticsUrl, "1");
        window._paq.push(['trackPageView']); //To track pageview
        console.log("matomo connected");
    }
    catch (e) {
        console.error(e);
    }
    /*
    nuxtApp.vueApp.use(VueMatomo, {
        host: 'http://localhost:3000',
        siteId: 1,
        // Enables automatically registering pageviews on the router
        router: nuxtApp.$router,
        enableLinkTracking: true,
        requireConsent: false,
        trackInitialView: true,
        disableCookies: true,
        requireCookieConsent: false,
    });
    */
});