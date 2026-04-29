import { expect, test } from '@playwright/test';
import { validateWorkVariantSourceFromSearchHit } from '../utils/elastic-contracts';

const BACKEND_BASE = process.env.E2E_BACKEND_BASE || 'https://www.av-efi.net/rest/v1';
const SEARCH_URL = `${BACKEND_BASE}/frontend/search`;

const REGULAR_SEARCH_BACKEND_FACETS = [
  'castmembers',
  'directors_or_editors',
  'has_access_status',
  'has_colour_type',
  'has_duration_has_value',
  'has_extent_has_value',
  'has_form',
  'has_format_type',
  'has_genre_has_name',
  'has_issuer_name',
  'has_sound_type',
  'in_language_code',
  'item_element_type',
  'located_in_has_name',
  'manifestation_event_type',
  'production',
  'subjects',
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

function assertSearchResultContract(result: unknown, caseName: string) {
  expect(typeof result).toBe('object');
  expect(result).toBeTruthy();
  const typedResult = result as SearchResultContract;

  for (const key of SEARCH_RESULT_REQUIRED_KEYS) {
    expect(Object.prototype.hasOwnProperty.call(typedResult, key), `[${caseName}] Missing SearchResult key: ${key}`).toBe(
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
    expect(errors, `[${caseName}] backend search hit mapping mismatch:\n${errors.join('\n')}`).toEqual([]);
  }
}

test.describe('Backend API Edge Cases', () => {
  test('[edge] frontend/search accepts empty query payload and returns valid contract', async ({ request }) => {
    const payload = [
      {
        indexName: '21.11155-denormalised-work',
        params: {
          query: '',
          page: 0,
          hitsPerPage: 5,
          facetFilters: [],
        },
      },
    ];

    const res = await request.post(SEARCH_URL, { data: payload });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
    for (const result of body.results as unknown[]) {
      assertSearchResultContract(result, 'empty-query');
    }
  });

  test('[edge] frontend/search handles whitespace and special-character queries without 5xx', async ({ request }) => {
    const edgeQueries = ['   ', '"', 'ÄÖÜ Berlin ?!', '%$#@!'];

    for (const query of edgeQueries) {
      const payload = [
        {
          indexName: '21.11155-denormalised-work',
          params: {
            query,
            page: 0,
            hitsPerPage: 5,
            facetFilters: [],
          },
        },
      ];

      const res = await request.post(SEARCH_URL, { data: payload });
      expect(res.status(), `query "${query}" returned 5xx`).toBeLessThan(500);
      if (res.status() === 200) {
        const body = await res.json();
        expect(Array.isArray(body.results)).toBe(true);
      }
    }
  });

  test('[edge] frontend/search supports multi-request payload arrays', async ({ request }) => {
    const payload = [
      {
        indexName: '21.11155-denormalised-work',
        params: { query: 'Berlin', page: 0, hitsPerPage: 5, facetFilters: [] },
      },
      {
        indexName: '21.11155-denormalised-work',
        params: { query: 'Metropolis', page: 0, hitsPerPage: 5, facetFilters: [] },
      },
    ];

    const res = await request.post(SEARCH_URL, { data: payload });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBe(2);
    for (const result of body.results as unknown[]) {
      assertSearchResultContract(result, 'multi-request');
    }
  });

  test('[edge] frontend/search rejects invalid pagination bounds with 422', async ({ request }) => {
    const negativePage = [
      {
        indexName: '21.11155-denormalised-work',
        params: { query: 'Berlin', page: -1, hitsPerPage: 5, facetFilters: [] },
      },
    ];
    const oversizedHits = [
      {
        indexName: '21.11155-denormalised-work',
        params: { query: 'Berlin', page: 0, hitsPerPage: 101, facetFilters: [] },
      },
    ];

    const negativeRes = await request.post(SEARCH_URL, { data: negativePage });
    expect(negativeRes.status()).toBe(422);
    const negativeBody = await negativeRes.json();
    expect(Array.isArray(negativeBody?.detail)).toBe(true);
    expect(negativeBody.detail.length).toBeGreaterThan(0);

    const oversizedRes = await request.post(SEARCH_URL, { data: oversizedHits });
    expect(oversizedRes.status()).toBe(422);
    const oversizedBody = await oversizedRes.json();
    expect(Array.isArray(oversizedBody?.detail)).toBe(true);
    expect(oversizedBody.detail.length).toBeGreaterThan(0);
  });

  test('[edge] frontend/search unknown facet key does not return 5xx', async ({ request }) => {
    const payload = [
      {
        indexName: '21.11155-denormalised-work',
        params: {
          query: '',
          page: 0,
          hitsPerPage: 5,
          facetFilters: [['non_existing_facet:value']],
          facets: ['non_existing_facet'],
        },
      },
    ];

    const res = await request.post(SEARCH_URL, { data: payload });
    expect(res.status()).toBeLessThan(500);
    if (res.status() === 200) {
      const body = await res.json();
      expect(Array.isArray(body.results)).toBe(true);
    }
  });

  test('[edge] frontend/search supported facets never return 5xx when requested or applied', async ({ request }) => {
    test.setTimeout(120_000);

    const discoveryPayload = [
      {
        indexName: '21.11155-denormalised-work',
        params: {
          query: '',
          page: 0,
          hitsPerPage: 1,
          facetFilters: [],
          facets: [...REGULAR_SEARCH_BACKEND_FACETS],
          maxValuesPerFacet: 20,
        },
      },
    ];

    const discoveryRes = await request.post(SEARCH_URL, { data: discoveryPayload });
    expect(discoveryRes.status(), 'facet discovery request returned 5xx').toBeLessThan(500);
    expect(discoveryRes.status(), 'facet discovery request should satisfy the SearchResult contract').toBe(200);

    const discoveryBody = await discoveryRes.json();
    expect(Array.isArray(discoveryBody.results)).toBe(true);
    expect(discoveryBody.results.length).toBeGreaterThan(0);
    const discoveryResult = discoveryBody.results[0];
    assertSearchResultContract(discoveryResult, 'facet-discovery');

    for (const facet of REGULAR_SEARCH_BACKEND_FACETS) {
      expect(
        Object.prototype.hasOwnProperty.call(discoveryResult.facets, facet),
        `Backend did not return requested facet "${facet}"`,
      ).toBe(true);

      const buckets = discoveryResult.facets[facet] as Record<string, number> | undefined;
      const firstValue = Object.entries(buckets ?? {})
        .filter(([value, count]) => value.length > 0 && count > 0)
        .sort((a, b) => b[1] - a[1])
        .at(0)?.[0];

      if (!firstValue) {
        continue;
      }

      const appliedPayload = [
        {
          indexName: '21.11155-denormalised-work',
          params: {
            query: '',
            page: 0,
            hitsPerPage: 1,
            facetFilters: [[`${facet}:${firstValue}`]],
            facets: [...REGULAR_SEARCH_BACKEND_FACETS],
            maxValuesPerFacet: 20,
          },
        },
      ];

      const appliedRes = await request.post(SEARCH_URL, { data: appliedPayload });
      expect(appliedRes.status(), `facet "${facet}" value "${firstValue}" returned 5xx`).toBeLessThan(500);
      expect(appliedRes.status(), `facet "${facet}" value "${firstValue}" should return SearchResult JSON`).toBe(200);

      const appliedBody = await appliedRes.json();
      expect(Array.isArray(appliedBody.results), `facet "${facet}" results must be array`).toBe(true);
      expect(appliedBody.results.length, `facet "${facet}" expected at least one SearchResult`).toBeGreaterThan(0);
      for (const result of appliedBody.results as unknown[]) {
        assertSearchResultContract(result, `facet-${facet}`);
      }
    }
  });
});
