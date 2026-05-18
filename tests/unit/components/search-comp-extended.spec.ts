// @vitest-environment happy-dom
import { defineComponent, reactive, ref } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SearchCompExtended from '~/components/global/SearchCompExtended.vue';

const navigateToMock = vi.fn();
const localeRef = ref('de');

const storeState: any = reactive({
  formData: {
    regularSearch: {
      searchTerm: '',
      optionsList: [],
    },
  },
});

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: localeRef,
    t: (key: string) => {
      if (key === 'facetValue.in_language_code.ger') return 'Deutsch';
      if (key === 'facetValue.in_language_code.dan') return 'Dänisch';
      if (key === 'facetValue.in_language_code.dut') return 'Niederländisch';
      return key;
    },
  }),
}));

vi.mock('~/stores/searchParams.js', () => ({
  useSearchParamsStore: () => storeState,
}));

vi.mock('~/searchConfig_avefi.js', () => ({
  config: {
    search_settings: {
      facet_attributes: [{ attribute: 'subjects' }, { attribute: 'in_language_code' }, { attribute: 'has_access_status' }],
    },
  },
}));

vi.mock('~/models/interfaces/manual/IFacetIconMapping.js', () => ({
  FACET_ICON_MAP: {
    subjects: 'tabler:tags',
    in_language_code: 'tabler:language',
    has_access_status: 'tabler:lock',
  },
}));

vi.mock('~/composables/useFormKitLoader', () => ({
  useFormKitLoader: () => ({
    ensureFormKitReady: vi.fn().mockResolvedValue(undefined),
  }),
}));

const FormKitStub = defineComponent({
  name: 'FormKit',
  props: {
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Object, Array, Number, Boolean], default: '' },
    options: { type: [Array, Object], default: () => [] },
  },
  emits: ['submit', 'update:modelValue', 'input'],
  template: `
    <form v-if="type === 'form'" @submit.prevent="$emit('submit')"><slot /></form>
    <select
      v-else-if="type === 'select'"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value); $emit('input', $event.target.value)"
    >
      <option value=""></option>
      <option value="subjects">subjects</option>
      <option value="in_language_code">in_language_code</option>
    </select>
    <input
      v-else
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value); $emit('input', $event)"
    />
  `,
});

const SearchQueryAutocompleteStub = defineComponent({
  name: 'SearchQueryAutocomplete',
  props: {
    modelValue: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  template: `
    <input
      data-testid="main-query"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  `,
});

const SuspendedHost = defineComponent({
  components: { SearchCompExtended },
  template: '<Suspense><SearchCompExtended /></Suspense>',
});

beforeEach(() => {
  localeRef.value = 'de';
  navigateToMock.mockReset();
  storeState.formData = {
    regularSearch: {
      searchTerm: '',
      optionsList: [],
    },
  };

  vi.stubGlobal('navigateTo', navigateToMock);
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      searchRouteBase: 'search',
      SEARCH_URL: 'search',
    },
  }));
  vi.stubGlobal('useSearchHistory', () => ({
    addToSearchHistory: vi.fn(),
    getSearchHistory: vi.fn(() => []),
    removeFromHistory: vi.fn(),
    clearSearchHistory: vi.fn(),
  }));
  vi.stubGlobal(
    '$fetch',
    vi.fn().mockResolvedValue({
      success: true,
      suggestions: [
        { text: 'ger', type: 'facet', count: 12 },
        { text: 'dut', type: 'facet', count: 6 },
        { text: 'dan', type: 'facet', count: 4 },
      ],
    })
  );
});

function mountComponent() {
  return mount(SuspendedHost, {
    global: {
      stubs: {
        ClientOnly: { template: '<div><slot /></div>' },
        Icon: { template: '<i />' },
        FormKit: FormKitStub,
        SearchQueryAutocomplete: SearchQueryAutocompleteStub,
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('SearchCompExtended interaction contracts', () => {
  test('blocks empty submit and shows validation warning', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    const submit = wrapper.find('button[type="submit"]');
    expect(submit.exists()).toBe(true);
    await submit.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('enterSearchTermFirst');
    expect(navigateToMock).not.toHaveBeenCalled();
  });

  test('submits main query and navigates to search URL', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    storeState.formData.regularSearch.searchTerm = 'Berlin';

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock.mock.calls[0][0]).toContain('/search/?query=Berlin');
  });

  test('does not show blacklisted has_access_status as selectable facet option', async () => {
    const wrapper = mountComponent();
    await flushPromises();

    expect(wrapper.html()).toContain('<option value="subjects">subjects</option>');
    expect(wrapper.html()).not.toContain('has_access_status');
  });

  test('submits localized facet input as raw elastic value with [1] index', async () => {
    vi.useFakeTimers();

    const wrapper = mountComponent();
    await flushPromises();

    const selects = wrapper.findAll('select');
    expect(selects.length).toBeGreaterThan(0);
    await selects[0].setValue('in_language_code');
    await selects[0].trigger('input');
    await flushPromises();

    const allInputs = wrapper.findAll('input');
    expect(allInputs.length).toBeGreaterThan(1);
    const facetValueInput = allInputs[allInputs.length - 1];
    await facetValueInput.setValue('Deutsch');
    await vi.runAllTimersAsync();
    await flushPromises();

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    const href = String(navigateToMock.mock.calls[0][0]);
    expect(href).toContain('%5B1%5D=ger');
    expect(href).toContain('in_language_code');
    expect(href).not.toContain('Deutsch');

    vi.useRealTimers();
  });
});
