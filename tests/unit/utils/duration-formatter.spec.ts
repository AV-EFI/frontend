import { describe, expect, test } from 'vitest';
import { formatDuration } from '~/utils/durationFormatter';

describe('formatDuration', () => {
  test('converts full ISO 8601 duration to HH:MM:SS', () => {
    expect(formatDuration('PT1H23M45S')).toBe('01:23:45');
  });

  test('pads single-digit segments', () => {
    expect(formatDuration('PT1H2M3S')).toBe('01:02:03');
  });

  test('handles duration without hours', () => {
    expect(formatDuration('PT45M30S')).toBe('45:30');
  });

  test('handles duration with only minutes (trailing colon segment padded)', () => {
    expect(formatDuration('PT90M')).toBe('90:00');
  });

  test('returns the raw value when parsing fails', () => {
    expect(formatDuration('not-a-duration')).toBe('not-a-duration');
  });
});
