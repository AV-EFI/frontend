import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(
  resolve(process.cwd(), 'components/global/CarouselCardComp.vue'),
  'utf8',
);

describe('CarouselCardComp interaction contract', () => {
  test('does not make slides inert because that blocks visible carousel item buttons', () => {
    expect(source).not.toContain(':inert=');
  });
});
