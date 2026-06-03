import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const storeFiles = [
  'stores/compareList.ts',
  'stores/favourites.ts',
  'stores/locale.ts',
  'stores/searchParams.ts',
];

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

describe('Pinia and persisted-state migration guards', () => {
  test('stores use Pinia 3 compatible defineStore(id, options) form', () => {
    for (const file of storeFiles) {
      expect(source(file), `${file} must not use Pinia 2 object-only defineStore form`).not.toMatch(
        /defineStore\s*\(\s*\{/,
      );
    }
  });

  test('stores do not rely on removed persistedState global', () => {
    for (const file of storeFiles) {
      expect(source(file), `${file} must not reference the removed persistedState global`).not.toContain(
        'persistedState',
      );
    }
  });

  test('persisted stores use explicit SSR-safe storage helpers', () => {
    expect(source('stores/compareList.ts')).toContain("import { persistedLocalStorage } from '~/utils/persistedStorage'");
    expect(source('stores/favourites.ts')).toContain("import { persistedLocalStorage } from '~/utils/persistedStorage'");
    expect(source('stores/searchParams.ts')).toContain("import { persistedSessionStorage } from '~/utils/persistedStorage'");
  });

  test('legacy custom persisted-state plugin is not reintroduced', () => {
    expect(existsSync(resolve(process.cwd(), 'plugins/persistedStatePlugin.ts'))).toBe(false);
  });
});
