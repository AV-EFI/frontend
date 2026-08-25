// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import BadgeCategoryComp from '~/components/micro/BadgeCategoryComp.vue';

vi.stubGlobal('useI18n', () => ({
  t: (key: string) => key,
}));

describe('BadgeCategoryComp', () => {
  test('uses the larger level icon class for AVefi stack badges', () => {
    const wrapper = mount(BadgeCategoryComp, {
      props: {
        category: 'avefi:WorkVariant',
      },
      global: {
        stubs: {
          Icon: {
            props: ['name'],
            template: '<i :data-icon="name" :class="$attrs.class" />',
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    const icon = wrapper.get('[data-icon="tabler:stack-front"]');

    expect(wrapper.classes()).toContain('badge-sm');
    expect(wrapper.classes()).toContain('text-xs');
    expect(wrapper.classes()).toContain('h-5');
    expect(icon.classes()).toContain('icon-inline');
    expect(icon.classes()).toContain('icon-level');
  });
});
