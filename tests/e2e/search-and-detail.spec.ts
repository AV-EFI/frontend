import { test, expect } from '@playwright/test';

// Basis-URL für Tests: lokal oder remote
const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// E2E test: Suche und Detailseite

test.describe('AVefi Suche und Detailseite', () => {
  test('Suche zeigt Ergebnisse und Detailseite funktioniert', async ({ page }) => {
    // Gehe zur Startseite (lokal oder remote)
    await page.goto(BASE_URL);

    // Suche nach "Leipzig"
    await page.getByPlaceholder('Suchbegriff').fill('Leipzig');
    await page.getByRole('button', { name: /suchen|search/i }).click();

    // Es sollten Suchergebnisse erscheinen
    await expect(page.getByText(/Leipzig/i)).toBeVisible();

    // Klicke auf das erste Suchergebnis (Link zur Detailseite)
    const firstResult = page.locator('.search-panel__results a').first();
    await firstResult.click();

    // Die Detailseite sollte geladen werden
    await expect(page.getByRole('heading', { name: /Leipzig/i })).toBeVisible();
    // Modus-Switch sollte sichtbar sein
    await expect(page.getByRole('button', { name: /defaultDetailView/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /exemplarDetailView/i })).toBeVisible();
  });
});
