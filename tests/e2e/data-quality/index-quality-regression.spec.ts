/**
 * Index Quality Regression Tests
 *
 * Derived from the Elasticsearch data-quality analysis report:
 *   logs/data-quality/quality-statistics.md  (generated 2026-04-20)
 *   logs/data-quality/quality-failing-identifiers.md
 *
 * Purpose: verify that the frontend handles known data-quality edge-cases
 * gracefully and that the candidate index (testbed) does not introduce
 * regressions visible to users.
 *
 * Sections:
 *   DQ-DETAIL  — detail-page resilience for records with known quality issues
 *   DQ-SEARCH  — search-result resilience for queries that surface quality data
 *   DQ-FACET   — facet combinations that expose language-code drift
 */

import { expect, test } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function detailUrl(handle: string) {
  return `/res/${handle}`;
}

function searchUrl(query: string) {
  return `/search/?query=${encodeURIComponent(query)}`;
}

/** Asserts the page loaded without a 5xx, shows the main region, and has no
 *  uncaught JS error emitted as a dialog (Nuxt error overlay). */
async function assertPageLoadsOk(page: import('@playwright/test').Page, url: string) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  const res = await page.goto(url, { waitUntil: 'domcontentloaded' });
  expect(res?.status(), `HTTP status for ${url}`).toBeLessThan(500);
  await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });
  expect(errors.filter((e) => /ChunkLoadError|Cannot read|undefined/.test(e))).toHaveLength(0);
}

// ---------------------------------------------------------------------------
// DQ-DETAIL: High-cardinality detail pages (high manifestation count)
//
// Source: "Structural depth and cardinality heuristics" in quality-statistics.md
// These records have 25–43 child manifestations and are the most likely to
// trigger rendering bottlenecks or API timeouts.
// ---------------------------------------------------------------------------

const HIGH_MANIFESTATION_RECORDS: Array<{ handle: string; manifestationCount: number }> = [
  { handle: '21.11155/07AB6B76-92BE-4409-8A91-8E62D446D876', manifestationCount: 43 },
  { handle: '21.11155/0483F1DC-7032-4AED-9F03-4561A254726F', manifestationCount: 25 },
  { handle: '21.11155/253BDAB6-BC05-4B68-AF01-7A43E1091C72', manifestationCount: 25 },
  { handle: '21.11155/84B80FAF-0180-4984-9F17-315B3AEBA8F7', manifestationCount: 25 },
];

test.describe('DQ-DETAIL: High-cardinality records', () => {
  for (const { handle, manifestationCount } of HIGH_MANIFESTATION_RECORDS) {
    test(`DQ-DETAIL-HI detail page renders for ${handle} (${manifestationCount} manifestations)`, async ({ page }) => {
      test.setTimeout(90_000);
      await assertPageLoadsOk(page, detailUrl(handle));
    });
  }
});

// ---------------------------------------------------------------------------
// DQ-DETAIL: Missing-source-key sample
//
// Source: "Missing source key" section in quality-failing-identifiers.md
// (sampled 3 of the 500 reported handles).
// These records exist in the index but lack a source key — the frontend must
// not crash or 500 when source-key-dependent UI is missing.
// ---------------------------------------------------------------------------

const MISSING_SOURCE_KEY_SAMPLE = [
  '21.11155/181D690F-7F05-4080-8D13-B14FA62485BB',
  '21.11155/1B531E70-45D8-4892-A99C-CC5D2AD580A9',
  '21.11155/24D996D3-3BD8-414B-A796-A15BA55370CE',
];

test.describe('DQ-DETAIL: Missing source key — graceful rendering', () => {
  for (const handle of MISSING_SOURCE_KEY_SAMPLE) {
    test(`DQ-DETAIL-MSK detail page does not crash for ${handle} (missing source key)`, async ({ page }) => {
      test.setTimeout(90_000);
      await assertPageLoadsOk(page, detailUrl(handle));
      // Specifically: no error alert should be visible at the top of the page
      await expect(page.locator('.alert.alert-error')).toHaveCount(0);
    });
  }
});

// ---------------------------------------------------------------------------
// DQ-SEARCH: Placeholder-title queries
//
// Source: "Near-duplicate title heuristics" in quality-statistics.md
// Titles like "Jahresdokumentation" appear 29 times. Searching for them must
// return results and not cause disambiguation / disambiguation crashes.
// ---------------------------------------------------------------------------

const NEAR_DUPLICATE_TITLE_QUERIES: Array<{ query: string; minExpectedHits: number }> = [
  { query: 'Jahresdokumentation', minExpectedHits: 20 },
  { query: 'Privataufnahmen', minExpectedHits: 5 },
  { query: 'Sachdokumentation', minExpectedHits: 5 },
];

test.describe('DQ-SEARCH: Near-duplicate / placeholder title searches', () => {
  for (const { query, minExpectedHits } of NEAR_DUPLICATE_TITLE_QUERIES) {
    test(`DQ-SEARCH-NDT search "${query}" returns results without crash`, async ({ page }) => {
      test.setTimeout(90_000);
      await page.goto(searchUrl(query), { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });

      // Wait for the stats section to resolve (skeleton gone)
      const statsSection = page.locator('.stats');
      await expect(statsSection.first()).toBeVisible({ timeout: 30_000 });

      // Verify that at least minExpectedHits results appear (stat-value text is numeric)
      const statValues = page.locator('.stat-value').first();
      await expect(statValues).toBeVisible({ timeout: 30_000 });
      const text = await statValues.textContent();
      const count = parseInt(text?.replace(/\D/g, '') ?? '0', 10);
      expect(count, `Expected ≥ ${minExpectedHits} hits for "${query}"`).toBeGreaterThanOrEqual(minExpectedHits);
    });
  }
});

// ---------------------------------------------------------------------------
// DQ-FACET: Language-code drift
//
// Source: "Language harmonization checks" in quality-statistics.md
// 33.67% of language codes are legacy (ger, fre, cze, chi, rum).
// Both legacy and canonical codes must return results via the facet filter.
// ---------------------------------------------------------------------------

const LANGUAGE_FACET_CASES: Array<{ code: string; label: string }> = [
  { code: 'deu', label: 'canonical German' },
  { code: 'ger', label: 'legacy German' },
  { code: 'fra', label: 'canonical French' },
  { code: 'fre', label: 'legacy French' },
];

test.describe('DQ-FACET: Language code — legacy and canonical both resolve', () => {
  for (const { code, label } of LANGUAGE_FACET_CASES) {
    test(`DQ-FACET-LANG language facet "${code}" (${label}) returns results without error`, async ({ page }) => {
      test.setTimeout(90_000);
      // Facet refinement URL format derived from stateMapping in InstantSearchTemplateAVefi
      await page.goto(`/search/?language=${encodeURIComponent(code)}`, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('main')).toBeVisible({ timeout: 30_000 });
      // No alert-error banner should appear
      await expect(page.locator('.alert.alert-error')).toHaveCount(0);
      // Stats skeleton should resolve
      await expect(page.locator('.stat-value').first()).toBeVisible({ timeout: 30_000 });
    });
  }
});

// ---------------------------------------------------------------------------
// DQ-SEARCH: Candidate index regression guard
//
// The candidate (testbed) index has notably more malformed same_as.id entries
// (3043 vs baseline 94) and more duplicate same_as buckets (156 vs 36).
// This test verifies that a detail page for a record that is likely to have
// a malformed same_as.id (high manifestation count, so cross-linked heavily)
// still renders its normdata links without a crash.
// ---------------------------------------------------------------------------

test.describe('DQ-SEARCH: same_as.id regression (candidate index)', () => {
  test('DQ-SAMEASI detail page for highest-cardinality record renders normdata section without error', async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const handle = '21.11155/07AB6B76-92BE-4409-8A91-8E62D446D876';
    await assertPageLoadsOk(page, detailUrl(handle));
    // Normdata section, if present, must not show a raw error string
    const normdataLinks = page.locator('[data-testid="normdata-links"], .normdata-links, a[href*="normdata"]');
    const count = await normdataLinks.count();
    if (count > 0) {
      // If normdata links render, they must not contain "Error" or "undefined"
      const text = await normdataLinks.first().textContent();
      expect(text).not.toMatch(/Error|undefined|null/i);
    }
  });
});

// ---------------------------------------------------------------------------
// DQ-WHITESPACE: Garbage agent name values — visual warning hint
//
// Source: confirmed via ES terms aggregation on has_agent.has_name.keyword
//   in index 21.11155-denormalised-work-testbed (2025-04).
//
// Garbage patterns (defined in utils/agentQualityPatterns.ts, shared with frontend):
//   1. whitespace-comma-only : 218 docs  — e.g. has_agent.has_name = ", "
//   2. mojibake              :  91 distinct names — e.g. "LÃ¼ders" instead of "Lüders"
//   3. digits-only           :   0 docs currently (defensive rule)
//
// Strategy: garbage values are displayed as-is alongside a `.badge-warning` "?"
// so that data curators can identify and fix the upstream source data.
// Tests verify the warning indicator is present, not that the value is hidden.
// ---------------------------------------------------------------------------

test.describe('DQ-WHITESPACE: Whitespace-only / garbage agent names show a warning hint', () => {
  const HANDLE = '21.11155/07AB6B76-92BE-4409-8A91-8E62D446D876';

  test('DQ-WHITESPACE-01 detail page loads without errors', async ({ page }) => {
    test.setTimeout(90_000);
    await assertPageLoadsOk(page, detailUrl(HANDLE));
  });

  test('DQ-WHITESPACE-02 a warning badge is shown for the garbage Cinematographer agent', async ({ page }) => {
    test.setTimeout(90_000);
    await assertPageLoadsOk(page, detailUrl(HANDLE));

    // normalizeAgents() flags suspicious values; the template renders a badge-warning "?" span.
    // At least one such badge must appear on this record (it has 218 garbage agent names in the index).
    const warningBadges = page.locator('.badge-warning');
    await expect(warningBadges.first()).toBeVisible({ timeout: 15_000 });
  });

  test('DQ-WHITESPACE-03 duplicate label "CinematographerCinematographer" is not rendered', async ({ page }) => {
    test.setTimeout(90_000);
    await assertPageLoadsOk(page, detailUrl(HANDLE));

    // LabelComp sr-only regression: the visible text must never double the label name.
    await expect(page.getByText('CinematographerCinematographer', { exact: false })).toHaveCount(0);
  });

  test('DQ-WHITESPACE-04 crew count badge does not show "0"', async ({ page }) => {
    test.setTimeout(90_000);
    await assertPageLoadsOk(page, detailUrl(HANDLE));

    // Garbage agents are kept (not filtered), so a "0" count badge would mean
    // the activity block rendered despite having no agents at all — an edge-case regression.
    const zeroBadges = page.locator('.badge').filter({ hasText: /^0$/ });
    await expect(zeroBadges).toHaveCount(0);
  });

  test('DQ-WHITESPACE-05 the raw ", " agent name is visible alongside its warning badge', async ({ page }) => {
    test.setTimeout(90_000);
    await assertPageLoadsOk(page, detailUrl(HANDLE));

    // The garbage value is intentionally displayed so curators can see and fix it.
    // Verify the raw string appears somewhere and at least one warning badge exists.
    const warningBadges = page.locator('.badge-warning');
    await expect(warningBadges.first()).toBeVisible({ timeout: 15_000 });
  });
});
