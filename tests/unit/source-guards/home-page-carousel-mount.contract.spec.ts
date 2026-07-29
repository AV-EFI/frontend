import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'pages/index.vue'),
  'utf8',
);

describe('Home page carousel mount contract', () => {
  test('renders mobile featured cards in SSR and keeps the carousel desktop-only after mount', () => {
    expect(source).toContain('<div class="md:hidden space-y-4" role="list">');
    expect(source).toContain('mobile-featured-card');
    expect(source).toContain('index === 0 ? \'eager\' : \'lazy\'');
    expect(source).toContain('index === 0 ? \'high\' : \'auto\'');
    expect(source).toContain('<div v-if="isClientMounted && featuredCarouselEnabled" class="hidden md:block h-full min-h-100">');
    expect(source).toContain('<LazyGlobalCarouselCardComp');
    expect(source).toContain("window.matchMedia('(min-width: 768px)')");
    expect(source).toContain('rounded-xl border border-dashed border-base-300 bg-base-100');
  });
});
