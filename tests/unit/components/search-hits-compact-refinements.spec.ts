// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import SearchHitsComp from '~/components/search/SearchHitsComp.vue';

vi.hoisted(() => {
  (globalThis as any).useRoute = () => ({
    query: {},
    path: '/search',
  });
});

const compactStub = {
  name: 'SearchListCompactComp',
  props: ['datasets', 'showAdminStats', 'currentRefinements'],
  template: '<div data-testid="compact-stub" />',
};

describe('SearchHitsComp compact refinement forwarding', () => {
  test('passes currentRefinements prop to compact view', () => {
    const currentRefinements = [{ label: 'has_format_type', refinements: [{ value: '16mm' }] }];

    const wrapper = mount(SearchHitsComp, {
      props: {
        items: [{ handle: '21.11155/work-1' }],
        viewTypeChecked: 'compact',
        isSearchLoading: false,
        currentRefinements,
        expandedHandles: new Set<string>(),
      },
      global: {
        stubs: {
          SearchListCompactComp: compactStub,
          SearchListFlatComp: { template: '<div />' },
          SearchListViewComp: { template: '<div />' },
          SearchTableViewComp: { template: '<div />' },
          GlobalSkeletonLoaderComp: { template: '<div />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    const compact = wrapper.getComponent(compactStub);
    expect(compact.props('currentRefinements')).toEqual(currentRefinements);
  });
});
