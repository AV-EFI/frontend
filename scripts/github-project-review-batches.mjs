// @ts-check
import fs from 'node:fs';
import path from 'node:path';

const CROSS_CHECK_PATH = path.resolve('docs/repo-analysis/github-issues-inventory/project-1-code-cross-check.json');
const OUT_DIR = path.resolve('docs/repo-analysis/github-issues-inventory');

const BATCH_LIMIT = 10;

const WEAK_EVIDENCE_PATTERNS = [
  /^\.?[\\/]+i18n[\\/]/,
  /^\.?[\\/]+scripts[\\/]/,
  /^\.?[\\/]+docs[\\/]/,
  /^\.?[\\/]+models[\\/]interfaces[\\/]schema[\\/]/,
  /^\.?[\\/]+server[\\/]assets[\\/]/,
  /^\.?[\\/]+README\.md$/i,
  /^\.?[\\/]+RELEASE_NOTES\.md$/i,
  /^\.?[\\/]+package\.json$/i,
];

function issueRef(row) {
  return row.issue || (row.repository && row.issueNumber ? `${row.repository}#${row.issueNumber}` : row.projectItemId);
}

function normalizePath(filePath) {
  return String(filePath || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function isWeakEvidenceFile(filePath) {
  const normalized = `./${normalizePath(filePath)}`;
  return WEAK_EVIDENCE_PATTERNS.some((pattern) => pattern.test(normalized));
}

function evidenceKind(filePath) {
  const normalized = normalizePath(filePath);
  if (normalized.startsWith('tests/') || /\.spec\.[cm]?[jt]s$/.test(normalized) || /\.test\.[cm]?[jt]s$/.test(normalized)) return 'test';
  if (normalized.startsWith('pages/')) return 'route';
  if (normalized.startsWith('components/')) return 'component';
  if (normalized.startsWith('composables/')) return 'composable';
  if (normalized.startsWith('stores/')) return 'store';
  if (normalized.startsWith('server/api/')) return 'server_api';
  if (normalized.endsWith('.vue') || normalized.endsWith('.ts') || normalized.endsWith('.js')) return 'code';
  return 'supporting';
}

function evidenceProfile(row) {
  const files = [...new Set(row.matchedFiles || [])];
  const strongFiles = files.filter((file) => !isWeakEvidenceFile(file));
  const kinds = [...new Set(strongFiles.map(evidenceKind))];
  const hasRuntimeCode = kinds.some((kind) => ['route', 'component', 'composable', 'store', 'server_api', 'code'].includes(kind));
  const hasTests = kinds.includes('test');
  const qualityScore = strongFiles.length + (hasRuntimeCode ? 3 : 0) + (hasTests ? 2 : 0);

  return {
    strongFiles,
    weakFiles: files.filter((file) => isWeakEvidenceFile(file)),
    kinds,
    hasRuntimeCode,
    hasTests,
    qualityScore,
  };
}

function proposedReviewAction(row, batchKey, profile) {
  if (batchKey === 'verification_candidates') {
    return profile.hasTests
      ? 'Review acceptance criteria against evidence; if product owner agrees, prepare a small close/comment batch.'
      : 'Review evidence and add or confirm regression coverage before any close decision.';
  }
  if (batchKey === 'frontend_triage') {
    return row.implementationState === 'not_found'
      ? 'Manually verify whether the issue is obsolete, external, or still missing in the frontend.'
      : 'Define remaining acceptance criteria and split backend/domain dependencies from frontend work.';
  }
  return 'Assign owner area and ask for decision or acceptance criteria before implementation cleanup.';
}

function makeBatchRow(row, batchKey) {
  const profile = evidenceProfile(row);
  return {
    issue: issueRef(row),
    title: row.title,
    repository: row.repository,
    issueNumber: row.issueNumber,
    issueUrl: row.issueUrl,
    state: row.state,
    projectStatus: row.projectStatus,
    auditBucket: row.auditBucket,
    ownerArea: row.suggestedOwnerArea,
    implementationState: row.implementationState,
    matchCount: row.matchCount || 0,
    evidenceQualityScore: profile.qualityScore,
    strongEvidenceFiles: profile.strongFiles,
    weakEvidenceFiles: profile.weakFiles,
    evidenceKinds: profile.kinds,
    proposedReviewAction: proposedReviewAction(row, batchKey, profile),
  };
}

function sortByEvidenceThenIssue(a, b) {
  return b.evidenceQualityScore - a.evidenceQualityScore
    || b.matchCount - a.matchCount
    || String(a.issue).localeCompare(String(b.issue));
}

function buildBatches(rows) {
  const openRows = rows.filter((row) => row.state !== 'CLOSED');

  const verificationCandidates = openRows
    .filter((row) => row.reviewScope)
    .filter((row) => ['implemented', 'implemented_but_untested'].includes(row.implementationState))
    .map((row) => makeBatchRow(row, 'verification_candidates'))
    .filter((row) => row.evidenceQualityScore >= 2)
    .sort(sortByEvidenceThenIssue)
    .slice(0, BATCH_LIMIT);

  const frontendTriage = openRows
    .filter((row) => row.reviewScope)
    .filter((row) => ['not_found', 'partial'].includes(row.implementationState))
    .map((row) => makeBatchRow(row, 'frontend_triage'))
    .sort(sortByEvidenceThenIssue)
    .slice(0, BATCH_LIMIT);

  const ownerRouting = openRows
    .filter((row) => !row.reviewScope && row.implementationState === 'blocked_external')
    .filter((row) => !row.assignees?.length || !row.projectStatus || !row.labels?.length || !row.milestone)
    .map((row) => makeBatchRow(row, 'owner_routing'))
    .sort((a, b) => String(a.ownerArea).localeCompare(String(b.ownerArea)) || String(a.issue).localeCompare(String(b.issue)))
    .slice(0, BATCH_LIMIT);

  return {
    verification_candidates: verificationCandidates,
    frontend_triage: frontendTriage,
    owner_routing: ownerRouting,
  };
}

function csvEscape(value) {
  if (Array.isArray(value)) value = value.join('; ');
  if (value === null || value === undefined) value = '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function flattenBatches(batches) {
  return Object.entries(batches).flatMap(([batchKey, rows]) => rows.map((row) => ({ batchKey, ...row })));
}

function toCsv(rows) {
  const headers = [
    'batchKey',
    'issue',
    'title',
    'state',
    'projectStatus',
    'auditBucket',
    'ownerArea',
    'implementationState',
    'matchCount',
    'evidenceQualityScore',
    'evidenceKinds',
    'strongEvidenceFiles',
    'weakEvidenceFiles',
    'proposedReviewAction',
    'issueUrl',
  ];

  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n') + '\n';
}

function markdownTable(entries, headers) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...entries.map((entry) => `| ${entry.map((value) => String(value).replace(/\|/g, '\\|')).join(' | ')} |`),
  ].join('\n');
}

function batchTitle(batchKey) {
  return batchKey
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function renderBatchTable(rows) {
  if (!rows.length) return 'No issues selected for this batch.';
  return markdownTable(
    rows.map((row) => [
      row.issue,
      row.auditBucket,
      row.implementationState,
      row.ownerArea,
      row.evidenceQualityScore,
      row.strongEvidenceFiles.slice(0, 4).join('<br>') || '(weak evidence only)',
      row.proposedReviewAction,
    ]),
    ['Issue', 'Bucket', 'State', 'Owner area', 'Evidence score', 'Strong evidence files', 'Proposed review action'],
  );
}

function buildSummary(project, batches, allRows) {
  const flatRows = flattenBatches(batches);
  const batchCounts = Object.entries(batches).map(([key, rows]) => [batchTitle(key), rows.length]);

  return `# Project 1 Review Batches

Generated: ${new Date().toISOString()}

Project: [${project.title}](${project.url})

## Snapshot

- Source items: ${allRows.length}
- Proposed review items: ${flatRows.length}
- Batch size limit: ${BATCH_LIMIT}
- GitHub changes made: none

## Batch Counts

${markdownTable(batchCounts, ['Batch', 'Count'])}

## Verification Candidates

These are open issues with local evidence that may support a keep/close decision after manual acceptance review. Weak files such as scripts, docs, generated schema files, and generic i18n strings are separated from stronger runtime/test evidence.

${renderBatchTable(batches.verification_candidates)}

## Frontend Triage

These are open frontend-scope issues where the local evidence suggests either missing work or partial implementation.

${renderBatchTable(batches.frontend_triage)}

## Owner Routing

These are open issues outside the frontend evidence scope that are missing routing metadata or need a product/domain/backend decision before implementation cleanup.

${renderBatchTable(batches.owner_routing)}

## Notes

- This is a review proposal only. No GitHub issues, labels, assignees, milestones, or project fields were changed.
- Evidence quality is a ranking aid, not proof of completion.
- Suggested next step: review one batch at a time, then prepare an explicit GitHub update batch with comments/status/labels.
`;
}

function main() {
  const source = JSON.parse(fs.readFileSync(CROSS_CHECK_PATH, 'utf8'));
  const batches = buildBatches(source.items);
  const flatRows = flattenBatches(batches);

  const jsonPath = path.join(OUT_DIR, 'project-1-review-batches.json');
  const csvPath = path.join(OUT_DIR, 'project-1-review-batches.csv');
  const summaryPath = path.join(OUT_DIR, 'project-1-review-batches.md');

  fs.writeFileSync(jsonPath, `${JSON.stringify({ project: source.project, batches }, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(flatRows));
  fs.writeFileSync(summaryPath, buildSummary(source.project, batches, source.items));

  console.log(`Wrote ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), csvPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), summaryPath)}`);
  console.log(`Prepared ${flatRows.length} proposed review items.`);
}

main();
