// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import SameAsComp from '~/components/detail/SameAsComp.vue';

vi.stubGlobal('useNormdataUrl', () => ({
  getNormdataUrl: (category: string, id: string) => `https://example.test/${category}/${id}`,
}));
vi.stubGlobal('useNuxtApp', () => ({
  $i18n: {
    t: (key: string) => key,
  },
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

  test('deduplicates duplicate TGN references and renders a single TGN link label', () => {
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
    expect(tgnLinks[0].textContent?.trim()).toBe('TGN');
    expect(links.map((link) => link.textContent?.trim()).filter((text) => text === 'TGN')).toHaveLength(1);
    wrapper.unmount();
  });
});
