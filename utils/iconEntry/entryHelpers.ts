import type { IconEntry, IconSegment } from '~/types/iconEntry';
import { ENTRY_ORDER } from '~/config/entryDisplayConfig';
import type { Level } from '~/types/iconEntry';

export function asArray(x: unknown): unknown[] {
  return Array.isArray(x) ? x : (x ? [x] : []);
}

export function segment(text: unknown, facetValue: unknown = text): IconSegment {
  return {
    text: String(text ?? '').trim(),
    facetValue: String(facetValue ?? '').trim(),
    hilite: false,
  };
}

export function orderEntries(entries: IconEntry[], level: Level): IconEntry[] {
  const order = ENTRY_ORDER[level];
  return [
    ...order.map(k => entries.find(e => e.key === k)).filter(Boolean) as IconEntry[],
    ...entries.filter(e => !order.includes(e.key)),
  ];
}
