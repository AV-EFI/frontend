import { describe, expect, test } from 'vitest';
import { buildItemEntries } from '~/utils/iconEntry/buildItemEntries';

const t = (key: string) => key;
const iconFor = (key: string) => `icon-${key}`;
const deps = { t, iconFor };

describe('buildItemEntries', () => {
  test('returns empty array for empty data', () => {
    expect(buildItemEntries({}, deps)).toEqual([]);
    expect(buildItemEntries(null, deps)).toEqual([]);
  });

  test('builds accessStatus entry from has_record.has_access_status', () => {
    const entries = buildItemEntries({ has_record: { has_access_status: 'Public' } }, deps);
    const e = entries.find(e => e.key === 'accessStatus');
    expect(e).toBeDefined();
    expect((e!.text as { text: string }[])[0]!.text).toBe('Public');
  });

  test('builds format entry from has_record.has_format', () => {
    const entries = buildItemEntries({ has_record: { has_format: [{ type: '16mm' }] } }, deps);
    const e = entries.find(e => e.key === 'format');
    expect(e).toBeDefined();
    const texts = (e!.text as { text: string }[]).map(s => s.text);
    expect(texts).toContain('16mm');
  });

  test('builds lang entry with code and usage', () => {
    const entries = buildItemEntries(
      { has_record: { in_language: [{ code: 'ger', usage: ['dubbed'] }] } },
      deps,
    );
    const e = entries.find(e => e.key === 'lang');
    expect(e).toBeDefined();
    const seg = (e!.text as { text: string; facetValue: string }[])[0]!;
    expect(seg.text).toContain('ger');
    expect(seg.text).toContain('dubbed');
    expect(seg.facetValue).toBe('ger');
  });

  test('uses tabler-volume-off icon for silent sound type', () => {
    const entries = buildItemEntries({ has_record: { has_sound_type: 'Silent' } }, deps);
    const e = entries.find(e => e.key === 'sound');
    expect(e?.icon).toBe('tabler-volume-off');
  });

  test('uses standard icon for non-silent sound type', () => {
    const entries = buildItemEntries({ has_record: { has_sound_type: 'Sound' } }, deps);
    const e = entries.find(e => e.key === 'sound');
    expect(e?.icon).toBe('icon-sound');
  });

  test('formats ISO 8601 duration', () => {
    const entries = buildItemEntries(
      { has_record: { has_duration: { has_value: 'PT1H23M45S' } } },
      deps,
    );
    const e = entries.find(e => e.key === 'duration');
    expect(e).toBeDefined();
    expect((e!.text as { text: string }[])[0]!.text).toBe('01:23:45');
  });

  test('builds extent entry with unit', () => {
    const entries = buildItemEntries(
      { has_record: { has_extent: { has_value: '120', has_unit: 'meters' } } },
      deps,
    );
    const e = entries.find(e => e.key === 'extent');
    expect(e).toBeDefined();
    expect((e!.text as { text: string }[])[0]!.text).toBe('120 meters');
  });
});
