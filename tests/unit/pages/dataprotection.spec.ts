// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import DataProtectionPage from '~/pages/dataprotection.vue';

vi.stubGlobal('definePageMeta', vi.fn());

describe('data protection page', () => {
  const wrapper = mount(DataProtectionPage, {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        GlobalBreadcrumbsComp: true,
        GlobalPageTitleComp: { template: '<h1><slot /></h1>' },
        Icon: true,
      },
    },
  });

  test('links to the hosted data protection statement in a new tab instead of embedding it', () => {
    expect(wrapper.find('iframe').exists()).toBe(false);

    const link = wrapper.get('a[href="https://datenschutz.gwdg.de/services/av-efi"]');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener noreferrer');
    expect(link.text()).toBe('vocab.openInNewTab');
  });
});
