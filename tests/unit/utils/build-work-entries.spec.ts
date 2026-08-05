import { describe, expect, test, vi } from 'vitest';
import { buildWorkEntries } from '~/utils/iconEntry/buildWorkEntries';

const t = (key: string) => key;
const getLocalizedPlaceLabel = vi.fn(() => '');
const iconFor = (key: string) => `icon-${key}`;
const deps = { t, getLocalizedPlaceLabel, iconFor };

describe('buildWorkEntries', () => {
  test('returns empty array for empty data', () => {
    expect(buildWorkEntries({}, deps)).toEqual([]);
    expect(buildWorkEntries(null, deps)).toEqual([]);
  });

  test('builds a creators entry from creators field', () => {
    const entries = buildWorkEntries({ creators: ['Reiniger, Lotte', 'Müller, Heinz'] }, deps);
    const creators = entries.find(e => e.key === 'creators');
    expect(creators).toBeDefined();
    expect(Array.isArray(creators!.text)).toBe(true);
    const texts = (creators!.text as { text: string }[]).map(s => s.text);
    expect(texts).toContain('Reiniger, Lotte');
    expect(texts).toContain('Müller, Heinz');
  });

  test('falls back to directors_or_editors when creators is absent', () => {
    const entries = buildWorkEntries({ directors_or_editors: ['Legacy Director'] }, deps);
    const creators = entries.find(e => e.key === 'creators');
    expect(creators).toBeDefined();
    const texts = (creators!.text as { text: string }[]).map(s => s.text);
    expect(texts).toContain('Legacy Director');
  });

  test('prefers creators over directors_or_editors', () => {
    const entries = buildWorkEntries(
      { creators: ['Real Creator'], directors_or_editors: ['Old Name'] },
      deps,
    );
    const creators = entries.find(e => e.key === 'creators');
    const texts = (creators!.text as { text: string }[]).map(s => s.text);
    expect(texts).toContain('Real Creator');
    expect(texts).not.toContain('Old Name');
  });

  test('builds a years entry from d.years', () => {
    const entries = buildWorkEntries({ years: ['1929', '1930'] }, deps);
    const years = entries.find(e => e.key === 'years');
    expect(years).toBeDefined();
    const texts = (years!.text as { text: string }[]).map(s => s.text);
    expect(texts).toEqual(['1929', '1930']);
  });

  test('builds a years entry from production_in_year object', () => {
    const entries = buildWorkEntries(
      { production_in_year: { gte: 1977, lte: 1978 } },
      deps,
    );
    const years = entries.find(e => e.key === 'years');
    expect(years).toBeDefined();
    expect((years!.text as { text: string }[])[0]?.text).toBe('1977–1978');
  });

  test('builds a genre entry from has_record.has_genre', () => {
    const entries = buildWorkEntries(
      { has_record: { has_genre: [{ has_name: 'Documentary' }] } },
      deps,
    );
    const genre = entries.find(e => e.key === 'genre');
    expect(genre).toBeDefined();
    const texts = (genre!.text as { text: string }[]).map(s => s.text);
    expect(texts).toContain('Documentary');
  });

  test('builds a subject entry from subjects array', () => {
    const entries = buildWorkEntries({ subjects: ['History', 'Film'] }, deps);
    const subject = entries.find(e => e.key === 'subject');
    expect(subject).toBeDefined();
    const texts = (subject!.text as { text: string }[]).map(s => s.text);
    expect(texts).toEqual(['History', 'Film']);
  });

  test('uses facetValue from raw value for genre (for clickable facets)', () => {
    const entries = buildWorkEntries(
      { has_record: { has_genre: [{ has_name: 'Animation' }] } },
      deps,
    );
    const genre = entries.find(e => e.key === 'genre');
    const segs = genre!.text as { text: string; facetValue: string }[];
    expect(segs[0]?.facetValue).toBe('Animation');
  });
});
