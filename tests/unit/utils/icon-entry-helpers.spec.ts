import { describe, expect, test } from 'vitest';
import { asArray, segment, orderEntries } from '~/utils/iconEntry/entryHelpers';
import type { IconEntry } from '~/types/iconEntry';

describe('asArray', () => {
  test('returns arrays unchanged', () => {
    expect(asArray([1, 2, 3])).toEqual([1, 2, 3]);
  });

  test('wraps a non-array truthy value in an array', () => {
    expect(asArray('hello')).toEqual(['hello']);
    expect(asArray(42)).toEqual([42]);
  });

  test('returns empty array for null', () => {
    expect(asArray(null)).toEqual([]);
  });

  test('returns empty array for undefined', () => {
    expect(asArray(undefined)).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    expect(asArray('')).toEqual([]);
  });
});

describe('segment', () => {
  test('creates a segment with text and matching facetValue by default', () => {
    const s = segment('Berlin');
    expect(s.text).toBe('Berlin');
    expect(s.facetValue).toBe('Berlin');
    expect(s.hilite).toBe(false);
  });

  test('uses a separate facetValue when provided', () => {
    const s = segment('Berlin (DE)', 'Berlin');
    expect(s.text).toBe('Berlin (DE)');
    expect(s.facetValue).toBe('Berlin');
  });

  test('trims whitespace from text and facetValue', () => {
    const s = segment('  trim me  ', '  also  ');
    expect(s.text).toBe('trim me');
    expect(s.facetValue).toBe('also');
  });

  test('coerces null/undefined to empty string', () => {
    const s = segment(null);
    expect(s.text).toBe('');
    expect(s.facetValue).toBe('');
  });
});

describe('orderEntries', () => {
  const make = (key: string): IconEntry => ({ key, icon: '', text: [], aria: '' });

  test('orders work entries according to the work order array', () => {
    const entries = [make('subject'), make('creators'), make('years'), make('located_in')];
    const ordered = orderEntries(entries, 'work');
    expect(ordered.map(e => e.key)).toEqual(['located_in', 'years', 'creators', 'subject']);
  });

  test('orders item entries according to the item order array', () => {
    const entries = [make('colour'), make('format'), make('lang')];
    const ordered = orderEntries(entries, 'item');
    expect(ordered.map(e => e.key)).toEqual(['format', 'lang', 'colour']);
  });

  test('appends unknown keys after the ordered ones', () => {
    const entries = [make('unknownKey'), make('creators')];
    const ordered = orderEntries(entries, 'work');
    expect(ordered[0]?.key).toBe('creators');
    expect(ordered[ordered.length - 1]?.key).toBe('unknownKey');
  });

  test('handles empty entries array', () => {
    expect(orderEntries([], 'work')).toEqual([]);
  });
});
