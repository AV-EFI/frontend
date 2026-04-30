import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/search/InstantSearchTemplateAVefi.vue'),
  'utf8'
);

describe('creators routing migration contract', () => {
  test('mapFacetAttributeForBackend is a no-op pass-through (alias mapping removed)', () => {
    // The backend now accepts the `creators` key natively, so no alias translation
    // is needed.  This contract test guards against accidental re-introduction of the
    // old directors_or_editors → creators mapping.
    //
    // The function must exist (it's still called by mapFacetFilterForBackend) but
    // must simply return its argument unchanged.
    expect(source).toContain('function mapFacetAttributeForBackend(attribute: string)');
    // The body must be just `return attribute;` with no conditional branching.
    const fnMatch = source.match(/function mapFacetAttributeForBackend\(attribute: string\)\s*\{([^}]*)\}/s);
    expect(fnMatch).not.toBeNull();
    const body = fnMatch![1].trim();
    expect(body).toBe('return attribute;');
  });

  test('directors_or_editors alias is not present in mapFacetAttributeForBackend', () => {
    // The mapping was removed when the backend team accepted `creators` natively.
    expect(source).not.toContain("key === 'directors_or_editors' ? 'creators' : key");
  });
});
