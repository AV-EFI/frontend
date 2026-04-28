/**
 * Shared suspicious-name pattern definitions.
 *
 * SINGLE SOURCE OF TRUTH used by both:
 *   - utils/agentQuality.ts          (frontend: isSuspiciousName flag shown to users)
 *   - tests/data-quality/whitespace-quality.report.spec.ts  (ES DQ report)
 *
 * Adding a new pattern here automatically extends both frontend detection
 * and the Elasticsearch data-quality analysis.
 *
 * Confirmed garbage counts in the testbed (21.11155-denormalised-work-testbed):
 *   whitespace-comma-only : 218 docs   (has_agent.has_name = ", ")
 *   mojibake              : 91 distinct names  (e.g. "LÃ¼ders, Klaus")
 *   digits-only           :  0 docs currently (defensive rule)
 */

export interface SuspiciousPattern {
    /** Short stable identifier used in labels and test names. */
    id: string;
    /** Human-readable description shown in DQ reports and tooltips. */
    description: string;
    /**
     * JavaScript predicate — receives the trimmed `has_name` string.
     * Used by isSuspiciousName() in the frontend.
     */
    test: (trimmedName: string) => boolean;
    /**
     * Returns an Elasticsearch query fragment that matches documents where
     * the given `.keyword` field value exhibits this pattern.
     * ES regexp queries are fully anchored (match the whole term), so
     * "contains" patterns need leading/trailing `.*`.
     */
    esQuery: (field: string) => object;
}

export const SUSPICIOUS_NAME_PATTERNS: SuspiciousPattern[] = [
    {
        id: 'whitespace-comma-only',
        description: 'Empty, whitespace-only, or comma-only value (e.g. ", ", " ")',
        test: (name) => name.length === 0 || /^[,\s]*$/.test(name),
        // ES regexp is fully anchored: '[,\s]+' matches values composed entirely of
        // commas/whitespace. The WS_PATTERN used in the legacy spec is equivalent.
        esQuery: (field) => ({ regexp: { [field]: { value: '[ ,\t\n\r]+' } } }),
    },
    {
        id: 'mojibake',
        description: 'UTF-8 decoded as Latin-1: U+00C3 ("Ã") followed by a continuation byte '
            + '(e.g. "LÃ¼ders" instead of "Lüders", "Institut fÃ¼r …" instead of "Institut für …")',
        // JS: U+00C3 followed by any byte in the continuation range U+0080–U+00BF
        test: (name) => /\u00C3[\u0080-\u00BF]/.test(name),
        // ES wildcard: '*Ã*' catches any value containing the literal 'Ã' character (U+00C3).
        // False-positive risk is minimal — Ã-tilde (Portuguese) is extremely rare in a
        // German/French film archive corpus, and all confirmed occurrences are mojibake.
        esQuery: (field) => ({ wildcard: { [field]: { value: '*\u00C3*' } } }),
    },
    {
        id: 'digits-only',
        description: 'Digits-only value — no real person or organisation name is purely numeric',
        test: (name) => /^\d+$/.test(name),
        // ES regexp '[0-9]+' is fully anchored → matches values that are only digits.
        esQuery: (field) => ({ regexp: { [field]: { value: '[0-9]+' } } }),
    },
];
