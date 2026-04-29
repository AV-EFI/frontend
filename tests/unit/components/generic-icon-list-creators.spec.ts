// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import GenericIconList from '~/components/search/GenericIconList.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.stubGlobal('useLocalizedPlaceLabel', () => ({
  getLocalizedPlaceLabel: vi.fn(),
}));

function mountList(data: Record<string, unknown>) {
  return mount(GenericIconList, {
    props: {
      data,
      level: 'work',
      iconColor: 'text-primary',
    },
    global: {
      stubs: {
        Icon: { props: ['name'], template: '<span data-testid="icon">{{ name }}</span>' },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('GenericIconList creators migration', () => {
  test('renders creators before legacy directors_or_editors', () => {
    const wrapper = mountList({
      creators: ['Creator Name'],
      ['directors_or_editors']: ['Legacy Name'],
    });

    expect(wrapper.text()).toContain('Creator Name');
    expect(wrapper.text()).not.toContain('Legacy Name');
  });

  test('falls back to directors_or_editors when creators is absent', () => {
    const wrapper = mountList({
      ['directors_or_editors']: ['Legacy Name'],
    });

    expect(wrapper.text()).toContain('Legacy Name');
  });

  test('uses the shared status icon for item access status', () => {
    const wrapper = mount(GenericIconList, {
      props: {
        data: {
          ['has_record']: {
            ['has_access_status']: 'Public',
          },
        },
        level: 'item',
        iconColor: 'text-primary',
      },
      global: {
        stubs: {
          Icon: { props: ['name'], template: '<span data-testid="icon">{{ name }}</span>' },
        },
        mocks: {
          $t: (key: string) => key,
        },
      },
    });

    expect(wrapper.find('[data-testid="icon"]').text()).toBe('tabler-lock-open');
  });
});
