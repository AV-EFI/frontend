import { describe, expect, test } from 'vitest';
import { isSuspiciousName } from '~/utils/agentQuality';
import { SUSPICIOUS_NAME_PATTERNS } from '~/utils/agentQualityPatterns';

// ---------------------------------------------------------------------------
// isSuspiciousName — unit tests
// Drives coverage for all patterns defined in agentQualityPatterns.ts.
// When a new pattern is added there, add matching cases here.
// ---------------------------------------------------------------------------

describe('isSuspiciousName', () => {

    // -----------------------------------------------------------------------
    // Pattern: whitespace-comma-only
    // -----------------------------------------------------------------------
    describe('whitespace-comma-only', () => {
        test.each([
            [', ',   'comma-space (confirmed in testbed: 218 docs)'],
            [',',    'bare comma'],
            [' ',    'single space'],
            ['\t',   'tab'],
            ['\n',   'newline'],
            ['',     'empty string'],
            ['  , ', 'mixed whitespace and comma'],
        ])('flags %j (%s)', (name) => {
            expect(isSuspiciousName({ has_name: name })).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // Pattern: mojibake (UTF-8 decoded as Latin-1)
    // -----------------------------------------------------------------------
    describe('mojibake', () => {
        test.each([
            ['LÃ¼ders, Klaus',                          'ü  → Ã¼  (confirmed in testbed)'],
            ['Eibl-Eibesfeldt, IrenÃ¤us',               'ä  → Ã¤  (confirmed in testbed)'],
            ['Institut fÃ¼r den Wissenschaftlichen Film','ü  → Ã¼  (confirmed in testbed, 180 docs)'],
            ['DrÃ¶scher, Roland',                       'ö  → Ã¶  (confirmed in testbed)'],
            ['Kleindienst-AndrÃ©e, Dore',               'é  → Ã©  (confirmed in testbed)'],
        ])('flags %j (%s)', (name) => {
            expect(isSuspiciousName({ has_name: name })).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // Pattern: digits-only
    // -----------------------------------------------------------------------
    describe('digits-only', () => {
        test.each([
            ['12345',  'arbitrary number'],
            ['0',      'single zero'],
            ['1984',   'year-like number'],
        ])('flags %j (%s)', (name) => {
            expect(isSuspiciousName({ has_name: name })).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // Non-suspicious — must NOT be flagged
    // -----------------------------------------------------------------------
    describe('legitimate values (must not be flagged)', () => {
        test.each([
            ['Schlenker, Hermann',          'name with comma — 290 docs in testbed'],
            ['IWF',                         'institution abbreviation — 2592 docs in testbed'],
            ['RWU',                         'institution abbreviation'],
            ['Lüders, Klaus',               'correct German umlaut ü'],
            ['Eibl-Eibesfeldt, Irenäus',    'correct German umlaut ä'],
            ['Institut für Wissenschaft',   'correct German ü'],
            ['Fassbinder, Rainer Werner',   'normal name'],
            ['Otte, C.',                    'name with initial'],
            ['Rosa von Praunheim',          'name with von'],
            ['1984 - Der Film',             'title-like string with digits and letters'],
            ['42nd Street',                 'digits mixed with letters'],
        ])('does not flag %j (%s)', (name) => {
            expect(isSuspiciousName({ has_name: name })).toBe(false);
        });

        test('returns false when has_name is missing', () => {
            expect(isSuspiciousName({ same_as: ['http://example.com'] })).toBe(false);
        });

        test('returns false when has_name is not a string (number)', () => {
            expect(isSuspiciousName({ has_name: 42 })).toBe(false);
        });

        test('returns false for null input', () => {
            expect(isSuspiciousName(null)).toBe(false);
        });

        test('returns false for undefined input', () => {
            expect(isSuspiciousName(undefined)).toBe(false);
        });
    });

    // -----------------------------------------------------------------------
    // Structural: all patterns in agentQualityPatterns.ts are represented above
    // -----------------------------------------------------------------------
    test('every pattern id in SUSPICIOUS_NAME_PATTERNS has test coverage', () => {
        const coveredIds = ['whitespace-comma-only', 'mojibake', 'digits-only'];
        for (const pattern of SUSPICIOUS_NAME_PATTERNS) {
            expect(coveredIds, `Pattern "${pattern.id}" has no unit-test coverage — add cases above`)
                .toContain(pattern.id);
        }
    });
});
