// /server/api/elastic/cache_top_values.post.ts
import { defineEventHandler } from 'h3';
import { $fetch } from 'ofetch';
import { promises as fs } from 'fs';
import { resolve } from 'pathe';
import { config as searchkitConfig } from '~/searchConfig_avefi';

type FacetCfg = { attribute: string; field: string; type: 'string'|'numeric'; nestedPath?: string }
type SearchAttr = { field: string; weight?: number }

function keywordField(field: string) {
    return field.endsWith('.keyword') ? field : `${field}.keyword`;
}
function fullFieldFacet(f: FacetCfg) {
    const base = keywordField(f.field);
    return f.nestedPath ? `${f.nestedPath}.${base}` : base;
}
function toTypeKey(field: string): string {
    if (field.includes('has_record.has_primary_title.has_name')) return 'title';
    if (field.includes('has_record.has_alternative_title.has_name')) return 'alt_title';
    const leaf = field.split('.').pop() || field;
    return leaf;
}

export default defineEventHandler(async () => {
    const cfg = useRuntimeConfig();
    const host  = cfg.public.ELASTIC_HOST_PUBLIC || cfg.public.ELASTIC_HOST;
    const index = cfg.public.ELASTIC_INDEX;
    if (!host || !index) return { success: false, message: 'Missing ES host/index' };

    const out: {
    facets: Record<string, Array<{ text: string; type: string }>>
    searchAttributes: Record<string, Array<{ text: string; type: string }>>
  } = { facets: {}, searchAttributes: {} };

    // ----- Facets (string only)
    const facetList = (searchkitConfig?.search_settings?.facet_attributes || []) as FacetCfg[];
    for (const f of facetList.filter(x => x.type === 'string')) {
        const field = fullFieldFacet(f);
        const aggs = f.nestedPath
            ? {
                facet_suggestions: {
                    nested: { path: f.nestedPath },
                    aggs: { vals: { terms: { field, size: 50, order: { _count: 'desc' }, min_doc_count: 1 } } }
                }
            }
            : { facet_suggestions: { terms: { field, size: 50, order: { _count: 'desc' }, min_doc_count: 1 } } };

        try {
            const res = await $fetch<any>(`${host}/${encodeURIComponent(index)}/_search`, {
                method: 'POST',
                body: { size: 0, aggs }
            });
            const buckets = f.nestedPath
                ? res?.aggregations?.facet_suggestions?.vals?.buckets || []
                : res?.aggregations?.facet_suggestions?.buckets || [];
            const vals = buckets.map((b: any) => String(b.key || '')).filter(Boolean);
            out.facets[f.attribute] = vals.map((text: string) => ({ text, type: f.attribute }));
            console.log('[cache_top_values] facet:', f.attribute, 'count:', vals.length);
        } catch (e: any) {
            console.error('[cache_top_values] facet error:', f.attribute, e?.message || e);
            out.facets[f.attribute] = [];
        }
    }

    // ----- Search attributes (multi-agg)
    const searchAttrs = (searchkitConfig?.search_settings?.search_attributes || []) as SearchAttr[];
    const aggs: Record<string, any> = {};
    for (const s of searchAttrs) {
        const name = `agg__${s.field.replace(/\./g, '__')}`;
        aggs[name] = { terms: { field: keywordField(s.field), size: 50, order: { _count: 'desc' }, min_doc_count: 1 } };
    }
    try {
        const res = await $fetch<any>(`${host}/${encodeURIComponent(index)}/_search`, {
            method: 'POST',
            body: { size: 0, aggs }
        });
        for (const s of searchAttrs) {
            const name = `agg__${s.field.replace(/\./g, '__')}`;
            const buckets = res?.aggregations?.[name]?.buckets || [];
            const key = toTypeKey(s.field);
            const vals = buckets.map((b: any) => String(b.key || '')).filter(Boolean);
            out.searchAttributes[key] = vals.map((text: string) => ({ text, type: key }));
            console.log('[cache_top_values] searchAttr:', key, 'count:', vals.length);
        }
    } catch (e: any) {
        console.error('[cache_top_values] search_attributes error:', e?.message || e);
    }

    const file = resolve(process.cwd(), 'server', 'data', 'autocomplete_fallbacks.json');
    await fs.mkdir(resolve(process.cwd(), 'server', 'data'), { recursive: true });
    await fs.writeFile(file, JSON.stringify(out, null, 2), 'utf-8');

    return { success: true, facets: Object.keys(out.facets).length, searchAttributes: Object.keys(out.searchAttributes).length, file };
});
