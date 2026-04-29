import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/search/InstantSearchTemplateAVefi.vue'),
  'utf8'
);

describe('creators routing migration contract', () => {
  test('maps legacy directors_or_editors URL refinements to creators state', () => {
    expect(source).toContain("key === 'directors_or_editors' ? 'creators' : key");
  });
});
