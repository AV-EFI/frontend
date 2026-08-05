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
  isNavigationItemActive: (item: WorkNavigationItem | undefined) => boolean;
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
  model.compound_record._source.has_record.same_as = [{ id: 'gnd:123', category: 'avefi:GNDResource' }];
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
  vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
  vi.stubGlobal('useHash', vi.fn());
  window.history.replaceState(window.history.state, '', '/');

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

    expect(wrapper.find('#manifestations').exists()).toBe(true);
    expect(wrapper.get('[data-testid="manifestation-list"]').text()).toBe('2');
  });

  test('adds top-level navigation entries in page order and excludes alternative titles', async () => {
    const withoutExtras = mountComponent(buildModelWithManifestations());
    await flushPromises();

    expect(withoutExtras.text()).not.toContain('AlternativeTitles');
    expect(withoutExtras.text()).not.toContain('referencesAndWorkRelations');

    const withExtras = mountComponent(buildModelWithTopLevelExtras());
    await flushPromises();

    expect(withExtras.text()).toContain('referencesAndWorkRelations');
    expect(withExtras.get('#alternative-titles').text()).toContain('AlternativeTitles');
    expect(withExtras.get('#alternative-titles').text()).toContain('Alt title');
    expect(withExtras.findAll('aside .work-section-menu-item').some(button => button.text().includes('AlternativeTitles'))).toBe(false);

    const vm = withExtras.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    expect(vm.workNavigationItems.map((item) => item.id)).toEqual([
      'references-work-relations',
      'work-events',
      'manifestations',
    ]);
  });

  test('keeps the PID out of the Work Navigation heading block', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const sidebarHeader = wrapper.get('aside .border-b');
    expect(sidebarHeader.text()).toContain('Work title');
    expect(sidebarHeader.text()).not.toContain('work-1');
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
    expect(wrapper.find('aside.hidden .work-production-summary').exists()).toBe(false);
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

  test('keeps sidebar active state tied to the active section only', async () => {
    const model = buildModelWithManifestations();
    model.compound_record._source.handle = '21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA';

    const wrapper = mountComponent(model, '', true);
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as unknown as WorkViewVm;
    vm.activeDetailTab = 'filmRelatedMaterials';
    vm.activeSection = 'work-events';
    await flushPromises();

    const workEventsItem = vm.workNavigationItems.find((item) => item.id === 'work-events');
    const filmRelatedItem = vm.workNavigationItems.find((item) => item.id === 'film-related-materials');

    expect(vm.isNavigationItemActive(workEventsItem)).toBe(true);
    expect(vm.isNavigationItemActive(filmRelatedItem)).toBe(false);
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

  test('renders manifestation anchors from raw handles', () => {
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
  });

});
