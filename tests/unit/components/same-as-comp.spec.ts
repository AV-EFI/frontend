// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import SameAsComp from '~/components/detail/SameAsComp.vue';

vi.stubGlobal('useNormdataUrl', () => ({
  getNormdataUrl: (category: string, id: string) => `https://example.test/${category}/${id}`,
}));
vi.stubGlobal('useI18n', () => ({
  t: (key: string) => ({
    'avefi:FilmportalResource': 'Filmportal',
    'avefi:GNDResource': 'GND',
    'avefi:DOIResource': 'DOI',
  }[key] ?? key),
  te: (key: string) => ['avefi:FilmportalResource', 'avefi:GNDResource', 'avefi:DOIResource'].includes(key),
}));

vi.mock('~/utils/clipboard', () => ({
  useClipboardUtil: () => ({
    copyExtended: vi.fn(),
  }),
}));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('SameAsComp positioning contract', () => {
  test('keeps transforms off the wrapper that contains the fixed-position menu', () => {
    const wrapper = mount(SameAsComp, {
      attachTo: document.body,
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
    expect(document.body.querySelector('[role="menu"]')?.classList.contains('fixed')).toBe(true);
  });

  test('deduplicates duplicate references and renders generic link labels', () => {
    const wrapper = mount(SameAsComp, {
      attachTo: document.body,
      props: {
        sameAsData: [
          { category: 'avefi:TGNResource', id: '7005332' },
          { category: 'avefi:TGNResource', id: '7005332' },
          { category: 'avefi:GNDResource', id: '14675-4' },
        ],
      },
      global: {
        stubs: {
          Icon: { template: '<span />' },
        },
        mocks: {
          $t: (key: string) => (key === 'avefi:GNDResource' ? 'GND' : key),
        },
      },
    });

    const links = Array.from(document.body.querySelectorAll('a[role="menuitem"]'));
    const tgnLinks = links.filter((link) => link.getAttribute('href') === 'https://example.test/avefi:TGNResource/7005332');

    expect(tgnLinks).toHaveLength(1);
    expect(tgnLinks[0]?.textContent?.trim()).toBe('avefi:TGNResource');
    expect(links.map((link) => link.textContent?.trim()).filter((text) => text === 'avefi:TGNResource')).toHaveLength(1);
    wrapper.unmount();
  });

  test('translates Filmportal resource labels through i18n', () => {
    const wrapper = mount(SameAsComp, {
      attachTo: document.body,
      props: {
        sameAsData: [{ category: 'avefi:FilmportalResource', id: 'film/test-id' }],
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

    const link = document.body.querySelector('a[role="menuitem"]');
    expect(link?.textContent?.trim()).toBe('Filmportal');
    wrapper.unmount();
  });

  test('renders DOI references with the translated DOI label and resolved URL', () => {
    const wrapper = mount(SameAsComp, {
      attachTo: document.body,
      props: {
        sameAsData: [{ category: 'avefi:DOIResource', id: '10.1234/item-doi-1' }],
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

    const link = document.body.querySelector('a[role="menuitem"]');
    expect(link?.textContent?.trim()).toBe('DOI');
    expect(link?.getAttribute('href')).toBe('https://example.test/avefi:DOIResource/10.1234/item-doi-1');
    wrapper.unmount();
  });
});
