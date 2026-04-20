import { expect, test } from '@playwright/test';

const STABLE_DETAIL_PATH =
  process.env.E2E_DETAIL_PATH || '/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406';

test.describe('Behavior Baseline Smoke', () => {
  test('BB-HOME-001 loads home and supports simple/advanced mode switch', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/$/);

    const searchRegion = page.locator('#home-search-area');
    await expect(searchRegion).toBeVisible();

    const buttons = page.locator('#home-search-area button.join-item.btn');
    await expect(buttons.first()).toBeVisible();
    await expect(buttons.nth(1)).toBeVisible();

    await buttons.nth(1).click();
    await expect(page).toHaveURL(/\/$/);

    await buttons.nth(0).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('BB-HOME-002 search route is reachable', async ({ page }) => {
    await page.goto('/search');
    await expect(page).toHaveURL(/\/search/);
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('BB-DETAIL-001 stable detail route is reachable', async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto(STABLE_DETAIL_PATH);
    await expect(page).toHaveURL(new RegExp(STABLE_DETAIL_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
  });
});
