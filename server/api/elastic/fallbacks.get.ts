// /server/api/elastic/fallbacks.get.ts
import { defineEventHandler } from 'h3'
import { promises as fs } from 'fs'
import { resolve } from 'pathe'

export default defineEventHandler(async () => {
  const file = resolve(process.cwd(), 'server', 'data', 'autocomplete_fallbacks.json')
  try {
    const json = await fs.readFile(file, 'utf-8')
    return { success: true, data: JSON.parse(json) }
  } catch {
    return { success: true, data: { facets: {}, searchAttributes: {} } }
  }
})
