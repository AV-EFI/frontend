// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import ManifestationListComp from '~/components/detail/ManifestationListComp.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, te: () => false }));

const HANDLE = '21.11155/AF1BEFE7-6E44-41DF-8727-5EAF19503FF9';

describe('ManifestationListComp efi row', () => {
  const wrapper = mount(ManifestationListComp, {
    props: { modelValue: [{ handle: HANDLE, has_record: { category: 'avefi:Manifestation' }, items: [] }] },
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        DetailManifestationHeaderComp: true,
        DetailKeyValueComp: { props: ['keytxt', 'valtxt'], template: '<div data-testid="key-value">{{ keytxt }} {{ valtxt }}</div>' },
        DetailItemListNewComp: true,
        DetailSameAsComp: true,
        MicroLabelComp: true,
        GlobalTooltipInfo: true,
        Icon: true,
      },
    },
  });

  test('keeps the efi for screen readers', () => {
    expect(wrapper.get('[data-testid="key-value"]').text()).toBe(`efi ${HANDLE}`);
  });

  test('hides the efi row visually until keyboard focus reaches it', () => {
    const row = wrapper.get('[data-testid="key-value"]').element.parentElement;

    expect(row?.classList.contains('sr-only')).toBe(true);
    expect(row?.classList.contains('focus-within:not-sr-only')).toBe(true);
    expect(row?.hasAttribute('aria-hidden')).toBe(false);
  });
});
