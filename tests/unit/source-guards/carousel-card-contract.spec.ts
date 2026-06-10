import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(
  resolve(process.cwd(), 'components/global/CarouselCardComp.vue'),
  'utf8',
);

describe('CarouselCardComp interaction contract', () => {
  test('keeps offscreen slides inert while preserving visible carousel item buttons', () => {
    expect(source).toContain(':inert="isSlideHidden(index)"');
    expect(source).toContain(':inert="isSlideHidden(createSlideIndex)"');
    expect(source).toContain('function isSlideHidden(index: number): boolean');
  });
});
