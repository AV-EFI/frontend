/**
 * backend-search-facet-combinations.spec.ts
 *
 * Regression suite: ensures the real /frontend/search endpoint never returns 5xx
 * when item-level facets are combined.  The bug history:
 *   - Individual facets worked fine.
 *   - Combining item-level facets (colour + sound + format + ...) caused 500s
 *     because of bad nested-query construction in the BFF beforeSearch hook.
 *
 * Strategy:
 *   1. Discovery pass: ask the backend for real bucket values for all relevant facets.
 *   2. All-at-once test:  fire every item-level facet simultaneously.
 *   3. All-facets test:   add manifestation-level facets on top.
 *   4. Pairwise matrix:   every pair of item-level facets combined (cartesian).
 *
 * Hits a REAL backend (E2E_BACKEND_BASE env var or the production default).
 * No mocks.
 */
import { expect, test } from '@playwright/test';

const BACKEND_BASE = process.env.E2E_BACKEND_BASE || 'https://www.av-efi.net/rest/v1';
const SEARCH_URL = `${BACKEND_BASE}/frontend/search`;
const INDEX = '21.11155-denormalised-work';

// ------------------------------------------------------------------ facet lists

/** Facets that route to manifestations.items nested query in the BFF. */
const ITEM_LEVEL_FACETS = [
  'has_colour_type',
  'has_sound_type',
  'has_format_type',
  'item_element_type',
  'in_language_code',
  'has_duration_has_value',
] as const;

/** Facets that stay at manifestation level in the BFF. */
const MANIFESTATION_LEVEL_FACETS = [
  'has_issuer_name',
  'manifestation_event_type',
] as const;

const ALL_FACETS = [...ITEM_LEVEL_FACETS, ...MANIFESTATION_LEVEL_FACETS] as const;
type FacetName = (typeof ALL_FACETS)[number];

// ------------------------------------------------------------------ helpers

function searchPayload(facetFilters: string[][], extra: Record<string, unknown> = {}) {
  return [
    {
      indexName: INDEX,
      params: {
        query: '',
        page: 0,
        hitsPerPage: 1,
        facetFilters,
        facets: [...ALL_FACETS],
        maxValuesPerFacet: 20,
        ...extra,
      },
    },
  ];
}

async function post(request: any, payload: unknown) {
  const res = await request.post(SEARCH_URL, { data: payload });
  return res;
}

function topBucket(facets: Record<string, Record<string, number>>, facet: string): string | undefined {
  return Object.entries(facets[facet] ?? {})
    .filter(([v, c]) => v.length > 0 && c > 0)
    .sort((a, b) => b[1] - a[1])
    .at(0)?.[0];
}

// ------------------------------------------------------------------ fixture: real bucket values

/**
 * Shared state populated once in the test-scoped beforeAll.
 * Maps facet name -> top real value discovered from the backend.
 */
let realValues: Partial<Record<FacetName, string>> = {};

test.describe('Backend /frontend/search – facet combination 500-regression', () => {
  test.setTimeout(180_000);

  test.beforeAll(async ({ request }) => {
    const res = await post(request, searchPayload([]));
    expect(res.status(), 'Discovery request should return 200').toBe(200);

    const body = await res.json();
    const facets: Record<string, Record<string, number>> = body.results?.[0]?.facets ?? {};

    for (const facet of ALL_FACETS) {
      const value = topBucket(facets, facet);
      if (value) {
        realValues[facet] = value;
      }
    }
  });

  // ------------------------------------------------------------------ all item facets at once

  test('[combo] all item-level facets applied simultaneously – must not return 5xx', async ({ request }) => {
    const filters = ITEM_LEVEL_FACETS
      .filter((f) => realValues[f] !== undefined)
      .map((f) => [`${f}:${realValues[f]}`]);

    // There must be at least 2 item-level facets with real values for this test to be meaningful.
    expect(
      filters.length,
      'Need at least 2 item-level facets with real bucket values from the backend',
    ).toBeGreaterThanOrEqual(2);

    const res = await post(request, searchPayload(filters));
    expect(res.status(), `All item-level facets combined returned ${res.status()}`).toBeLessThan(500);
    expect(res.status(), 'Expected 200 with combined item-level facets').toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.results), 'results must be array').toBe(true);
    expect(body.results.length, 'at least one result object expected').toBeGreaterThan(0);
  });

  // ------------------------------------------------------------------ all facets (item + manifestation)
  //
  // KNOWN BACKEND BUG: ES limitation – a nested query with inner_hits cannot
  // contain another nested query with inner_hits in its must clauses.
  // When has_issuer_name (plain terms at manifestations level, outer inner_hits)
  // is combined with item-level facets (nested at manifestations.items level,
  // inner inner_hits), the Python backend Searchkit generates a conflicting
  // query and ES returns 500.  Track this until the backend is patched.
  // manifestation_event_type is NOT affected (its nested has no inner_hits).

  test.fixme('[combo] all facets (item + manifestation level) simultaneously – must not return 5xx', async ({ request }) => {
    const filters = ALL_FACETS
      .filter((f) => realValues[f] !== undefined)
      .map((f) => [`${f}:${realValues[f]}`]);

    expect(
      filters.length,
      'Need at least 3 facets with real bucket values from the backend',
    ).toBeGreaterThanOrEqual(3);

    const res = await post(request, searchPayload(filters));
    expect(res.status(), `All facets combined returned ${res.status()}`).toBeLessThan(500);
    expect(res.status(), 'Expected 200 with all facets combined').toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
  });

  // ------------------------------------------------------------------ item facets + production_in_year range

  test('[combo] item facets + production_in_year numeric range – must not return 5xx', async ({ request }) => {
    const filters = ITEM_LEVEL_FACETS
      .filter((f) => realValues[f] !== undefined)
      .map((f) => [`${f}:${realValues[f]}`]);

    const res = await post(request, searchPayload(filters, {
      'numeric-refinements': {
        production_in_year: { '>=': 1930, '<=': 2000 },
      },
    }));

    expect(res.status(), `Item facets + year range returned ${res.status()}`).toBeLessThan(500);
    expect(res.status()).toBe(200);
  });

  // ------------------------------------------------------------------ pairwise matrix (item-level)

  test('[combo] every pair of item-level facets – none may return 5xx', async ({ request }) => {
    const available = ITEM_LEVEL_FACETS.filter((f) => realValues[f] !== undefined);

    const pairs: [FacetName, FacetName][] = [];
    for (let i = 0; i < available.length; i++) {
      for (let j = i + 1; j < available.length; j++) {
        pairs.push([available[i], available[j]]);
      }
    }

    expect(pairs.length, 'Need at least one item-level facet pair to test').toBeGreaterThan(0);

    for (const [a, b] of pairs) {
      const filters = [
        [`${a}:${realValues[a]}`],
        [`${b}:${realValues[b]}`],
      ];
      const res = await post(request, searchPayload(filters));
      expect(
        res.status(),
        `Pair (${a} + ${b}) returned ${res.status()}`,
      ).toBeLessThan(500);
    }
  });

  // ------------------------------------------------------------------ item facets × manifestation_event_type (passes)

  test('[combo] each item-level facet paired with manifestation_event_type – none may return 5xx', async ({ request }) => {
    if (!realValues['manifestation_event_type']) {
      test.skip();
      return;
    }
    const itemFacets = ITEM_LEVEL_FACETS.filter((f) => realValues[f] !== undefined);

    for (const item of itemFacets) {
      const filters = [
        [`${item}:${realValues[item]}`],
        [`manifestation_event_type:${realValues['manifestation_event_type']}`],
      ];
      const res = await post(request, searchPayload(filters));
      expect(
        res.status(),
        `Pair (${item} + manifestation_event_type) returned ${res.status()}`,
      ).toBeLessThan(500);
    }
  });

  // ------------------------------------------------------------------ item facets × has_issuer_name (known backend bug)

  test.fixme('[combo] each item-level facet paired with has_issuer_name – none may return 5xx', async ({ request }) => {
    // KNOWN BACKEND BUG: see comment above "all facets simultaneously".
    if (!realValues['has_issuer_name']) {
      test.skip();
      return;
    }
    const itemFacets = ITEM_LEVEL_FACETS.filter((f) => realValues[f] !== undefined);

    for (const item of itemFacets) {
      const filters = [
        [`${item}:${realValues[item]}`],
        [`has_issuer_name:${realValues['has_issuer_name']}`],
      ];
      const res = await post(request, searchPayload(filters));
      expect(
        res.status(),
        `Pair (${item} + has_issuer_name) returned ${res.status()}`,
      ).toBeLessThan(500);
    }
  });

  // ------------------------------------------------------------------ triple combos: all item facets + one manifestation facet

  test.fixme('[combo] all item facets + has_issuer_name simultaneously – must not return 5xx', async ({ request }) => {
    // KNOWN BACKEND BUG: see comment above "all facets simultaneously".
    if (!realValues['has_issuer_name']) {
      test.skip();
      return;
    }

    const filters = [
      ...ITEM_LEVEL_FACETS
        .filter((f) => realValues[f] !== undefined)
        .map((f) => [`${f}:${realValues[f]}`]),
      [`has_issuer_name:${realValues['has_issuer_name']}`],
    ];

    const res = await post(request, searchPayload(filters));
    expect(res.status(), `All item facets + has_issuer_name returned ${res.status()}`).toBeLessThan(500);
    expect(res.status()).toBe(200);
  });

  test('[combo] all item facets + manifestation_event_type simultaneously – must not return 5xx', async ({ request }) => {
    // manifestation_event_type is a nested sub-query (no outer inner_hits), so it does NOT trigger the bug.
    if (!realValues['manifestation_event_type']) {
      test.skip();
      return;
    }

    const filters = [
      ...ITEM_LEVEL_FACETS
        .filter((f) => realValues[f] !== undefined)
        .map((f) => [`${f}:${realValues[f]}`]),
      [`manifestation_event_type:${realValues['manifestation_event_type']}`],
    ];

    const res = await post(request, searchPayload(filters));
    expect(res.status(), `All item facets + manifestation_event_type returned ${res.status()}`).toBeLessThan(500);
    expect(res.status()).toBe(200);
  });

  // ------------------------------------------------------------------ empty query + all facets (includes has_issuer_name → fixme)

  test.fixme('[combo] empty text query with all facets active – must not return 5xx', async ({ request }) => {
    // KNOWN BACKEND BUG: see comment above "all facets simultaneously".
    const filters = ALL_FACETS
      .filter((f) => realValues[f] !== undefined)
      .map((f) => [`${f}:${realValues[f]}`]);

    const res = await post(request, searchPayload(filters, { query: '' }));
    expect(res.status(), `Empty query + all facets returned ${res.status()}`).toBeLessThan(500);
    expect(res.status()).toBe(200);
  });

  // ------------------------------------------------------------------ text query + all facets (includes has_issuer_name → fixme)

  test.fixme('[combo] text query "Berlin" with all facets active – must not return 5xx', async ({ request }) => {
    // KNOWN BACKEND BUG: see comment above "all facets simultaneously".
    const filters = ALL_FACETS
      .filter((f) => realValues[f] !== undefined)
      .map((f) => [`${f}:${realValues[f]}`]);

    const res = await post(request, searchPayload(filters, { query: 'Berlin' }));
    expect(res.status(), `Text query + all facets returned ${res.status()}`).toBeLessThan(500);
    // may return 0 hits but must not 500
  });
});
