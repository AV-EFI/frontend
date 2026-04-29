import { describe, expect, test } from 'vitest';
import { config } from '~/searchConfig_avefi';

describe('search config creators field migration', () => {
  test('uses creators as the primary filmmakers search and facet field', () => {
    const settings = config.search_settings;

    expect(settings.search_attributes).toContainEqual({ field: 'creators', weight: 1 });
    expect(settings.highlight_attributes).toContain('creators');
    expect(settings.facet_attributes).toContainEqual({
      attribute: 'creators',
      field: 'creators.keyword',
      type: 'string',
    });

    expect(settings.search_attributes).not.toContainEqual({ field: 'directors_or_editors', weight: 1 });
    expect(settings.highlight_attributes).not.toContain('directors_or_editors');
  });

  test('keeps directors_or_editors only as a result fallback field during migration', () => {
    const settings = config.search_settings;

    expect(settings.result_attributes).toContain('creators');
    expect(settings.result_attributes).toContain('directors_or_editors');
  });
});
