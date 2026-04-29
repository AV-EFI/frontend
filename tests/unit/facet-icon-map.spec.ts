import { describe, expect, test } from 'vitest';
import { FACET_ICON_MAP, getFacetIcon } from '~/models/interfaces/manual/IFacetIconMapping';

describe('shared facet icon map', () => {
  test('uses the same icon for status in facets and film metadata', () => {
    expect(FACET_ICON_MAP.has_access_status).toBe('tabler-lock-open');
    expect(getFacetIcon('accessStatus')).toBe(FACET_ICON_MAP.has_access_status);
  });

  test('contains aliases used by GenericIconList key-value metadata', () => {
    [
      'located_in',
      'years',
      'creators',
      'form',
      'prod_events',
      'eventType',
      'mfYear',
      'mfPlace',
      'accessStatus',
      'format',
      'elementType',
      'lang',
      'sound',
      'colour',
      'duration',
      'extent',
      'fps',
    ].forEach((key) => {
      expect(getFacetIcon(key)).not.toBe('tabler-adjustments-horizontal');
    });
  });
});
