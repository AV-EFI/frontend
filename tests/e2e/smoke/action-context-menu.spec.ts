import { expect, test } from '@playwright/test';

const STABLE_DETAIL_PATH =
  process.env.E2E_DETAIL_PATH || '/res/21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406';

test.describe('Detail action context menu', () => {
  test('renders compare/favourites actions and shows feedback toasts', async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto(STABLE_DETAIL_PATH, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.removeItem('avefi-objectList');
      localStorage.removeItem('avefi-favourites');
      localStorage.removeItem('pinia-favourites');
      localStorage.removeItem('favourites-local-update');
    });
    await page.reload({ waitUntil: 'networkidle' });

    const actionMenuButton = page.locator('.dropdown-end > button:visible').first();
    await expect(actionMenuButton).toBeVisible();

    await actionMenuButton.click();
    const comparisonAction = page.locator('.action-list .btn-compare-list');
    const favouritesAction = page.locator('.action-list .btn-favourites-list');

    await expect(comparisonAction).toBeVisible();
    await expect(favouritesAction).toBeVisible();

    await comparisonAction.click();
    await expect(
      page.locator('.Toastify__toast').filter({
        hasText: /(?:«Metropolis» zum Vergleich hinzugefügt|Added Metropolis to comparison)/,
      })
    ).toBeVisible();

    await actionMenuButton.click();
    await favouritesAction.click();
    await expect(
      page.locator('.Toastify__toast').filter({
        hasText: /(?:«Metropolis» zu Favoriten hinzugefügt|Added Metropolis to Favourites)/,
      })
    ).toBeVisible();

    const stores = await page.evaluate(() => ({
      comparison: JSON.parse(localStorage.getItem('avefi-objectList') || '{}'),
      favourites: JSON.parse(localStorage.getItem('avefi-favourites') || '{}'),
    }));

    expect(stores.comparison.objects).toContainEqual({
      filmId: '21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406',
      filmTitle: 'Metropolis',
    });
    expect(stores.favourites.objects).toContainEqual({
      filmId: '21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406',
      filmTitle: 'Metropolis',
    });
  });
});
