import { expect, test } from '@playwright/test';
import { validateWorkVariantSourceFromSearchHit, validateWorkVariantSourceStrict } from '../utils/elastic-contracts';

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

const SITEMAP_DETAIL_LOCS = [
  '/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406',
  '/res/21.11155/D8231D2F-3F17-4917-A242-02844AA83C88',
] as const;

type SuggestionItem = {
  text: string;
  type: string;
  count?: number;
};

type SuggestionResponse = {
  success: boolean;
  suggestions: SuggestionItem[];
};

type DetailResponse = {
  error?: string;
  handle?: string;
  _index?: string;
  _id?: string;
  compound_record?: {
    _source?: Record<string, unknown>;
  };
};

type RuntimeSearchResult = {
  nbHits: number;
  hitsPerPage: number;
  page: number;
  nbPages: number;
  processingTimeMS: number;
  query: string;
  hits: Record<string, unknown>[];
};

type RuntimeSearchResponse = {
  results: RuntimeSearchResult[];
};

function normalizeFacetKey(key: string): string {
  return key.replace(/\[\d+\]$/, '');
}

function assertSuggestionContract(body: unknown) {
  expect(typeof body).toBe('object');
  expect(body).toBeTruthy();
  const typedBody = body as SuggestionResponse;

  expect(typeof typedBody.success).toBe('boolean');
  expect(Array.isArray(typedBody.suggestions)).toBe(true);

  for (const item of typedBody.suggestions) {
    expect(typeof item).toBe('object');
    expect(typeof item.text).toBe('string');
    expect(typeof item.type).toBe('string');
    if (Object.prototype.hasOwnProperty.call(item, 'count') && item.count !== undefined) {
      expect(typeof item.count).toBe('number');
    }
  }
}

function assertDetailContract(body: unknown) {
  expect(typeof body).toBe('object');
  expect(body).toBeTruthy();
  const typedBody = body as DetailResponse;

  if (typeof typedBody.error === 'string') {
    expect(typedBody.error.length).toBeGreaterThan(0);
    return;
  }

  expect(typeof typedBody.handle).toBe('string');
  expect(typeof typedBody._index).toBe('string');
  expect(typeof typedBody._id).toBe('string');
  expect(typeof typedBody.compound_record).toBe('object');
  expect(typeof typedBody.compound_record?._source).toBe('object');
  const errors = validateWorkVariantSourceStrict(typedBody.compound_record?._source);
  expect(errors, `detail _source schema mismatch:\n${errors.join('\n')}`).toEqual([]);
}

test.describe('Sitemap URL Runtime API Smoke', () => {
  test('sitemap search URLs load and related elastic API endpoints respond with valid contracts', async ({
    page,
    request,
  }) => {
    test.setTimeout(180_000);

    for (const loc of SITEMAP_SEARCH_LOCS) {
      const routeResponse = await page.goto(loc, { waitUntil: 'domcontentloaded' });
      expect(routeResponse, `No HTTP response while loading ${loc}`).toBeTruthy();
      expect(routeResponse!.status(), `Search route ${loc} returned 5xx`).toBeLessThan(500);

      const parsed = new URL(loc, 'http://localhost');
      const params = parsed.searchParams;

      const query = params.get('query');
      if (query) {
        const suggestRes = await request.post('/api/elastic/query_suggest', {
          data: { query, size: 10 },
        });
        expect(suggestRes.status(), `query_suggest returned 5xx for query="${query}" from ${loc}`).toBeLessThan(500);
        const suggestBody = await suggestRes.json();
        assertSuggestionContract(suggestBody);
      }

      const facetEntries = Array.from(params.entries()).filter(([key]) => key !== 'query');
      const seenFacetKeys = new Set<string>();
      for (const [rawKey, value] of facetEntries) {
        const facetAttr = normalizeFacetKey(rawKey);
        if (seenFacetKeys.has(`${facetAttr}::${value}`)) continue;
        seenFacetKeys.add(`${facetAttr}::${value}`);

        const facetRes = await request.post('/api/elastic/suggestions', {
          data: { mode: 'facet', facetAttr, query: value, size: 10 },
        });
        expect(facetRes.status(), `suggestions(facet) returned 5xx for ${facetAttr}="${value}" from ${loc}`).toBeLessThan(
          500,
        );
        const facetBody = await facetRes.json();
        assertSuggestionContract(facetBody);
      }
    }
  });

  test('sitemap detail URLs load and related detail API endpoint responds without 5xx', async ({ page, request }) => {
    test.setTimeout(120_000);

    for (const loc of SITEMAP_DETAIL_LOCS) {
      const routeResponse = await page.goto(loc, { waitUntil: 'domcontentloaded' });
      expect(routeResponse, `No HTTP response while loading ${loc}`).toBeTruthy();
      expect(routeResponse!.status(), `Detail route ${loc} returned 5xx`).toBeLessThan(500);
      await expect(page).toHaveURL(new RegExp(loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);

      const id = loc.split('/').at(-1);
      expect(id, `Missing id segment in detail loc ${loc}`).toBeTruthy();

      const detailRes = await request.get(`/api/elastic/get_work_by_id/${id}`);
      expect(detailRes.status(), `get_work_by_id/${id} returned 5xx`).toBeLessThan(500);
      const detailBody = await detailRes.json();
      assertDetailContract(detailBody);
    }
  });

  test('detail API handles missing/non-existent IDs with stable error contract', async ({ request }) => {
    const missingId = '00000000-0000-0000-0000-000000000000';
    const detailRes = await request.get(`/api/elastic/get_work_by_id/${missingId}`);
    expect(detailRes.status(), 'missing-id detail request returned 5xx').toBeLessThan(500);

    const detailBody = await detailRes.json();
    expect(typeof detailBody).toBe('object');
    expect(detailBody).toBeTruthy();
    expect(typeof detailBody.error).toBe('string');
    expect((detailBody.error as string).length).toBeGreaterThan(0);
  });

  test('runtime search endpoint returns strict, interface-aligned hit payloads', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto('/search', { waitUntil: 'domcontentloaded' });

    const runtimePublic = await page.evaluate(() => {
      const win = window as Window & {
        __NUXT__?: { config?: { public?: { searchApiPath?: unknown } } };
      };
      return win.__NUXT__?.config?.public ?? null;
    });
    expect(runtimePublic, 'window.__NUXT__.config.public unavailable').toBeTruthy();
    expect(typeof runtimePublic?.searchApiPath).toBe('string');
    const searchPath = runtimePublic?.searchApiPath as string;
    const responsePromise = page.waitForResponse(
      (resp) => resp.request().method() === 'POST' && resp.url().includes(searchPath),
      { timeout: 60_000 },
    );

    await page.goto('/search/?query=Berlin', { waitUntil: 'domcontentloaded' });
    let response: Awaited<typeof responsePromise>;
    try {
      response = await responsePromise;
    } catch {
      test.skip(
        true,
        `No browser-side POST to runtime search endpoint (${searchPath}) in this profile; likely SSR-only search execution`,
      );
      return;
    }
    expect(response.status(), `runtime search endpoint returned 5xx: ${response.url()}`).toBeLessThan(500);

    const body = (await response.json()) as RuntimeSearchResponse;
    expect(body, `No valid JSON body from runtime search endpoint ${response.url()}`).toBeTruthy();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);

    for (const result of body.results) {
      expect(typeof result.nbHits).toBe('number');
      expect(typeof result.hitsPerPage).toBe('number');
      expect(typeof result.page).toBe('number');
      expect(typeof result.nbPages).toBe('number');
      expect(typeof result.processingTimeMS).toBe('number');
      expect(typeof result.query).toBe('string');
      expect(Array.isArray(result.hits)).toBe(true);

      for (const hit of result.hits) {
        const errors = validateWorkVariantSourceFromSearchHit(hit);
        expect(errors, `runtime search hit schema mismatch:\n${errors.join('\n')}`).toEqual([]);
      }
    }
  });

});
