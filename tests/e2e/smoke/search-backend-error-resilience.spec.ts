import { expect, test } from '@playwright/test';

const SEARCH_ENDPOINT_SEGMENT = '/frontend/search';

test.describe('Search backend error resilience', () => {
  test('SBER-001 shows warning and UI stays interactive when backend returns 500', async ({ page }) => {
    await page.route(`**${SEARCH_ENDPOINT_SEGMENT}**`, async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'backend failure' }),
      });
    });

    await page.goto('/search?query=Metropolis', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('main')).toBeVisible();

    const warningAlert = page.locator('.alert-error[role="alert"]').first();
    await expect(warningAlert).toBeVisible({ timeout: 15_000 });

    const clearAllButton = page.getByRole('button', { name: /clear all/i });
    await expect(clearAllButton).toBeVisible();
    await clearAllButton.click({ force: true });

    await expect(page).toHaveURL(/\/search/);
    await expect(page.getByRole('main')).toBeVisible();
  });
});
