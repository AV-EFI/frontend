// @vitest-environment happy-dom
import { defineComponent } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import WorkViewCompAVefi from '~/components/views/WorkViewCompAVefi.vue';

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
            handle: 'mf-1',
            has_record: {
              has_event: [{ type: 'PremiereEvent' }],
              described_by: { has_issuer_name: 'Issuer A' },
            },
            items: [
              { handle: 'it-1', has_record: { has_access_status: 'Public' } },
              { handle: 'it-2', has_record: { has_access_status: 'Restricted' } },
            ],
          },
          {
            handle: 'mf-2',
            has_record: {
              has_event: [{ type: 'RestorationEvent' }],
              described_by: { has_issuer_name: 'Issuer B' },
            },
            items: [{ handle: 'it-3', has_record: { has_access_status: 'Public' } }],
          },
        ],
      },
    },
  };
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

  test('filters manifestations/items based on selected suggestion', async () => {
    const wrapper = mountComponent(buildModelWithManifestations());
    await flushPromises();

    const vm = wrapper.getComponent(WorkViewCompAVefi).vm as any;
    vm.toggleSuggestion('Restricted');
    await flushPromises();

    expect(vm.searchQuery).toContain('Restricted');
    expect(vm.filteredManifestations.length).toBe(1);
    expect(vm.filteredManifestations[0].items.length).toBe(1);
    expect(vm.filteredManifestations[0].items[0].handle).toBe('it-2');
  });

  test('switches to parts view when manifestations are absent but parts exist', async () => {
    const wrapper = mountComponent(buildModelWithPartsOnly());
    await flushPromises();

    expect(wrapper.find('#manifestations').exists()).toBe(false);
    expect(wrapper.find('[data-testid="parts-view"]').exists()).toBe(true);
  });

});
