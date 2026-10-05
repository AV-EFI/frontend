import { expect, test } from '@playwright/test';

test('news is unavailable unless enabled for the deployment', async ({ page, request }) => {
  const enabled = process.env.NUXT_PUBLIC_NEWS_ENABLED !== undefined
    ? process.env.NUXT_PUBLIC_NEWS_ENABLED === 'true'
    : process.env.CI_ENVIRONMENT_NAME === 'testbed';
  const api = await request.get('/api/news');
  const response = await page.goto('/news');
  const home = await page.goto('/');
  const homeNewsSection = page.getByRole('region', { name: /news|nachrichten/i });
  if (!enabled) {
    expect(api.status()).toBe(404);
    expect(response?.status()).toBe(404);
    await expect(page.locator('nav a[href="/news"]')).toHaveCount(0);
    await expect(homeNewsSection).toHaveCount(0);
    return;
  }

  expect(home?.status()).toBe(200);
  await expect(homeNewsSection).toBeVisible();
  await expect(homeNewsSection.locator('a[href="/news"]')).toBeVisible();
  const homeCards = homeNewsSection.locator('article h3');
  const homeCardCount = await homeCards.count();
  expect(homeCardCount).toBeGreaterThan(0);
  expect(homeCardCount).toBeLessThanOrEqual(3);
  await expect(homeCards.first()).not.toBeEmpty();
  // The source link only appears once an article is expanded on the home page.
  await homeNewsSection.locator('button[aria-controls^="home-news-panel-"]').first().click();
  await expect(homeNewsSection.locator('a[href^="https://projects.tib.eu/av-efi/"]').first()).toBeVisible();

  expect(api.status()).toBe(200);
  expect(response?.status()).toBe(200);
  await page.goto('/news');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^noindex, nofollow/);
  const article = page.locator('article').first();
  await expect(article.locator('h2')).not.toBeEmpty();
  const summary = article.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(article.locator('details')).toHaveAttribute('open', '');
  await page.keyboard.press('Enter');
  await expect(article.locator('details')).not.toHaveAttribute('open', '');
  await expect(article.locator('a.link')).toHaveAttribute('href', /^https:\/\/projects.tib.eu\/av-efi\//);

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});
