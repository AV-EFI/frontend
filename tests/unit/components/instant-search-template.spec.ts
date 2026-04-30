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

vi.hoisted(() => {
    (globalThis as any).useRuntimeConfig = () => ({
        public: {
            elasticApiBase: 'http://localhost',
            searchApiPath: 'frontend/search',
            ELASTIC_INDEX: 'test-index',
        },
    });
    (globalThis as any).useNuxtApp = () => ({
        $toggleFacetDrawerState: () => {},
        $toast: { success: () => {}, error: () => {} },
    });
    (globalThis as any).useRouter = () => ({
        replace: routerReplaceMock,
        push: vi.fn(),
    });
    (globalThis as any).useRoute = () => ({
        query: routeQueryMock.value,
        path: '/search',
    });
    (globalThis as any).useSearchHistory = () => ({
        addToSearchHistory: vi.fn(),
        getSearchHistory: vi.fn(() => []),
        removeFromHistory: vi.fn(),
        clearSearchHistory: vi.fn(),
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

function mountComponent(searchClient = { search: vi.fn().mockResolvedValue({ results: [] }) }) {
    return mount(InstantSearchTemplateAVefi, {
        props: { indexName: 'test-index', searchClient },
        global: {
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
        const wrappedClient = instantSearch.props('searchClient') as { search: (requests: any[]) => Promise<any> };

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
        expect(response.results[0].facets).toEqual({
            creators: {
                'Muster, Maria': 1,
            },
        });
        expect(response.results[0].renderingContent.facetOrdering.facets.order).toEqual(['creators', 'subjects']);
        expect(Object.keys(response.results[0].renderingContent.facetOrdering.values)).toEqual(['creators', 'subjects']);
    });

    test('strips empty query params before calling the backend search client', async () => {
        const parentSearchClient = {
            search: vi.fn().mockResolvedValue({ results: [] }),
        };
        const wrapper = mountComponent(parentSearchClient);
        const instantSearch = wrapper.findComponent(AisInstantSearchStub);
        const wrappedClient = instantSearch.props('searchClient') as { search: (requests: any[]) => Promise<any> };

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
        const wrappedClient = instantSearch.props('searchClient') as { search: (requests: any[]) => Promise<any> };

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
        const wrappedClient = instantSearch.props('searchClient') as { search: (requests: any[]) => Promise<any> };

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
        const wrappedClient = instantSearch.props('searchClient') as { search: (requests: any[]) => Promise<any> };

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
        const wrappedClient = instantSearch.props('searchClient') as { search: (requests: any[]) => Promise<any> };

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

        expect(response.results[0].facets).toEqual(backendResponse.results[0].facets);
        expect(response.results[0].renderingContent.facetOrdering.facets.order).toEqual([
            'has_sound_type',
            'has_issuer_name',
        ]);
        expect(response.results[0].hits[0]).toMatchObject({
            directors_or_editors: ['Lang, Fritz'],
            creators: ['Lang, Fritz'],
        });
    });
});
