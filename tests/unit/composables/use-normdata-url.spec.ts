import { describe, expect, test } from 'vitest';
import { useNormdataUrl } from '~/composables/useNormdataUrl';

describe('useNormdataUrl', () => {
  test('resolves DOI authority references to doi.org URLs', () => {
    const { getNormdataUrl } = useNormdataUrl();

    expect(getNormdataUrl('avefi:DOIResource', '10.1234/item-doi-1')).toBe('https://doi.org/10.1234/item-doi-1');
  });
});
