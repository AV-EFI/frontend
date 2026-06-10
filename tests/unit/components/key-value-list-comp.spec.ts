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

  test('deduplicates repeated located_in rows with the same authority references', () => {
    const wrapper = mount(KeyValueListComp, {
      props: {
        keytxt: 'place',
        valtxt: [
          {
            category: 'avefi:GeographicName',
            has_name: 'Bahamas',
            same_as: [
              { category: 'avefi:GNDResource', id: '14675-4' },
              { category: 'avefi:TGNResource', id: '7005332' },
            ],
          },
          {
            category: 'avefi:GeographicName',
            has_name: 'Bahamas',
            same_as: [
              { category: 'avefi:TGNResource', id: '7005332' },
              { category: 'avefi:GNDResource', id: '14675-4' },
            ],
          },
        ],
        ul: true,
        sameAs: true,
      },
      global: {
        stubs: {
          MicroLabelComp: {
            props: ['labelText'],
            template: '<div class="label">{{ labelText }}</div>',
          },
          DetailSameAsComp: {
            props: ['sameAsData'],
            template: '<div data-testid="same-as">{{ sameAsData.map((item) => item.category).join(",") }}</div>',
          },
          GlobalClipboardComp: { template: '<span />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.findAll('li')).toHaveLength(1);
    expect(wrapper.text().match(/Bahamas/g)).toHaveLength(1);
    expect(wrapper.findAll('[data-testid="same-as"]')).toHaveLength(1);
  });
});
