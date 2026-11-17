// Dynamic source of the sitemap module (nuxt.config.ts `sitemap.sources`): one URL per work.
export default defineEventHandler(() => getSitemapWorkUrls());
