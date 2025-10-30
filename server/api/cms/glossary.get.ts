// server/api/cms/glossary.get.ts
import { useServerGlossary } from '~/server/utils/useServerGlossary'

export default defineEventHandler(async () => {
  return await useServerGlossary()
})
