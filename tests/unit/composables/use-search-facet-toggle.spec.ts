// @vitest-environment happy-dom
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useSearchFacetToggle } from '~/composables/useSearchFacetToggle';

const locationAssign = vi.fn();
const routerPush = vi.fn();
const routerResolve = vi.fn((location: { path: string; query?: Record<string, unknown> }) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(location.query || {})) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item == null) continue;
      params.append(key, String(item));
    }
  }
  return {
    href: `${location.path}${params.toString() ? `?${params.toString()}` : ''}`,
  };
});
let routePath = '/res/21.11155/work-1';
let routeQuery: Record<string, unknown> = {};

const Host = defineComponent({
  setup() {
    return useSearchFacetToggle();
  },
  template: '<div />',
});

describe('useSearchFacetToggle', () => {
  beforeEach(() => {
    locationAssign.mockReset();
    routerPush.mockReset();
    routerResolve.mockClear();
    routePath = '/res/21.11155/work-1';
    routeQuery = {};

    Object.defineProperty(window, 'location', {
      value: { assign: locationAssign, href: 'http://localhost/', pathname: routePath, search: '' },
      writable: true,
      configurable: true,
    });

    vi.stubGlobal('useRoute', () => ({
      path: routePath,
      query: routeQuery,
    }));
    vi.stubGlobal('useRouter', () => ({
      push: routerPush,
      resolve: routerResolve,
    }));
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        ELASTIC_INDEX: 'test-index',
        SEARCH_URL: 'search',
      },
    }));
  });

  test('navigates facet toggles from detail pages to the search route', async () => {
    const wrapper = mount(Host);

    await (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).toggleFacetValue('creators', 'Reiniger, Lotte');

    expect(locationAssign).toHaveBeenCalledWith('/search?creators%5B0%5D=Reiniger%2C+Lotte');
  });

  test('keeps facet toggles on the search route when already searching', async () => {
    routePath = '/search';
    routeQuery = { 'creators[0]': 'Reiniger, Lotte', page: '3' };
    const wrapper = mount(Host);

    await (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).toggleFacetValue('subjects', 'Animation');

    expect(locationAssign).toHaveBeenCalledWith(
      '/search?creators%5B0%5D=Reiniger%2C+Lotte&subjects%5B0%5D=Animation',
    );
  });

  test('returns a shareable search href for detail-page facet toggles', () => {
    const wrapper = mount(Host);

    const href = (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).getFacetToggleHref('creators', 'Reiniger, Lotte');

    expect(href).toBe('/search?creators%5B0%5D=Reiniger%2C+Lotte');
  });

  test('navigates production year clicks via full navigation', async () => {
    const wrapper = mount(Host);

    await (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).toggleFacetValue('productionyear', '1929');

    expect(locationAssign).toHaveBeenCalledWith(
      '/search?numericRefinement%5Bproduction_in_year%5D%5B%3E%3D%5D=1929&numericRefinement%5Bproduction_in_year%5D%5B%3C%3D%5D=1929',
    );
  });

  test('uses min and max years for production year range clicks', async () => {
    const wrapper = mount(Host);

    await (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).toggleFacetValue('productionyear', '1929-2000');

    expect(locationAssign).toHaveBeenCalledWith(
      '/search?numericRefinement%5Bproduction_in_year%5D%5B%3E%3D%5D=1929&numericRefinement%5Bproduction_in_year%5D%5B%3C%3D%5D=2000',
    );
  });

  test('treats slash-separated production years as a numeric range', async () => {
    const wrapper = mount(Host);

    await (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).toggleFacetValue('productionyear', '1925/1926');

    expect(locationAssign).toHaveBeenCalledWith(
      '/search?numericRefinement%5Bproduction_in_year%5D%5B%3E%3D%5D=1925&numericRefinement%5Bproduction_in_year%5D%5B%3C%3D%5D=1926',
    );
  });

  test('toggles off an active production year numeric refinement', async () => {
    routeQuery = {
      'numericRefinement[production_in_year][>=]': '1929',
      'numericRefinement[production_in_year][<=]': '2000',
      page: '2',
    };
    Object.defineProperty(window, 'location', {
      value: {
        assign: locationAssign,
        href: 'http://localhost/search?numericRefinement%5Bproduction_in_year%5D%5B%3E%3D%5D=1929&numericRefinement%5Bproduction_in_year%5D%5B%3C%3D%5D=2000&page=2',
        pathname: '/search',
        search: '?numericRefinement%5Bproduction_in_year%5D%5B%3E%3D%5D=1929&numericRefinement%5Bproduction_in_year%5D%5B%3C%3D%5D=2000&page=2',
      },
      writable: true,
      configurable: true,
    });
    const wrapper = mount(Host);

    await (wrapper.vm as unknown as ReturnType<typeof useSearchFacetToggle>).toggleFacetValue('productionyear', '1929-2000');

    expect(locationAssign).toHaveBeenCalledWith('/search');
  });
});
