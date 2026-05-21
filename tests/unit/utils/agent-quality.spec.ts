import { describe, expect, test } from 'vitest';
import {
  getSuspiciousAgentNamePattern,
  isSuspiciousAgentNameText,
  isWhitespaceCommaOnlyText,
} from '~/utils/agentQuality';

describe('agent quality warning heuristics', () => {
  test.each([',', ', ', '   '])('flags whitespace/comma-only text: %j', (value) => {
    expect(isWhitespaceCommaOnlyText(value)).toBe(true);
    expect(getSuspiciousAgentNamePattern(value)?.id).toBe('whitespace-comma-only');
  });

  test('flags digits-only agent names', () => {
    expect(isSuspiciousAgentNameText('12345')).toBe(true);
    expect(getSuspiciousAgentNamePattern('12345')?.id).toBe('digits-only');
  });

  test('does not flag normal names or production labels', () => {
    expect(isSuspiciousAgentNameText('Klinger, Jakob')).toBe(false);
    expect(isWhitespaceCommaOnlyText('DEFA')).toBe(false);
  });
});
