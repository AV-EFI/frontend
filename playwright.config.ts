import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const startWebServer = process.env.PLAYWRIGHT_NO_WEBSERVER !== 'true';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  workers: process.env.CI ? 2 : 4,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: startWebServer
    ? {
        command: 'yarn dev:local',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
