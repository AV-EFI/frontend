// composables/useItemEmpty.ts

/**
 * Checks if an item is empty (has no meaningful data beyond handle).
 */
export function isItemEmpty(item: unknown): boolean {
  if (!item) return true;
  const itemFieldsFromSpec = [
    'has_record.has_format',
    'has_record.in_language.code',
    'has_record.elementy_type',
    'has_record.has_sound_type',
    'has_record.has_colour_type',
    'has_record.has_frame_rate',
    'has_record.has_extent',
    'has_record.has_webresource',
    'has_record.has_access_status',
    'has_record.has_duration',


  ];
  return !itemFieldsFromSpec.some(path => has(item, path));
}

/**
 * Checks if all items in a work are empty.
 */
export function allItemsEmpty(work: unknown): boolean {
  const rows = buildRows(work);
  if (rows.length === 0) return false;
  return rows.every(row => isItemEmpty(row.item));
}

/**
 * Helper to safely walk nested highlight paths like 'has_record.has_primary_title.has_name'.
 */
export function has(obj: unknown, path: string): boolean {
  const v = get(obj, path);
  return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== '';
}

export function get(obj: unknown, path: string): unknown {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current: unknown = obj;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === undefined) return undefined;

    if (Array.isArray(current)) {
      // Map and flatten, then deduplicate
      const arr = current.map(item => get(item, parts.slice(i).join('.'))).flat().filter(x => x != null);
      // Return only distinct values
      return Array.from(new Set(arr));
    }
    current = (current as Record<string, unknown> | null | undefined)?.[part];
    if (current == null) return current;
  }
  return current;
}

/**
 * Build rows for a work (item, mf context)
 */
export function buildRows(work: unknown): Array<{ item: unknown, mf: unknown | null }> {
  const rows: Array<{ item: unknown, mf: unknown | null }> = [];
  const w = work as { manifestations?: unknown; items?: unknown } | null | undefined;
  const mfs: unknown[] = Array.isArray(w?.manifestations) ? w.manifestations : [];
  for (const mf of mfs) {
    const mfItems = (mf as { items?: unknown } | null | undefined)?.items;
    const items: unknown[] = Array.isArray(mfItems) ? mfItems : [];
    for (const it of items) rows.push({ item: it, mf });
  }
  const tlItems: unknown[] = Array.isArray(w?.items) ? w.items : [];
  for (const it of tlItems) {
    rows.push({ item: it, mf: null });
  }
  return rows;
}
