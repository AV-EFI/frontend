// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import ManifestationHeaderComp from '~/components/detail/ManifestationHeaderComp.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}));

const HANDLE = '21.11155/AF1BEFE7-6E44-41DF-8727-5EAF19503FF9';

function mountHeader() {
  return mount(ManifestationHeaderComp, {
    props: {
      manifestation: {
        handle: HANDLE,
        has_record: {
          category: 'avefi:Manifestation',
          has_primary_title: { has_name: 'Metropolis' },
          described_by: { has_issuer_name: 'Deutsche Kinemathek' },
        },
        items: [],
      },
      headingId: 'manifestation-heading-0',
    },
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        Icon: true,
        SearchGenericIconList: true,
        MicroBadgeCategoryComp: { props: ['category'], template: '<span data-testid="badge">{{ category }}</span>' },
        MicroEfiCopyComp: true,
      },
    },
  });
}

describe('ManifestationHeaderComp collapsed row', () => {
  test('shows the efi once, next to the category badge', () => {
    const visibleText = mountHeader().find('div.flex-col').text();

    expect(visibleText.split(HANDLE)).toHaveLength(2);
  });

  test('keeps the category badge, the title and the issuer', () => {
    const wrapper = mountHeader();

    expect(wrapper.get('[data-testid="badge"]').text()).toBe('avefi:Manifestation');
    expect(wrapper.text()).toContain('Metropolis');
    expect(wrapper.text()).toContain('Deutsche Kinemathek');
  });
});
