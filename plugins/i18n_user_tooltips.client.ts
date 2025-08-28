/* eslint-disable */
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const store = await $fetch<{ updatedAt: string; entries: Record<string, { de?: string; en?: string }> }>('/api/cms/usertooltips');

    // build small message bags
    const de: Record<string, string> = {};
    const en: Record<string, string> = {};
    const toLeaf = (p: string) => (p.split('.').pop() || '').replace(/\[\]$/, '');

    for (const [path, val] of Object.entries(store.entries)) {
      const key = `tooltip.${toLeaf(path)}`;
      if (val.de) de[key] = val.de;
      if (val.en) en[key] = val.en;
    }

    // get i18n instance the safe way
    const i18n: any = (nuxtApp as any).$i18n || (nuxtApp.vueApp as any).__VUE_I18N__;
    const global = i18n?.global;

    if (global?.mergeLocaleMessage) {
      if (Object.keys(de).length) global.mergeLocaleMessage('de', de);
      if (Object.keys(en).length) global.mergeLocaleMessage('en', en);
    }

    // expose a super-lightweight message bag to the directive (no composables)
    (globalThis as any).__I18N__ = {
      de: { ...(global?.messages?.de || {}), ...de },
      en: { ...(global?.messages?.en || {}), ...en },
    };
  } catch {
    // non-fatal
  }
});
