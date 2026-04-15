import { expect, test } from '@playwright/test';

test.describe('Public Route and Auth Smoke', () => {
  test('BB-ROUTE-FAQ-001 /faq renders', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveURL(/\/faq/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('BB-ROUTE-PRESS-001 /press renders', async ({ page }) => {
    await page.goto('/press');
    await expect(page).toHaveURL(/\/press/);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="/api/press-kit.zip"]')).toBeVisible();
  });

  test('BB-ROUTE-VOCAB-001 /vocab renders', async ({ page }) => {
    await page.goto('/vocab');
    await expect(page).toHaveURL(/\/vocab/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('BB-AUTH-ADMIN-001 unauthenticated /admin route redirects away', async ({ page }) => {
    await page.goto('/admin/user_tooltips');
    await expect(page).toHaveURL(/\/$/);
  });
});
