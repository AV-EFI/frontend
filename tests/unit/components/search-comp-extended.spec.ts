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
      facet_attributes: [
        { attribute: 'production_year_start' },
        { attribute: 'production_year_end' },
        { attribute: 'subjects' },
        { attribute: 'in_language_code' },
        { attribute: 'has_sound_type' },
        { attribute: 'has_access_status' },
      ],
    },
  },
}));

vi.mock('~/models/interfaces/manual/IFacetIconMapping.js', () => ({
  FACET_ICON_MAP: {
    subjects: 'tabler:tags',
    in_language_code: 'tabler:language',
    has_sound_type: 'tabler:volume',
    has_access_status: 'tabler:lock',
    production_year_start: 'tabler:calendar',
    production_year_end: 'tabler:calendar',
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
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
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
    expect(wrapper.html()).toContain('<option value="production_year_start">productionyear</option>');
    expect(wrapper.html()).not.toContain('has_access_status');
    expect(wrapper.html()).not.toContain('production_year_end');
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

  test('submits production year as numeric refinement without fetching facet suggestions', async () => {
    const fetchMock = vi.mocked(globalThis.$fetch as any);
    const wrapper = mountComponent();
    await flushPromises();

    const selects = wrapper.findAll('select');
    expect(selects.length).toBeGreaterThan(0);
    await selects[0].setValue('production_year_start');
    await selects[0].trigger('input');
    await flushPromises();

    expect(fetchMock).not.toHaveBeenCalled();

    const allInputs = wrapper.findAll('input');
    const facetValueInput = allInputs[allInputs.length - 1];
    await facetValueInput.setValue('1927');
    await flushPromises();

    expect(wrapper.find('button[aria-label="showSuggestions"]').exists()).toBe(false);

    await wrapper.get('form').trigger('submit');
    await flushPromises();

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    const href = String(navigateToMock.mock.calls[0][0]);
    expect(href).toContain('numericRefinement%5Bproduction_in_year%5D%5B%3E%3D%5D=1927');
    expect(href).toContain('numericRefinement%5Bproduction_in_year%5D%5B%3C%3D%5D=1927');
    expect(href).not.toContain('production_year_start');
  });

  test('closes facet value dropdown on facet change and preloads new facet values', async () => {
    const fetchMock = vi.fn((url: string, options: any) => {
      const attr = options?.body?.facetAttr;
      return Promise.resolve({
        success: true,
        suggestions: attr === 'subjects'
          ? [{ text: 'Architecture', type: 'facet', count: 5 }]
          : [{ text: 'ger', type: 'facet', count: 12 }],
      });
    });
    vi.stubGlobal('$fetch', fetchMock);

    const wrapper = mountComponent();
    await flushPromises();

    const select = wrapper.find('select');
    await select.setValue('in_language_code');
    await flushPromises();

    const suggestionButton = wrapper.find('button[aria-label="showSuggestions"]');
    await suggestionButton.trigger('mousedown');
    await flushPromises();

    expect(wrapper.text()).toContain('Deutsch');

    await select.setValue('subjects');
    await flushPromises();

    expect(wrapper.text()).not.toContain('Deutsch');
    expect(wrapper.text()).not.toContain('Architecture');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/elastic/suggestions',
      expect.objectContaining({
        body: expect.objectContaining({ facetAttr: 'subjects' }),
      })
    );

    const allInputs = wrapper.findAll('input');
    const facetValueInput = allInputs[allInputs.length - 1];
    await facetValueInput.trigger('focus');
    await flushPromises();

    expect(wrapper.text()).toContain('Architecture');
  });

  test('loads sound type facet values through the facet autocomplete flow', async () => {
    const fetchMock = vi.fn((url: string, options: any) => {
      const attr = options?.body?.facetAttr;
      return Promise.resolve({
        success: true,
        suggestions: attr === 'has_sound_type'
          ? [{ text: 'Sound', type: 'facet', count: 3 }]
          : [],
      });
    });
    vi.stubGlobal('$fetch', fetchMock);

    const wrapper = mountComponent();
    await flushPromises();

    const select = wrapper.find('select');
    await select.setValue('has_sound_type');
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/elastic/suggestions',
      expect.objectContaining({
        body: expect.objectContaining({
          mode: 'facet',
          facetAttr: 'has_sound_type',
          query: '',
          size: 250,
        }),
      })
    );
    expect(wrapper.text()).not.toContain('Sound');

    const allInputs = wrapper.findAll('input');
    const facetValueInput = allInputs[allInputs.length - 1];
    await facetValueInput.trigger('focus');
    await flushPromises();

    expect(wrapper.text()).toContain('Sound');
  });
});
