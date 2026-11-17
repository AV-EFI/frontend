// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import DataProtectionPage from '~/pages/dataprotection.vue';

const useSeoMeta = vi.fn();
vi.stubGlobal('definePageMeta', vi.fn());
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useSeoMeta', useSeoMeta);

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

  test('uses the page heading as document title', () => {
    const [{ title }] = useSeoMeta.mock.calls[0] as [{ title: () => string }];
    expect(title()).toBe('dataprotection');
  });
});
