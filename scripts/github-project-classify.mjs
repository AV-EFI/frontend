// @ts-check
import fs from 'node:fs';
import path from 'node:path';

const INVENTORY_PATH = path.resolve('docs/repo-analysis/github-issues-inventory/project-1-items.json');
const OUT_DIR = path.resolve('docs/repo-analysis/github-issues-inventory');

const DOMAIN_TERMS = [
  'normdaten',
  'gnd',
  'identifier',
  'identifikator',
  'identifikatoren',
  'pid',
  'redaktion',
  'fiaf',
  'archiv',
  'datenmodell',
  'mapping',
  'dublette',
  'dublett',
  'disambiguierung',
  'filminstitution',
  'filmhaltend',
  'werk',
  'manifestation',
  'item',
];

const BACKEND_TERMS = [
  'api',
  'backend',
  'elasticsearch',
  'index',
  'import',
  'aggregation',
  'query',
  'endpoint',
  'mets',
  'oai',
  'daten',
  'schema',
  'schnittstelle',
];

const FRONTEND_TERMS = [
  'ui',
  'layout',
  'button',
  'filter',
  'suche',
  'such',
  'detailseite',
  'carousel',
  'tab',
  'modal',
  'responsive',
  'landing',
  'seite',
  'view',
  'frontend',
  'formular',
  'redaktionssystem',
];

const QA_TERMS = [
  'test',
  'akzeptanz',
  'validierung',
  'smoke',
  'regression',
  'a11y',
  'accessibility',
  'barrierefreiheit',
  'qa',
];

const STOPWORDS = new Set([
  'einer',
  'eines',
  'eine',
  'einen',
  'einem',
  'als',
  'und',
  'oder',
  'der',
  'die',
  'das',
  'den',
  'dem',
  'zur',
  'zum',
  'mit',
  'von',
  'for',
  'the',
  'and',
  'user',
  'story',
  'issue',
  'moechte',
  'möchte',
  'kann',
  'soll',
  'sollen',
  'bug',
]);

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function normalizeText(row) {
  return [
    row.title,
    row.bodyExcerpt,
    row.labels?.join(' '),
    row.projectStatus,
    row.repository,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function inferOwnerArea(row, text) {
  if (includesAny(text, DOMAIN_TERMS)) return 'Product/domain decision';
  if (includesAny(text, BACKEND_TERMS)) return 'Backend/API/indexing';
  if (includesAny(text, QA_TERMS)) return 'Accessibility/QA';
  if (includesAny(text, FRONTEND_TERMS)) return 'Frontend/UI';
  if (row.repository === 'AV-EFI/frontend') return 'Frontend/UI';
  return 'Unassigned triage';
}

function extractSearchTerms(row) {
  const text = `${row.title || ''} ${row.labels?.join(' ') || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9äöüß_-]+/gi, ' ');
  const terms = text
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 5 && !STOPWORDS.has(term))
    .filter((term, index, arr) => arr.indexOf(term) === index);
  return terms.slice(0, 10);
}

function classify(row) {
  const text = normalizeText(row);
  const labels = new Set((row.labels || []).map((label) => label.toLowerCase()));
  const reasons = [];
  let bucket = 'actionable';
  let confidence = 'low';
  let suggestedAction = 'Keep for later codebase cross-check.';

  if (labels.has('duplicate') || labels.has('duplicate issue') || text.includes('duplicate') || text.includes('dublette')) {
    bucket = 'duplicate_candidate';
    confidence = 'medium';
    suggestedAction = 'Find and link likely canonical issue before closing or merging.';
    reasons.push('Duplicate/dublette signal found in title, body, or labels.');
  } else if (row.state === 'CLOSED' || row.projectStatus === 'Done') {
    bucket = 'implemented_candidate';
    confidence = 'medium';
    suggestedAction = 'Verify whether the current codebase and tests reflect this closed/done issue.';
    reasons.push('Issue is closed or project status is Done.');
  } else if (!row.bodyHash || !row.title || text.length < 80) {
    bucket = 'needs_clarification';
    confidence = 'medium';
    suggestedAction = 'Rewrite with acceptance criteria or ask for clarification.';
    reasons.push('Issue has little or no descriptive body/title content.');
  } else if (!row.projectStatus && (!row.labels || row.labels.length === 0) && (!row.assignees || row.assignees.length === 0)) {
    bucket = 'needs_clarification';
    confidence = 'medium';
    suggestedAction = 'Triage status, labels, assignee, and acceptance criteria.';
    reasons.push('Issue has no status, labels, or assignee.');
  } else if (includesAny(text, DOMAIN_TERMS)) {
    bucket = 'domain_logic_needed';
    confidence = 'medium';
    suggestedAction = 'Assign owner area for business/domain decision before implementation.';
    reasons.push('Domain/business terminology detected.');
  } else if (includesAny(text, BACKEND_TERMS)) {
    bucket = 'backend_or_data_needed';
    confidence = 'medium';
    suggestedAction = 'Assign backend/data owner or confirm frontend dependency.';
    reasons.push('Backend, data, API, indexing, or schema terminology detected.');
  } else if (includesAny(text, QA_TERMS)) {
    bucket = 'qa_or_acceptance_needed';
    confidence = 'medium';
    suggestedAction = 'Add verification criteria or test coverage expectations.';
    reasons.push('QA/test/accessibility terminology detected.');
  } else if (includesAny(text, FRONTEND_TERMS) || row.repository === 'AV-EFI/frontend') {
    bucket = 'frontend_work';
    confidence = 'medium';
    suggestedAction = 'Cross-check frontend implementation and decide whether work remains.';
    reasons.push('Frontend/UI terminology or frontend repository detected.');
  }

  if (!row.assignees || row.assignees.length === 0) {
    reasons.push('Missing assignee.');
  }
  if (!row.projectStatus) {
    reasons.push('Missing project status.');
  }
  if (!row.milestone) {
    reasons.push('Missing milestone.');
  }
  if (!row.labels || row.labels.length === 0) {
    reasons.push('Missing labels.');
  }

  return {
    auditBucket: bucket,
    auditConfidence: confidence,
    auditReason: reasons.join(' '),
    suggestedAction,
    suggestedOwnerArea: inferOwnerArea(row, text),
    codeSearchTerms: extractSearchTerms(row),
    needsHumanReview: bucket !== 'frontend_work' && bucket !== 'actionable',
  };
}

function csvEscape(value) {
  if (Array.isArray(value)) value = value.join('; ');
  if (value === null || value === undefined) value = '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows) {
  const headers = [
    'issueNumber',
    'repository',
    'title',
    'state',
    'projectStatus',
    'auditBucket',
    'auditConfidence',
    'suggestedOwnerArea',
    'needsHumanReview',
    'labels',
    'assignees',
    'milestone',
    'suggestedAction',
    'auditReason',
    'codeSearchTerms',
    'issueUrl',
  ];
  return [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n') + '\n';
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const key = getter(row) || '(missing)';
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function markdownTable(entries, headers) {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...entries.map((entry) => `| ${entry.map((value) => String(value).replace(/\|/g, '\\|')).join(' | ')} |`),
  ].join('\n');
}

function buildSummary(project, rows) {
  const bucketCounts = countBy(rows, (row) => row.auditBucket);
  const ownerCounts = countBy(rows, (row) => row.suggestedOwnerArea);
  const confidenceCounts = countBy(rows, (row) => row.auditConfidence);
  const humanReviewCount = rows.filter((row) => row.needsHumanReview).length;
  const missingAssigneeCount = rows.filter((row) => !row.assignees?.length).length;
  const missingStatusCount = rows.filter((row) => !row.projectStatus).length;

  const reviewSamples = rows
    .filter((row) => row.needsHumanReview)
    .slice(0, 20)
    .map((row) => [
      row.repository && row.issueNumber ? `${row.repository}#${row.issueNumber}` : row.projectItemId,
      row.auditBucket,
      row.suggestedOwnerArea,
      row.title,
    ]);

  return `# Project 1 Initial Classification Summary

Generated: ${new Date().toISOString()}

Project: [${project.title}](${project.url})

## Snapshot

- Classified items: ${rows.length}
- Items needing human review: ${humanReviewCount}
- Missing assignees: ${missingAssigneeCount}
- Missing project status: ${missingStatusCount}

## Audit Buckets

${markdownTable(bucketCounts.map(([key, count]) => [key, count]), ['Bucket', 'Count'])}

## Suggested Owner Areas

${markdownTable(ownerCounts.map(([key, count]) => [key, count]), ['Owner area', 'Count'])}

## Confidence

${markdownTable(confidenceCounts.map(([key, count]) => [key, count]), ['Confidence', 'Count'])}

## First Human-Review Samples

${reviewSamples.length
    ? markdownTable(reviewSamples, ['Issue', 'Bucket', 'Owner area', 'Title'])
    : 'No human-review samples found.'}

## Notes

- This is a heuristic, reversible classification pass over the local inventory snapshot.
- No GitHub issues, labels, assignees, milestones, or project fields were changed.
- The next step is to review the buckets and tune the rules before any GitHub update batch.
`;
}

function main() {
  const source = JSON.parse(fs.readFileSync(INVENTORY_PATH, 'utf8'));
  const classifiedRows = source.items.map((row) => ({
    ...row,
    ...classify(row),
  }));

  const jsonPath = path.join(OUT_DIR, 'project-1-classified.json');
  const csvPath = path.join(OUT_DIR, 'project-1-classified.csv');
  const summaryPath = path.join(OUT_DIR, 'project-1-classification-summary.md');

  fs.writeFileSync(jsonPath, `${JSON.stringify({ project: source.project, items: classifiedRows }, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(classifiedRows));
  fs.writeFileSync(summaryPath, buildSummary(source.project, classifiedRows));

  console.log(`Wrote ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), csvPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), summaryPath)}`);
  console.log(`Classified ${classifiedRows.length} project items.`);
}

main();
