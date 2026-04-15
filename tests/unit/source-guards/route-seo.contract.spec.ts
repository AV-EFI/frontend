import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const appSource = readFileSync(resolve(process.cwd(), 'app.vue'), 'utf8');
const searchSource = readFileSync(resolve(process.cwd(), 'pages/search/index.vue'), 'utf8');
const detailSource = readFileSync(
  resolve(process.cwd(), 'pages/res/[prefix]/[id].vue'),
  'utf8'
);

describe('Route and SEO contract guards', () => {
  test('BB-APP-001 keeps global canonical and schema graph mount points', () => {
    expect(appSource).toContain('useSchemaOrg([');
    expect(appSource).toContain("{ rel: 'canonical', href: siteUrl.value }");
  });

  test('BB-SEARCH-001 keeps search canonical and robots directives logic', () => {
    expect(searchSource).toContain('normalizeQueryToParams');
    expect(searchSource).toContain("return hasIndexableParams.value ? 'index,follow' : 'noindex,follow'");
    expect(searchSource).toContain("{ rel: 'canonical', href: canonicalUrl.value }");
  });

  test('BB-DETAIL-001 keeps route-based canonical for /res/:prefix/:id', () => {
    expect(detailSource).toContain('const canonical = computed(() => `${siteUrl.value}/res/${prefix.value}/${id.value}`)');
    expect(detailSource).toContain("useHead({");
    expect(detailSource).toContain("link: [{ rel: 'canonical', href: canonical.value }]");
  });

  test('BB-DETAIL-002 keeps resource-type branching for detail rendering', () => {
    expect(detailSource).toContain('resourceType');
    expect(detailSource).toContain("resourceType = 'manifestationOrItem'");
    expect(detailSource).toContain("resourceType = 'compilationManifestation'");
    expect(detailSource).toContain("resourceType = 'compilationItem'");
  });
});
