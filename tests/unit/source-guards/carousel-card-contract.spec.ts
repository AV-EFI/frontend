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
    expect(source).toContain("visibleSlideIndexes.value.size > 0");
    expect(source).toContain("'pointer-events-none'");
    expect(source).toContain("'pointer-events-auto relative z-10'");
  });

  test('uses geometry as a fallback for visible slide detection', () => {
    expect(source).toContain("querySelectorAll<HTMLElement>('[data-carousel-slide-index]')");
    expect(source).toContain('visibleArea / slideArea > 0.05');
    expect(source).toContain('visible.add(selectedIndex)');
  });
});
