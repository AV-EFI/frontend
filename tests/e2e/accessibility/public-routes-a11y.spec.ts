import { expect, test, type Page } from '@playwright/test';

const publicRoutes = [
  '/',
  '/faq',
  '/press',
  '/vocab',
  '/compare',
  '/compare?prev=demo-prev&next=demo-next',
];

const ignoredConsolePatterns = [
  /favicon/i,
  /ResizeObserver loop/i,
  /Failed to load resource.*(404|net::ERR_ABORTED)/i,
];

async function collectStructuralA11yIssues(page: Page) {
  return page.evaluate(() => {
    const issues: string[] = [];

    const visible = (element: Element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };

    const text = (element: Element) => (element.textContent || '').replace(/\s+/g, ' ').trim();
    const accessibleName = (element: Element) =>
      element.getAttribute('aria-label') ||
      element.getAttribute('title') ||
      text(element);

    if (!document.querySelector('main')) {
      issues.push('missing main landmark');
    }

    const visibleHeadings = [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')]
      .filter(visible);
    if (visibleHeadings.length === 0) {
      issues.push('no visible heading');
    }

    for (const button of [...document.querySelectorAll('button')].filter(visible)) {
      if (!accessibleName(button)) {
        issues.push('visible button without accessible name');
      }
    }

    for (const link of [...document.querySelectorAll('a[href]')].filter(visible)) {
      if (!accessibleName(link)) {
        issues.push(`visible link without accessible name: ${link.getAttribute('href') || ''}`);
      }
    }

    for (const image of [...document.querySelectorAll('img')].filter(visible)) {
      if (!image.hasAttribute('alt')) {
        issues.push(`visible image missing alt: ${image.getAttribute('src') || ''}`);
      }
    }

    const horizontalOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    if (horizontalOverflow > 2) {
      issues.push(`page has horizontal overflow of ${horizontalOverflow}px`);
    }

    return issues;
  });
}

test.describe('Public Route Accessibility Smoke', () => {
  for (const route of publicRoutes) {
    test(`A11Y-SMOKE ${route} has basic semantic and console health`, async ({ page }) => {
      const severeMessages: string[] = [];

      page.on('console', (message) => {
        if (!['error', 'warning'].includes(message.type())) return;

        const text = message.text();
        if (ignoredConsolePatterns.some((pattern) => pattern.test(text))) return;
        severeMessages.push(`${message.type()}: ${text}`);
      });

      page.on('pageerror', (error) => {
        severeMessages.push(`pageerror: ${error.message}`);
      });

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response, `No HTTP response while loading ${route}`).toBeTruthy();
      expect(response!.status(), `${route} returned a server error`).toBeLessThan(500);

      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();

      const issues = await collectStructuralA11yIssues(page);
      expect(issues, `${route} structural accessibility issues`).toEqual([]);
      expect(severeMessages, `${route} console/page errors`).toEqual([]);
    });
  }
});
