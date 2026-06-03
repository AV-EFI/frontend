import { expect, test } from '@playwright/test';

const publicRoutes = ['/', '/faq', '/search', '/press'] as const;
const failureMarkers = [
  'This page is temporarily unavailable',
  '<h1>500</h1>',
  '>500<',
] as const;

test.describe('Remote App Health', () => {
  for (const route of publicRoutes) {
    test(`HEALTH ${route} does not serve an error page`, async ({ request }) => {
      const response = await request.get(route, {
        headers: {
          'user-agent': 'AVefi Playwright health check',
        },
      });
      const body = await response.text();
      const marker = failureMarkers.find((candidate) => body.includes(candidate));

      expect(
        response.status(),
        `${route} returned status=${response.status()} body="${body.replace(/\s+/g, ' ').trim().slice(0, 500)}"`,
      ).toBeLessThan(500);
      expect(response.ok(), `${route} returned status=${response.status()}`).toBeTruthy();
      expect(marker, `${route} served a Nuxt/server error page`).toBeUndefined();
    });
  }
});
