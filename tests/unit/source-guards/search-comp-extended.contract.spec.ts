import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/global/SearchCompExtended.vue'),
  'utf8'
);

describe('SearchCompExtended contract guards', () => {
  test('CBC-SEARCH-EXT-001 keeps has_access_status in facet blacklist', () => {
    expect(source).toContain("'has_access_status'");
  });

  test('CBC-SEARCH-EXT-002 keeps debounced suggestions endpoint', () => {
    expect(source).toContain('/api/elastic/suggestions');
    expect(source).toContain('debounceFetch');
    expect(source).toContain('AbortController');
  });

  test('CBC-SEARCH-EXT-003 keeps empty-submit validation behavior', () => {
    expect(source).toContain('showValidationWarning');
    expect(source).toContain('if (!canSubmit.value)');
  });

  test('CBC-SEARCH-EXT-004 keeps URL builder with query + facet parameters', () => {
    expect(source).toContain("params.append('query', q)");
    expect(source).toContain("params.append(`[${f.facet}][0]`, f.valueRaw)");
  });
});
