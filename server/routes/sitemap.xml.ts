/*
 * Serves /sitemap.xml: the public pages below plus one URL per work (see server/utils/sitemapWorks.ts).
 * It is a route of its own, like robots.txt, because the deployed build (`yarn build`, build profile
 * `local`) does not include the @nuxtjs/sitemap module.
 */
const PAGE_PATHS = [
  '/',
  '/search',
  '/press',
  '/faq',
  '/accessibility',
  '/imprint',
  '/search/?has_form=Short&manifestation_event_type=RestorationEvent',
  '/search/?has_form=Documentary&subjects=Protest&subjects=Aufstand&subjects=Widerstand&subjects=Streik',
  '/search/?creators=Troller%2C%20Georg%20Stefan',
  '/search/?production=Schlenker%2C%20Hermann&production=Hermann%20Schlenker%20Filmproduktion',
  '/search/?query=Metropolis',
  '/search/?query=Berlin',
];

const XML_ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' };

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => XML_ENTITIES[character] ?? character);
}

export default defineEventHandler(async (event) => {
  const { public: publicConfig } = useRuntimeConfig();
  const siteUrl = String(publicConfig.siteUrl || publicConfig.origin || 'https://www.av-efi.net').replace(/\/+$/, '');
  const entries = [...PAGE_PATHS.map((loc) => ({ loc, lastmod: undefined })), ...await getSitemapWorkUrls()];

  const urls = entries.map(({ loc, lastmod }) => (
    `<url><loc>${escapeXml(`${siteUrl}${loc}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`
  ));

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
});
