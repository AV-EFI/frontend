import { beforeEach, describe, expect, test, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal Searchkit search-request as the beforeSearch hook receives it. */
function makeSearchRequest(
  facetFilters: string[][],
  numericRefinements: Record<string, any> = {},
  query = '',
): any {
  return {
    indexName: 'works',
    request: {
      params: {
        query,
        facetFilters,
        'numeric-refinements': numericRefinements,
      },
    },
    body: {
      query: { bool: { filter: [] } },
    },
  };
}

function buildFacetCombinations(values: string[][]): string[][][] {
  const out: string[][][] = [[]];

  for (const value of values) {
    const withCurrent = out.map((combo) => [...combo, value]);
    out.push(...withCurrent);
  }

  return out;
}

/** Boot the handler, capture the beforeSearch hook, and return it. */
async function captureBeforeSearch(): Promise<(requests: any[]) => Promise<any[]>> {
  let hook: any;

  vi.doMock('@searchkit/api', () => ({
    default: () => ({
      searchkit: {
        handleInstantSearchRequests: async (_body: any, options: any) => {
          hook = options.hooks.beforeSearch;
          return { results: [] };
        },
      },
    }),
  }));

  vi.doMock('~/searchConfig_avefi', () => ({ config: {} }));
  vi.stubGlobal('defineEventHandler', (fn: any) => fn);
  vi.stubGlobal('readBody', vi.fn().mockResolvedValue({}));
  vi.stubGlobal('useRuntimeConfig', () => ({}));

  const handler = (
    await import('~/server/api/elastic/msearch.post')
  ).default as (event: any) => Promise<any>;

  await handler({});
  return hook;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Outbound API: /api/elastic/msearch – query construction', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  // --- no-500 guard: all item-level facets active simultaneously ---------------

  test('does not throw and returns a result when all item-level facets are active at once', async () => {
    const beforeSearch = await captureBeforeSearch();

    const allFacets: string[][] = [
      ['has_colour_type:ColourBlackAndWhite'],
      ['has_sound_type:Sound'],
      ['has_format_type:FormatFilm35mm'],
      ['item_element_type:ItemElementPositive'],
      ['in_language_code:de'],
      ['has_issuer_name:Bundesarchiv'],
      ['manifestation_event_type:ManifestationEventTypeRelease'],
      ['has_duration_has_value:90min'],
    ];

    const numericRefinements = {
      item_duration_in_minutes: { '>=': 60, '<=': 120 },
      production_in_year: { '>=': 1950, '<=': 1980 },
      prodYearsOnly: { '=': 1 },
    };

    let result: any[];
    await expect(
      (async () => { result = await beforeSearch([makeSearchRequest(allFacets, numericRefinements)]); })()
    ).resolves.not.toThrow();

    expect(result!).toHaveLength(1);
    expect(result![0].body.query.bool.filter).toBeDefined();
  });

  test('handles all facet combinations without query and with query', async () => {
    const beforeSearch = await captureBeforeSearch();

    const facets: string[][] = [
      ['has_colour_type:ColourBlackAndWhite'],
      ['has_sound_type:Sound'],
      ['has_format_type:FormatFilm35mm'],
      ['item_element_type:ItemElementPositive'],
      ['in_language_code:de'],
      ['has_issuer_name:Bundesarchiv'],
      ['manifestation_event_type:ManifestationEventTypeRelease'],
      ['has_duration_has_value:90min'],
    ];

    const combinations = buildFacetCombinations(facets);

    for (const combo of combinations) {
      const [withoutQuery] = await beforeSearch([makeSearchRequest(combo, {}, '')]);
      expect(withoutQuery.body.query.bool.filter).toBeDefined();
      expect(withoutQuery.body.query.bool.must).toEqual([]);

      const [withQuery] = await beforeSearch([makeSearchRequest(combo, {}, 'Berlin')]);
      expect(withQuery.body.query.bool.filter).toBeDefined();
      expect(withQuery.body.query.bool.must).toHaveLength(1);
      const should = withQuery.body.query.bool.must[0]?.bool?.should;
      expect(Array.isArray(should)).toBe(true);
      expect(should[0].multi_match.query).toBe('Berlin');
    }
  });

  // --- no-500 guard: no facets active (match-all) -----------------------------

  test('does not throw and returns a result when no facets are active', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([makeSearchRequest([], {})]);

    expect(out.body.query.bool.filter).toEqual([]);
    expect(out.body.query.bool.must).toEqual([]);
  });

  // --- nested query structure --------------------------------------------------

  test('wraps all item facets in a manifestations.items nested query inside manifestations', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([
      makeSearchRequest([
        ['has_colour_type:ColourBlackAndWhite'],
        ['has_sound_type:Sound'],
        ['has_format_type:FormatFilm35mm'],
        ['item_element_type:ItemElementPositive'],
        ['in_language_code:de'],
      ]),
    ]);

    const outerNested = out.body.query.bool.filter.find(
      (f: any) => f.nested?.path === 'manifestations',
    );
    expect(outerNested).toBeDefined();

    const manifestationsMust: any[] = outerNested.nested.query.bool.must;
    const itemsNested = manifestationsMust.find(
      (c: any) => c.nested?.path === 'manifestations.items',
    );
    expect(itemsNested).toBeDefined();

    const itemsMust: any[] = itemsNested.nested.query.bool.must;

    const fields = itemsMust.flatMap((m: any) => Object.keys(m.terms ?? {}));
    expect(fields).toContain('manifestations.items.has_record.has_colour_type.keyword');
    expect(fields).toContain('manifestations.items.has_record.has_sound_type.keyword');
    expect(fields).toContain('manifestations.items.has_record.has_format.type.keyword');
    expect(fields).toContain('manifestations.items.has_record.element_type.keyword');
    expect(fields).toContain('manifestations.items.has_record.in_language.code.keyword');
  });

  test('keeps issuer_name and manifestation_event_type at manifestation level, not items', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([
      makeSearchRequest([
        ['has_issuer_name:Bundesarchiv'],
        ['manifestation_event_type:ManifestationEventTypeRelease'],
      ]),
    ]);

    const outerNested = out.body.query.bool.filter.find(
      (f: any) => f.nested?.path === 'manifestations',
    );
    expect(outerNested).toBeDefined();

    const manifestationsMust: any[] = outerNested.nested.query.bool.must;

    const issuerTerms = manifestationsMust.find(
      (c: any) => c.terms?.['manifestations.has_record.described_by.has_issuer_name.keyword'],
    );
    expect(issuerTerms).toBeDefined();
    expect(
      issuerTerms.terms['manifestations.has_record.described_by.has_issuer_name.keyword'],
    ).toContain('Bundesarchiv');

    const eventNested = manifestationsMust.find(
      (c: any) => c.nested?.path === 'manifestations.has_record.has_event',
    );
    expect(eventNested).toBeDefined();
    expect(
      eventNested.nested.query.terms['manifestations.has_record.has_event.type.keyword'],
    ).toContain('ManifestationEventTypeRelease');

    // items nested should NOT be present when no item-level facets are given
    const itemsNested = manifestationsMust.find(
      (c: any) => c.nested?.path === 'manifestations.items',
    );
    expect(itemsNested).toBeUndefined();
  });

  // --- numeric refinements ----------------------------------------------------

  test('adds item_duration_in_minutes range inside manifestations.items nested query', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([
      makeSearchRequest([], { item_duration_in_minutes: { '>=': 60, '<=': 120 } }),
    ]);

    const outerNested = out.body.query.bool.filter.find(
      (f: any) => f.nested?.path === 'manifestations',
    );
    const itemsNested = outerNested.nested.query.bool.must.find(
      (c: any) => c.nested?.path === 'manifestations.items',
    );
    const rangeFilter = itemsNested.nested.query.bool.must.find(
      (m: any) => m.range?.['manifestations.items.duration_in_minutes'],
    );

    expect(rangeFilter).toBeDefined();
    expect(rangeFilter.range['manifestations.items.duration_in_minutes']).toEqual({
      gte: 60,
      lte: 120,
    });
  });

  test('adds production_in_year range at top-level filter, not inside nested', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([
      makeSearchRequest([], { production_in_year: { '>=': 1950, '<=': 1980 } }),
    ]);

    const rangeFilter = out.body.query.bool.filter.find(
      (f: any) => f.range?.production_in_year,
    );
    expect(rangeFilter).toBeDefined();
    expect(rangeFilter.range.production_in_year).toEqual({ gte: 1950, lte: 1980 });

    // must NOT be inside a manifestations nested
    const outerNested = out.body.query.bool.filter.find(
      (f: any) => f.nested?.path === 'manifestations',
    );
    expect(outerNested).toBeUndefined();
  });

  test('adds exists filter and removes prodYearsOnly key when prodYearsOnly is active', async () => {
    const beforeSearch = await captureBeforeSearch();

    const numericRefinements = { prodYearsOnly: { '=': 1 } };
    const [out] = await beforeSearch([makeSearchRequest([], numericRefinements)]);

    const existsFilter = out.body.query.bool.filter.find(
      (f: any) => f.exists?.field === 'production_in_year',
    );
    expect(existsFilter).toBeDefined();

    // prodYearsOnly should be stripped from the refinements object
    expect(numericRefinements).not.toHaveProperty('prodYearsOnly');
  });

  // --- text query handling ----------------------------------------------------

  test('builds multi_match must clause for plain text query', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([makeSearchRequest([], {}, 'Berlin')]);

    expect(out.body.query.bool.must).toHaveLength(1);
    const should = out.body.query.bool.must[0].bool.should;
    expect(should[0].multi_match.query).toBe('Berlin');
  });

  test('builds wildcard + phrase must clause for quoted query', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([makeSearchRequest([], {}, '"Berlin"')]);

    const should = out.body.query.bool.must[0].bool.should;
    expect(should).toHaveLength(2);
    expect(should[0].wildcard?.['has_record.has_primary_title.has_name.keyword']?.value).toBe(
      '*Berlin*',
    );
    expect(should[1].multi_match.type).toBe('phrase');
  });

  test('emits empty must clause and match-all filter when query is blank', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([makeSearchRequest([], {}, '')]);

    expect(out.body.query.bool.must).toEqual([]);
  });

  // --- inner_hits: outer manifestations nested must NOT have inner_hits --------
  //
  // ES limitation: a nested query with inner_hits cannot contain another nested
  // query with inner_hits in its must clauses.  Only the items-level nested
  // should carry inner_hits; the outer manifestations nested must not.

  test('outer manifestations nested has no inner_hits (avoids ES nested-inner_hits conflict)', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([
      makeSearchRequest([['has_colour_type:ColourBlackAndWhite']]),
    ]);

    const outerNested = out.body.query.bool.filter.find(
      (f: any) => f.nested?.path === 'manifestations',
    );
    expect(outerNested.nested.inner_hits).toBeUndefined();
  });

  test('items-level nested still carries inner_hits for item matching', async () => {
    const beforeSearch = await captureBeforeSearch();

    const [out] = await beforeSearch([
      makeSearchRequest([['has_colour_type:ColourBlackAndWhite']]),
    ]);

    const outerNested = out.body.query.bool.filter.find(
      (f: any) => f.nested?.path === 'manifestations',
    );
    const itemsNested = outerNested.nested.query.bool.must.find(
      (c: any) => c.nested?.path === 'manifestations.items',
    );
    expect(itemsNested.nested.inner_hits.name).toBe('manifestations_items_hits');
  });
});
