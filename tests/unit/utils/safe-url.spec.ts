import { describe, expect, test } from 'vitest';
import { safeHref } from '~/utils/safeUrl';

describe('safeHref', () => {
  test.each([
    'https://example.org/a?b=1',
    'http://example.org',
    'mailto:team@example.org',
    '/res/av-efi/123',
    'relative/path',
    '#anchor',
  ])('keeps %s', (value) => {
    expect(safeHref(value)).toBe(value);
  });

  test.each([
    'javascript:alert(1)',
    ' JaVaScRiPt:alert(1)',
    'java\tscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '',
    '   ',
  ])('drops %j', (value) => {
    expect(safeHref(value)).toBeUndefined();
  });

  test('drops non-string values', () => {
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(42)).toBeUndefined();
  });
});
