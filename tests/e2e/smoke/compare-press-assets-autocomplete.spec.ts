import { expect, test } from '@playwright/test';

test.describe('Compare, Press Assets, and Autocomplete Smoke', () => {
  test('BB-COMPARE-001 /compare without params shows invalid-state alert', async ({ page }) => {
    await page.goto('/compare');
    await expect(page).toHaveURL(/\/compare$/);
    await expect(page.locator('.alert.alert-error')).toBeVisible();
  });

  test('BB-COMPARE-002 /compare with prev/next params renders tablist', async ({ page }) => {
    await page.goto('/compare?prev=demo-prev&next=demo-next');
    await expect(page).toHaveURL(/\/compare\?prev=demo-prev&next=demo-next/);
    await expect(page.locator('[role="tablist"]')).toBeVisible();
  });

  test('BB-PRESS-ASSET-001 manifest and press-kit endpoints are reachable', async ({ page }) => {
    const manifestResponse = await page.request.get('/press/manifest.json');
    expect(manifestResponse.status()).toBe(200);
    expect(manifestResponse.headers()['content-type']).toContain('application/json');

    const zipResponse = await page.request.get('/api/press-kit.zip');
    expect(zipResponse.status()).toBe(200);
    expect(zipResponse.headers()['content-type']).toContain('application/zip');
  });

  test('BB-HOME-AUTOCOMPLETE-001 keyboard submit from home search navigates to /search', async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.goto('/');
    await page.waitForSelector('#home-search-area', { state: 'visible', timeout: 30_000 });
    await page.waitForSelector('#home-search-area input[type="text"]', { state: 'visible', timeout: 30_000 });

    const input = page.locator('#home-search-area input[type="text"]').first();
    await expect(input).toBeVisible({ timeout: 30_000 });

    await input.fill('Berlin');
    await input.press('Enter');

    await expect(page).toHaveURL(/\/search\/\?query=Berlin/);
  });
});
