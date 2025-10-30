// /server/api/elastic/suggestions.post.ts
import { defineEventHandler, readBody } from 'h3'
import { $fetch } from 'ofetch'
import { config as searchkitConfig } from '~/searchConfig_avefi'

/**
 * One endpoint, two modes:
 *   - { mode: "query",  query?: string, size?: number }
 *   - { mode: "facet",  facetAttr: string, query?: string, size?: number }
 *
 * It pulls:
 *   - search_attributes from searchConfig_avefi for query-suggest
 *   - a FACETS map for facet-suggest (with nestedPath support)
 */

type Req =
  | { mode: 'query'; query?: string; size?: number }
  | { mode: 'facet'; facetAttr: string; query?: string; size?: number }

type SearchAttr = { field: string; weight?: number }

function toTypeKey(field: string): string {
  if (field.includes('has_record.has_primary_title.has_name')) return 'title'
  if (field.includes('has_record.has_alternative_title.has_name')) return 'alt_title'
  const leaf = field.split('.').pop() || field
  return leaf
}
function keywordField(field: string) {
  return field.endsWith('.keyword') ? field : `${field}.keyword`
}

const FACETS: Record<
  string,
  { field: string; type: 'string' | 'numeric'; nestedPaths?: string[] }
> = {
  // ----- Work-level strings -----
  has_genre_has_name: { field: 'has_record.has_genre.has_name.keyword', type: 'string' },
  subjects:            { field: 'subjects.keyword', type: 'string' },
  directors_or_editors:{ field: 'directors_or_editors.keyword', type: 'string' },
  castmembers:         { field: 'castmembers.keyword', type: 'string' },
  production:          { field: 'production.keyword', type: 'string' },
  has_form:            { field: 'has_record.has_form.keyword', type: 'string' },

  // Work-level event locations (nested at root)
  located_in_has_name: {
    field: 'has_record.has_event.located_in.has_name.keyword',
    type: 'string',
    nestedPaths: ['has_record.has_event'],
  },

  // ----- Manifestation-level (nested 1 deep) -----
  //manifestations.has_record.has_event.type.keyword
  manifestation_event_type: {
    field: 'manifestations.has_record.has_event.type.keyword',
    type: 'string',
    nestedPaths: ['manifestations'],
  },
  in_language_code: {
    field: 'manifestations.items.has_record.in_language.code.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_sound_type: {
    field: 'manifestations.has_record.has_sound_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations'],
  },
  has_colour_type_manifestation: {
    field: 'manifestations.has_record.has_colour_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations'],
  },
  has_issuer_name: {
    field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
    type: 'string',
    nestedPaths: ['manifestations'],
  },

  // ----- Item-level (nested 2 deep under manifestations.items) -----
  has_format_type: {
    field: 'manifestations.items.has_record.has_format.type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  item_element_type: {
    field: 'manifestations.items.has_record.element_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_colour_type: {
    field: 'manifestations.items.has_record.has_colour_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_sound_type_item: {
    field: 'manifestations.items.has_record.has_sound_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Req>(event)
  const cfg = useRuntimeConfig()
  const host  = cfg.public.ELASTIC_HOST_PUBLIC || cfg.public.ELASTIC_HOST
  const index = cfg.public.ELASTIC_INDEX
  if (!host || !index) return { success: false, suggestions: [] }

  const size = Number((body as any).size) || 10
  const q = String((body as any).query || '').trim()
  const includeRegex = q ? `${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*` : undefined

  // ---------- MODE: query (from search_attributes) ----------
  if (body.mode === 'query') {
    const searchAttrs = (searchkitConfig?.search_settings?.search_attributes || []) as SearchAttr[]
    if (!searchAttrs.length) return { success: true, suggestions: [] }

    // one terms agg per search field
    const aggs: Record<string, any> = {}
    for (const attr of searchAttrs) {
      const field = keywordField(attr.field)
      aggs[`agg__${attr.field.replace(/\./g, '__')}`] = {
        terms: {
          field,
          size,
          order: { _count: 'desc' },
          min_doc_count: 1,
          ...(includeRegex ? { include: includeRegex } : {})
        }
      }
    }

    try {
      const url = `${host}/${encodeURIComponent(index)}/_search`
      const res = await $fetch<any>(url, { method: 'POST', body: { size: 0, aggs } })
      
      console.log('suggestions res: ', res);

      const suggestions: Array<{ text: string; type: string }> = []
      for (const attr of searchAttrs) {
        const name = `agg__${attr.field.replace(/\./g, '__')}`
        const buckets = res?.aggregations?.[name]?.buckets || []
        const type = toTypeKey(attr.field)
        for (const b of buckets) {
          const key = String(b?.key ?? '')
          if (!key) continue
          suggestions.push({ text: key, type })
        }
      }

      // de-dup by (text,type)
      const seen = new Set<string>()
      const deduped = suggestions.filter(s => {
        const k = `${s.type}::${s.text}`
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      return { success: true, suggestions: deduped.slice(0, 50) }
    } catch (err: any) {
      console.error('[suggestions:query] ERROR', err?.data || err?.message || err)
      return { success: false, suggestions: [] }
    }
  }

  // ---------- MODE: facet ----------
  if (body.mode === 'facet') {
    const facetAttr = body.facetAttr
    const def = FACETS[facetAttr]
    if (!def) return { success: true, suggestions: [] }
    if (def.type !== 'string') return { success: true, suggestions: [] }

    const terms = {
      field: def.field,
      size,
      order: { _count: 'desc' },
      min_doc_count: 1,
      ...(includeRegex ? { include: includeRegex } : {})
    }

    // Build nested chain if needed
    let aggs: any = { facet_suggestions: { terms } }
    if (def.nestedPaths?.length) {
      // wrap deepest to top: lvlN { nested }, aggs { lvl(N-1) { nested } ... facet_suggestions }
      for (let i = def.nestedPaths.length - 1; i >= 0; i--) {
        const path = def.nestedPaths[i]
        aggs = { [`lvl${i + 1}`]: { nested: { path }, aggs } }
      }
    }

    const esBody = { size: 0, aggs }

    try {
      const url = `${host}/${encodeURIComponent(index)}/_search`
      const res = await $fetch<any>(url, { method: 'POST', body: esBody })

      // descend to buckets
      let node = res?.aggregations
      if (def.nestedPaths?.length) {
        for (let i = 1; i <= def.nestedPaths.length; i++) node = node?.[`lvl${i}`]
      }
      const buckets = node?.facet_suggestions?.buckets || []
      const suggestions = buckets.map((b: any) => ({ text: b.key, type: facetAttr }))

      return { success: true, suggestions, count: suggestions.length }
    } catch (err: any) {
      console.error('[suggestions:facet] ERROR', err?.status, err?.message || err)
      return { success: false, suggestions: [], count: 0 }
    }
  }

  return { success: true, suggestions: [] }
})
