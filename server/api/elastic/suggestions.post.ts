// /server/api/elastic/suggestions.post.ts
import { defineEventHandler, readBody } from 'h3'
import { $fetch } from 'ofetch'

/**
 * Exact facet map:
 * - field: full ES field path (include .keyword for string terms)
 * - type: 'string' | 'numeric' (we only aggregate suggestions for string)
 * - nestedPaths: [] | ['manifestations'] | ['manifestations','manifestations.items'] | ['has_record.has_event']
 */
const FACETS: Record<
  string,
  { field: string; type: 'string' | 'numeric'; nestedPaths?: string[] }
> = {
  // ----- Work-level strings (root doc) -----
  has_genre_has_name: { field: 'has_record.has_genre.has_name.keyword', type: 'string' },
  subjects:            { field: 'subjects.keyword', type: 'string' },
  directors_or_editors:{ field: 'directors_or_editors.keyword', type: 'string' },
  castmembers:         { field: 'castmembers.keyword', type: 'string' },
  production:          { field: 'production.keyword', type: 'string' },
  has_form:            { field: 'has_record.has_form.keyword', type: 'string' },

  // Work-level event locations (NESTED at root: has_record.has_event)
  located_in_has_name: {
    field: 'has_record.has_event.located_in.has_name.keyword',
    type: 'string',
    nestedPaths: ['has_record.has_event'],
  },

  // ----- Manifestation-level (nested 1 deep) -----
  manifestation_event_type: {
    field: 'manifestations.has_record.has_event.type.keyword',
    type: 'string',
    nestedPaths: ['manifestations'],
  },
  has_issuer_name: {
    field: 'manifestations.has_record.described_by.has_issuer_name.keyword',
    type: 'string',
    nestedPaths: ['manifestations'],
  },

  // ----- Item-level (nested inside manifestations.items → 2-level nested) -----
  has_format_type: {
    field: 'manifestations.items.has_record.has_format.type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_colour_type: {
    field: 'manifestations.items.has_record.has_colour_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_sound_type: {
    field: 'manifestations.items.has_record.has_sound_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  in_language_code: {
    field: 'manifestations.items.has_record.in_language.code.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_duration_has_value: {
    field: 'manifestations.items.has_record.has_duration.has_value.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_extent_has_value: {
    field: 'manifestations.items.has_record.has_extent.has_value.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  item_element_type: {
    field: 'manifestations.items.has_record.element_type.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },
  has_access_status: {
    field: 'manifestations.items.has_access_status.keyword',
    type: 'string',
    nestedPaths: ['manifestations', 'manifestations.items'],
  },

  // ----- Numeric (we don’t return suggestions for these) -----
  production_year_start:   { field: 'production_in_year.lte', type: 'numeric' },
  production_year_end:     { field: 'production_in_year.gte', type: 'numeric' },
  item_duration_in_minutes:{ field: 'manifestations.items.duration_in_minutes', type: 'numeric', nestedPaths: ['manifestations','manifestations.items'] },
}

const esc = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

/** Build nested aggregation tree based on nestedPaths array */
function buildAggTree(field: string, size: number, include?: string, nestedPaths?: string[]) {
  const termsAgg = {
    terms: {
      field,
      size,
      order: { _count: 'desc' as const },
      min_doc_count: 1,
      ...(include ? { include } : {})
    }
  }

  if (!nestedPaths || nestedPaths.length === 0) {
    return { aggs: { facet_suggestions: termsAgg } }
  }

  // Build bottom-up
  let current: any = { facet_suggestions: termsAgg }
  for (let i = nestedPaths.length - 1; i >= 0; i--) {
    current = {
      lvl: {
        nested: { path: nestedPaths[i] },
        aggs: current
      }
    }
  }
  // rename lvls to stable keys
  const renameLevels = (node: any, depth = 1): any => {
    const [[key, val]] = Object.entries(node)
    const k = `lvl${depth}`
    const aggs = val.aggs ? renameLevels(val.aggs, depth + 1) : val.aggs
    return { [k]: { nested: val.nested, aggs } }
  }
  return { aggs: renameLevels(current) }
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) || {}
  const facetAttr: string = body.facetAttr || body.facet || ''
  const query: string = (body.query || '').toString()
  const size: number = Math.max(1, Math.min(1000, Number(body.size || 10)))

  const rc = useRuntimeConfig()
  const elasticHost = rc.public.ELASTIC_HOST_PUBLIC || rc.public.ELASTIC_HOST
  const index = rc.public.ELASTIC_INDEX

  const def = FACETS[facetAttr]
  if (!def) {
    console.error('[suggestions] UNKNOWN facetAttr:', facetAttr)
    return { success: false, suggestions: [], count: 0, message: `Unknown facetAttr: ${facetAttr}` }
  }
  if (def.type !== 'string') {
    // Don’t suggest numeric ranges
    return { success: true, suggestions: [], count: 0 }
  }

  const include = query ? `${esc(query)}.*` : undefined
  const { aggs } = buildAggTree(def.field, size, include, def.nestedPaths)
  const esBody = { size: 0, aggs }

  // Logging
  console.log('[suggestions] MODE: facet | ATTR:', facetAttr)
  console.log('[suggestions] FIELD:', def.field)
  console.log('[suggestions] NESTED_PATHS:', def.nestedPaths || [])
  // console.log('[suggestions] ES_BODY:', JSON.stringify(esBody, null, 2))

  try {
    const url = `${elasticHost}/${index}/_search`
    const res = await $fetch<any>(url, { method: 'POST', body: esBody })

    // Walk down to the facet_suggestions buckets regardless of nesting depth
    let node = res?.aggregations
    if (def.nestedPaths?.length) {
      for (let i = 1; i <= def.nestedPaths.length; i++) {
        node = node?.[`lvl${i}`]
      }
    }
    const buckets = node?.facet_suggestions?.buckets || []
    const suggestions = buckets.map((b: any) => ({ text: b.key, type: facetAttr }))

    console.log('[suggestions] COUNT:', suggestions.length, 'PREVIEW:', suggestions.slice(0, 5))
    return { success: true, suggestions, count: suggestions.length }
  } catch (err: any) {
    console.error('[suggestions] ERROR', err?.status, err?.message || err)
    return { success: false, suggestions: [], count: 0, message: err?.message || String(err) }
  }
})
