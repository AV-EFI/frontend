import { describe, expect, test } from 'vitest';
import { useNormdataUrl } from '~/composables/useNormdataUrl';

describe('useNormdataUrl', () => {
  const { getNormdataUrl } = useNormdataUrl();

  test('builds resolver URLs for known categories', () => {
    expect(getNormdataUrl('avefi:GNDResource', '123')).toBe('https://explore.gnd.network/gnd/123');
  });

  test('keeps a full https URL for unknown categories', () => {
    expect(getNormdataUrl('other', 'https://example.org/x')).toBe('https://example.org/x');
  });

  test.each(['javascript:alert(1)', 'data:text/html,x'])('drops the unsafe scheme %s', (id) => {
    expect(getNormdataUrl('other', id)).toBe('');
  });
});
