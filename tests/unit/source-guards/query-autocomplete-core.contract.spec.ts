import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const source = readFileSync(
  resolve(process.cwd(), 'components/search/QueryAutocompleteCore.vue'),
  'utf8'
);

describe('QueryAutocompleteCore contract guards', () => {
  test('CBC-QA-001 keeps v-model proxy as single source of truth', () => {
    expect(source).toContain('const displayValue = computed<string>({');
    expect(source).toContain("get: () => props.modelValue ?? ''");
    expect(source).toContain("set: v => emit('update:modelValue', v)");
  });

  test('CBC-QA-002 keeps keyboard support (arrow, enter, tab, escape)', () => {
    expect(source).toContain("['ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'Tab']");
  });

  test('CBC-QA-003 keeps recent-search event surface', () => {
    expect(source).toContain("'recent-search-click'");
    expect(source).toContain("'remove-recent'");
    expect(source).toContain("'clear-history'");
  });

  test('CBC-QA-004 keeps stale-async race protections', () => {
    expect(source).toContain('fetchToken');
    expect(source).toContain('cancelDebounce');
    expect(source).toContain('onBeforeUnmount');
  });
});
