import { expect, test } from '@playwright/test';

test('news is unavailable unless enabled for the deployment', async ({ page, request }) => {
  const enabled = process.env.NUXT_PUBLIC_NEWS_ENABLED !== undefined
    ? process.env.NUXT_PUBLIC_NEWS_ENABLED === 'true'
    : process.env.CI_ENVIRONMENT_NAME === 'testbed';
  const api = await request.get('/api/news');
  const response = await page.goto('/news');
  if (!enabled) {
    expect(api.status()).toBe(404);
    expect(response?.status()).toBe(404);
    await expect(page.locator('nav a[href="/news"]')).toHaveCount(0);
    return;
  }

  expect(api.status()).toBe(200);
  expect(response?.status()).toBe(200);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
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
