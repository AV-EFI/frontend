import { expect, test, type Page } from '@playwright/test';

// The explorer uses bundled, invented examples only, so none of these tests needs the backend.

async function openExplorer(page: Page) {
  const response = await page.goto('/explorer-poc');
  expect(response?.status()).toBe(200);
  const decline = page.getByRole('button', { name: /alle ablehnen|reject all|decline all/i });
  await decline.first().waitFor({ timeout: 8_000 }).then(() => decline.first().click()).catch(() => undefined);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Explorer');
}

// The texts are checked in German, the default language of the site.
test.use({ locale: 'de-DE' });

test.describe('Explorer', () => {
  test('BB-ROUTE-EXPLORER-001 shows the three levels and keeps the information closed at the start', async ({ page }) => {
    await openExplorer(page);

    for (const level of ['Werk', 'Manifestation', 'Exemplar']) {
      await expect(page.locator('.explorer-band-word', { hasText: new RegExp(`^${level}$`) })).toBeVisible();
    }
    await expect(page.locator('.explorer-drawer')).toHaveCount(0);
    await expect(page.locator('.explorer-badge')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('AVefi Explorer');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Datenmodell' })).toBeChecked();
  });

  test('BB-ROUTE-EXPLORER-007 switches the views with tabs and lists the fields of each filter', async ({ page }) => {
    await openExplorer(page);

    const sidebar = page.getByRole('complementary', { name: /Navigation und Filter/ });
    await expect(sidebar.getByRole('button', { name: /Pflichtfelder/ })).toHaveAttribute('aria-pressed', 'false');
    await expect(sidebar.getByRole('button', { name: 'Haupttitel Werk' })).toBeVisible();
    await expect(sidebar.getByRole('button', { name: 'Produktionsort' })).toBeVisible();
    await expect(sidebar.getByText('nichts hervorgehoben')).toHaveCount(0);

    await sidebar.getByRole('button', { name: /Pflichtfelder/ }).click();
    await expect(sidebar.getByRole('button', { name: /Pflichtfelder/ })).toHaveAttribute('aria-pressed', 'true');

    await sidebar.getByRole('button', { name: 'Haupttitel Werk' }).click();
    await expect(page.locator('#explorer-drawer-title')).toHaveText('Titel');
    await page.keyboard.press('Escape');

    // The tabs are the daisyUI radio tabs of the rest of the site: arrow keys move between them.
    await page.getByRole('tab', { name: /Fälle/ }).click();
    await expect(page.getByRole('tab', { name: /Fälle/ })).toBeChecked();
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByRole('tab', { name: 'Datenmodell' })).toBeChecked();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: /Fälle/ })).toBeChecked();
    await expect(page.getByRole('tabpanel', { name: /Fälle/ }).or(page.locator('#explorer-panel-cases')))
      .toContainText('Zwei Lieferungen, ein Werk?');
    await expect(sidebar.getByRole('button', { name: /Pflichtfelder/ })).toHaveCount(0);
  });

  test('BB-ROUTE-EXPLORER-006 the details button opens the information of a level', async ({ page }) => {
    await openExplorer(page);

    await page.getByRole('button', { name: 'Details zu Werk' }).click();
    await expect(page.locator('#explorer-drawer-title')).toHaveText('Werk');
    await page.keyboard.press('Escape');
    await expect(page.locator('.explorer-drawer')).toHaveCount(0);
  });

  test('BB-ROUTE-EXPLORER-002 opens a level and a field, and Escape returns focus to the field', async ({ page }) => {
    await openExplorer(page);

    await page.locator('.explorer-band-toggle', { hasText: 'Exemplar' }).click();
    // Showing the fields does not open the information; the details button does.
    await expect(page.locator('.explorer-drawer')).toHaveCount(0);
    const colour = page.getByRole('button', { name: 'Farbe' }).first();
    await colour.click();

    const drawerTitle = page.locator('#explorer-drawer-title');
    await expect(drawerTitle).toBeFocused();
    await expect(page.locator('.explorer-drawer')).toContainText('has_colour_type');
    await expect(page.locator('.explorer-drawer').getByRole('link', { name: /Im Schema nachlesen/ }).first())
      .toHaveAttribute('href', /av-efi\.github\.io\/av-efi-schema\//);

    await page.keyboard.press('Escape');
    await expect(page.locator('.explorer-drawer')).toHaveCount(0);
    await expect(colour).toBeFocused();
  });

  test('BB-ROUTE-EXPLORER-003 links to the glossary, the FAQ and the documents', async ({ page }) => {
    await openExplorer(page);

    await page.getByRole('button', { name: 'Überblick' }).click();
    const drawer = page.locator('.explorer-drawer');
    await expect(drawer.getByRole('link', { name: /Glossar und Vokabular/ })).toHaveAttribute('href', '/vocab');
    await expect(drawer.getByRole('link', { name: /FAQ: Werk, Manifestation, Exemplar/ }))
      .toHaveAttribute('href', '/faq#faq-sections-definitions');
    await expect(drawer.getByRole('link', { name: /AVefi-Manual/ }))
      .toHaveAttribute('href', 'https://projects.tib.eu/fileadmin/data/av-efi/docs/AVefi_Manual_aktuell.pdf');
    await expect(drawer.getByRole('link', { name: /AVefi-How-to/ }))
      .toHaveAttribute('href', 'https://projects.tib.eu/fileadmin/data/av-efi/docs/AVefi_how-to_aktuell.pdf');
  });

  test('BB-ROUTE-EXPLORER-004 the visitor judges every field before the decision, and the result follows', async ({ page }) => {
    await openExplorer(page);

    await page.getByRole('tab', { name: /Fälle/ }).click();
    await page.getByRole('button', { name: /Fall Undine/ }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Von Hand zusammenführen' })).toBeDisabled();

    for (const index of [0, 1, 2, 4]) await dialog.locator(`input[name="judge-${index}"][value="same"]`).check({ force: true });
    await dialog.locator('input[name="judge-3"][value="diff"]').check({ force: true });

    // Nothing is revealed before the decision.
    await expect(dialog.getByText('Richtig eingeschätzt.')).toHaveCount(0);
    await dialog.getByRole('button', { name: 'Von Hand zusammenführen' }).click();
    await expect(dialog.getByText('Gut entschieden')).toBeVisible();
    await expect(dialog.getByText('Richtig eingeschätzt.')).toHaveCount(5);

    await dialog.getByRole('button', { name: 'Weiter zur Übersicht' }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: /Fall Undine.*geklärt/ })).toBeVisible();
  });

  test('BB-ROUTE-EXPLORER-005 a wrong decision explains the rule and allows another try', async ({ page }) => {
    await openExplorer(page);

    await page.getByRole('tab', { name: /Fälle/ }).click();
    await page.getByRole('button', { name: /Fall Weihnachten/ }).click();
    const dialog = page.getByRole('dialog');
    for (const index of [0, 1, 2, 4]) await dialog.locator(`input[name="judge-${index}"][value="same"]`).check({ force: true });
    await dialog.locator('input[name="judge-3"][value="same"]').check({ force: true });
    await dialog.getByRole('button', { name: 'Zusammenführen' }).click();

    await expect(dialog.getByText('Vorsicht: falsche Zusammenführung')).toBeVisible();
    await expect(dialog.getByText(/Zu Ihren Einschätzungen/)).toBeVisible();
    await dialog.getByRole('button', { name: 'Noch einmal entscheiden' }).click();
    await expect(dialog.getByRole('button', { name: 'Getrennt lassen' })).toBeEnabled();
  });
});
