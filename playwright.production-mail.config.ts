import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testMatch: ['**/smoke/production-mail-to-secondary.spec.ts'],
  workers: 1,
  fullyParallel: false,
});
