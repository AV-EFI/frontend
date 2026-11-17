import { afterEach, describe, expect, test, vi } from 'vitest';

type SitemapHandler = (event: object) => Promise<string>;

async function renderSitemap(workUrls: Array<{ loc: string; lastmod?: string }>) {
  vi.resetModules();
  const setResponseHeader = vi.fn();
  vi.stubGlobal('defineEventHandler', (handler: SitemapHandler) => handler);
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { siteUrl: 'https://www.av-efi.net/' } }));
  vi.stubGlobal('getSitemapWorkUrls', async () => workUrls);
  vi.stubGlobal('setResponseHeader', setResponseHeader);
  const { default: handler } = await import('~/server/routes/sitemap.xml');
  const xml = await (handler as unknown as SitemapHandler)({});
  return { xml, setResponseHeader };
}

describe('sitemap.xml route', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('lists the public pages and every work as absolute URLs', async () => {
    const { xml, setResponseHeader } = await renderSitemap([
      { loc: '/res/21.11155/AAA', lastmod: '2026-01-05T00:00:00.000Z' },
    ]);

    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
    expect(xml).toContain('<url><loc>https://www.av-efi.net/</loc></url>');
    expect(xml).toContain('<url><loc>https://www.av-efi.net/faq</loc></url>');
    expect(xml).toContain('<url><loc>https://www.av-efi.net/res/21.11155/AAA</loc><lastmod>2026-01-05T00:00:00.000Z</lastmod></url>');
    expect(xml.trimEnd().endsWith('</urlset>')).toBe(true);
    expect(setResponseHeader).toHaveBeenCalledWith({}, 'Content-Type', 'application/xml; charset=utf-8');
  });

  test('escapes query strings so the document stays valid XML', async () => {
    const { xml } = await renderSitemap([]);

    expect(xml).toContain('/search/?has_form=Short&amp;manifestation_event_type=RestorationEvent');
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;|apos;)/);
  });
});
