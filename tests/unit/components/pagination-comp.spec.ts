// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import PaginationComp from '~/components/detail/PaginationComp.vue';

describe('PaginationComp loading state', () => {
  test('shows pagination skeleton while search is loading', () => {
    const wrapper = mount(PaginationComp, {
      props: { isSearchLoading: true },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: {
          'ais-pagination': { template: '<nav data-test="ais-pagination" />' },
        },
      },
    });

    expect(wrapper.find('[role="status"]').exists()).toBe(true);
    expect(wrapper.findAll('.animate-pulse').length).toBe(5);
  });

  test('hides loading overlay when search is not loading', async () => {
    const wrapper = mount(PaginationComp, {
      props: { isSearchLoading: false },
      global: {
        mocks: { $t: (k: string) => k },
        stubs: {
          'ais-pagination': { template: '<nav data-test="ais-pagination" />' },
        },
      },
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('[role="status"]').exists()).toBe(false);
  });
});
