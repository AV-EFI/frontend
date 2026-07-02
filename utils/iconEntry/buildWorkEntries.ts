import type { IconEntry, IconSegment } from '~/types/iconEntry';
import { asArray, segment } from './entryHelpers';

interface WorkBuilderDeps {
    t: (key: string, ...args: unknown[]) => string;
    getLocalizedPlaceLabel: (loc: unknown) => string;
    iconFor: (key: string) => string;
}

export function buildWorkEntries(data: unknown, deps: WorkBuilderDeps): IconEntry[] {
  const { t, getLocalizedPlaceLabel, iconFor } = deps;
  const d = data as Record<string, unknown> | null | undefined;
  const entries: IconEntry[] = [];

  // Produktionsorte
  const workEvents = asArray((d?.has_record as Record<string, unknown> | undefined)?.has_event);
  const locs = workEvents.flatMap((ev) => asArray((ev as Record<string, unknown>)?.located_in));
  const locTexts = locs.map((loc) => {
    const l = loc as Record<string, unknown> | null;
    const sameAs = l?.same_as as Record<string, unknown> | null;
    const label = getLocalizedPlaceLabel(loc) ||
            sameAs?.id as string ||
            (sameAs?.category ? t(sameAs.category as string) : (l?.category ? t(l.category as string) : ''));
    return segment(label || '');
  }).filter(s => s.text);
  if (locTexts.length) {
    entries.push({
      key: 'located_in',
      icon: iconFor('located_in'),
      text: locTexts,
      aria: `${t('located_in')}: ${locTexts.map(l => l.text).join(', ')}`,
    });
  }

  // Produktionsjahre
  if (d?.years) {
    const years = asArray(d.years) as string[];
    entries.push({
      key: 'years',
      icon: iconFor('years'),
      text: years.map(y => segment(y)),
      aria: `${t('years')}: ${years.join(', ')}`,
    });
  } else if (d?.production_in_year) {
    let label = '';
    const piy = d.production_in_year as Record<string, unknown> | Record<string, unknown>[];
    if (Array.isArray(piy)) {
      label = piy.map(r => {
        const from = r.gte ?? r.gt ?? '';
        const to = r.lte ?? r.lt ?? '';
        return [from, to].filter(Boolean).join('–');
      }).join(', ');
    } else if (typeof piy === 'object') {
      const from = piy.gte ?? piy.gt ?? '';
      const to = piy.lte ?? piy.lt ?? '';
      label = [from, to].filter(Boolean).join('–');
    }
    if (label) {
      entries.push({
        key: 'years',
        icon: iconFor('years'),
        text: [segment(label)],
        aria: `${t('productionyears')}: ${label}`,
      });
    }
  }

  // Filmschaffende
  const creatorsRaw = d?.creators as string[] | undefined;
  const fallbackRaw = d?.directors_or_editors as string[] | undefined;
  const creators = asArray(creatorsRaw?.length ? creatorsRaw : fallbackRaw) as string[];
  if (creators.length) {
    entries.push({
      key: 'creators',
      icon: iconFor('creators'),
      text: creators.map(c => segment(c)),
      aria: `${t('creators')}: ${creators.join(', ')}`,
    });
  }

  // Form (Gattung)
  const forms = asArray((d?.has_record as Record<string, unknown> | undefined)?.has_form);
  const formLabels = forms
    .map((f) => {
      const raw = typeof f === 'string' ? f : ((f as Record<string, unknown>)?.has_name as string ?? '');
      return raw ? segment(t(raw), raw) : null;
    })
    .filter(Boolean) as IconSegment[];
  if (formLabels.length) {
    entries.push({
      key: 'form',
      icon: iconFor('form'),
      text: formLabels,
      aria: `${t('has_form')}: ${formLabels.map(s => s.text).join(', ')}`,
    });
  }

  // Episode/Teil-Indikator
  const partOf = d?.is_part_of as Record<string, unknown> | undefined;
  if (partOf) {
    const cat = partOf.category ? t(partOf.category as string) : '';
    const id = partOf.id ? String(partOf.id) : '';
    const label = [cat, id].filter(Boolean).join(' ');
    if (label) {
      entries.push({
        key: 'episode',
        icon: iconFor('episode'),
        text: [segment(label)],
        aria: `${t('is_part_of')}: ${label}`,
      });
    }
  }

  // Produktions-Events (Typ/Kategorie)
  const evTypeLabels = workEvents
    .map(e => (e as Record<string, unknown>)?.type || (e as Record<string, unknown>)?.category)
    .filter(Boolean) as string[];
  if (evTypeLabels.length) {
    entries.push({
      key: 'prod_events',
      icon: iconFor('prod_events'),
      text: evTypeLabels.map(tp => segment(t(tp), tp)),
      aria: `${t('has_event')}: ${evTypeLabels.map(tp => t(tp)).join(', ')}`,
    });
  }

  // Production names
  const productionNames = asArray(d?.production) as string[];
  if (productionNames.length) {
    entries.push({
      key: 'production',
      icon: iconFor('production'),
      text: productionNames.map(n => segment(n)),
      aria: `${t('production')}: ${productionNames.join(', ')}`,
    });
  }

  // Genre
  const genres = asArray((d?.has_record as Record<string, unknown> | undefined)?.has_genre);
  const gLabels = genres
    .map((g) => {
      const raw = (g as Record<string, unknown>)?.has_name ?? g;
      return raw ? segment(t(raw as string), raw) : null;
    })
    .filter(Boolean) as IconSegment[];
  if (gLabels.length) {
    entries.push({
      key: 'genre',
      icon: iconFor('genre'),
      text: gLabels,
      aria: `${t('has_genre')}: ${gLabels.map(s => s.text).join(', ')}`,
    });
  }

  // Subjects
  const subjects = asArray(d?.subjects);
  const sLabels = subjects
    .map(s => (typeof s === 'string' ? s : ((s as Record<string, unknown>)?.has_name as string ?? '')))
    .filter(Boolean) as string[];
  if (sLabels.length) {
    entries.push({
      key: 'subject',
      icon: iconFor('subject'),
      text: sLabels.map(x => segment(x)),
      aria: `${t('subjects')}: ${sLabels.join(', ')}`,
    });
  }

  return entries;
}
