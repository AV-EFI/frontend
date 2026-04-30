import { expect, test, type Page } from '@playwright/test';

const SEARCH_ENDPOINT_SEGMENT = '/frontend/search';

const MOCK_FACET_BUCKETS: Record<string, Record<string, number>> = {
  castmembers: { 'Mock Value': 3 },
  creators: { 'Mock Value': 3 },
  has_access_status: { Open: 3 },
  has_colour_type: { ColourBlackAndWhite: 3 },
  has_duration_has_value: { '90min': 3 },
  has_extent_has_value: { '2 reels': 3 },
  has_form: { Documentary: 3 },
  has_format_type: { FormatFilm35mm: 3 },
  has_genre_has_name: { GenreNewsreel: 3 },
  has_issuer_name: { Bundesarchiv: 3 },
  has_sound_type: { Sound: 3 },
  in_language_code: { de: 3 },
  item_element_type: { ItemElementPositive: 3 },
  located_in_has_name: { Berlin: 3 },
  manifestation_event_type: { ManifestationEventTypeRelease: 3 },
  production: { DEFA: 3 },
  subjects: { Arbeit: 3 },
};

function buildMockSearchResponse(requestedFacets: string[] = []) {
  const requestedFacetBuckets = Object.fromEntries(
    requestedFacets
      .filter((facet) => facet && facet !== '*')
      .map((facet) => [facet, { 'Mock Value': 3 }]),
  );
  const facets = {
    ...MOCK_FACET_BUCKETS,
    ...requestedFacetBuckets,
  };

  const facetOrder = Array.from(new Set([...Object.keys(MOCK_FACET_BUCKETS), ...requestedFacets.filter((facet) => facet && facet !== '*')]));

  return {
    results: [
      {
        hits: [],
        nbHits: 0,
        page: 0,
        hitsPerPage: 20,
        nbPages: 0,
        processingTimeMS: 2,
        exhaustiveNbHits: true,
        exhaustiveFacetsCount: true,
        query: '',
        params: '',
        facets,
        renderingContent: {
          facetOrdering: {
            facets: {
              order: facetOrder,
            },
            values: Object.fromEntries(facetOrder.map((facet) => [facet, { order: ['Mock Value'] }])),
          },
        },
        nbManifestations: 0,
        nbItems: 0,
      },
    ],
  };
}

async function acceptCookiesIfPresent(page: Page) {
  const acceptButton = page.getByRole('button', { name: /accept all/i });
  if (await acceptButton.count()) {
    await acceptButton.first().click();
  }
}

async function getRefinementActions(page: Page) {
  return page.evaluate(() =>
    (window as Window & { __avefiRefinementActions?: string[] }).__avefiRefinementActions ?? [],
  );
}

async function expectRefinementAction(page: Page, action: () => Promise<void>, expectedAction: string) {
  const before = await getRefinementActions(page);
  await action();
  await expect
    .poll(async () => getRefinementActions(page), { timeout: 10_000 })
    .toContain(expectedAction);

  const after = await getRefinementActions(page);
  expect(after.length).toBeGreaterThanOrEqual(before.length + 1);
}

async function runRefinementRequestFlow(page: Page, path: string) {
  await page.addInitScript(() => {
    (window as Window & { __avefiRefinementActions?: string[] }).__avefiRefinementActions = [];
    window.addEventListener('avefi:search-refinement-action', (event: Event) => {
      const action = (event as CustomEvent).detail?.action;
      if (typeof action === 'string') {
        (window as Window & { __avefiRefinementActions?: string[] }).__avefiRefinementActions?.push(action);
      }
    });
  });

  await page.route(`**${SEARCH_ENDPOINT_SEGMENT}**`, async (route) => {
    const request = route.request();
    if (request.method() !== 'POST') {
      await route.continue();
      return;
    }

    const payload = request.postDataJSON() as { requests?: Array<{ params?: Record<string, unknown> }> };

    const firstRequestParams = payload?.requests?.[0]?.params;
    const requestedFacets = Array.isArray(firstRequestParams?.facets)
      ? (firstRequestParams.facets as string[])
      : [];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(buildMockSearchResponse(requestedFacets)),
    });
  });

  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await acceptCookiesIfPresent(page);
  await expect(page.getByRole('main')).toBeVisible();

  const firstFacetHeader = page.locator('.ais-Panel-header').first();
  await expect(firstFacetHeader).toBeVisible({ timeout: 10_000 });
  await firstFacetHeader.click({ force: true });

  const firstFacetCheckbox = page.locator('input.ais-RefinementList-checkbox[type="checkbox"]:visible').first();
  await expect(firstFacetCheckbox).toBeVisible({ timeout: 10_000 });

  await expectRefinementAction(
    page,
    async () => {
      if (await firstFacetCheckbox.isChecked()) {
        await firstFacetCheckbox.uncheck({ force: true });
      }
      await firstFacetCheckbox.check({ force: true });
    },
    'panel-facet-toggle',
  );

  await expectRefinementAction(
    page,
    async () => {
      const activeRefinementRemoveLink = page.locator('[aria-labelledby="active-facets-heading"] a').first();
      await expect(activeRefinementRemoveLink).toBeVisible({ timeout: 10_000 });
      await activeRefinementRemoveLink.click({ force: true });
    },
    'current-refinement-remove',
  );

  const clearAllButton = page.getByRole('button', { name: /clear all/i });
  await expect(clearAllButton).toBeVisible();

  await expectRefinementAction(
    page,
    async () => {
      await clearAllButton.click({ force: true });
    },
    'clear-all-refinements',
  );
}

test.describe('Search refinement request flow', () => {
  test('SRR-001 panel toggle, active-refinement delete, and clear-all use centralized refinement actions (without query)', async ({ page }) => {
    await runRefinementRequestFlow(page, '/search');
  });

  test('SRR-002 panel toggle, active-refinement delete, and clear-all use centralized refinement actions (with query)', async ({ page }) => {
    await runRefinementRequestFlow(page, '/search?query=Berlin');
    await expect(page).toHaveURL(/query=Berlin/);
  });
});
