/**
 * Shared suspicious-name pattern definitions.
 *
 * These rules mirror the Elasticsearch data-quality report and intentionally
 * stay conservative: they mark values that are very likely import artifacts,
 * not merely low-quality metadata.
 */

export interface SuspiciousPattern {
  id: string;
  description: string;
  test: (trimmedName: string) => boolean;
  esQuery: (field: string) => object;
}

export const SUSPICIOUS_NAME_PATTERNS: SuspiciousPattern[] = [
  {
    id: 'whitespace-comma-only',
    description: 'Empty, whitespace-only, or comma-only value',
    test: (name) => name.length === 0 || /^[,\s]*$/.test(name),
    esQuery: (field) => ({ regexp: { [field]: { value: '[ ,\t\n\r]+' } } }),
  },
  {
    id: 'mojibake',
    description: 'UTF-8 decoded as Latin-1, for example "LÃ¼ders" instead of "Lüders"',
    test: (name) => /\u00C3[\u0080-\u00BF]/.test(name),
    esQuery: (field) => ({ wildcard: { [field]: { value: '*\u00C3*' } } }),
  },
  {
    id: 'digits-only',
    description: 'Digits-only value in an agent name field',
    test: (name) => /^\d+$/.test(name),
    esQuery: (field) => ({ regexp: { [field]: { value: '[0-9]+' } } }),
  },
];
