// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { computed, nextTick, onBeforeUnmount, reactive, watch } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import SearchListViewComp from '~/components/search/SearchListViewComp.vue';

vi.hoisted(() => {
  (globalThis as any).useRuntimeConfig = () => ({
    public: {
      AVEFI_COPY_PID_URL: 'https://hdl.handle.net/',
    },
  });
  (globalThis as any).useRoute = () => ({
    query: {},
    path: '/search',
  });
});

vi.mock('@/composables/useItemEmpty', () => ({
  allItemsEmpty: () => false,
  isItemEmpty: () => false,
  has: (obj: any, path: string) => path.split('.').every((part) => {
    obj = obj?.[part];
    return obj !== undefined && obj !== null;
  }),
  get: (obj: any, path: string) => path.split('.').reduce((value, part) => value?.[part], obj),
  buildRows: (work: any) => (work?.manifestations || []).flatMap((mf: any) =>
    (mf?.items || []).map((item: any) => ({ item, mf }))
  ),
}));

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const manifestationListStub = {
  name: 'SearchManifestationListSplitView',
  props: ['manifestations', 'getFilteredItems', 'workVariantHandle'],
  template: '<div data-testid="manifestation-list" />',
};

function makeItem(handle: string, colour: string | null) {
  return {
    handle,
    has_record: {
      has_colour_type: colour,
      has_format: [{ type: 'format-35mm' }],
      in_language: [{ code: 'de' }],
      element_type: 'itemElement',
      has_access_status: 'public',
      has_sound_type: 'sound',
    },
  };
}

function mountComponent(manifestation: any) {
  return mount(SearchListViewComp, {
    props: {
      items: [{
        handle: '21.11155/work-1',
        has_record: {
          has_primary_title: { has_name: 'Work 1' },
        },
        manifestations: [manifestation],
      }],
      productionDetailsChecked: true,
    },
    global: {
      stubs: {
        SearchManifestationListSplitView: manifestationListStub,
        GlobalClipboardComp: { template: '<span />' },
        MicroBadgeCategoryComp: { template: '<span />' },
        GlobalActionContextComp: { template: '<span />' },
        SearchGenericIconList: { template: '<span />' },
        SearchHighlightMatchComp: { template: '<span />' },
        GlobalTooltipInfo: { template: '<span />' },
        Icon: { template: '<span />' },
        NuxtLink: { template: '<a><slot /></a>' },
        Transition: { template: '<div><slot /></div>' },
      },
      mocks: {
        $t: (key: string) => key,
        useRuntimeConfig: () => ({
          public: {
            AVEFI_COPY_PID_URL: 'https://hdl.handle.net/',
          },
        }),
      },
    },
  });
}

describe('SearchListViewComp item filtering', () => {
  beforeEach(() => {
    vi.stubGlobal('computed', computed);
    vi.stubGlobal('reactive', reactive);
    vi.stubGlobal('watch', watch);
    vi.stubGlobal('onBeforeUnmount', onBeforeUnmount);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    Object.defineProperty(window.navigator, 'sendBeacon', {
      value: undefined,
      configurable: true,
    });
    window.sessionStorage.clear();
    window.history.pushState({}, '', '/search/?has_colour_type%5B0%5D=ColourBlackAndWhite');
  });

  test('filters manifestation items locally when item inner_hits are missing', () => {
    const manifestation = {
      handle: '21.11155/manifestation-1',
      items: [
        makeItem('item-bw', 'ColourBlackAndWhite'),
        makeItem('item-colour', 'Colour'),
        makeItem('item-empty-colour', null),
      ],
    };

    const wrapper = mountComponent(manifestation);
    const splitView = wrapper.getComponent(manifestationListStub);
    const filtered = splitView.props('getFilteredItems')(manifestation);

    expect(filtered.map((item: any) => item.handle)).toEqual(['item-bw']);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/api/log/client', expect.objectContaining({
      method: 'POST',
      keepalive: true,
    }));
    const payload = JSON.parse((fetch as any).mock.calls[0][1].body);
    expect(payload).toMatchObject({
      type: 'search-item-filter-mismatch',
      source: 'SearchListViewComp',
      message: 'Search result contained nested items that did not match active item-level refinements',
    });
    expect(JSON.parse(payload.info)).toMatchObject({
      manifestationHandle: '21.11155/manifestation-1',
      removedCount: 2,
      activeItemRefinements: {
        has_colour_type: ['ColourBlackAndWhite'],
      },
    });
  });

  test('reports at most one local item-filter mismatch per URL and refinement set', () => {
    const firstManifestation = {
      handle: '21.11155/manifestation-1',
      items: [
        makeItem('item-bw-1', 'ColourBlackAndWhite'),
        makeItem('item-colour-1', 'Colour'),
      ],
    };
    const secondManifestation = {
      handle: '21.11155/manifestation-2',
      items: [
        makeItem('item-bw-2', 'ColourBlackAndWhite'),
        makeItem('item-colour-2', 'Colour'),
      ],
    };

    const firstWrapper = mountComponent(firstManifestation);
    firstWrapper.getComponent(manifestationListStub).props('getFilteredItems')(firstManifestation);

    const secondWrapper = mountComponent(secondManifestation);
    secondWrapper.getComponent(manifestationListStub).props('getFilteredItems')(secondManifestation);

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('prefers item inner_hits over local fallback filtering', () => {
    const innerHitItem = makeItem('inner-hit-bw', 'ColourBlackAndWhite');
    const manifestation = {
      handle: '21.11155/manifestation-1',
      items: [
        makeItem('full-item-colour', 'Colour'),
        makeItem('full-item-bw', 'ColourBlackAndWhite'),
      ],
      inner_hits: {
        manifestations_items_hits: {
          hits: {
            hits: [
              { _source: innerHitItem },
            ],
          },
        },
      },
    };

    const wrapper = mountComponent(manifestation);
    const splitView = wrapper.getComponent(manifestationListStub);
    const filtered = splitView.props('getFilteredItems')(manifestation);

    expect(filtered).toEqual([innerHitItem]);
    expect(fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Tests for the route.query watch that replaced the old polling / fake-event
// listeners.  The watch has { immediate: true }, so updateFromHref() is called
// once on mount; and when route.query changes reactively, it is called again.
//
// Note: parseRefinementsFromUrl matches the InstantSearch default URL format
// "[refinementList][facet][0]=value", so the test URLs below use that format
// (%5BrefinementList%5D = "[refinementList]") to produce an observable result.
// ---------------------------------------------------------------------------
describe('SearchListViewComp route.query watch (replaces polling)', () => {
  let reactiveRouteQuery: Record<string, any>;

  // IS default format key that parseRefinementsFromUrl can match
  const IS_FORMAT_URL = '/search/?%5BrefinementList%5D%5Bhas_format_type%5D%5B0%5D=VHS';

  beforeEach(() => {
    reactiveRouteQuery = reactive({});
    (globalThis as any).useRoute = () => ({ query: reactiveRouteQuery, path: '/search' });

    vi.stubGlobal('computed', computed);
    vi.stubGlobal('reactive', reactive);
    vi.stubGlobal('watch', watch);
    vi.stubGlobal('onBeforeUnmount', onBeforeUnmount);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    Object.defineProperty(window.navigator, 'sendBeacon', {
      value: undefined,
      configurable: true,
    });
    window.sessionStorage.clear();
  });

  afterEach(() => {
    // Restore static useRoute mock used by the sibling describe block.
    (globalThis as any).useRoute = () => ({ query: {}, path: '/search' });
    window.history.pushState({}, '', '/search/');
  });

  test('refinementsActive is false on mount when URL has no facet params', () => {
    window.history.pushState({}, '', '/search/');
    const wrapper = mountComponent({ handle: 'mf-1', items: [] });
    expect((wrapper.vm as any).refinementsActive).toBe(false);
  });

  test('refinementsActive is true immediately on mount when URL already has facet params (immediate: true)', () => {
    // Uses [refinementList][facet][0] format which parseRefinementsFromUrl matches.
    window.history.pushState({}, '', IS_FORMAT_URL);
    reactiveRouteQuery['has_format_type'] = ['VHS'];
    const wrapper = mountComponent({ handle: 'mf-1', items: [] });
    expect((wrapper.vm as any).refinementsActive).toBe(true);
  });

  test('refinementsActive updates when route.query changes reactively', async () => {
    // Start with no facets.
    window.history.pushState({}, '', '/search/');
    const wrapper = mountComponent({ handle: 'mf-1', items: [] });
    expect((wrapper.vm as any).refinementsActive).toBe(false);

    // Simulate InstantSearch router.write patching both the URL and Vue Router.
    window.history.pushState({}, '', IS_FORMAT_URL);
    reactiveRouteQuery['has_format_type'] = ['VHS'];
    await nextTick();

    expect((wrapper.vm as any).refinementsActive).toBe(true);
  });

  test('refinementsActive resets to false when route.query is cleared', async () => {
    // Start with an active facet.
    window.history.pushState({}, '', IS_FORMAT_URL);
    reactiveRouteQuery['has_format_type'] = ['VHS'];
    const wrapper = mountComponent({ handle: 'mf-1', items: [] });
    expect((wrapper.vm as any).refinementsActive).toBe(true);

    // Simulate "Clear all refinements" — IS router.write calls router.replace('/search/').
    window.history.pushState({}, '', '/search/');
    delete reactiveRouteQuery['has_format_type'];
    await nextTick();

    expect((wrapper.vm as any).refinementsActive).toBe(false);
  });
});
