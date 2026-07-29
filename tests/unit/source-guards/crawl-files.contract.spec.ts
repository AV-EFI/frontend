import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const nuxtConfigSource = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8');
const robotsRouteSource = readFileSync(resolve(process.cwd(), 'server/routes/robots.txt.ts'), 'utf8');
const sitemapSource = readFileSync(resolve(process.cwd(), 'public/sitemap.xml'), 'utf8');

describe('Public crawl files', () => {
  test('exposes the sitemap through Nuxt robots config', () => {
    const robotsStart = nuxtConfigSource.indexOf('robots: {');
    const robotsConfig = nuxtConfigSource.slice(
      robotsStart,
      nuxtConfigSource.indexOf('// Sitemap', robotsStart)
    );

    expect(nuxtConfigSource).toContain("sitemap: [`${publicSiteUrl.replace(/\\/+$/, '')}/sitemap.xml`]");
    expect(robotsConfig).toContain("userAgent: '*'");
    expect(robotsConfig).toContain("allow: '/'");
    expect(robotsConfig).not.toContain("'/_nuxt/**'");
    expect(robotsRouteSource).toContain('Sitemap: ${siteUrl}/sitemap.xml');
    expect(robotsRouteSource).not.toContain('Disallow: /_nuxt');
  });

  test('keeps the sitemap focused on indexable public URLs', () => {
    expect(sitemapSource).toContain('<loc>https://www.av-efi.net/</loc>');
    expect(sitemapSource).toContain('<loc>https://www.av-efi.net/search</loc>');
    expect(sitemapSource).toContain('<loc>https://www.av-efi.net/press</loc>');
    expect(sitemapSource).not.toContain('/protected/');
    expect(sitemapSource).not.toContain('/admin/');
    expect(sitemapSource).not.toContain('/filmrel/');
    expect(sitemapSource).not.toContain('/normdata');
  });
});
