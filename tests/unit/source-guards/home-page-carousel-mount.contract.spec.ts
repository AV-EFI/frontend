import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'pages/index.vue'),
  'utf8',
);

describe('Home page carousel mount contract', () => {
  test('keeps the featured carousel behind client mount with a placeholder fallback', () => {
    expect(source).toContain('<div v-if="isClientMounted" class="h-full min-h-100">');
    expect(source).toContain('<LazyGlobalCarouselCardComp');
    expect(source).toContain('v-else');
    expect(source).toContain('rounded-xl border border-dashed border-base-300 bg-base-100');
  });
});
