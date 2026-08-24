import { describe, expect, test } from 'vitest';
import {
  FACET_ICON_MAP,
  getFacetIcon,
  getFacetLevel,
  getFacetLevelClass,
} from '~/models/interfaces/manual/IFacetIconMapping';

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

  test('contains canonical icons for AVefi data levels', () => {
    expect(getFacetIcon('work')).toBe('tabler:stack-1');
    expect(getFacetIcon('works')).toBe('tabler:stack-1');
    expect(getFacetIcon('workVariant')).toBe('tabler:stack-1');
    expect(getFacetIcon('workvariants')).toBe('tabler:stack-1');
    expect(getFacetIcon('avefi:WorkVariant')).toBe('tabler:stack-1');
    expect(getFacetIcon('manifestation')).toBe('tabler:stack-2');
    expect(getFacetIcon('manifestations')).toBe('tabler:stack-2');
    expect(getFacetIcon('avefi:Manifestation')).toBe('tabler:stack-2');
    expect(getFacetIcon('item')).toBe('tabler:stack-3');
    expect(getFacetIcon('items')).toBe('tabler:stack-3');
    expect(getFacetIcon('avefi:Item')).toBe('tabler:stack-3');
  });

  test('maps ambiguous search fields to their display level color classes', () => {
    expect(getFacetLevel('manifestation_event_type')).toBe('manifestation');
    expect(getFacetLevelClass('manifestation_event_type', 'bg')).toBe('bg-manifestation');

    expect(getFacetLevel('has_access_status')).toBe('item');
    expect(getFacetLevelClass('has_access_status', 'bg')).toBe('bg-item');
  });
});
