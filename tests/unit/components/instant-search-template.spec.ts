// @vitest-environment happy-dom
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// vi.hoisted runs before any imports – required for globals used at the top
// level of <script setup> (e.g. useRuntimeConfig, useNuxtApp, useRoute…)
const routerReplaceMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const routeQueryMock = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
const currentRefinementsItemsMock = vi.hoisted(() => ({
  value: [] as Array<{ label: string; refinements: Array<{ attribute: string; type: string; value: string; operator?: string; label: string }> }>,
}));
const currentRefinementRefineSpy = vi.hoisted(() => vi.fn());

type IndexState = {
  query?: string;
  page?: number;
  refinementList?: Record<string, unknown[]>;
  numericRefinements?: Record<string, Record<string, unknown[]>>;
  range?: Record<string, unknown>;
};
type UiState = Record<string, IndexState>;
type UiStateUpdater = (prevState: UiState) => UiState;

// Shape of the backend-search-client wrapper produced by
// InstantSearchTemplateAVefi (`instantSearch.props('searchClient')`) —
// scoped to just the request/response fields these tests set or read; the
// component itself intentionally stays loosely typed around the raw
// Algolia/instantsearch.js request shape (see its own eslint-disable).
type SearchRequestParams = {
  query?: string;
  page?: number;
  hitsPerPage?: number;
  facetFilters?: string[][];
  facets?: string[];
  numericFilters?: string[];
};
type SearchRequest = { params: SearchRequestParams };
type FacetOrdering = {
  facets: { order: string[] };
  values: Record<string, { sortRemainingBy: string }>;
};
type SearchResultItem = {
  facets?: Record<string, Record<string, number>>;
  renderingContent?: { facetOrdering: FacetOrdering };
  hits?: Array<Record<string, unknown>>;
  nbHits?: number;
  query?: string;
  page?: number;
  hitsPerPage?: number;
  nbManifestations?: number;
  nbItems?: number;
};
type SearchClientResponse = { results: SearchResultItem[] };
type WrappedSearchClient = { search: (requests: SearchRequest[]) => Promise<SearchClientResponse> };

type FacetValueRequestParams = { facetName?: string; facetQuery?: string; maxFacetHits?: number };
type FacetValueRequest = { params: FacetValueRequestParams };
type FacetHit = { value: string; highlighted: string; count: number };
type FacetValuesResult = { facetHits: FacetHit[] };
type WrappedFacetValuesClient = {
  searchForFacetValues: (requests: FacetValueRequest[]) => Promise<FacetValuesResult[]>;
};

vi.hoisted(() => {
  (globalThis as Record<string, unknown>).useRuntimeConfig = () => ({
    public: {
      elasticApiBase: 'http://localhost',
      searchApiPath: 'frontend/search',
      ELASTIC_INDEX: 'test-index',
    },
  });
  (globalThis as Record<string, unknown>).useNuxtApp = () => ({
    $toggleFacetDrawerState: () => {},
    $toast: { success: () => {}, error: () => {} },
  });
  (globalThis as Record<string, unknown>).useRouter = () => ({
    replace: routerReplaceMock,
    push: vi.fn(),
  });
  (globalThis as Record<string, unknown>).useRoute = () => ({
    query: routeQueryMock.value,
    path: '/search',
  });
  (globalThis as Record<string, unknown>).useSearchHistory = () => ({
    addToSearchHistory: vi.fn(),
    getSearchHistory: vi.fn(() => []),
    removeFromHistory: vi.fn(),
    clearSearchHistory: vi.fn(),
  });
  (globalThis as Record<string, unknown>).$fetch = vi.fn().mockResolvedValue({
    success: true,
    suggestions: [],
  });
});

import InstantSearchTemplateAVefi from '~/components/search/InstantSearchTemplateAVefi.vue';

// ---------- module mocks ----------

vi.mock('vue-router', () => ({
  useRouter: () => ({ replace: routerReplaceMock, push: vi.fn() }),
  useRoute: () => ({ query: routeQueryMock.value, path: '/search' }),
}));

vi.mock('~/composables/useMatomoTracking', () => ({
  useMatomoTracking: () => ({
    trackSearchSubmitted: vi.fn(),
    trackFacetUsed: vi.fn(),
    trackEvent: vi.fn(),
    trackResultViewChanged: vi.fn(),
  }),
}));

vi.mock('~/utils/searchResultCounts', () => ({
  getDisplayedWorksCount: vi.fn(() => 0),
}));

vi.mock('@searchkit/instantsearch-client', () => ({
  default: vi.fn(() => ({
    search: vi.fn().mockResolvedValue({ results: [] }),
  })),
}));

vi.mock('~/searchConfig_avefi', () => ({
  config: {},
}));

vi.mock('instantsearch.js/es/lib/routers', () => ({
  history: vi.fn(() => ({
    createURL: vi.fn(() => ''),
    read: vi.fn(() => ({})),
    write: vi.fn(),
    onUpdate: vi.fn(),
    dispose: vi.fn(),
  })),
}));

// ---------- global stubs / mocks ----------

beforeEach(() => {
  routerReplaceMock.mockReset().mockResolvedValue(undefined);
  routeQueryMock.value = {};
  currentRefinementsItemsMock.value = [];
  currentRefinementRefineSpy.mockReset();
  vi.stubGlobal(
    '$fetch',
    vi.fn().mockResolvedValue({
      success: true,
      suggestions: [],
    })
  );
});

// ---------- component stubs ----------

/** Renders a real button so click spies work */
const AisClearRefinementsStub = {
  name: 'AisClearRefinements',
  template: '<div><button data-testid="ais-clear-btn" type="button">clear</button></div>',
};

const genericStub = { template: '<div><slot /></div>' };
const AisInstantSearchStub = {
  name: 'AisInstantSearch',
  props: ['searchClient'],
  template: '<div><slot /></div>',
};

const AisCurrentRefinementsStub = {
  name: 'AisCurrentRefinements',
  template: '<div><slot :items="items" /><slot name="item" :item="item" :refine="refine" :createURL="createURL" /><slot name="noRefinement" /></div>',
  computed: {
    items() {
      return currentRefinementsItemsMock.value;
    },
    item() {
      return currentRefinementsItemsMock.value[0] ?? { label: '', refinements: [] };
    },
  },
  methods: {
    refine(refinement: unknown) {
      currentRefinementRefineSpy(refinement);
    },
    createURL() {
      return '#';
    },
  },
};

function mountComponent(
  searchClient: Record<string, ReturnType<typeof vi.fn>> = { search: vi.fn().mockResolvedValue({ results: [] }) },
  provide: Record<string, unknown> = {},
) {
  return mount(InstantSearchTemplateAVefi, {
    props: { indexName: 'test-index', searchClient },
    global: {
      provide,
      stubs: {
        AisInstantSearch: AisInstantSearchStub,
        AisConfigure: { template: '<div />' },
        AisClearRefinements: AisClearRefinementsStub,
        AisSearchBox: {
          template: '<div><slot :currentRefinement="\'\'" :refine="() => {}" :isSearchStalled="false" /></div>',
        },
        AisStats: {
          template: '<div><slot :nbHits="0" :results="null" /></div>',
        },
        AisCurrentRefinements: AisCurrentRefinementsStub,
        AisHits: {
          template: '<div><slot :items="[]" /></div>',
        },
        GlobalFacetDrawer: { template: '<div />' },
        LazyDetailPaginationComp: { template: '<div />' },
        SearchQueryAutocomplete: {
          props: ['modelValue'],
          emits: ['update:modelValue'],
          template: '<input :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
        },
        SearchHitsComp: { template: '<div />' },
        SearchNoResultsComp: { template: '<div />' },
        MicroContactForm: { template: '<div />' },
        Icon: { template: '<span />' },
        ClientOnly: genericStub,
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

// ---------- tests ----------

describe('InstantSearchTemplateAVefi – clear all refinements button', () => {
  test('renders the hidden ais-clear-refinements widget inside ais-instant-search', () => {
    const wrapper = mountComponent();
    // The stub renders a button with this testid; it must exist in the DOM
    expect(wrapper.find('[data-testid="ais-clear-btn"]').exists()).toBe(true);
  });

  test('clicking "Alle Filter entfernen" triggers the ais-clear-refinements button', async () => {
    const wrapper = mountComponent();

    const hiddenClearBtn = wrapper.find('[data-testid="ais-clear-btn"]');
    expect(hiddenClearBtn.exists()).toBe(true);

    const clickSpy = vi.fn();
    hiddenClearBtn.element.addEventListener('click', clickSpy);

    // The aria-label on the custom button is the i18n key (mocked to return the key)
    const clearAllBtn = wrapper.find('button[aria-label="clearallfilters"]');
    expect(clearAllBtn.exists()).toBe(true);

    await clearAllBtn.trigger('click');
    await flushPromises();
    await nextTick();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  test('clear-all keeps query in route when query exists', async () => {
    routeQueryMock.value = { query: 'Berlin', subjects: 'Arbeit' };
    const wrapper = mountComponent();

    const clearAllBtn = wrapper.find('button[aria-label="clearallfilters"]');
    expect(clearAllBtn.exists()).toBe(true);

    await clearAllBtn.trigger('click');
    await flushPromises();

    expect(routerReplaceMock).toHaveBeenCalledWith({
      path: '/search',
      query: { query: 'Berlin' },
    });
  });

  test('clear-all removes all route params when no query exists', async () => {
    routeQueryMock.value = { subjects: 'Arbeit', creators: 'Muster, Maria' };
    const wrapper = mountComponent();

    const clearAllBtn = wrapper.find('button[aria-label="clearallfilters"]');
    expect(clearAllBtn.exists()).toBe(true);

    await clearAllBtn.trigger('click');
    await flushPromises();

    expect(routerReplaceMock).toHaveBeenCalledWith({
      path: '/search',
      query: {},
    });
  });

  test('clears the visible search input when the URL query is removed', async () => {
    routeQueryMock.value = { query: 'Rosa' };
    window.history.pushState({}, '', '/search?query=Rosa');

    const wrapper = mountComponent();
    await nextTick();

    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('Rosa');

    routeQueryMock.value = {};
    window.history.pushState({}, '', '/search');
    window.dispatchEvent(new PopStateEvent('popstate'));
    await nextTick();

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  test('clears the visible search input immediately for new facetted search sync events', async () => {
    routeQueryMock.value = {
      query: 'Rosa',
      'creators[0]': 'Praunheim, Rosa von',
    };
    window.history.pushState(
      {},
      '',
      '/search?query=Rosa&creators%5B0%5D=Praunheim%2C%20Rosa%20von',
    );

    const wrapper = mountComponent();
    await nextTick();

    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('Rosa');

    window.history.pushState({}, '', '/search?creators%5B0%5D=Praunheim%2C%20Rosa%20von');
    window.dispatchEvent(new CustomEvent('avefi:search-query-sync', { detail: { query: '' } }));
    await nextTick();

    expect((input.element as HTMLInputElement).value).toBe('');
  });

  test('keeps visible input and InstantSearch uiState derived from the current URL across transitions', async () => {
    routeQueryMock.value = {
      query: 'Rosa',
      'creators[0]': 'Praunheim, Rosa von',
    };
    window.history.pushState(
      {},
      '',
      '/search?query=Rosa&creators%5B0%5D=Praunheim%2C%20Rosa%20von',
    );

    let uiState: UiState = {
      'test-index': {
        query: 'stale',
        refinementList: {
          subjects: ['stale subject'],
        },
      },
    };
    const instantSearchInstance = {
      get uiState() {
        return uiState;
      },
      setUiState: vi.fn((updater: UiStateUpdater) => {
        uiState = updater(uiState);
      }),
    };

    const wrapper = mountComponent(
      { search: vi.fn().mockResolvedValue({ results: [] }) },
      { '$_ais_instantSearchInstance': instantSearchInstance },
    );
    await flushPromises();
    await nextTick();

    const input = wrapper.find('input');
    expect((input.element as HTMLInputElement).value).toBe('Rosa');
    expect(uiState['test-index']).toEqual({
      query: 'Rosa',
      refinementList: {
        creators: ['Praunheim, Rosa von'],
      },
    });

    window.history.pushState({}, '', '/search?creators%5B0%5D=Praunheim%2C%20Rosa%20von');
    window.dispatchEvent(new PopStateEvent('popstate'));
    await flushPromises();
    await nextTick();

    expect((input.element as HTMLInputElement).value).toBe('');
    expect(uiState['test-index']).toEqual({
      refinementList: {
        creators: ['Praunheim, Rosa von'],
      },
    });

    window.history.pushState({}, '', '/search?query=Berlin&subjects%5B0%5D=Arbeit&page=2');
    window.dispatchEvent(new PopStateEvent('popstate'));
    await flushPromises();
    await nextTick();

    expect((input.element as HTMLInputElement).value).toBe('Berlin');
    expect(uiState['test-index']).toEqual({
      query: 'Berlin',
      page: 2,
      refinementList: {
        subjects: ['Arbeit'],
      },
    });
  });

  test('clear-all dispatches a centralized refinement action event', async () => {
    const actionSpy = vi.fn();
    const listener = (event: Event) => {
      actionSpy((event as CustomEvent).detail?.action);
    };
    window.addEventListener('avefi:search-refinement-action', listener as EventListener);

    try {
      const wrapper = mountComponent();
      const clearAllBtn = wrapper.find('button[aria-label="clearallfilters"]');
      expect(clearAllBtn.exists()).toBe(true);

      await clearAllBtn.trigger('click');
      await flushPromises();

      expect(actionSpy).toHaveBeenCalledWith('clear-all-refinements');
    } finally {
      window.removeEventListener('avefi:search-refinement-action', listener as EventListener);
    }
  });

  test('clicking an active refinement calls refine with that refinement', async () => {
    currentRefinementsItemsMock.value = [
      {
        label: 'subjects',
        refinements: [
          {
            attribute: 'subjects',
            type: 'disjunctive',
            value: 'Arbeit',
            label: 'Arbeit',
          },
        ],
      },
    ];

    const wrapper = mountComponent();
    const removeLink = wrapper.find('a[aria-label="remove subjects Arbeit"]');
    expect(removeLink.exists()).toBe(true);

    await removeLink.trigger('click');
    await flushPromises();

    expect(currentRefinementRefineSpy).toHaveBeenCalledTimes(1);
    expect(currentRefinementRefineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        attribute: 'subjects',
        value: 'Arbeit',
      }),
    );
  });

  test('clicking an active refinement dispatches centralized refinement action event', async () => {
    currentRefinementsItemsMock.value = [
      {
        label: 'subjects',
        refinements: [
          {
            attribute: 'subjects',
            type: 'disjunctive',
            value: 'Arbeit',
            label: 'Arbeit',
          },
        ],
      },
    ];

    const actionSpy = vi.fn();
    const listener = (event: Event) => {
      actionSpy((event as CustomEvent).detail?.action);
    };
    window.addEventListener('avefi:search-refinement-action', listener as EventListener);

    try {
      const wrapper = mountComponent();
      const removeLink = wrapper.find('a[aria-label="remove subjects Arbeit"]');
      expect(removeLink.exists()).toBe(true);

      await removeLink.trigger('click');
      await flushPromises();

      expect(actionSpy).toHaveBeenCalledWith('current-refinement-remove');
    } finally {
      window.removeEventListener('avefi:search-refinement-action', listener as EventListener);
    }
  });

  test('wraps the provided search client instead of creating a regular-search endpoint internally', async () => {
    // The `creators` field is now accepted natively by the backend.
    // No alias mapping (creators → directors_or_editors) occurs.
    const parentSearchClient = {
      search: vi.fn().mockResolvedValue({
        results: [
          {
            facets: {
              creators: {
                'Muster, Maria': 1,
              },
            },
            renderingContent: {
              facetOrdering: {
                facets: {
                  order: ['creators', 'subjects'],
                },
                values: {
                  creators: { sortRemainingBy: 'count' },
                  subjects: { sortRemainingBy: 'count' },
                },
              },
            },
          },
        ],
      }),
    };
    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedSearchClient;

    const response = await wrappedClient.search([
      {
        params: {
          facetFilters: [['creators:Muster, Maria']],
          facets: ['creators', 'subjects'],
          numericFilters: ['production_in_year>=1900'],
        },
      },
    ]);

    expect(parentSearchClient.search).toHaveBeenCalledWith([
      {
        params: {
          facetFilters: [['creators:Muster, Maria']],
          facets: ['creators', 'subjects'],
          'numeric-refinements': {
            production_in_year: {
              '>=': 1900,
            },
          },
        },
      },
    ]);
    expect(response.results[0]!.facets).toEqual({
      creators: {
        'Muster, Maria': 1,
      },
    });
    expect(response.results[0]!.renderingContent!.facetOrdering.facets.order).toEqual(['creators', 'subjects']);
    expect(Object.keys(response.results[0]!.renderingContent!.facetOrdering.values)).toEqual(['creators', 'subjects']);
  });

  test('strips empty query params before calling the backend search client', async () => {
    const parentSearchClient = {
      search: vi.fn().mockResolvedValue({ results: [] }),
    };
    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedSearchClient;

    await wrappedClient.search([
      {
        params: {
          query: '',
          page: 0,
          hitsPerPage: 20,
        },
      },
    ]);

    expect(parentSearchClient.search).toHaveBeenCalledWith([
      {
        params: {
          page: 0,
          hitsPerPage: 20,
        },
      },
    ]);
  });

  test('does not silently strip has_issuer_name when item-level filters are active', async () => {
    const parentSearchClient = {
      search: vi.fn().mockResolvedValue({ results: [] }),
    };
    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedSearchClient;

    await wrappedClient.search([
      {
        params: {
          facetFilters: [
            ['has_issuer_name:Deutsche Kinemathek'],
            ['has_sound_type:Sound'],
          ],
          facets: ['has_issuer_name', 'has_sound_type'],
        },
      },
    ]);

    expect(parentSearchClient.search).toHaveBeenCalledWith([
      {
        params: {
          facetFilters: [
            ['has_issuer_name:Deutsche Kinemathek'],
            ['has_sound_type:Sound'],
          ],
          facets: ['has_issuer_name', 'has_sound_type'],
        },
      },
    ]);
  });

  test('shows error and returns fallback result when backend response shape is invalid', async () => {
    const parentSearchClient = {
      search: vi.fn().mockResolvedValue({ nope: true }),
    };
    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedSearchClient;

    const response = await wrappedClient.search([
      {
        params: {
          query: 'Metropolis',
          page: 0,
          hitsPerPage: 20,
        },
      },
    ]);

    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({
      hits: [],
      nbHits: 0,
      query: 'Metropolis',
      page: 0,
      hitsPerPage: 20,
    });
    expect(wrapper.text()).toContain('searchBackendError');
  });

  test('shows an error and returns an empty response when backend search fails', async () => {
    const parentSearchClient = {
      search: vi.fn().mockRejectedValue(new Error('backend down')),
    };
    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedSearchClient;

    const response = await wrappedClient.search([
      {
        params: {
          query: 'kaputt',
          page: 1,
          hitsPerPage: 10,
        },
      },
    ]);

    await nextTick();

    expect(response.results).toHaveLength(1);
    expect(response.results[0]).toMatchObject({
      hits: [],
      nbHits: 0,
      page: 1,
      hitsPerPage: 10,
      nbManifestations: 0,
      nbItems: 0,
    });
    expect(wrapper.text()).toContain('searchBackendError');
  });

  test('treats backend response as source-of-truth for facets and facetOrdering', async () => {
    const backendResponse = {
      results: [
        {
          facets: {
            has_issuer_name: {
              'Deutsche Kinemathek': 5,
            },
            has_sound_type: {
              Sound: 3,
            },
          },
          renderingContent: {
            facetOrdering: {
              facets: {
                order: ['has_sound_type', 'has_issuer_name'],
              },
              values: {
                has_sound_type: { sortRemainingBy: 'count' },
                has_issuer_name: { sortRemainingBy: 'count' },
              },
            },
          },
          hits: [
            {
              objectID: 'A37FAC2F-2527-4DFE-94FB-5C18D2569406',
              directors_or_editors: ['Lang, Fritz'],
              creators: ['Lang, Fritz'],
            },
          ],
        },
      ],
    };

    const parentSearchClient = {
      search: vi.fn().mockResolvedValue(backendResponse),
    };

    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedSearchClient;

    const response = await wrappedClient.search([
      {
        params: {
          query: 'Metropolis',
          facetFilters: [['has_issuer_name:Deutsche Kinemathek']],
          facets: ['has_issuer_name', 'has_sound_type'],
        },
      },
    ]);

    expect(parentSearchClient.search).toHaveBeenCalledWith([
      {
        params: {
          query: 'Metropolis',
          facetFilters: [['has_issuer_name:Deutsche Kinemathek']],
          facets: ['has_issuer_name', 'has_sound_type'],
        },
      },
    ]);

    expect(response.results[0]!.facets).toEqual(backendResponse.results[0]!.facets);
    expect(response.results[0]!.renderingContent!.facetOrdering.facets.order).toEqual([
      'has_sound_type',
      'has_issuer_name',
    ]);
    expect(response.results[0]!.hits![0]).toMatchObject({
      directors_or_editors: ['Lang, Fritz'],
      creators: ['Lang, Fritz'],
    });
  });

  test('searches facet panel values through the facet suggestions endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      success: true,
      suggestions: [
        {
          text: 'Schaller, Dietrich',
          count: 3,
        },
      ],
    });
    vi.stubGlobal('$fetch', fetchMock);

    const parentSearchClient = {
      searchForFacetValues: vi.fn(),
    };

    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedFacetValuesClient;

    const response = await wrappedClient.searchForFacetValues([
      {
        params: {
          facetName: 'creators',
          facetQuery: 'Sch',
          maxFacetHits: 10,
        },
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/elastic/suggestions',
      expect.objectContaining({
        body: {
          mode: 'facet',
          facetAttr: 'creators',
          query: 'Sch',
          size: 10,
        },
      })
    );
    expect(parentSearchClient.searchForFacetValues).not.toHaveBeenCalled();
    expect(response[0]!.facetHits).toEqual([
      {
        value: 'Schaller, Dietrich',
        highlighted: 'Schaller, Dietrich',
        count: 3,
      },
    ]);
  });

  test('derives facetHits from regular facets when backend facet search returns a search result', async () => {
    const parentSearchClient = {
      searchForFacetValues: vi.fn().mockResolvedValue([
        {
          facets: {
            creators: {
              'Muster, Maria': 3,
              'Lang, Fritz': 2,
            },
          },
        },
      ]),
    };

    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedFacetValuesClient;

    const response = await wrappedClient.searchForFacetValues([
      {
        params: {
          facetName: 'creators',
          maxFacetHits: 10,
        },
      },
    ]);

    expect(response[0]!.facetHits).toEqual([
      {
        value: 'Muster, Maria',
        highlighted: 'Muster, Maria',
        count: 3,
      },
      {
        value: 'Lang, Fritz',
        highlighted: 'Lang, Fritz',
        count: 2,
      },
    ]);
  });

  test('keeps exact facet-value searches on the suggestions endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      success: true,
      suggestions: [
        {
          text: 'Schaller, Dietrich',
          count: 7,
        },
      ],
    });
    vi.stubGlobal('$fetch', fetchMock);

    const parentSearchClient = {
      searchForFacetValues: vi.fn(),
    };

    const wrapper = mountComponent(parentSearchClient);
    const instantSearch = wrapper.findComponent(AisInstantSearchStub);
    const wrappedClient = instantSearch.props('searchClient') as WrappedFacetValuesClient;

    const response = await wrappedClient.searchForFacetValues([
      {
        params: {
          facetName: 'creators',
          facetQuery: 'Schaller, Dietrich',
          maxFacetHits: 10,
        },
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/elastic/suggestions',
      expect.objectContaining({
        body: expect.objectContaining({
          facetAttr: 'creators',
          query: 'Schaller, Dietrich',
        }),
      })
    );
    expect(parentSearchClient.searchForFacetValues).not.toHaveBeenCalled();
    expect(response[0]!.facetHits).toEqual([
      {
        value: 'Schaller, Dietrich',
        highlighted: 'Schaller, Dietrich',
        count: 7,
      },
    ]);
  });
});
