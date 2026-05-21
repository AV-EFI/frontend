import { SUSPICIOUS_NAME_PATTERNS, type SuspiciousPattern } from './agentQualityPatterns';

function normalizeName(value: unknown): string | null {
  if (typeof value === 'string') return value.trim();
  return null;
}

export function getSuspiciousAgentNamePattern(value: unknown): SuspiciousPattern | null {
  const trimmed = normalizeName(value);
  if (trimmed === null) return null;
  return SUSPICIOUS_NAME_PATTERNS.find((pattern) => pattern.test(trimmed)) ?? null;
}

export function isSuspiciousAgentNameText(value: unknown): boolean {
  return Boolean(getSuspiciousAgentNamePattern(value));
}

export function isWhitespaceCommaOnlyText(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return SUSPICIOUS_NAME_PATTERNS[0].test(value.trim());
}

export function isSuspiciousName(agent: unknown): boolean {
  const name = (agent as Record<string, unknown> | null)?.has_name;
  return isSuspiciousAgentNameText(name);
}
