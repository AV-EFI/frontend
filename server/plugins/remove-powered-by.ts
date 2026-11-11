import { removeResponseHeader } from 'h3';

// Nuxt sets `x-powered-by: Nuxt` on rendered pages, which tells visitors which technology runs the site.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    if (response.headers) {
      delete response.headers['x-powered-by'];
    }
    // Streamed responses set the header on the event before this hook runs.
    removeResponseHeader(event, 'x-powered-by');
  });
});
