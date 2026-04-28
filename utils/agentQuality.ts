/**
 * Heuristics for detecting garbage / data-error values in agent name fields.
 *
 * Used by HasEventComp.vue to show a visual warning badge next to names that
 * are definitely wrong rather than hiding them, so data curators can see and
 * fix the upstream source.
 *
 * Patterns are defined in agentQualityPatterns.ts (shared with the ES DQ spec).
 */

import { SUSPICIOUS_NAME_PATTERNS } from './agentQualityPatterns';

/**
 * Returns true when the `has_name` property of an agent object is definitely
 * a data error. See agentQualityPatterns.ts for the full list of rules.
 */
export function isSuspiciousName(a: unknown): boolean {
    const name = (a as Record<string, unknown>)?.has_name;
    if (typeof name !== 'string') return false;
    const trimmed = name.trim();
    return SUSPICIOUS_NAME_PATTERNS.some((p) => p.test(trimmed));
}
