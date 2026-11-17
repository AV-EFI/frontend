// The stored list of work URLs lives in memory, so it is built right after the server starts. That way
// the first sitemap request after a deploy does not wait about a minute. Skipped in development to keep
// restarts fast.
export default defineNitroPlugin(() => {
  if (import.meta.dev || import.meta.prerender) return;
  rebuildSitemapWorkUrls().catch((error: unknown) => {
    console.error('[sitemap] building the list of work URLs failed', error);
  });
});
