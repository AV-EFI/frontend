// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import SameAsComp from '~/components/detail/SameAsComp.vue';

vi.stubGlobal('useNormdataUrl', () => ({
  getNormdataUrl: (category: string, id: string) => `https://example.test/${category}/${id}`,
}));

vi.mock('~/utils/clipboard', () => ({
  useClipboardUtil: () => ({
    copyExtended: vi.fn(),
  }),
}));

describe('SameAsComp positioning contract', () => {
  test('keeps transforms off the wrapper that contains the fixed-position menu', () => {
    const wrapper = mount(SameAsComp, {
      props: {
        sameAsData: [{ category: 'avefi:GNDResource', id: '123' }],
      },
      global: {
        stubs: {
          Icon: { template: '<span />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.classes()).not.toContain('-translate-y-0.5');
    expect(wrapper.classes().some(className => className.includes('translate'))).toBe(false);
    expect(wrapper.get('[role="menu"]').classes()).toContain('fixed');
  });
});
