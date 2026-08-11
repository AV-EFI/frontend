import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const appSource = readFileSync(resolve(process.cwd(), 'app.vue'), 'utf8');
const searchSource = readFileSync(resolve(process.cwd(), 'pages/search/index.vue'), 'utf8');
const detailSource = readFileSync(
  resolve(process.cwd(), 'pages/res/[prefix]/[id].vue'),
  'utf8'
);
const filmrelSource = readFileSync(
  resolve(process.cwd(), 'pages/filmrel/[prefix]/[id].vue'),
  'utf8'
);
const nuxtConfigSource = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8');
const botGuardSource = readFileSync(resolve(process.cwd(), 'server/middleware/bot-guard.ts'), 'utf8');
const manifestationViewSource = readFileSync(
  resolve(process.cwd(), 'components/views/ManifestationViewCompAVefi.vue'),
  'utf8'
);
const itemListSource = readFileSync(
  resolve(process.cwd(), 'components/detail/ItemListNewComp.vue'),
  'utf8'
);

describe('Route and SEO contract guards', () => {
  test('BB-APP-001 keeps global canonical and schema graph mount points', () => {
    expect(appSource).toContain('useSchemaOrg([');
    expect(appSource).toContain("{ rel: 'canonical', href: siteUrl.value }");
  });

  test('BB-APP-002 keeps the document language synchronized with i18n locale', () => {
    expect(appSource).toContain('htmlAttrs:');
    expect(appSource).toContain("lang: locale.value === 'en' ? 'en' : 'de'");
  });

  test('BB-SEARCH-001 keeps search canonical and robots directives logic', () => {
    expect(searchSource).toContain('normalizeQueryToParams');
    expect(searchSource).toContain("return hasIndexableParams.value ? 'index,follow' : 'noindex,follow'");
    expect(searchSource).toContain("{ rel: 'canonical', href: canonicalUrl.value }");
  });

  test('BB-DETAIL-001 keeps route-based canonical for /res/:prefix/:id', () => {
    expect(detailSource).toContain('const routeCanonical = computed(() => `${routeSiteUrl.value}/res/${prefix.value}/${id.value}`)');
    expect(detailSource).toContain("useHead(() => ({");
    expect(detailSource).toContain("link: [{ key: 'canonical', rel: 'canonical', href: routeCanonical.value }]");
    expect(detailSource.indexOf('href: routeCanonical.value')).toBeLessThan(
      detailSource.indexOf('await useAsyncData')
    );
  });

  test('BB-DETAIL-002 keeps resource-type branching for detail rendering', () => {
    expect(detailSource).toContain('resourceType');
    expect(detailSource).toContain("resourceType = 'manifestationOrItem'");
    expect(detailSource).toContain("resourceType = 'compilationManifestation'");
    expect(detailSource).toContain("resourceType = 'compilationItem'");
  });

  test('BB-DETAIL-003 logs server-side detail fetch failures with resolved URL context', () => {
    expect(detailSource).toContain("console.error('[detail-fetch:error]'");
    expect(detailSource).toContain('elasticApiBase: config.public.elasticApiBase');
    expect(detailSource).toContain('getWork: config.public.AVEFI_GET_WORK');
    expect(detailSource).toContain('throw fetchError');
  });

  test('BB-DETAIL-004 keeps runtime config reads out of the detail route template', () => {
    expect(detailSource).toContain("const copyPidUrl = computed(() => String(config.public.AVEFI_COPY_PID_URL ?? ''))");
    expect(detailSource).not.toContain('useRuntimeConfig().public.AVEFI_COPY_PID_URL');
    expect(manifestationViewSource).not.toContain('useRuntimeConfig().public.AVEFI_COPY_PID_URL');
    expect(itemListSource).not.toContain('useRuntimeConfig().public.AVEFI_COPY_PID_URL');
  });

  test('BB-DETAIL-005 keeps raw data disclosure prominent and shared across detail routes', () => {
    expect(detailSource).toContain('<GlobalRawDataViewer');
    expect(detailSource).not.toContain('class="card collapse lg:max-w-4/5 mx-auto mt-4"');
    expect(filmrelSource).toContain('<GlobalRawDataViewer');
    expect(filmrelSource).not.toContain('class="card collapse lg:max-w-4/5 mx-auto mt-4"');
  });

  test('BB-FILMREL-SEO-001 keeps /filmrel pages out of indexing and schema output', () => {
    expect(nuxtConfigSource).toContain("'/filmrel/**': { ssr: true, prerender: false, headers: { 'X-Robots-Tag': 'noindex, follow, noarchive' } }");
    expect(nuxtConfigSource).toContain("'/filmrel/**'");
    expect(filmrelSource).toContain("{ key: 'robots', name: 'robots', content: 'noindex, follow, noarchive' }");
    expect(filmrelSource).toContain("{ key: 'googlebot', name: 'googlebot', content: 'noindex, follow, noarchive' }");
    expect(filmrelSource).toContain('const exposeSchemaOrg = false');
    expect(filmrelSource).toContain('if (!exposeSchemaOrg) return []');
  });

  test('BB-BOT-SEO-001 keeps Microsoft search crawlers allowlisted', () => {
    for (const crawler of ['Bingbot', 'msnbot', 'BingPreview', 'BingVideoPreview', 'MicrosoftPreview', 'AdIdxBot']) {
      expect(nuxtConfigSource).toContain(crawler);
      expect(botGuardSource).toContain(crawler);
    }
    expect(botGuardSource).toContain('bingpreview|bingvideopreview|microsoftpreview');
  });

  test('BB-BOT-SEO-002 keeps link previews allowed without defaulting to training crawlers', () => {
    for (const crawler of ['Twitterbot', 'facebookexternalhit', 'LinkedInBot', 'Slackbot', 'TeamsBot']) {
      expect(nuxtConfigSource).toContain(crawler);
      expect(botGuardSource).toContain(crawler);
    }
    expect(botGuardSource).toContain('facebookexternalhit|linkedinbot|slackbot|teamsbot|twitterbot');
    expect(nuxtConfigSource).not.toContain('GPTBot');
    expect(botGuardSource).not.toContain("'GPTBot'");
  });
});
