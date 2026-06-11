// @vitest-environment happy-dom
import { defineComponent } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import WorkViewCompAVefi from '~/components/views/WorkViewCompAVefi.vue';
import ManifestationListComp from '~/components/detail/ManifestationListComp.vue';
import ItemListNewComp from '~/components/detail/ItemListNewComp.vue';

vi.mock('~/composables/useFormKitLoader', () => ({
  useFormKitLoader: () => ({
    ensureFormKitReady: vi.fn().mockResolvedValue(undefined),
  }),
}));

function buildModelWithManifestations() {
  return {
    compound_record: {
      _source: {
        handle: 'work-1',
        has_record: {
          has_primary_title: { has_name: 'Work title' },
          has_event: [{ type: 'ProductionEvent' }],
        },
        manifestations: [
          {
            handle: '21.11155/MF-1',
            has_record: {
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
  },
  template:
    '<Suspense><WorkViewCompAVefi v-model="modelValue" handle="work-1" :requested-handle="requestedHandle" /></Suspense>',
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

function mountComponent(modelValue: any, requestedHandle = '') {
  return mount(Host, {
    props: {
      modelValue,
      requestedHandle,
    },
    global: {
      stubs: {
        ClientOnly: { template: '<div><slot /></div>' },
        NuxtLayout: { template: '<div><slot name="left" /><slot name="right" /></div>' },
        Icon: { template: '<i />' },
        GlobalTooltipInfo: { template: '<span />' },
        DetailWorkVariantTopLevelComp: { template: '<section id="work-events"></section>' },
        DetailHasEventComp: { template: '<section id="event-0"></section>' },
        DetailKeyActionRowsComp: { template: '<div />' },
        DetailManifestationListComp: {
          props: ['modelValue'],
          template: '<div data-testid="manifestation-list">{{ modelValue?.length || 0 }}</div>',
        },
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

  test('adds top-level extra sections to sidebar navigation only when data exists', async () => {
    const withoutExtras = mountComponent(buildModelWithManifestations());
    await flushPromises();

    expect(withoutExtras.text()).not.toContain('AlternativeTitles');
    expect(withoutExtras.text()).not.toContain('referencesAndWorkRelations');

    const withExtras = mountComponent(buildModelWithTopLevelExtras());
    await flushPromises();

    expect(withExtras.text()).toContain('AlternativeTitles');
    expect(withExtras.text()).toContain('referencesAndWorkRelations');

    const buttons = withExtras.findAll('button');
    expect(buttons.some(button => button.text() === 'AlternativeTitles')).toBe(true);
    expect(buttons.some(button => button.text() === 'referencesAndWorkRelations')).toBe(true);
  });

  test('filters manifestations/items based on selected suggestion', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as any;
    vm.toggleSuggestion('Restricted');
    await flushPromises();

    expect(vm.searchQuery).toContain('Restricted');
    expect(vm.filteredManifestations.length).toBe(1);
    expect(vm.filteredManifestations[0].items.length).toBe(1);
    expect(vm.filteredManifestations[0].items[0].handle).toBe('21.11155/IT-2');
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

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as any;
    const manifestation = buildModelWithManifestations().compound_record._source.manifestations[0];

    expect(vm.getManifestationAnchorId(manifestation, 0)).toBe('21.11155/MF-1');
    expect(vm.getManifestationAnchorId(manifestation, 0)).not.toBe('manifestation-0-21-11155-MF-1');
  });

  test('uses raw item handles for navigation anchors', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as any;
    const item = buildModelWithManifestations().compound_record._source.manifestations[0].items[0];

    expect(vm.getItemAnchorId(item, 0, 0)).toBe('21.11155/IT-1');
    expect(vm.getItemAnchorId(item, 0, 0)).not.toBe('item-0-0-21-11155-IT-1');
  });

  test('renders manifestation anchors from raw handles', () => {
    const wrapper = mount(ManifestationListComp, {
      props: {
        modelValue: buildModelWithManifestations().compound_record._source.manifestations,
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
        items: buildModelWithManifestations().compound_record._source.manifestations[0].items,
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
