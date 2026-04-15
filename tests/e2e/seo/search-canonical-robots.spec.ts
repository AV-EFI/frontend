import { expect, test } from '@playwright/test';

test.describe('Search SEO Contracts', () => {
  test('BB-SEO-SEARCH-001 whitelisted params keep canonicalized query and index,follow', async ({ page }) => {
    await page.goto('/search?query=Berlin&subjects=Krieg&subjects=Arbeit');

    const canonicalHref = await page
      .locator('head link[rel="canonical"]')
      .first()
      .getAttribute('href');
    expect(canonicalHref).toContain('/search');
    expect(canonicalHref).toContain('query=Berlin');
    expect(canonicalHref).toContain('subjects=Arbeit');
    expect(canonicalHref).toContain('subjects=Krieg');

    const robotsContent = await page
      .locator('head meta[name="robots"]')
      .first()
      .getAttribute('content');
    expect(robotsContent).toBe('index,follow');
  });

  test('BB-SEO-SEARCH-002 unknown params force base canonical and noindex,follow', async ({ page }) => {
    await page.goto('/search?query=Berlin&unexpected_param=1');

    const canonicalHref = await page
      .locator('head link[rel="canonical"]')
      .first()
      .getAttribute('href');
    expect(canonicalHref?.endsWith('/search')).toBe(true);

    const robotsContent = await page
      .locator('head meta[name="robots"]')
      .first()
      .getAttribute('content');
    expect(robotsContent).toBe('noindex,follow');
  });
});
