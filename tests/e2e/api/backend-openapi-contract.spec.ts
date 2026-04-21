import { expect, test } from '@playwright/test';
import { validateWorkVariantSourceFromSearchHit, validateWorkVariantSourceStrict } from '../utils/elastic-contracts';

const BACKEND_BASE = process.env.E2E_BACKEND_BASE || 'https://www.av-efi.net/rest/v1';
const OPENAPI_URL = `${BACKEND_BASE}/openapi.json`;
const SEARCH_URL = `${BACKEND_BASE}/frontend/search`;
const VIEW_URL = `${BACKEND_BASE}/frontend/view`;

const STABLE_DETAIL_IDS = [
  'A37FAC2F-2527-4DFE-94FB-5C18D2569406',
  'D8231D2F-3F17-4917-A242-02844AA83C88',
] as const;

const SEARCH_RESULT_REQUIRED_KEYS = [
  'appliedRules',
  'exhaustive',
  'hitsPerPage',
  'processingTimeMS',
  'nbHits',
  'nbWorks',
  'page',
  'nbPages',
  'query',
  'renderingContent',
  'facets',
  'facets_stats',
  'hits',
  'index',
  'params',
] as const;

const SITEMAP_SEARCH_LOCS = [
  '/search/?has_form=Short&manifestation_event_type=RestorationEvent',
  '/search/?has_form=Documentary&subjects=Protest&subjects=Aufstand&subjects=Widerstand&subjects=Streik',
  '/search/?directors_or_editors=Troller%2C%20Georg%20Stefan',
  '/search/?production=Schlenker%2C%20Hermann&production=Hermann%20Schlenker%20Filmproduktion',
  '/search/?query=Metropolis',
  '/search/?query=Berlin',
  '/search/?query=Cabinet%20des%20Dr%20Caligari',
  '/search/?query=Berlin%20Alexanderplatz',
  '/search/?query=Solo%20Sunny',
  '/search/?has_form%5B0%5D=HomeMovie',
  '/search/?has_form%5B0%5D=Short',
  '/search/?production%5B0%5D=Schlenker%2C%20Hermann&production%5B1%5D=Hermann%20Schlenker%20Filmproduktion&production%5B2%5D=Hermann%20Schlenker',
  '/search/?subjects=Krieg',
  '/search/?subjects=Berlin',
  '/search/?subjects=Amateurfilm',
  '/search/?subjects=Familie',
  '/search/?subjects=Arbeit',
  '/search/?manifestation_event_type%5B0%5D=RestorationEvent',
  '/search/?manifestation_event_type%5B0%5D=TheatricalDistributionEvent',
  '/search/?directors_or_editors%5B0%5D=Nekes%2C%20Werner',
  '/search/?directors_or_editors%5B0%5D=Wildenhahn%2C%20Klaus',
  '/search/?directors_or_editors%5B0%5D=Nestler%2C%20Peter',
  '/search/?directors_or_editors%5B0%5D=Nickel%2C%20Gitta',
] as const;

const SEARCH_VARIANTS: Array<{ name: string; params: Record<string, unknown> }> = [
  {
    name: 'plain-query',
    params: { query: 'Berlin', page: 0, hitsPerPage: 5, facetFilters: [] },
  },
  {
    name: 'facet-subjects',
    params: {
      query: '',
      page: 0,
      hitsPerPage: 5,
      facetFilters: [['subjects:Berlin']],
      facets: ['subjects', 'has_form'],
    },
  },
  {
    name: 'facet-production',
    params: {
      query: '',
      page: 0,
      hitsPerPage: 5,
      facetFilters: [['production:Schlenker, Hermann']],
      facets: ['production'],
    },
  },
];

type SearchHit = Record<string, unknown>;

type SearchResultContract = {
  appliedRules: unknown[];
  exhaustive: {
    facetsCount: boolean;
    nbHits: boolean;
    typo: boolean;
  };
  hitsPerPage: number;
  processingTimeMS: number;
  nbHits: number;
  nbWorks: number;
  page: number;
  nbPages: number;
  query: string;
  renderingContent: Record<string, unknown>;
  facets: Record<string, unknown>;
  facets_stats: Record<string, unknown>;
  hits: SearchHit[];
  index: string;
  params: string;
};

function normalizeFacetKey(key: string): string {
  return key.replace(/\[\d+\]$/, '');
}

function searchParamsFromLoc(loc: string): Record<string, unknown> {
  const params = new URL(loc, 'https://www.av-efi.net').searchParams;
  const query = params.get('query') ?? '';
  const grouped = new Map<string, string[]>();
  const facets = new Set<string>();

  for (const [rawKey, value] of params.entries()) {
    if (rawKey === 'query') continue;
    const key = normalizeFacetKey(rawKey);
    const arr = grouped.get(key) ?? [];
    arr.push(`${key}:${value}`);
    grouped.set(key, arr);
    facets.add(key);
  }

  const facetFilters = Array.from(grouped.values());

  return {
    query,
    page: 0,
    hitsPerPage: 10,
    facetFilters,
    facets: Array.from(facets),
  };
}

function assertSearchResultContract(result: unknown, variantName: string) {
  expect(typeof result).toBe('object');
  expect(result).toBeTruthy();
  const typedResult = result as SearchResultContract;

  for (const key of SEARCH_RESULT_REQUIRED_KEYS) {
    expect(Object.prototype.hasOwnProperty.call(typedResult, key), `[${variantName}] Missing SearchResult key: ${key}`).toBe(
      true,
    );
  }

  expect(Array.isArray(typedResult.appliedRules)).toBe(true);
  expect(typeof typedResult.exhaustive).toBe('object');
  expect(typeof typedResult.exhaustive.facetsCount).toBe('boolean');
  expect(typeof typedResult.exhaustive.nbHits).toBe('boolean');
  expect(typeof typedResult.exhaustive.typo).toBe('boolean');
  expect(typeof typedResult.hitsPerPage).toBe('number');
  expect(typeof typedResult.processingTimeMS).toBe('number');
  expect(typeof typedResult.nbHits).toBe('number');
  expect(typeof typedResult.nbWorks).toBe('number');
  expect(typeof typedResult.page).toBe('number');
  expect(typeof typedResult.nbPages).toBe('number');
  expect(typeof typedResult.query).toBe('string');
  expect(typeof typedResult.renderingContent).toBe('object');
  expect(typeof typedResult.facets).toBe('object');
  expect(typeof typedResult.facets_stats).toBe('object');
  expect(Array.isArray(typedResult.hits)).toBe(true);
  expect(typeof typedResult.index).toBe('string');
  expect(typeof typedResult.params).toBe('string');

  for (const hit of typedResult.hits) {
    const errors = validateWorkVariantSourceFromSearchHit(hit);
    expect(errors, `[${variantName}] backend search hit mapping mismatch:\n${errors.join('\n')}`).toEqual([]);
  }
}

test.describe('Backend Swagger Contract Smoke', () => {
  test('[openapi] lists expected frontend paths and schemas', async ({ request }) => {
    const res = await request.get(OPENAPI_URL);
    expect(res.status()).toBe(200);
    const spec = await res.json();

    expect(spec?.paths?.['/frontend/search']).toBeTruthy();
    expect(spec?.paths?.['/frontend/view/{prefix}/{id_}']).toBeTruthy();
    expect(spec?.components?.schemas?.SearchResult).toBeTruthy();
    expect(spec?.components?.schemas?.DetailView).toBeTruthy();
  });

  test('[detail] frontend/view response matches swagger contract + strict mapped _source shape', async ({ request }) => {
    for (const id of STABLE_DETAIL_IDS) {
      const res = await request.get(`${VIEW_URL}/21.11155/${id}`);
      expect(res.status(), `frontend/view failed for ${id}`).toBe(200);
      const body = await res.json();

      expect(typeof body.handle).toBe('string');
      expect(typeof body.compound_record).toBe('object');
      expect(body.compound_record).toBeTruthy();

      const source = body.compound_record?._source;
      if (source && typeof source === 'object') {
        const errors = validateWorkVariantSourceStrict(source);
        expect(errors, `backend view _source mapping mismatch for ${id}:\n${errors.join('\n')}`).toEqual([]);
      }
    }
  });

  test('[search] frontend/search response matches swagger required fields + strict mapped hit shape', async ({ request }) => {
    for (const variant of SEARCH_VARIANTS) {
      const payload = [{ indexName: '21.11155-denormalised-work', params: variant.params }];
      const res = await request.post(SEARCH_URL, { data: payload });
      expect(res.status(), `frontend/search failed for variant "${variant.name}"`).toBe(200);
      const body = await res.json();

      expect(Array.isArray(body.results), `[${variant.name}] results must be array`).toBe(true);
      expect(body.results.length, `[${variant.name}] expected at least one SearchResult`).toBeGreaterThan(0);

      for (const result of body.results as unknown[]) {
        assertSearchResultContract(result, variant.name);
      }
    }
  });

  test('[negative] frontend/search invalid payload returns 422 validation error contract', async ({ request }) => {
    const invalidPayload = [{ indexName: 123, params: 'invalid' }];
    const res = await request.post(SEARCH_URL, { data: invalidPayload });
    expect(res.status()).toBe(422);
    const body = await res.json();
    expect(Array.isArray(body?.detail)).toBe(true);
    expect(body.detail.length).toBeGreaterThan(0);
  });

  test('[negative] frontend/view path validation rejects invalid prefix and id with 422', async ({ request }) => {
    const invalidPrefix = await request.get(`${VIEW_URL}/invalid-prefix/A37FAC2F-2527-4DFE-94FB-5C18D2569406`);
    expect(invalidPrefix.status()).toBe(422);
    const invalidPrefixBody = await invalidPrefix.json();
    expect(Array.isArray(invalidPrefixBody?.detail)).toBe(true);
    expect(invalidPrefixBody.detail.length).toBeGreaterThan(0);

    const invalidId = await request.get(`${VIEW_URL}/21.11155/contains space`);
    expect(invalidId.status()).toBe(422);
    const invalidIdBody = await invalidId.json();
    expect(Array.isArray(invalidIdBody?.detail)).toBe(true);
    expect(invalidIdBody.detail.length).toBeGreaterThan(0);
  });

  test('[health] health endpoint returns success payload', async ({ request }) => {
    const res = await request.get(`${BACKEND_BASE}/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body).toBe('object');
    expect(body).toBeTruthy();
  });

  for (const loc of SITEMAP_SEARCH_LOCS) {
    test(`[search-matrix] sitemap-backed search contract: ${loc}`, async ({ request }) => {
      const payload = [
        {
          indexName: '21.11155-denormalised-work',
          params: searchParamsFromLoc(loc),
        },
      ];

      const res = await request.post(SEARCH_URL, { data: payload });
      expect(res.status(), `frontend/search failed for sitemap loc ${loc}`).toBe(200);
      const body = await res.json();

      expect(Array.isArray(body.results), `[${loc}] results must be array`).toBe(true);
      expect(body.results.length, `[${loc}] expected at least one SearchResult`).toBeGreaterThan(0);

      for (const result of body.results as unknown[]) {
        assertSearchResultContract(result, `sitemap:${loc}`);
      }
    });
  }
});
