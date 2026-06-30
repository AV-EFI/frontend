// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { computed, nextTick, ref } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import NormdataPage from '~/pages/normdata.vue';

const routeQueryMock = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
const routerReplaceMock = vi.hoisted(() => vi.fn());
const rowsMock = vi.hoisted(() => ({ value: [] as Array<Record<string, unknown>> }));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: routeQueryMock.value,
  }),
  useRouter: () => ({
    replace: routerReplaceMock,
  }),
}));

beforeEach(() => {
  routeQueryMock.value = {};
  routerReplaceMock.mockReset();
  rowsMock.value = [];

  vi.stubGlobal('useI18n', () => ({
    locale: ref('de'),
    t: (key: string, params?: Record<string, unknown>) => {
      if (key === 'normdata.noEntries') return 'Keine Eintraege';
      if (key === 'normdata.page') return 'Seite';
      if (key === 'normdata.of') return 'von';
      if (key === 'normdata.entries') return 'Eintraege';
      if (params) return `${key} ${JSON.stringify(params)}`;
      return key;
    },
  }));

  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      siteUrl: 'https://www.av-efi.net',
      siteOgImage: '',
    },
  }));

  vi.stubGlobal('useSeoMeta', vi.fn());
  vi.stubGlobal('useSchemaOrg', vi.fn());
  vi.stubGlobal('defineWebPage', (value: unknown) => value);

  vi.stubGlobal('useNormdataUrl', () => ({
    getNormdataUrl: (_category: string, id: string) => `https://example.test/${id}`,
  }));

  vi.stubGlobal('useFetch', vi.fn(() => ({
    data: computed(() => ({
      rows: rowsMock.value,
      total: rowsMock.value.length,
    })),
    pending: ref(false),
    refresh: vi.fn(),
  })));
});

function mountPage() {
  return mount(NormdataPage, {
    global: {
      stubs: {
        Icon: { template: '<span />' },
      },
      mocks: {
        $t: (key: string, params?: Record<string, unknown>) => {
          if (key === 'normdata.noEntries') return 'Keine Eintraege';
          if (key === 'normdata.page') return 'Seite';
          if (key === 'normdata.of') return 'von';
          if (key === 'normdata.entries') return 'Eintraege';
          if (params) return `${key} ${JSON.stringify(params)}`;
          return key;
        },
      },
    },
  });
}

describe('normdata page pagination', () => {
  test('clamps stale has_genre page params so genre rows are rendered', async () => {
    routeQueryMock.value = {
      field: 'has_genre',
      page: '3',
    };
    rowsMock.value = Array.from({ length: 50 }, (_, index) => ({
      value: `Genre ${index + 1}`,
      normdataRefs: [],
      provider: null,
      docCount: index + 1,
    }));

    const wrapper = mountPage();
    expect(wrapper.text()).toContain('Genre 1');
    expect(wrapper.text()).not.toContain('Keine Eintraege');

    await nextTick();
    await nextTick();

    expect(wrapper.text()).toContain('Genre 1');
    expect(wrapper.text()).not.toContain('Keine Eintraege');
    expect(routerReplaceMock).toHaveBeenLastCalledWith({
      query: {
        field: 'has_genre',
      },
    });
  });

  test('keeps has_subject explicit in the URL when switching the field selector to subjects', async () => {
    routeQueryMock.value = {
      field: 'has_genre',
      page: '2',
    };
    rowsMock.value = Array.from({ length: 150 }, (_, index) => ({
      value: `Subject ${index + 1}`,
      normdataRefs: [],
      provider: null,
      docCount: index + 1,
    }));

    const wrapper = mountPage();
    await nextTick();

    await wrapper.find('select').setValue('has_subject');
    await nextTick();
    await nextTick();

    expect(routerReplaceMock).toHaveBeenLastCalledWith({
      query: {
        field: 'has_subject',
      },
    });
    expect(wrapper.text()).toContain('Subject 1');
    expect(wrapper.text()).not.toContain('Keine Eintraege');
  });
});
