// composables/useItemEmpty.ts

/**
 * Checks if an item is empty (has no meaningful data beyond handle).
 */
export function isItemEmpty(item: any): boolean {
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
export function allItemsEmpty(work: any): boolean {
    const rows = buildRows(work);
    if (rows.length === 0) return false;
    return rows.every(row => isItemEmpty(row.item));
}

/**
 * Helper to safely walk nested highlight paths like 'has_record.has_primary_title.has_name'.
 */
export function has(obj: any, path: string): boolean {
    const v = get(obj, path);
    return v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0) && v !== '';
}

export function get(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((o, p) => (o && o[p] != null ? o[p] : undefined), obj);
}

/**
 * Build rows for a work (item, mf context)
 */
export function buildRows(work: any): Array<{ item: any, mf: any | null }> {
    const rows: Array<{ item: any, mf: any | null }> = [];
    const mfs: any[] = Array.isArray(work?.manifestations) ? work.manifestations : [];
    for (const mf of mfs) {
        const items: any[] = Array.isArray(mf?.items) ? mf.items : [];
        for (const it of items) rows.push({ item: it, mf });
    }
    const tlItems: any[] = Array.isArray(work?.items) ? work.items : [];
    for (const it of tlItems) {
        rows.push({ item: it, mf: null });
    }
    return rows;
}
