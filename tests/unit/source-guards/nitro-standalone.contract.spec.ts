import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const nuxtConfig = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8');

describe('Nitro standalone deployment guards', () => {
  test('inlines Vue SSR packages required by standalone Docker output', () => {
    expect(nuxtConfig).toContain('/^vue(?:\\/.*)?$/');
    expect(nuxtConfig).toContain('/^@vue\\/server-renderer(?:\\/.*)?$/');
  });
});
