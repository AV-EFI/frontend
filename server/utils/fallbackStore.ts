import { promises as fs } from 'fs'
import { resolve, dirname } from 'path'

type FallbackShape = {
  query: Record<string, string[]>
  facets: Record<string, string[]>
}

const fallbackPath = resolve(process.cwd(), 'server', 'data', 'autocomplete_fallbacks.json')

async function ensureDirExists(filePath: string) {
  await fs.mkdir(dirname(filePath), { recursive: true })
}

async function readJSONSafe<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const buf = await fs.readFile(filePath, 'utf8')
    return JSON.parse(buf) as T
  } catch {
    return fallback
  }
}

async function writeJSONAtomic(filePath: string, data: any) {
  const tmp = `${filePath}.tmp`
  await ensureDirExists(filePath)
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, filePath)
}

export async function getFallbacks(): Promise<FallbackShape> {
  await ensureDirExists(fallbackPath)
  // create minimal file if missing
  try { await fs.access(fallbackPath) } catch {
    await writeJSONAtomic(fallbackPath, { query: {}, facets: {} })
  }
  return readJSONSafe<FallbackShape>(fallbackPath, { query: {}, facets: {} })
}

export async function mergeQueryFallback(field: string, values: string[]) {
  const data = await getFallbacks()
  data.query[field] = uniqueLimit(values, 50)
  await writeJSONAtomic(fallbackPath, data)
}

export async function mergeFacetFallback(attrOrField: string, values: string[]) {
  const data = await getFallbacks()
  data.facets[attrOrField] = uniqueLimit(values, 50)
  await writeJSONAtomic(fallbackPath, data)
}

export function uniqueLimit(arr: string[], limit: number) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of arr) {
    const s = String(v)
    if (!s) continue
    if (seen.has(s)) continue
    seen.add(s)
    out.push(s)
    if (out.length >= limit) break
  }
  return out
}
