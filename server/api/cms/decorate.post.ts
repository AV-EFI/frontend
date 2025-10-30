/* eslint-disable */
import { loadEntities, loadLocale, loadUserTooltips, collectLeafObjectPaths, labelForPath, tooltipForPath } from '../../utils/fieldMeta';
import { toExplorerPath, isKnownExplorerPath } from '../../utils/pathMapping.ts';

type Lang = 'de'|'en';

export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event);
  const lang = (getQuery(event).lang as Lang) || 'de';

  const entities = await loadEntities();
  const locale = await loadLocale();
  const user = await loadUserTooltips();

  // 1) collect raw leaf paths from incoming record
  const rawPaths = collectLeafObjectPaths(body);

  // 2) map raw to canonical explorer paths
  const explorerPaths = rawPaths.map(toExplorerPath);

  // 3) build meta maps
  const labels: Record<string, { de: string; en: string }> = {};
  const tooltips: Record<string, { de?: string; en?: string }> = {};
  const stale: string[] = [];

  // Provide an i18n bag for tooltip fallback: pretend i18n messages are served here.
  // If you have real i18n in runtime, you might inject those instead.
  const i18nDE = locale.de || {};
  const i18nEN = locale.en || {};

  for (const p of explorerPaths) {
    const known = isKnownExplorerPath(entities, p);
    if (!known) {
      stale.push(p);
    }

    labels[p] = {
      de: labelForPath(entities, locale, p, 'de'),
      en: labelForPath(entities, locale, p, 'en'),
    };

    const tDe = tooltipForPath(user, i18nDE, p, 'de');
    const tEn = tooltipForPath(user, i18nEN, p, 'en');
    if (tDe || tEn) {
      tooltips[p] = {};
      if (tDe) tooltips[p].de = tDe;
      if (tEn) tooltips[p].en = tEn;
    }
  }

  return {
    ok: true,
    data: body,       // original record untouched
    _meta: {
      labels,         // path -> { de, en }
      tooltips,       // path -> { de?, en? }
      stalePaths: stale, // paths present in data but not in entities (warn in UI)
    }
  };
});
