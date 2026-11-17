import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const nuxtConfigSource = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8');
const robotsRouteSource = readFileSync(resolve(process.cwd(), 'server/routes/robots.txt.ts'), 'utf8');
const botGuardSource = readFileSync(resolve(process.cwd(), 'server/middleware/bot-guard.ts'), 'utf8');
const openSearchRouteSource = readFileSync(resolve(process.cwd(), 'server/routes/opensearch.xml.ts'), 'utf8');

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

  test('advertises an OpenSearch description that targets the public search page', () => {
    expect(nuxtConfigSource).toContain("{ rel: 'search', type: 'application/opensearchdescription+xml', title: 'AVefi', href: '/opensearch.xml' }");
    expect(openSearchRouteSource).toContain('template="${siteUrl}/search?query={searchTerms}"');
    expect(openSearchRouteSource).toContain("'Content-Type', 'application/opensearchdescription+xml; charset=utf-8'");
  });

  test('keeps the sitemap focused on indexable public URLs and lists every work', () => {
    const sitemapConfig = nuxtConfigSource.slice(
      nuxtConfigSource.indexOf('  sitemap: {'),
      nuxtConfigSource.indexOf('  nuxt3WinstonLog: {')
    );
    const urlList = sitemapConfig.slice(sitemapConfig.indexOf('urls: ['), sitemapConfig.indexOf('exclude: ['));
    const excludeList = sitemapConfig.slice(sitemapConfig.indexOf('exclude: ['));

    expect(existsSync(resolve(process.cwd(), 'public/sitemap.xml'))).toBe(false);
    expect(sitemapConfig).toContain('zeroRuntime: false');
    expect(sitemapConfig).toContain("sources: [['/api/__sitemap__/works', { timeout: 120_000 }]]");
    expect(urlList).toContain("'/search'");
    expect(urlList).toContain("'/press'");
    expect(urlList).not.toContain("'/contact'");
    expect(urlList).not.toContain("'/res'");
    for (const privatePath of ['/protected/**', '/admin/**', '/filmrel/**', '/normdata']) {
      expect(excludeList).toContain(`'${privatePath}'`);
    }
    expect(botGuardSource).toContain("path.startsWith('/api/__sitemap__/')");
  });
});
