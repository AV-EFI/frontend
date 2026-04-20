// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { computed, ref } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SearchCompReduced from '~/components/global/SearchCompReduced.vue';

const navigateToMock = vi.fn();
const addToSearchHistoryMock = vi.fn();
const getSearchHistoryMock = vi.fn(() => []);
const removeFromHistoryMock = vi.fn();
const clearSearchHistoryMock = vi.fn();

vi.mock('~/models/interfaces/manual/IFacetIconMapping.js', () => ({
  FACET_ICON_MAP: {},
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        Search: 'Search',
        showEntireCollection: 'Show Entire Collection',
        searchbox: 'Searchbox',
      };
      return map[key] ?? key;
    },
  }),
}));

beforeEach(() => {
  navigateToMock.mockReset();
  addToSearchHistoryMock.mockReset();
  removeFromHistoryMock.mockReset();
  clearSearchHistoryMock.mockReset();

  vi.stubGlobal('navigateTo', navigateToMock);
  vi.stubGlobal('ref', ref);
  vi.stubGlobal('computed', computed);
  vi.stubGlobal('useI18n', () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        Search: 'Search',
        showEntireCollection: 'Show Entire Collection',
        searchbox: 'Searchbox',
      };
      return map[key] ?? key;
    },
  }));
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      SEARCH_URL: 'search',
    },
  }));
  vi.stubGlobal('useSearchHistory', () => ({
    addToSearchHistory: addToSearchHistoryMock,
    getSearchHistory: getSearchHistoryMock,
    removeFromHistory: removeFromHistoryMock,
    clearSearchHistory: clearSearchHistoryMock,
  }));
});

function mountComponent() {
  return mount(SearchCompReduced, {
    global: {
      stubs: {
        SearchQueryAutocomplete: {
          props: ['modelValue'],
          emits: ['update:modelValue', 'submit'],
          template:
            '<input data-testid="qa" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" @keydown.enter="$emit(\'submit\', modelValue)" />',
        },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('SearchCompReduced', () => {
  test('shows "Show Entire Collection" when query is empty', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('Show Entire Collection');
  });

  test('shows "Search" when query has content', async () => {
    const wrapper = mountComponent();
    await wrapper.get('[data-testid="qa"]').setValue('Berlin');
    expect(wrapper.text()).toContain('Search');
  });

  test('submits encoded query and records search history when query is non-empty', async () => {
    const wrapper = mountComponent();
    await wrapper.get('[data-testid="qa"]').setValue('Berlin & Co');
    await wrapper.get('button').trigger('click');

    expect(addToSearchHistoryMock).toHaveBeenCalledWith('Berlin & Co');
    expect(navigateToMock).toHaveBeenCalledWith('/search/?query=Berlin%20%26%20Co');
  });
});
