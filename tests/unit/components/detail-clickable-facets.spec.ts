// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import KeyActionRowsComp from '~/components/detail/KeyActionRowsComp.vue';
import HasEventComp from '~/components/detail/HasEventComp.vue';
import ItemListNewComp from '~/components/detail/ItemListNewComp.vue';
import KeyValueComp from '~/components/detail/KeyValueComp.vue';
import KeyValueListComp from '~/components/detail/KeyValueListComp.vue';
import HighlightSingleComp from '~/components/search/HighlightSingleComp.vue';
import HighlightListComp from '~/components/search/HighlightListComp.vue';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    AVEFI_COPY_PID_URL: 'https://pid.example/',
  },
}));
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
}));
vi.stubGlobal('useNuxtApp', () => ({
  $i18n: {
    t: (key: string) => key,
  },
}));

const clickableFacetStub = {
  props: ['attribute', 'value', 'label'],
  template:
    '<button data-testid="facet-value" :data-attribute="attribute" :data-value="value" :data-label="label"><slot /></button>',
};

const commonStubs = {
  SearchClickableFacetValue: clickableFacetStub,
  DetailSameAsComp: { template: '<span />' },
  GlobalClipboardComp: { template: '<span />' },
  MicroLabelComp: { props: ['labelText'], template: '<span>{{ labelText }}</span>' },
  MicroDataQualityWarningIcon: { template: '<span />' },
  GlobalTooltipInfo: { template: '<span />' },
  Icon: { template: '<span />' },
};

describe('detail clickable facets', () => {
  test('renders genre and subject detail rows as facet values', () => {
    const wrapper = mount(KeyActionRowsComp, {
      props: {
        keyLabel: 'Genre',
        values: [{ has_name: 'Animation' }],
        sameAsType: 'genre',
        facetAttribute: 'has_genre_has_name',
      },
      global: {
        stubs: commonStubs,
        mocks: { $t: (key: string) => key },
      },
    });

    const facetValue = wrapper.get('[data-testid="facet-value"]');
    expect(facetValue.attributes('data-attribute')).toBe('has_genre_has_name');
    expect(facetValue.attributes('data-value')).toBe('Animation');
  });

  test('renders work event type, place, and agents as facet values', () => {
    const wrapper = mount(HasEventComp, {
      props: {
        modelValue: [
          {
            category: 'ProductionEvent',
          },
          {
            category: 'PremiereEvent',
            has_date: '1929-2000',
            located_in: [{ category: 'avefi:GeographicName', has_name: 'Berlin' }],
            has_activity: [
              { category: 'avefi:Activity', type: 'Director', has_agent: [{ category: 'avefi:Agent', has_name: 'Reiniger, Lotte' }] },
              { category: 'avefi:Activity', type: 'CastMember', has_agent: [{ category: 'avefi:Agent', has_name: 'Actor Name' }] },
            ],
          },
        ],
      },
      global: {
        components: {
          DetailKeyValueComp: KeyValueComp,
          DetailKeyValueListComp: KeyValueListComp,
        },
        stubs: {
          ...commonStubs,
        },
        mocks: { $t: (key: string) => key },
      },
    });

    const facetValues = wrapper.findAll('[data-testid="facet-value"]').map((node) => ({
      attribute: node.attributes('data-attribute'),
      value: node.attributes('data-value'),
    }));

    expect(facetValues).toContainEqual({ attribute: 'manifestation_event_type', value: 'ProductionEvent' });
    expect(facetValues).toContainEqual({ attribute: 'productionyear', value: '1929-2000' });
    expect(facetValues).toContainEqual({ attribute: 'located_in_has_name', value: 'Berlin' });
    expect(facetValues).toContainEqual({ attribute: 'creators', value: 'Reiniger, Lotte' });
    expect(facetValues).toContainEqual({ attribute: 'castmembers', value: 'Actor Name' });
  });

  test('renders item metadata as facet values', () => {
    const wrapper = mount(ItemListNewComp, {
      props: {
        manifestationIndex: 0,
        items: [
          {
            handle: '21.11155/ITEM-1',
            has_record: {
              category: 'avefi:Item',
              is_item_of: { category: 'avefi:MovingImageResource', id: '21.11155/MANIFESTATION-1' },
              has_access_status: 'Public',
              has_format: [{ category: 'avefi:Format', type: '16mm' }],
              element_type: 'Print',
              in_language: [{ code: 'ger', usage: 'Original' }],
              has_sound_type: 'Sound',
              has_colour_type: 'Colour',
            },
          },
        ],
      },
      global: {
        components: {
          SearchHighlightSingleComp: HighlightSingleComp,
          SearchHighlightListComp: HighlightListComp,
        },
        stubs: {
          ...commonStubs,
          MicroDividerComp: { template: '<div />' },
          DetailKeyValueComp: { template: '<div />' },
        },
        mocks: { $t: (key: string) => key },
      },
    });

    const facetValues = wrapper.findAll('[data-testid="facet-value"]').map((node) => ({
      attribute: node.attributes('data-attribute'),
      value: node.attributes('data-value'),
    }));

    expect(facetValues).toContainEqual({ attribute: 'has_access_status', value: 'Public' });
    expect(facetValues).toContainEqual({ attribute: 'has_format_type', value: '16mm' });
    expect(facetValues).toContainEqual({ attribute: 'item_element_type', value: 'Print' });
    expect(facetValues).toContainEqual({ attribute: 'in_language_code', value: 'ger' });
    expect(facetValues).toContainEqual({ attribute: 'has_sound_type', value: 'Sound' });
    expect(facetValues).toContainEqual({ attribute: 'has_colour_type', value: 'Colour' });
  });
});
