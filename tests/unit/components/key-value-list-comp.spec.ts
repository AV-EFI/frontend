// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import KeyValueListComp from '~/components/detail/KeyValueListComp.vue';

describe('KeyValueListComp', () => {
  test('renders a value-only list when keytxt is null', () => {
    const wrapper = mount(KeyValueListComp, {
      props: {
        keytxt: null,
        valtxt: [
          { has_name: 'Alternative title one' },
          { has_name: 'Alternative title two' },
        ],
        ul: true,
      },
      global: {
        stubs: {
          MicroLabelComp: {
            props: ['labelText'],
            template: '<div class="label">{{ labelText }}</div>',
          },
          DetailSameAsComp: { template: '<div />' },
          GlobalClipboardComp: { template: '<span />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.find('.label').exists()).toBe(false);
    expect(wrapper.text()).toContain('Alternative title one');
    expect(wrapper.text()).toContain('Alternative title two');
    expect(wrapper.get('ul').attributes('aria-label')).toBeUndefined();
  });
});
