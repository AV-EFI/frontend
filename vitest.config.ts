/// vitest.config.ts
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        // Nuxt sets import.meta.client = true at build time; replicate that here
        // so composables using that guard (e.g. useLiveToast.announce) behave as
        // they would in a real browser during unit tests.
        define: { 'import.meta.client': true },
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.spec.ts'],
          environment: 'node',
          globals: true,
          testTimeout: 15000,
          setupFiles: ['tests/unit/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'data-quality',
          include: ['tests/data-quality/**/*.spec.ts'],
          environment: 'node',
          globals: true,
          testTimeout: 120000,
          maxWorkers: 1,
          fileParallelism: false,
        },
      },
    ],
  },
});
