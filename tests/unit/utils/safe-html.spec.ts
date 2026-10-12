import { describe, expect, test } from 'vitest';
import { escapeHtml, markMatches, sanitizeHighlightHtml } from '~/utils/safeHtml';

const PAYLOADS = [
  '<img src=x onerror=alert(1)>',
  '<script>alert(1)</script>',
  '<a href="javascript:alert(1)">x</a>',
  '<mark onmouseover="alert(1)">x</mark>',
];

describe('escapeHtml', () => {
  test('escapes markup characters', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });
});

describe('sanitizeHighlightHtml', () => {
  test('keeps plain mark and em tags', () => {
    expect(sanitizeHighlightHtml('Der <mark>Film</mark> und <em>Ton</em>')).toBe('Der <mark>Film</mark> und <em>Ton</em>');
  });

  test.each(PAYLOADS)('neutralises payload %s', (payload) => {
    const result = sanitizeHighlightHtml(payload);
    expect(result).not.toMatch(/<(?!\/?(mark|em)>)/i);
  });

  test('escapes mark tags carrying attributes', () => {
    expect(sanitizeHighlightHtml('<mark onmouseover="x">a</mark>')).toBe('&lt;mark onmouseover=&quot;x&quot;&gt;a</mark>');
  });
});

describe('markMatches', () => {
  test('marks matches case-insensitively and escapes the rest', () => {
    expect(markMatches('Metropolis <b>1927</b>', 'metro')).toBe('<mark>Metro</mark>polis &lt;b&gt;1927&lt;/b&gt;');
  });

  test('does not match inside generated entities', () => {
    expect(markMatches('a & b', 'amp')).toBe('a &amp; b');
  });

  test('treats regex characters in the query literally', () => {
    expect(markMatches('a.b (c)', '(c)')).toBe('a.b <mark>(c)</mark>');
  });

  test('escapes the text when the query is empty', () => {
    expect(markMatches('<script>', '  ')).toBe('&lt;script&gt;');
  });

  test.each(PAYLOADS)('escapes payload %s when it is also the query', (payload) => {
    expect(markMatches(payload, payload)).not.toMatch(/<(?!\/?mark>)/i);
  });
});
