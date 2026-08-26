import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();
const ciSource = readFileSync(resolve(root, '.gitlab-ci.yml'), 'utf8');
const packageSource = readFileSync(resolve(root, 'package.json'), 'utf8');
const mrTemplateSource = readFileSync(resolve(root, '.gitlab/merge_request_templates/Default.md'), 'utf8');

function jobBlock(jobName: string) {
  const match = new RegExp(`^${jobName}:\\n(?<body>(?:^[ \\t].*\\n|^\\s*$\\n)*)`, 'm').exec(ciSource);
  return match?.groups?.body || '';
}

describe('quality gate source contracts', () => {
  test('keeps accessibility smoke available as a package script and CI gate', () => {
    expect(packageSource).toContain('"audit:accessibility": "playwright test tests/e2e/accessibility/public-routes-a11y.spec.ts"');

    const block = jobBlock('test_accessibility_smoke');
    expect(block).toContain('npx playwright install --with-deps chromium');
    expect(block).toContain('yarn audit:accessibility --workers=1 --reporter=list,junit');
    expect(block).toContain('e2e-accessibility-junit.xml');
    expect(block).toContain('test-results/');
    expect(block).toContain('playwright-report/');
  });

  test('keeps typecheck as a required CI job', () => {
    const block = jobBlock('test_typecheck');
    expect(block).toContain('yarn typecheck');
    expect(block).not.toContain('allow_failure');
  });

  test('keeps merge requests tied to quality lanes and contract mapping', () => {
    expect(mrTemplateSource).toContain('## Quality Lane');
    expect(mrTemplateSource).toContain('docs/repo-analysis/release-quality-checklist.md');
    expect(mrTemplateSource).toContain('docs/repo-analysis/test-contract-mapping.md');
    expect(mrTemplateSource).toContain('Warnings, skipped checks, backend/VPN blockers, and residual risk');
  });
});
