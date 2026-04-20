import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const tempRoots: string[] = [];

afterEach(() => {
  for (const root of tempRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  tempRoots.length = 0;
});

describe('stakeholder quality report generator', () => {
  it('creates all stakeholder files and required sections', async () => {
    const tempRoot = mkdtempSync(resolve(tmpdir(), 'dq-stakeholder-'));
    tempRoots.push(tempRoot);

    const reportPath = resolve(tempRoot, 'quality-statistics.md');
    const identifiersPath = resolve(tempRoot, 'quality-failing-identifiers.md');

    writeFileSync(
      reportPath,
      [
        '# Elasticsearch Data Quality Statistics',
        '',
        'Generated: 2026-04-16T00:00:00.000Z',
        '',
        '## Executive Summary',
        '- Example summary line',
        '',
        '## Legend and Interpretation',
        '- Example legend',
        '',
        '## Text quality placeholder heuristics',
        '- Root placeholders: 1',
        '',
        '## Near-duplicate title heuristics',
        '- Potential duplicate root titles: none',
        '',
        '## Language harmonization checks',
        '- Legacy language-code share: 1/10 (10.00%) [WARN]',
        '',
        '## Denormalised index comparison',
        '- Baseline index: 21.11155-denormalised-work',
        '- Candidate index: 21.11155-denormalised-work-testbed',
        '',
        '## Trend snapshot and deltas',
        '- Delta total root docs: 0.0000',
        '',
        '## Source-level anomaly heuristics',
        '- Source __MISSING_SOURCE_KEY__: docs=1, missing same_as=100.00%, suspicious titles=50.00%',
        '',
        '## Referential integrity heuristics',
        '- Missing manifestation parent links: 0/10 (0.00%) [OK]',
        '',
        '## Identifier and URL format checks',
        '- Potentially malformed same_as.id values: 0',
        '',
        '## Cross-field consistency checks',
        '- Items with access status but missing element type: 0',
        '',
        '## Mapping/schema drift checks',
        '- Mapping drift check: all required paths were found.',
        '',
        '## Root completeness overview',
        '- Missing root source key: 1/10 (10.00%) [WARN]',
        '',
        '## Manifestation completeness overview',
        '- Missing manifestation source key: 1/10 (10.00%) [WARN]',
        '',
        '## Item completeness overview',
        '- Missing item access status: 1/10 (10.00%) [WARN]',
        '',
        '## Controlled vocabulary conformance',
        '- Unknown access_status values: none',
        '',
        '## Suspicious root titles in non-test sources',
        '- Suspicious root title count: 1',
        '',
        '## Root quality by source key',
        '- Root documents by source key:',
      ].join('\n'),
      'utf8',
    );

    writeFileSync(identifiersPath, '# Elasticsearch Failing Document Identifiers\n', 'utf8');

    const modulePath = new URL('../../../scripts/generate-stakeholder-quality-reports.mjs', import.meta.url).href;
    const { generateStakeholderQualityReports } = await import(modulePath);

    const writtenFiles = generateStakeholderQualityReports({ rootDir: tempRoot }) as string[];

    expect(writtenFiles).toHaveLength(5);

    const frontendPath = resolve(tempRoot, 'stakeholders', 'frontend-ux.md');
    const backendPath = resolve(tempRoot, 'stakeholders', 'backend.md');
    const dataEngineerPath = resolve(tempRoot, 'stakeholders', 'data-engineer.md');
    const pmPath = resolve(tempRoot, 'stakeholders', 'project-manager.md');
    const institutionsPath = resolve(tempRoot, 'stakeholders', 'data-delivering-institutions.md');

    expect(existsSync(frontendPath)).toBe(true);
    expect(existsSync(backendPath)).toBe(true);
    expect(existsSync(dataEngineerPath)).toBe(true);
    expect(existsSync(pmPath)).toBe(true);
    expect(existsSync(institutionsPath)).toBe(true);

    const frontend = readFileSync(frontendPath, 'utf8');
    expect(frontend).toContain('## Audience and Reading Order');
    expect(frontend).toContain('## Text quality placeholder heuristics');
    expect(frontend).toContain('## Denormalised index comparison');

    const backend = readFileSync(backendPath, 'utf8');
    expect(backend).toContain('## Referential integrity heuristics');
    expect(backend).toContain('## Mapping/schema drift checks');

    const dataEngineer = readFileSync(dataEngineerPath, 'utf8');
    expect(dataEngineer).toContain('## Root completeness overview');
    expect(dataEngineer).toContain('## Item completeness overview');
    expect(dataEngineer).toContain('## Identifier Samples');

    const pm = readFileSync(pmPath, 'utf8');
    expect(pm).toContain('## Executive Summary');
    expect(pm).toContain('## Denormalised index comparison');

    const institutions = readFileSync(institutionsPath, 'utf8');
    expect(institutions).toContain('## Root quality by source key');
    expect(institutions).toContain('## Suspicious root titles in non-test sources');
  });
});
