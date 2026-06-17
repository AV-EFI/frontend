// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { computed } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const toggleFacetValue = vi.fn();
const getFacetToggleHref = vi.fn();
let active = false;
let routePath = '/search';

const translations: Record<string, string> = {
  addFilter: 'Filter hinzufügen',
  remove: 'Entfernen',
  creators: 'Filmschaffende',
  ['has_genre_has_name']: 'Genre',
  ['manifestation_event_type']: 'Manifestationstyp',
};

async function mountClickableFacetValue(props: { attribute: string; value: string; label?: string }) {
  vi.stubGlobal('computed', computed);
  vi.stubGlobal('useRoute', () => ({
    path: routePath,
  }));
  vi.stubGlobal('useI18n', () => ({
    t: (key: string) => translations[key] ?? key,
    te: (key: string) => key in translations,
  }));
  vi.stubGlobal('useSearchFacetToggle', () => ({
    getFacetToggleHref,
    isFacetValueActive: vi.fn(() => active),
    toggleFacetValue,
  }));

  const { default: ClickableFacetValue } = await import('~/components/search/ClickableFacetValue.vue');

  return mount(ClickableFacetValue, {
    props,
    slots: {
      default: props.label || props.value,
    },
  });
}

describe('ClickableFacetValue', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    toggleFacetValue.mockReset();
    getFacetToggleHref.mockReset();
    getFacetToggleHref.mockReturnValue('/search?creators=Reiniger%2C%20Lotte');
    active = false;
    routePath = '/search';
  });

  test('uses translated facet names in the add-filter label', async () => {
    const wrapper = await mountClickableFacetValue({
      attribute: 'creators',
      value: 'Reiniger, Lotte',
    });

    expect(wrapper.attributes('aria-label')).toBe('Filter hinzufügen: Filmschaffende = Reiniger, Lotte');
    expect(wrapper.attributes('title')).toBe('Filter hinzufügen: Filmschaffende = Reiniger, Lotte');
  });

  test('uses translated facet names in the remove-filter label', async () => {
    active = true;

    const wrapper = await mountClickableFacetValue({
      attribute: 'manifestation_event_type',
      value: 'ManifestationEventTypeRelease',
      label: 'Release',
    });

    expect(wrapper.attributes('aria-label')).toBe('Entfernen: Manifestationstyp = Release');
  });

  test('falls back to the technical attribute name when no translation exists', async () => {
    const wrapper = await mountClickableFacetValue({
      attribute: 'unknown_facet',
      value: 'Wert',
    });

    expect(wrapper.attributes('aria-label')).toBe('Filter hinzufügen: unknown_facet = Wert');
  });

  test('opens detail-page facet links in a new tab', async () => {
    routePath = '/res/21.11155/work-1';

    const wrapper = await mountClickableFacetValue({
      attribute: 'creators',
      value: 'Reiniger, Lotte',
    });

    const link = wrapper.get('a');
    expect(link.attributes('href')).toBe('/search?creators=Reiniger%2C%20Lotte');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
  });
});
