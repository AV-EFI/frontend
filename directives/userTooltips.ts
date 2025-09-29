/* eslint-disable */
import type { DirectiveBinding } from 'vue';
import { useUserGlossary } from '@/composables/useUserGlossary';

type Payload = string | { path: string; lang?: 'de' | 'en' };

// --- locale helpers (no useI18n outside setup)
function resolveLocale(): 'de' | 'en' {
  // try Nuxt runtime
  const nuxtLocale =
    (globalThis as any).__NUXT__?.i18n?.locale ||
    (globalThis as any).__NUXT__?.state?.locale;
  if (typeof nuxtLocale === 'string') {
    return nuxtLocale.startsWith('en') ? 'en' : 'de';
  }
  // try <html lang="">
  if (typeof document !== 'undefined') {
    const htmlLang = document.documentElement.getAttribute('lang') || '';
    if (htmlLang) return htmlLang.startsWith('en') ? 'en' : 'de';
  }
  // default
  return 'de';
}

function parse(binding: DirectiveBinding<Payload>): { path: string; lang?: 'de' | 'en' } {
  if (typeof binding.value === 'string') {
    return { path: binding.value };
  }
  if (binding.value && typeof binding.value === 'object') {
    return { path: binding.value.path, lang: binding.value.lang };
  }
  return { path: '' };
}

function lastSegment(path: string): string {
  const seg = path.split('.').pop() || '';
  return seg.replace(/\[\]$/, '');
}

/** try class-level segment too, e.g. …manifestations[].items[] -> "item" */
function classSegment(path: string): string | null {
  const segs = path.split('.');
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i];
    if (s.endsWith('[]')) return s.replace('[]', '').toLowerCase();
  }
  return null;
}

/** lightweight i18n accessor (no useI18n): expects flattened keys like "tooltip.format" on window.__I18N__ */
function i18nGet(key: string, lang: 'de' | 'en'): string | undefined {
  const bag =
    (globalThis as any).__I18N__?.[lang] ||
    (globalThis as any).__NUXT__?.i18n?.messages?.[lang];
  const val = bag?.[key];
  return typeof val === 'string' ? val : undefined;
}

async function apply(el: HTMLElement, binding: DirectiveBinding<Payload>) {
  const { path, lang } = parse(binding);
  if (!path) return;

  const chosen: 'de' | 'en' = (lang || resolveLocale()) as 'de' | 'en';

  // 1) user tooltip by exact path
  const { ensureLoaded, get } = useUserGlossary();
  await ensureLoaded();
  const userText = get(path, chosen);
  if (userText && userText.trim()) {
    el.setAttribute('title', userText.trim());
    return;
  }

  // 2) fallback to i18n.tooltip.<leaf>
  const leaf = lastSegment(path);
  let text = i18nGet(`tooltip.${leaf}`, chosen);

  // 3) try class-level tooltip
  if (!text) {
    const cls = classSegment(path);
    if (cls) text = i18nGet(`tooltip.${cls}`, chosen);
  }

  el.setAttribute('title', text || path);
}

export default {
  async mounted(el: HTMLElement, binding: DirectiveBinding<Payload>) {
    await apply(el, binding);
  },
  async updated(el: HTMLElement, binding: DirectiveBinding<Payload>) {
    await apply(el, binding);
  },
};
