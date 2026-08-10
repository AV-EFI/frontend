// @vitest-environment happy-dom
import { defineComponent } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import WorkViewCompAVefi from '~/components/views/WorkViewCompAVefi.vue';
import ManifestationListComp from '~/components/detail/ManifestationListComp.vue';
import ItemListNewComp from '~/components/detail/ItemListNewComp.vue';
import { getFilmRelatedMaterialCountForWork } from '~/composables/useFilmRelatedMaterials';

vi.mock('~/composables/useFormKitLoader', () => ({
  useFormKitLoader: () => ({
    ensureFormKitReady: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Mirrors WorkViewCompAVefi's own local `WorkNavigationItem` type (not
// exported from the component) and the subset of its script-setup state
// these tests reach into via wrapper.vm — script-setup bindings aren't part
// of the public ComponentPublicInstance type, hence the cast through unknown.
type WorkNavigationItem = {
  id: string;
  label: string;
  icon: string;
  count?: number;
  description?: string;
  kind: 'work' | 'collection';
};
type WorkViewVm = {
  workNavigationItems: WorkNavigationItem[];
  activeSection: string;
  activeDetailTab: string;
  searchQuery: string;
  filteredManifestations: Array<{ handle: string; items: Array<{ handle: string }> }>;
  suggestionsForManifestations: string[];
  toggleSuggestion: (value: string) => void;
  getManifestationAnchorId: (manifestation: unknown, index: number) => string;
  getItemAnchorId: (item: unknown, manifestationIndex: number, itemIndex: number) => string;
};

function buildModelWithManifestations() {
  return {
    compound_record: {
      _source: {
        handle: 'work-1',
        creators: ['Director A'],
        has_record: {
          has_primary_title: { has_name: 'Work title' },
          has_alternative_title: undefined as { has_name: string }[] | undefined,
          same_as: undefined as { id: string; category: string }[] | undefined,
          is_part_of: undefined as { id: string; category: string }[] | undefined,
          has_event: [{
            category: 'avefi:ProductionEvent',
            type: 'ProductionEvent',
            has_date: '1934',
            located_in: [{ has_name: 'USA' }],
            has_activity: [{
              category: 'avefi:DirectingActivity',
              type: 'Director',
              has_agent: [{ has_name: 'Director A' }],
            }],
          }],
        },
        manifestations: [
          {
            handle: '21.11155/MF-1',
            has_record: {
              category: 'avefi:Manifestation',
              has_event: [{ type: 'PremiereEvent' }],
              described_by: { has_issuer_name: 'Issuer A' },
            },
            items: [
              { handle: '21.11155/IT-1', has_name: 'Item 1', has_record: { has_access_status: 'Public' } },
              { handle: '21.11155/IT-2', has_name: 'Item 2', has_record: { has_access_status: 'Restricted' } },
            ],
          },
          {
            handle: '21.11155/MF-2',
            has_record: {
              category: 'avefi:Manifestation',
              has_event: [{ type: 'RestorationEvent' }],
              described_by: { has_issuer_name: 'Issuer B' },
            },
            items: [{ handle: '21.11155/IT-3', has_name: 'Item 3', has_record: { has_access_status: 'Public' } }],
          },
        ],
      },
    },
  };
}

function buildModelWithTopLevelExtras() {
  const model = buildModelWithManifestations();
  model.compound_record._source.has_record.has_alternative_title = [{ has_name: 'Alt title' }];
  model.compound_record._source.has_record.same_as = [{ id: 'film/test-id', category: 'avefi:FilmportalResource' }];
  model.compound_record._source.has_record.is_part_of = [{ id: 'parent-1', category: 'avefi:WorkVariant' }];
  return model;
}

function buildModelWithPartsOnly() {
  return {
    compound_record: {
      _source: {
        handle: 'work-parts',
        has_record: { has_primary_title: { has_name: 'Parts work' } },
        parts: [{ handle: 'part-1' }],
        manifestations: [],
      },
    },
  };
}

const Host = defineComponent({
  components: { WorkViewCompAVefi },
  props: {
    modelValue: { type: Object, required: true },
    requestedHandle: { type: String, default: '' },
    enableFilmrelated: { type: Boolean, default: false },
  },
  template:
    '<Suspense><WorkViewCompAVefi v-model="modelValue" handle="work-1" :requested-handle="requestedHandle" :enable-filmrelated="enableFilmrelated" /></Suspense>',
});

beforeEach(() => {
  vi.stubGlobal('useI18n', () => ({
    t: (key: string, params?: Record<string, string>) => {
      if (key === 'avefi:FilmportalResource') return 'Filmportal';
      if (key === 'workReferenceAtAuthority') return `${params?.title} on ${params?.authority}`;
      if (key === 'referencesAndWorkRelations') return 'References';
      return key;
    },
  }));
  vi.stubGlobal('useHash', vi.fn());
  window.history.replaceState(window.history.state, '', '/');
  window.localStorage.clear();

  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
  );
});

// The `modelValue` passed to WorkViewCompAVefi is the opaque ES compound-record
// JSON blob the component parses defensively itself (see its own DataObject/
// WorkVariantSource local types); mountComponent never inspects its fields,
// so a generic object bag is the honest type here rather than reusing (and
// forcing every fixture below to satisfy) the full generated AVefi schema.
function mountComponent(modelValue: Record<string, unknown>, requestedHandle = '', enableFilmrelated = false) {
  return mount(Host, {
    props: {
      modelValue,
      requestedHandle,
      enableFilmrelated,
    },
    global: {
      stubs: {
        ClientOnly: { template: '<div><slot /></div>' },
        NuxtLayout: { template: '<div><slot name="left" /><slot name="right" /></div>' },
        Icon: { template: '<i />' },
        GlobalTooltipInfo: { template: '<span />' },
        DetailWorkVariantTopLevelComp: { template: '<section id="work-events"></section>' },
        DetailHasEventComp: { template: '<section id="event-0"></section>' },
        DetailKeyActionRowsComp: {
          props: ['keyLabel', 'values'],
          template: '<section v-bind="$attrs" data-testid="key-action-rows"><h3>{{ keyLabel }}</h3><ul><li v-for="value in values" :key="value?.has_name || value">{{ value?.has_name || value }}</li></ul></section>',
        },
        DetailManifestationListComp: {
          props: ['modelValue'],
          template: '<div data-testid="manifestation-list">{{ modelValue?.length || 0 }}</div>',
        },
        DetailKeyValueListComp: { template: '<div data-testid="alternative-title-list"><slot />Alt title</div>' },
        DetailFilmRelatedMaterialsComp: { template: '<section id="film-related-materials"></section>' },
        ViewsWorkViewCompParts: { template: '<div data-testid="parts-view"></div>' },
        MicroIconTextComp: { template: '<div />' },
        MicroLabelComp: { props: ['labelText'], template: '<span>{{ labelText }}</span>' },
        DetailSameAsComp: { template: '<button data-testid="same-as-menu" />' },
        DetailKeyValueComp: { template: '<div />' },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('WorkViewCompAVefi interaction contracts', () => {
  test('renders manifestation section when manifestations exist', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    expect(wrapper.get('.work-level-area').classes()).toContain('border-work');
    expect(wrapper.find('#manifestations').exists()).toBe(true);
    expect(wrapper.get('[data-testid="manifestation-list"]').text()).toBe('2');
  });

  test('adds work-variant navigation entries in menu order and groups them before collections', async () => {
    const withoutExtras = mountComponent(buildModelWithManifestations());
    await flushPromises();

    expect(withoutExtras.text()).not.toContain('AlternativeTitles');
    expect(withoutExtras.text()).not.toContain('referencesAndWorkRelations');

    const withExtras = mountComponent(buildModelWithTopLevelExtras());
    await flushPromises();

    expect(withExtras.text()).toContain('References');
    expect(withExtras.text()).toContain('Work title on Filmportal');
    expect(withExtras.text()).not.toContain('film/test-id');
    expect(withExtras.get('[data-testid="work-reference-label"]').classes()).toContain('text-base-content');
    expect(withExtras.get('[data-testid="work-reference-label"]').classes()).not.toContain('text-primary');
    const alternativeTitles = withExtras.get('#alternative-titles');
    expect(alternativeTitles.classes()).toContain('rounded-lg');
    expect(alternativeTitles.classes()).toContain('border');
    expect(alternativeTitles.text()).toContain('AlternativeTitles');
    expect(alternativeTitles.text()).toContain('Alt title');

    const sidebar = withExtras.get('#work-navigation-desktop-menu');
    expect(sidebar.find('.work-section-menu-group-label').exists()).toBe(false);
    expect(sidebar.findAll('.work-section-menu-item')[0]?.text()).toContain('References');
    expect(sidebar.findAll('.work-section-menu-item')[0]?.text()).not.toContain('References and Work Relations');
    expect(sidebar.findAll('.work-section-menu-item').some(button => button.text().includes('AlternativeTitles'))).toBe(true);

    const vm = withExtras.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    expect(vm.workNavigationItems.map((item) => item.id)).toEqual([
      'references-work-relations',
      'alternative-titles',
      'work-events',
      'manifestations',
    ]);
  });

  test('keeps the PID out of the Work Navigation heading block', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const sidebar = wrapper.get('.work-navigation-sidebar');
    expect(sidebar.text()).toContain('Work title');
    expect(sidebar.text()).not.toContain('work-1');
  });

  test('shows work navigation by default and persists visibility changes', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    expect(wrapper.find('.work-navigation-sidebar').exists()).toBe(true);

    await wrapper.get('.work-navigation-toggle').trigger('click');
    await flushPromises();

    expect(window.localStorage.getItem('avefi.work.navigationVisible')).toBe('false');
    expect(wrapper.find('.work-navigation-sidebar').exists()).toBe(false);

    window.localStorage.setItem('avefi.work.navigationVisible', 'false');
    const hiddenByPreference = mountComponent(buildModelWithManifestations());
    await flushPromises();

    expect(hiddenByPreference.find('.work-navigation-sidebar').exists()).toBe(false);
  });

  test('attaches compact production context below the navbar after production', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;

    vm.activeSection = 'work-events';
    await flushPromises();
    expect(wrapper.find('.work-production-summary').exists()).toBe(false);

    vm.activeSection = 'manifestations';
    await flushPromises();

    const summary = wrapper.get('.work-production-summary');
    expect(summary.classes()).toContain('fixed');
    expect(summary.classes()).toContain('inset-x-0');
    expect(summary.text()).toContain('Work title');
    expect(summary.text()).not.toContain('ProductionEvent');
    expect(summary.text()).toContain('USA');
    expect(summary.text()).toContain('1934');
    expect(summary.text()).toContain('Director A');
    expect(wrapper.find('.work-navigation-sidebar .work-production-summary').exists()).toBe(false);
    expect(wrapper.find('.drawer-side .work-production-summary').exists()).toBe(false);
    expect(wrapper.find('#manifestations > div > aside').exists()).toBe(false);
  });

  test('renders DaisyUI tabs including film-related materials for the legacy mock work variant', async () => {
    const model = buildModelWithManifestations();
    model.compound_record._source.handle = '21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA';

    const wrapper = mountComponent(model, '', true);
    await flushPromises();

    expect(wrapper.find('.tabs.tabs-lift').exists()).toBe(true);
    expect(wrapper.get('#manifestations-tab').attributes('type')).toBe('radio');
    expect(wrapper.get('#manifestations-panel').classes()).toContain('border-manifestation');
    expect(wrapper.get('#film-related-materials-tab').attributes('type')).toBe('radio');
    expect(wrapper.get('#film-related-materials-tab').attributes('aria-label')).toBe('filmRelatedMaterials (4)');
    expect(getFilmRelatedMaterialCountForWork('21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA')).toBe(4);
  });

  test('filters manifestations/items based on selected suggestion', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    vm.toggleSuggestion('Restricted');
    await flushPromises();

    expect(vm.searchQuery).toContain('Restricted');
    expect(vm.filteredManifestations.length).toBe(1);
    expect(vm.filteredManifestations[0]!.items.length).toBe(1);
    expect(vm.filteredManifestations[0]!.items[0]!.handle).toBe('21.11155/IT-2');
  });

  test('exposes manifestation events as filter suggestions', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    expect(vm.suggestionsForManifestations).toContain('Issuer A');
    expect(vm.suggestionsForManifestations).toContain('Restricted');
    expect(vm.suggestionsForManifestations).toContain('PremiereEvent');
    expect(vm.suggestionsForManifestations).toContain('RestorationEvent');

    vm.toggleSuggestion('PremiereEvent');
    await flushPromises();

    expect(vm.filteredManifestations.length).toBe(1);
    expect(vm.filteredManifestations[0]!.handle).toBe('21.11155/MF-1');
  });

  test('does not render scroll-driven active state in the work navigation menu', async () => {
    const model = buildModelWithManifestations();
    model.compound_record._source.handle = '21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA';

    const wrapper = mountComponent(model, '', true);
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    vm.activeDetailTab = 'filmRelatedMaterials';
    vm.activeSection = 'work-events';
    await flushPromises();

    const menuItems = wrapper.findAll('#work-navigation-desktop-menu .work-section-menu-item');

    expect(menuItems.length).toBeGreaterThan(0);
    expect(menuItems.some((item) => item.classes().includes('is-active'))).toBe(false);
    expect(menuItems.some((item) => item.attributes('aria-current'))).toBe(false);
  });

  test('switches to parts view when manifestations are absent but parts exist', async () => {
    const wrapper = mountComponent(buildModelWithPartsOnly());
    await flushPromises();

    expect(wrapper.find('#manifestations').exists()).toBe(false);
    expect(wrapper.find('[data-testid="parts-view"]').exists()).toBe(true);
  });

  test('uses raw manifestation handles for navigation anchors', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    const manifestation = buildModelWithManifestations().compound_record._source.manifestations[0];

    expect(vm.getManifestationAnchorId(manifestation, 0)).toBe('21.11155/MF-1');
    expect(vm.getManifestationAnchorId(manifestation, 0)).not.toBe('manifestation-0-21-11155-MF-1');
  });

  test('uses raw item handles for navigation anchors', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    const item = buildModelWithManifestations().compound_record._source.manifestations[0]!.items[0];

    expect(vm.getItemAnchorId(item, 0, 0)).toBe('21.11155/IT-1');
    expect(vm.getItemAnchorId(item, 0, 0)).not.toBe('item-0-0-21-11155-IT-1');
  });

  test('renders manifestation anchors from raw handles', async () => {
    const wrapper = mount(ManifestationListComp, {
      props: {
        modelValue: buildModelWithManifestations().compound_record._source.manifestations as unknown as
          InstanceType<typeof ManifestationListComp>['$props']['modelValue'],
      },
      global: {
        stubs: {
          Icon: { template: '<i />' },
          GlobalTooltipInfo: { template: '<span />' },
          DetailManifestationHeaderComp: { template: '<h4 />' },
          DetailItemListNewComp: { template: '<div />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    const sectionIds = wrapper.findAll('section').map(section => section.attributes('id'));
    expect(sectionIds).toContain('21.11155/MF-1');
    expect(sectionIds).not.toContain('manifestation-0-21-11155-MF-1');
    expect(wrapper.get('section').classes()).not.toContain('manifestation-card');

    await wrapper.get('section > div[role="button"]').trigger('click');
    expect(wrapper.get('.item-area').classes()).toContain('border-l-2');
    expect(wrapper.get('.item-area').classes()).toContain('border-item');
  });

  test('renders item anchors from raw handles', () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ public: { AVEFI_COPY_PID_URL: 'https://pid.example/' } }));

    const wrapper = mount(ItemListNewComp, {
      props: {
        items: buildModelWithManifestations().compound_record._source.manifestations[0]!.items as unknown as
          InstanceType<typeof ItemListNewComp>['$props']['items'],
        manifestationIndex: 0,
      },
      global: {
        stubs: {
          Icon: { template: '<i />' },
          MicroDividerComp: { template: '<div />' },
          DetailKeyValueComp: { template: '<div />' },
          MicroLabelComp: { template: '<span />' },
          GlobalTooltipInfo: { template: '<span />' },
          SearchHighlightSingleComp: { template: '<span />' },
          SearchHighlightListComp: { template: '<span />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    const itemAnchorIds = wrapper.findAll('article > div:first-child > div:last-child')
      .map(anchor => anchor.attributes('id'));
    expect(itemAnchorIds).toContain('21.11155/IT-1');
    expect(itemAnchorIds).not.toContain('item-0-0-21-11155-IT-1');
    expect(wrapper.get('article').classes()).not.toContain('border-l-4');
    expect(wrapper.get('article').classes()).not.toContain('border-item');
  });

});
