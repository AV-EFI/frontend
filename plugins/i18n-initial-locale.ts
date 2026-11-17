/*
 * Every URL serves German unless the visitor chose English with the language switch. The i18n module
 * would otherwise pick the first locale from the Accept-Language header (server) or navigator.languages
 * (client), so search engines indexed English pages and hydration could switch the language.
 *
 * Only the first locale switch of an app instance is decided here: with the `no_prefix` strategy the
 * module never ends its initial phase, so `initialSetup` cannot tell later switches apart.
 * The plugin runs before the i18n plugins so the hook is registered before the initial locale is set.
 */
export default defineNuxtPlugin({
  name: 'avefi:i18n-initial-locale',
  enforce: 'pre',
  setup(nuxtApp) {
    let isInitialLocaleSet = false;

    nuxtApp.hook('i18n:beforeLocaleSwitch', (switchData) => {
      if (isInitialLocaleSet) return;
      isInitialLocaleSet = true;

      const i18n = nuxtApp.$i18n;
      // The module types both values as string, although both are always one of the configured locales.
      switchData.newLocale = (i18n.getLocaleCookie() || i18n.defaultLocale) as typeof switchData.newLocale;
    });
  },
});
