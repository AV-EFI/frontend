#!/usr/bin/env ts-node
/**
 * scripts/generate-query-suggestions.ts
 *
 * Run once to generate a static list of the most common query suggestions
 * (for empty query input). The output can be imported by the frontend to
 * show initial suggestions without hitting the /elastic/suggestions endpoint.
 *
 * Usage:
 *   ELASTIC_HOST="https://..." ELASTIC_INDEX="index-name" ts-node scripts/generate-query-suggestions.ts
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { $fetch } from 'ofetch'
// Adjust this import path if your searchConfig_avefi lives elsewhere:
import { config as searchkitConfig } from '../searchConfig_avefi'

type SearchAttr = { field: string; weight?: number }

type Suggestion = {
  text: string
  type: string
  docCount: number
}

/**
 * Same helpers as in /server/api/elastic/suggestions.post.ts
 */
function toTypeKey(field: string): string {
  if (field.includes('has_record.has_primary_title.has_name')) return 'title'
  if (field.includes('has_record.has_alternative_title.has_name')) return 'alt_title'
  const leaf = field.split('.').pop() || field
  return leaf
}

function keywordField(field: string): string {
  return field.endsWith('.keyword') ? field : `${field}.keyword`
}

async function main() {
  const host =
    process.env.ELASTIC_HOST_PUBLIC ||
    process.env.ELASTIC_HOST

  const index = process.env.ELASTIC_INDEX

  if (!host || !index) {
    console.error(
      '[generate-query-suggestions] ERROR: ELASTIC_HOST / ELASTIC_HOST_PUBLIC and ELASTIC_INDEX must be set in env.'
    )
    process.exit(1)
  }

  const searchAttrs = (searchkitConfig?.search_settings?.search_attributes || []) as SearchAttr[]
  if (!searchAttrs.length) {
    console.error('[generate-query-suggestions] No search_attributes found in searchConfig_avefi.')
    process.exit(1)
  }

  // Per-field agg size and global max suggestions
  const aggSize = Number(process.env.SUGGESTION_AGG_SIZE || 20)
  const maxSuggestions = Number(process.env.SUGGESTION_LIMIT || 100)

  // Build ES aggregations: one terms agg per search field
  const aggs: Record<string, any> = {}
  for (const attr of searchAttrs) {
    const field = keywordField(attr.field)
    const aggName = `agg__${attr.field.replace(/\./g, '__')}`
    aggs[aggName] = {
      terms: {
        field,
        size: aggSize,
        order: { _count: 'desc' },
        min_doc_count: 1,
      },
    }
  }

  const esBody = {
    size: 0,
    aggs,
  }

  console.log('[generate-query-suggestions] Requesting aggregations from Elasticsearch…')
  const url = `${host}/${encodeURIComponent(index)}/_search`

  let res: any
  try {
    res = await $fetch<any>(url, {
      method: 'POST',
      body: esBody,
    })
  } catch (err: any) {
    console.error(
      '[generate-query-suggestions] ERROR while calling Elasticsearch:',
      err?.data || err?.message || err
    )
    process.exit(1)
  }

  const rawSuggestions: Suggestion[] = []

  for (const attr of searchAttrs) {
    const aggName = `agg__${attr.field.replace(/\./g, '__')}`
    const buckets = res?.aggregations?.[aggName]?.buckets || []
    const type = toTypeKey(attr.field)

    for (const bucket of buckets) {
      const key = String(bucket?.key ?? '')
      const docCount = Number(bucket?.doc_count ?? 0)
      if (!key || !docCount) continue

      rawSuggestions.push({
        text: key,
        type,
        docCount,
      })
    }
  }

  if (!rawSuggestions.length) {
    console.warn('[generate-query-suggestions] No buckets returned, nothing to write.')
    process.exit(0)
  }

  // De-duplicate suggestions by (type, text) and combine docCount
  const byKey = new Map<string, Suggestion>()

  for (const s of rawSuggestions) {
    const k = `${s.type}::${s.text}`
    const existing = byKey.get(k)
    if (existing) {
      existing.docCount += s.docCount
    } else {
      byKey.set(k, { ...s })
    }
  }

  // Sort globally by docCount (desc)
  const mergedSuggestions = Array.from(byKey.values()).sort(
    (a, b) => b.docCount - a.docCount
  )

  // Cut to maxSuggestions
  const topSuggestions = mergedSuggestions.slice(0, maxSuggestions)

  // Decide on output path (adjust if you prefer a different location)
  const outDir = path.resolve(process.cwd(), 'assets', 'data')
  const outFile = path.join(outDir, 'default-query-suggestions.json')

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  fs.writeFileSync(outFile, JSON.stringify(topSuggestions, null, 2), 'utf8')

  console.log(
    `[generate-query-suggestions] Wrote ${topSuggestions.length} suggestions to ${outFile}`
  )
}

main().catch((err) => {
  console.error('[generate-query-suggestions] Unhandled ERROR:', err)
  process.exit(1)
})
