// Builds the list of work URLs right after the server starts, so the first sitemap request does not
// wait about a minute for it. Skipped in development to keep restarts fast.
export default defineNitroPlugin(() => {
  if (import.meta.dev || import.meta.prerender) return;
  getSitemapWorkUrls().catch((error: unknown) => {
    console.error('[sitemap] building the list of work URLs failed', error);
  });
});
