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
  test('renders same_as link data instead of duplicate clipboard mode when enabled', () => {
    const wrapper = mount(KeyValueComp, {
      props: {
        keytxt: 'avefi:FilmportalResource',
        valtxt: 'film/test-id',
        sameAs: true,
        showSameAsLink: true,
      },
      global: {
        stubs: {
          MicroLabelComp: {
            props: ['labelText'],
            template: '<span data-testid="label">{{ labelText }}</span>',
          },
          GlobalClipboardComp: { template: '<div data-testid="clipboard" />' },
          DetailSameAsComp: {
            props: ['sameAsData'],
            template: '<div data-testid="same-as">{{ sameAsData[0].category }}={{ sameAsData[0].id }}</div>',
          },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.find('[data-testid="clipboard"]').exists()).toBe(false);
    expect(wrapper.get('[data-testid="same-as"]').text()).toBe('avefi:FilmportalResource=film/test-id');
  });

  test('aligns text mode and same_as action at the top of the same row', () => {
    const wrapper = mount(KeyValueComp, {
      props: {
        keytxt: 'avefi:FilmportalResource',
        valtxt: 'film/test-id',
        sameAs: true,
        showSameAsLink: true,
      },
      global: {
        stubs: {
          MicroLabelComp: { template: '<span />' },
          GlobalClipboardComp: { template: '<div />' },
          DetailSameAsComp: { template: '<div data-testid="same-as" />' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    const sameAs = wrapper.get('[data-testid="same-as"]');
    const row = sameAs.element.parentElement;
    const rowClasses = String(row?.className || '').split(/\s+/);

    expect(rowClasses).toContain('items-start');
    expect(rowClasses).not.toContain('h-8');
    expect(sameAs.classes()).toContain('shrink-0');
    expect(sameAs.classes()).not.toContain('-translate-y-0.5');
  });
});
