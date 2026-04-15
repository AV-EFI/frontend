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
    include: ['tests/unit/**/*.spec.ts'],
    environment: 'node',
    globals: true,
    testTimeout: 15000,
    setupFiles: ['tests/unit/setup.ts'],
  },
});
