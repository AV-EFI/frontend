/* eslint-disable */
import type { EntitiesEntry } from './fieldMeta';

/**
 * Map raw dot paths from the ES record to canonical explorer paths.
 * You will know these rules best; start simple, expand as you learn.
 *
 * Examples (adjust to your schema):
 * - WorkVariant.has_record.has_primary_title.has_name
 * - MovingImageRecord.WorkVariant.manifestations[].items[].has_format.type    (canonical)
 */
export function toExplorerPath(rawPath: string): string {
  // Heuristics: normalise root & containers
  let p = rawPath
    .replace(/^compound_record\._source\./, '')
    .replace(/^has_record\./, 'WorkVariant.has_record.')
    .replace(/^manifestations\[\]\./, 'WorkVariant.manifestations[].')
    .replace(/^items\[\]\./, 'WorkVariant.manifestations[].items[].');

  // Common aliasing across your data:
  p = p
    .replace(/\.has_record\./g, '.has_record.')
    .replace(/\.has_item\[\]\./g, '.items[].')
    .replace(/\.is_manifestation_of\./g, '.is_manifestation_of.')
    .replace(/\.is_item_of\./g, '.is_item_of.');

  // If the path already looks canonical, leave it
  if (p.startsWith('MovingImageRecord.')) return p;

  // Ensure full prefix
  if (!p.startsWith('MovingImageRecord.')) {
    p = `MovingImageRecord.${p}`;
  }
  return p;
}

/** Optionally, verify that the explorerPath exists as a slot or class in entities */
export function isKnownExplorerPath(entities: EntitiesEntry[], explorerPath: string): boolean {
  // Known if there is a slot with this explorerPath, or a class path prefix
  return entities.some(e => e.explorerPath === explorerPath);
}
