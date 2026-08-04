import { describe, expect, test } from 'vitest';
import de from '~/i18n/locales/de';

describe('German maintenance banner locale', () => {
  test('uses German umlauts in fallback copy', () => {
    const maintenanceBanner = de.maintenanceBanner;

    expect(maintenanceBanner.planned.message).toContain('möglicherweise');
    expect(maintenanceBanner.planned.message).toContain('eingeschränkt');
    expect(maintenanceBanner.planned.message).toContain('verfügbar');
    expect(maintenanceBanner.active.title).toContain('Störung');
    expect(maintenanceBanner.active.message).toContain('nicht verfügbar');
  });

  test('does not reintroduce common ASCII fallback spellings in German UI copy', () => {
    const serializedLocale = JSON.stringify(de);
    const fallbackFragments = [
      'voruebergehend',
      'verfuegbar',
      'Fuegen',
      'Eintraege',
      'geoeffnet',
      'pruefen',
      'ausgewaehlten',
      'uebertragen',
      'fuer Grundfunktionen',
      'koennen Sie',
    ];

    fallbackFragments.forEach((fragment) => {
      expect(serializedLocale).not.toContain(fragment);
    });
  });
});
