// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import SearchHitsComp from '~/components/search/SearchHitsComp.vue';

const baseProps = {
  items: [{ handle: 'h1', has_record: { category: 'avefi:WorkVariant' } }],
  viewTypeChecked: 'flat',
  expandedHandles: {},
  productionDetailsChecked: false,
  showAdminStats: false,
  expandAllHandlesChecked: false,
  currentRefinements: [],
};

describe('SearchHitsComp loading behavior', () => {
  test('renders data list even when isSearchLoading is true', () => {
    const wrapper = mount(SearchHitsComp, {
      props: { ...baseProps, isSearchLoading: true },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: {
          SearchListFlatComp: { template: '<div data-test="flat-list" />' },
          SearchListViewComp: { template: '<div data-test="accordion-list" />' },
          SearchTableViewComp: { template: '<div data-test="table-list" />' },
        },
      },
    });

    expect(wrapper.find('[data-test="flat-list"]').exists()).toBe(true);
  });
});

