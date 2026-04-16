// @vitest-environment happy-dom
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import SearchSection from '~/components/search/SearchSection.vue';

const ensureInstantSearchReadyMock = vi.fn();
const isReadyRef = ref(false);
const errorRef = ref(false);

beforeEach(() => {
  ensureInstantSearchReadyMock.mockReset();
  isReadyRef.value = false;
  errorRef.value = false;

  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      ELASTIC_INDEX: 'works-index',
    },
  }));
  vi.stubGlobal('useInstantSearchLoader', () => ({
    isInstantSearchReady: isReadyRef,
    instantSearchError: errorRef,
    ensureInstantSearchReady: ensureInstantSearchReadyMock,
  }));
});

function mountComponent() {
  return mount(SearchSection, {
    props: {
      searchClient: { search: vi.fn() },
    },
    global: {
      stubs: {
        ClientOnly: { template: '<div><slot /><slot name="fallback" /></div>' },
        SearchInstantSearchTemplateAVefi: {
          emits: ['facetsChanged'],
          template: '<div data-testid="is-ready">ready</div>',
        },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('SearchSection', () => {
  test('shows loading state while instant search is not ready', () => {
    isReadyRef.value = false;
    errorRef.value = false;
    const wrapper = mountComponent();
    expect(wrapper.html()).toContain('loading-spinner');
    expect(ensureInstantSearchReadyMock).toHaveBeenCalledTimes(1);
  });

  test('shows error text when loader has error', () => {
    isReadyRef.value = false;
    errorRef.value = true;
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('error');
  });

  test('renders instant search template when ready', () => {
    isReadyRef.value = true;
    const wrapper = mountComponent();
    expect(wrapper.get('[data-testid="is-ready"]').exists()).toBe(true);
  });
});
