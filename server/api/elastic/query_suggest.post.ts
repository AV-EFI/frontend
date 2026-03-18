// /server/api/elastic/query_suggest.post.ts
import { defineEventHandler, readBody } from 'h3';
import { $fetch } from 'ofetch';
import { config as searchkitConfig } from '~/searchConfig_avefi';
import { getElasticsearchNode } from '../../utils/elasticsearchRuntime';

type SearchAttr = { field: string; weight?: number }
type Req = { query?: string; size?: number }

function toTypeKey(field: string): string {
  if (field.includes('has_record.has_primary_title.has_name')) return 'title';
  if (field.includes('has_record.has_alternative_title.has_name')) return 'alt_title';
  // leaf names map straight through for your existing icons/translations
  const leaf = field.split('.').pop() || field;
  return leaf;
}

function keywordField(field: string) {
  return field.endsWith('.keyword') ? field : `${field}.keyword`;
}

function matchesQueryCaseInsensitive(value: unknown, query: string) {
  if (!query) return true;
  if (typeof value !== 'string') return false;
  return value.toLowerCase().includes(query.toLowerCase());
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Req>(event);
  const q = String(body.query || '').trim();
  const size = Number(body.size) || 10;

  const cfg = useRuntimeConfig();
  const host = getElasticsearchNode();
  const index = cfg.public.ELASTIC_INDEX;
  if (!host || !index) return { success: false, suggestions: [] };

  const searchAttrs = (searchkitConfig?.search_settings?.search_attributes || []) as SearchAttr[];
  if (!searchAttrs.length) return { success: true, suggestions: [] };

  // Build multi-aggs — one terms agg per search field
  const aggs: Record<string, any> = {};
  const aggSize = q ? Math.max(size * 10, 100) : size;

  for (const attr of searchAttrs) {
    const field = keywordField(attr.field);
    const name  = `agg__${attr.field.replace(/\./g, '__')}`;
    aggs[name] = {
      terms: {
        field,
        size: aggSize,
        order: { _count: 'desc' },
        min_doc_count: 1
      }
    };
  }

  const esBody = { size: 0, aggs };

  try {
    const url = `${host}/${encodeURIComponent(index)}/_search`;
    const res = await $fetch<any>(url, { method: 'POST', body: esBody });

    const suggestions: Array<{ text: string; type: string }> = [];
    for (const attr of searchAttrs) {
      const name = `agg__${attr.field.replace(/\./g, '__')}`;
      const buckets = res?.aggregations?.[name]?.buckets || [];
      const type = toTypeKey(attr.field);
      for (const b of buckets) {
        const key = String(b?.key ?? '');
        if (!key) continue;
        suggestions.push({ text: key, type });
      }
    }

    // De-dup by (text,type) while preserving order
    const seen = new Set<string>();
    const deduped = suggestions.filter(s => {
      const k = `${s.type}::${s.text}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    return {
      success: true,
      suggestions: deduped
        .filter((entry) => matchesQueryCaseInsensitive(entry.text, q))
        .slice(0, 50)
    };
  } catch (err: any) {
    console.error('[query_suggest] ERROR', err?.data || err?.message || err);
    return { success: false, suggestions: [] };
  }
});
