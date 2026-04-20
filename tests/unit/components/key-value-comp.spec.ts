// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import KeyValueComp from '~/components/detail/KeyValueComp.vue';
import de from '~/i18n/locales/de';
import en from '~/i18n/locales/en';

function getByPath(messages: Record<string, unknown>, key: string): string {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);

  return typeof value === 'string' ? value : key;
}

describe('KeyValueComp translation and label rendering', () => {
  test.each([
    { locale: 'de', messages: de as Record<string, unknown> },
    { locale: 'en', messages: en as Record<string, unknown> },
  ])('renders translated label/value for locale $locale when clip=false', ({ messages }) => {
    const t = (key: string) => getByPath(messages, key);
    const wrapper = mount(KeyValueComp, {
      props: {
        keytxt: 'has_access_status',
        valtxt: 'Removed',
        clip: false,
      },
      global: {
        stubs: {
          MicroLabelComp: {
            props: ['labelText'],
            template: '<span data-testid="label">{{ $t(labelText) }}</span>',
          },
          GlobalClipboardComp: { template: '<div />' },
          DetailSameAsComp: { template: '<div />' },
        },
        mocks: {
          $t: t,
        },
      },
    });

    expect(wrapper.get('[data-testid="label"]').text()).toContain(t('has_access_status'));
    expect(wrapper.text()).toContain(t('Removed'));
  });
});
