// @vitest-environment happy-dom
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// vi.hoisted runs before any imports – required for globals used at the top
// level of <script setup> (e.g. useRuntimeConfig, useNuxtApp, useRoute…)
const routerReplaceMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

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
        query: {},
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
    useRoute: () => ({ query: {}, path: '/search' }),
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
                AisCurrentRefinements: {
                    template: '<div><slot :items="[]" /><slot name="item" :item="{label:\'\',refinements:[]}" :refine="() => {}" :createURL="() => \'\'" /><slot name="noRefinement" /></div>',
                },
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

    test('wraps the provided search client instead of creating a regular-search endpoint internally', async () => {
        const parentSearchClient = {
            search: vi.fn().mockResolvedValue({
                results: [
                    {
                        facets: {
                            directors_or_editors: {
                                'Muster, Maria': 1,
                            },
                        },
                        renderingContent: {
                            facetOrdering: {
                                facets: {
                                    order: ['directors_or_editors', 'subjects'],
                                },
                                values: {
                                    directors_or_editors: { sortRemainingBy: 'count' },
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
                    facetFilters: [['directors_or_editors:Muster, Maria']],
                    facets: ['directors_or_editors', 'subjects'],
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
});
