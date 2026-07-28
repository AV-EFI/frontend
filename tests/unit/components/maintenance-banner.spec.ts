// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import MaintenanceBanner from '~/components/global/MaintenanceBanner.vue';

const translations: Record<string, string> = {
  'maintenanceBanner.planned.title': 'Planned maintenance',
  'maintenanceBanner.planned.message': 'Default planned message',
  'maintenanceBanner.active.title': 'Ongoing maintenance or service disruption',
  'maintenanceBanner.active.message': 'Default active message',
  'maintenanceBanner.previewLabel': 'Preview',
  'maintenanceBanner.window': 'Maintenance window: {start} to {end}',
  'maintenanceBanner.startsAt': 'Starts: {start}',
  'maintenanceBanner.endsAt': 'Expected until: {end}',
};

function t(key: string, params?: Record<string, string>) {
  let text = translations[key] ?? key;

  Object.entries(params ?? {}).forEach(([name, value]) => {
    text = text.replace(`{${name}}`, value);
  });

  return text;
}

function mountComponent(config: Record<string, unknown>, query: Record<string, string> = {}) {
  vi.stubGlobal('useRuntimeConfig', () => ({
    public: {
      maintenanceBanner: config,
    },
  }));
  vi.stubGlobal('useRoute', () => ({
    query,
  }));
  vi.stubGlobal('useI18n', () => ({
    locale: ref('en'),
    t,
  }));

  return mount(MaintenanceBanner, {
    global: {
      stubs: {
        Icon: {
          props: ['name'],
          template: '<span data-testid="icon" :data-name="name"></span>',
        },
      },
    },
  });
}

describe('MaintenanceBanner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-27T10:00:00.000Z'));
  });

  test('renders planned maintenance as a polite status with the configured message', () => {
    const wrapper = mountComponent({
      enabled: true,
      state: 'planned',
      startsAt: '2026-07-28T08:00:00.000Z',
      endsAt: '2026-07-28T10:00:00.000Z',
      messageEn: 'Search will be read-only during maintenance.',
    });

    const banner = wrapper.get('[data-testid="maintenance-banner"]');

    expect(banner.attributes('role')).toBe('status');
    expect(banner.attributes('aria-live')).toBe('polite');
    expect(wrapper.text()).toContain('Planned maintenance');
    expect(wrapper.text()).toContain('Search will be read-only during maintenance.');
    expect(wrapper.text()).toContain('Maintenance window:');
    expect(wrapper.get('[data-testid="icon"]').attributes('data-name')).toBe('tabler:calendar-event');
  });

  test('renders active maintenance as an assertive alert', () => {
    const wrapper = mountComponent({
      enabled: true,
      state: 'active',
      startsAt: '2026-07-27T09:00:00.000Z',
    });

    const banner = wrapper.get('[data-testid="maintenance-banner"]');

    expect(banner.attributes('role')).toBe('alert');
    expect(banner.attributes('aria-live')).toBe('assertive');
    expect(wrapper.text()).toContain('Ongoing maintenance or service disruption');
    expect(wrapper.get('[data-testid="icon"]').attributes('data-name')).toBe('tabler:alert-triangle');
  });

  test('does not render when disabled', () => {
    const wrapper = mountComponent({
      enabled: false,
      state: 'planned',
    });

    expect(wrapper.find('[data-testid="maintenance-banner"]').exists()).toBe(false);
  });

  test('renders a labelled preview from the query parameter when preview mode is enabled', () => {
    const wrapper = mountComponent({
      enabled: false,
      previewEnabled: true,
      state: 'planned',
    }, {
      maintenanceBannerPreview: 'active',
    });

    const banner = wrapper.get('[data-testid="maintenance-banner"]');

    expect(banner.attributes('role')).toBe('alert');
    expect(wrapper.text()).toContain('Preview');
    expect(wrapper.text()).toContain('Ongoing maintenance or service disruption');
  });
});
