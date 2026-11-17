// Scheduled in nuxt.config.ts (`nitro.scheduledTasks`) to rebuild the sitemap's work URLs at night.
export default defineTask({
  meta: {
    name: 'sitemap:works',
    description: 'Rebuild the list of work URLs for the sitemap',
  },
  async run() {
    const urls = await rebuildSitemapWorkUrls();
    return { result: { workUrls: urls.length } };
  },
});
