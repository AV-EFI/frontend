// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { computed } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';

const toggleFacetValue = vi.fn();
const getFacetToggleHref = vi.fn();
const getNewSearchLocation = vi.fn();
let active = false;
let routePath = '/search';

const translations: Record<string, string> = {
  addFilter: 'Filter hinzufügen',
  remove: 'Entfernen',
  creators: 'Filmschaffende',
  ['has_genre_has_name']: 'Genre',
  ['manifestation_event_type']: 'Manifestationstyp',
  ['facetMenu.addToSearch']: 'Zur Suche hinzufügen',
  ['facetMenu.newSearch']: 'Neue Suche',
  openSearchWithFacetInNewTab: 'Neue Suchseite in neuem Tab öffnen mit aktivem Filter: {attribute} = {value}',
};

async function mountClickableFacetValue(props: { attribute: string; value: string; label?: string }) {
  vi.stubGlobal('computed', computed);
  vi.stubGlobal('useRoute', () => ({
    path: routePath,
  }));
  vi.stubGlobal('useRouter', () => ({
    push: vi.fn(),
    resolve: vi.fn(() => ({ href: '' })),
  }));
  vi.stubGlobal('useI18n', () => ({
    t: (key: string, params?: Record<string, string>) => {
      const translation = translations[key] ?? key;
      return translation
        .replace('{attribute}', params?.attribute ?? '')
        .replace('{value}', params?.value ?? '');
    },
    te: (key: string) => key in translations,
  }));
  vi.stubGlobal('useSearchFacetToggle', () => ({
    getFacetToggleHref,
    isFacetValueActive: vi.fn(() => active),
    toggleFacetValue,
    getNewSearchLocation,
  }));

  const { default: ClickableFacetValue } = await import('~/components/search/ClickableFacetValue.vue');

  return mount(ClickableFacetValue, {
    props,
    slots: {
      default: props.label || props.value,
    },
    global: {
      stubs: {
        Icon: { template: '<span />' },
        ClientOnly: { template: '<slot />' },
        Teleport: { template: '<div />' },
      },
    },
  });
}

describe('ClickableFacetValue', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
    toggleFacetValue.mockReset();
    getFacetToggleHref.mockReset();
    getNewSearchLocation.mockReset();
    getFacetToggleHref.mockReturnValue('/search?creators=Reiniger%2C%20Lotte');
    getNewSearchLocation.mockReturnValue({ path: '/search', query: {} });
    active = false;
    routePath = '/search';
  });

  test('uses translated facet names in the add-filter label', async () => {
    const wrapper = await mountClickableFacetValue({
      attribute: 'creators',
      value: 'Reiniger, Lotte',
    });

    const btn = wrapper.find('button');
    expect(btn.attributes('aria-label')).toBe('Filter hinzufügen: Filmschaffende = Reiniger, Lotte');
    expect(btn.attributes('title')).toBe('Filter hinzufügen: Filmschaffende = Reiniger, Lotte');
  });

  test('uses translated facet names in the remove-filter label', async () => {
    active = true;

    const wrapper = await mountClickableFacetValue({
      attribute: 'manifestation_event_type',
      value: 'ManifestationEventTypeRelease',
      label: 'Release',
    });

    const btn = wrapper.find('button');
    expect(btn.attributes('aria-label')).toBe('Entfernen: Manifestationstyp = Release');
  });

  test('falls back to the technical attribute name when no translation exists', async () => {
    const wrapper = await mountClickableFacetValue({
      attribute: 'unknown_facet',
      value: 'Wert',
    });

    // unknown_facet is not in clickableFacetConfig → disabled button renders
    expect(wrapper.find('button').attributes('aria-label')).toBe('Filter hinzufügen: unknown_facet = Wert');
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
    expect(link.attributes('aria-label')).toBe('Neue Suchseite in neuem Tab öffnen mit aktivem Filter: Filmschaffende = Reiniger, Lotte');
    expect(link.attributes('title')).toBe('Neue Suchseite in neuem Tab öffnen mit aktivem Filter: Filmschaffende = Reiniger, Lotte');
  });

  // ManifestationHeaderComp's collapsed row sits under an absolutely-positioned,
  // higher-stacked toggle button (see ManifestationListComp) so its own facet
  // chips (event type, place, ...) are only clickable if they opt back in to
  // pointer events with a stacking context above that overlay.
  test('stays clickable above an ancestor toggle overlay via its own stacking context', async () => {
    routePath = '/res/21.11155/work-1';

    const wrapper = await mountClickableFacetValue({
      attribute: 'creators',
      value: 'Reiniger, Lotte',
    });

    const link = wrapper.get('a');
    expect(link.classes()).toContain('pointer-events-auto');
    expect(link.classes()).toContain('relative');
    expect(link.classes()).toContain('z-20');
  });
});
