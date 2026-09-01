import { describe, expect, test } from 'vitest';
import { buildManifestationEntries } from '~/utils/iconEntry/buildManifestationEntries';

const translations: Record<string, string> = {
  manifestation_event_type: 'Manifestation Type',
  productionyear: 'Production Year',
  located_in_has_name: 'Location',
  'avefi:Publishing': 'Publishing',
};
const t = (key: string) => translations[key] ?? key;
const iconFor = () => 'tabler-info-circle';

describe('buildManifestationEntries screen-reader labels', () => {
  const data = {
    has_record: {
      has_event: [
        {
          type: 'avefi:Publishing',
          has_date: '1975',
          located_in: [{ has_name: 'Berlin' }],
        },
      ],
    },
  };

  test('translates the event-type aria label instead of leaking a hardcoded German prefix', () => {
    const entries = buildManifestationEntries(data, { t, iconFor });
    const eventType = entries.find((e) => e.key === 'eventType');

    expect(eventType?.aria).toBe('Manifestation Type: Publishing');
    expect(eventType?.aria).not.toMatch(/Manifestationstyp/);
  });

  test('translates the year aria label instead of leaking a hardcoded German prefix', () => {
    const entries = buildManifestationEntries(data, { t, iconFor });
    const year = entries.find((e) => e.key === 'mfYear');

    expect(year?.aria).toBe('Production Year: 1975');
    expect(year?.aria).not.toMatch(/Jahresangabe/);
  });

  test('translates the place aria label instead of leaking a hardcoded German prefix', () => {
    const entries = buildManifestationEntries(data, { t, iconFor });
    const place = entries.find((e) => e.key === 'mfPlace');

    expect(place?.aria).toBe('Location: Berlin');
    expect(place?.aria).not.toMatch(/Ortsangabe/);
  });
});
