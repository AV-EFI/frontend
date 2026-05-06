import { defineConfig } from '@playwright/test';
import baseConfig from './playwright.config';

export default defineConfig({
  ...baseConfig,
  testMatch: ['**/smoke/contact-mail-delivery.spec.ts'],
  workers: 1,
  fullyParallel: false,
});
