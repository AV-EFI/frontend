import { computed } from 'vue';
import type { ExplorerTexts } from '~/i18n/locales/explorer';
import type { ExplorerLocale } from '~/utils/explorer/fieldTerms';

/**
 * The explorer keeps long, structured texts (levels, groups, rules, cases) in one tree in
 * i18n/locales/explorer.ts. This returns that tree as plain strings for the active language.
 */
export function useExplorerTexts() {
  const { tm, rt, locale } = useI18n();

  const resolve = (node: unknown): unknown => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(resolve);
    if (typeof node === 'function' || (node && typeof node === 'object' && 'loc' in node)) {
      return rt(node as Parameters<typeof rt>[0]);
    }
    if (node && typeof node === 'object') {
      return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, resolve(value)]));
    }
    return node;
  };

  const text = computed(() => resolve((tm as (key: string) => unknown)('explorer')) as ExplorerTexts);
  const language = computed<ExplorerLocale>(() => (locale.value === 'en' ? 'en' : 'de'));

  /** Fills {name} placeholders. */
  const fill = (template: string, values: Record<string, string | number>): string =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));

  return { text, language, fill };
}
