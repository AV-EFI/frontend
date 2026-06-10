import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/detail/FilmRelatedMaterialsComp.vue'),
  'utf8'
);

describe('FilmRelatedMaterialsComp accessibility contract guards', () => {
  test('keeps carousel and slide semantics for screenreader navigation', () => {
    expect(source).toContain('aria-roledescription="carousel"');
    expect(source).toContain(':aria-label="$t(\'filmRelatedMaterials\')"');
    expect(source).toContain('aria-live="polite"');
    expect(source).toContain('aria-roledescription="slide"');
    expect(source).toContain(':aria-label="getSlideAriaLabel(entry, index)"');
  });

  test('keeps hidden slides out of the accessibility and keyboard navigation tree', () => {
    expect(source).toContain(':aria-hidden="isSlideHidden(index) ? \'true\' : undefined"');
    expect(source).toContain(':inert="isSlideHidden(index)"');
    expect(source).toContain('function isSlideHidden(index: number): boolean');
  });
});
