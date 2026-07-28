import { describe, expect, test } from 'vitest';
import { resolveMaintenanceBanner } from '~/composables/useMaintenanceBanner';

const NOW = new Date('2026-07-27T10:00:00.000Z');

describe('maintenance banner activation rules', () => {
  test('shows planned maintenance before the configured maintenance window', () => {
    const resolved = resolveMaintenanceBanner({
      now: NOW,
      locale: 'de',
      config: {
        enabled: true,
        state: 'planned',
        startsAt: '2026-07-28T08:00:00.000Z',
        endsAt: '2026-07-28T10:00:00.000Z',
      },
    });

    expect(resolved.visible).toBe(true);
    expect(resolved.state).toBe('planned');
    expect(resolved.startsAt?.toISOString()).toBe('2026-07-28T08:00:00.000Z');
    expect(resolved.endsAt?.toISOString()).toBe('2026-07-28T10:00:00.000Z');
  });

  test('does not show active maintenance before its configured start', () => {
    const resolved = resolveMaintenanceBanner({
      now: NOW,
      config: {
        enabled: true,
        state: 'active',
        startsAt: '2026-07-28T08:00:00.000Z',
      },
    });

    expect(resolved.visible).toBe(false);
    expect(resolved.state).toBe('active');
  });

  test('hides the banner after the configured end', () => {
    const resolved = resolveMaintenanceBanner({
      now: NOW,
      config: {
        enabled: true,
        state: 'planned',
        endsAt: '2026-07-27T09:59:00.000Z',
      },
    });

    expect(resolved.visible).toBe(false);
  });

  test('hides the banner when disabled or when the state is unsupported', () => {
    expect(resolveMaintenanceBanner({
      now: NOW,
      config: { enabled: false, state: 'planned' },
    }).visible).toBe(false);

    expect(resolveMaintenanceBanner({
      now: NOW,
      config: { enabled: true, state: 'unknown' },
    }).visible).toBe(false);
  });

  test('uses localized operational override messages with fallback to the other language', () => {
    expect(resolveMaintenanceBanner({
      now: NOW,
      locale: 'en',
      config: {
        enabled: 'true',
        state: 'planned',
        messageDe: 'Wartungstext',
        messageEn: 'Maintenance text',
      },
    }).message).toBe('Maintenance text');

    expect(resolveMaintenanceBanner({
      now: NOW,
      locale: 'en',
      config: {
        enabled: 'true',
        state: 'planned',
        messageDe: 'Wartungstext',
      },
    }).message).toBe('Wartungstext');
  });

  test('allows gated query-param preview without enabling real maintenance mode', () => {
    const resolved = resolveMaintenanceBanner({
      now: NOW,
      previewState: 'active',
      config: {
        enabled: false,
        previewEnabled: true,
        state: 'planned',
        startsAt: '2026-07-28T08:00:00.000Z',
        endsAt: '2026-07-27T09:59:00.000Z',
      },
    });

    expect(resolved.visible).toBe(true);
    expect(resolved.state).toBe('active');
    expect(resolved.preview).toBe(true);
    expect(resolved.startsAt).toBeNull();
    expect(resolved.endsAt).toBeNull();
  });

  test('ignores query-param preview when preview mode is disabled', () => {
    const resolved = resolveMaintenanceBanner({
      now: NOW,
      previewState: 'active',
      config: {
        enabled: false,
        previewEnabled: false,
        state: 'planned',
      },
    });

    expect(resolved.visible).toBe(false);
    expect(resolved.preview).toBe(false);
  });
});
