// @ts-check
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CLASSIFIED_PATH = path.resolve('docs/repo-analysis/github-issues-inventory/project-1-classified.json');
const OUT_DIR = path.resolve('docs/repo-analysis/github-issues-inventory');

const TARGET_BUCKETS = new Set([
  'actionable',
  'frontend_work',
  'implemented_candidate',
  'partial_candidate',
  'qa_or_acceptance_needed',
]);

const EXCLUDED_GLOBS = [
  '!node_modules/**',
  '!.git/**',
  '!.nuxt/**',
  '!dist/**',
  '!.output/**',
  '!coverage/**',
  '!public/**',
  '!assets/data/**',
  '!data/**',
  '!docs/**',
  '!models/interfaces/generated/**',
  '!docs/repo-analysis/github-issues-inventory/**',
  '!docs/repo-analysis/github-issues-consolidation-plan.md',
  '!output.json',
  '!package.json',
  '!yarn.lock',
];

const SEARCH_ALIASES = new Map([
  ['barrierefreiheit', ['accessibility', 'a11y']],
  ['datenschutz', ['dataprotection']],
  ['impressum', ['imprint']],
  ['landing', ['index.vue', 'home']],
  ['landingpage', ['index.vue', 'home']],
  ['mehrsprachig', ['i18n', 'locale', 'language']],
  ['multilanguage', ['i18n', 'locale', 'language']],
  ['normdaten', ['normdata', 'gnd']],
  ['redaktion', ['cms', 'edit', 'editor']],
  ['redaktionell', ['cms', 'edit', 'editor']],
  ['suche', ['search']],
  ['suchverlaeufe', ['searchhistory', 'search history']],
  ['suchverlauf', ['searchhistory', 'search history']],
  ['zitat', ['citation', 'clipboard']],
  ['zitieren', ['citation', 'clipboard']],
]);

const STOP_TERMS = new Set([
  'daten',
  'datensaetze',
  'datensatz',
  'anzeigen',
  'auch',
  'avefi',
  'couldhave',
  'dass',
  'eine',
  'einer',
  'einen',
  'einem',
  'filmanzeige',
  'filmrecherche',
  'film',
  'filme',
  'frontend',
  'institution',
  'issue',
  'kann',
  'können',
  'konnen',
  'medien',
  'moechte',
  'möchte',
  'mochte',
  'musthave',
  'oder',
  'projekt',
  'public-release',
  'seite',
  'seiten',
  'sehen',
  'shouldhave',
  'story',
  'user',
  'benutzer',
  'welche',
  'wonthave',
]);

function repairMojibake(value) {
  if (!value || !/[ÃÂâ]/.test(value)) return value || '';
  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return value;
  }
}

function stripDiacritics(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function normalizeTerm(value) {
  return stripDiacritics(repairMojibake(value).toLowerCase())
    .replace(/[^a-z0-9_-]+/g, ' ')
    .trim();
}

function extractTerms(row) {
  const titleTerms = normalizeTerm(row.title || '')
    .split(/\s+/)
    .filter((term) => term.length >= 4);
  const terms = [
    ...(row.codeSearchTerms || []),
    ...titleTerms,
    ...(row.labels || []),
  ]
    .flatMap((term) => {
      const normalized = normalizeTerm(String(term));
      return [normalized, ...(SEARCH_ALIASES.get(normalized) || [])];
    })
    .map((term) => term.trim())
    .filter((term) => term.length >= 4 && !STOP_TERMS.has(term));

  return [...new Set(terms)].slice(0, 16);
}

function runRg(term) {
  const args = [
    '--json',
    '--ignore-case',
    '--fixed-strings',
    '--max-count',
    '3',
    ...EXCLUDED_GLOBS.flatMap((glob) => ['--glob', glob]),
    term,
    '.',
  ];

  try {
    return execFileSync('rg', args, {
      cwd: process.cwd(),
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error && error.status === 1) {
      return error.stdout?.toString() || '';
    }
    throw error;
  }
}

function pathKind(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.startsWith('tests/') || normalized.includes('.spec.') || normalized.includes('.test.')) return 'test';
  if (normalized.startsWith('docs/')) return 'doc';
  if (normalized.startsWith('pages/')) return 'route';
  if (normalized.startsWith('components/')) return 'component';
  if (normalized.startsWith('composables/')) return 'composable';
  if (normalized.startsWith('stores/')) return 'store';
  if (normalized.startsWith('server/')) return 'server';
  if (normalized.startsWith('scripts/')) return 'script';
  return 'code';
}

function collectMatches(terms) {
  const byKey = new Map();

  for (const term of terms) {
    const output = runRg(term);
    for (const line of output.split(/\r?\n/)) {
      if (!line) continue;
      const event = JSON.parse(line);
      if (event.type !== 'match') continue;

      const filePath = event.data?.path?.text || '';
      const lineNumber = event.data?.line_number || 0;
      const lineText = (event.data?.lines?.text || '').trim().replace(/\s+/g, ' ').slice(0, 180);
      if (!filePath || !lineNumber) continue;

      const key = `${filePath}:${lineNumber}`;
      const existing = byKey.get(key);
      if (existing) {
        existing.terms = [...new Set([...existing.terms, term])];
      } else {
        byKey.set(key, {
          file: filePath,
          line: lineNumber,
          kind: pathKind(filePath),
          terms: [term],
          text: lineText,
        });
      }
    }
  }

  return [...byKey.values()]
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
    .slice(0, 20);
}

function inferImplementationState(row, matches, reviewScope) {
  if (!reviewScope) return 'blocked_external';
  const codeMatches = matches.filter((match) => match.kind !== 'test' && match.kind !== 'doc').length;
  const testMatches = matches.filter((match) => match.kind === 'test').length;
  const docMatches = matches.filter((match) => match.kind === 'doc').length;

  if (!matches.length) return 'not_found';
  if (codeMatches > 0 && testMatches > 0) return 'implemented';
  if (codeMatches > 0 && row.auditBucket === 'implemented_candidate') return 'implemented_but_untested';
  if (codeMatches > 0) return 'partial';
  if (testMatches > 0 || docMatches > 0) return 'unclear';
  return 'unclear';
}

function suggestedNextStep(row, state) {
  if (state === 'blocked_external') return 'Keep in owner-area review before frontend code verification.';
  if (state === 'not_found') return 'Review manually; no local frontend evidence found from generated search terms.';
  if (state === 'implemented') return 'Review evidence and acceptance criteria; candidate for keep/close decision batch.';
  if (state === 'implemented_but_untested') return 'Review code evidence and add or confirm regression coverage before closing.';
  if (state === 'partial') return 'Review matched implementation and define remaining acceptance criteria.';
  return 'Review manually; search found indirect evidence only.';
}

function csvEscape(value) {
  if (Array.isArray(value)) value = value.join('; ');
  if (value === null || value === undefined) value = '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows) {
  const headers = [
    'issue',
    'title',
    'auditBucket',
    'suggestedOwnerArea',
    'reviewScope',
    'implementationState',
    'matchCount',
    'matchedFiles',
    'searchTerms',
    'suggestedNextStep',
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

function issueRef(row) {
  return row.repository && row.issueNumber ? `${row.repository}#${row.issueNumber}` : row.projectItemId;
}

function buildSummary(project, rows) {
  const reviewRows = rows.filter((row) => row.reviewScope);
  const stateCounts = countBy(rows, (row) => row.implementationState);
  const bucketCounts = countBy(reviewRows, (row) => row.auditBucket);
  const evidenceRows = reviewRows
    .filter((row) => row.matchCount > 0)
    .slice(0, 20)
    .map((row) => [
      row.issue,
      row.auditBucket,
      row.implementationState,
      row.matchCount,
      row.matchedFiles.slice(0, 3).join('<br>'),
    ]);

  return `# Project 1 Codebase Cross-Check Summary

Generated: ${new Date().toISOString()}

Project: [${project.title}](${project.url})

## Snapshot

- Items cross-checked: ${rows.length}
- Items in frontend/implementation review scope: ${reviewRows.length}
- Items with local evidence matches: ${reviewRows.filter((row) => row.matchCount > 0).length}
- Items with no local evidence matches: ${reviewRows.filter((row) => row.implementationState === 'not_found').length}

## Implementation States

${markdownTable(stateCounts.map(([key, count]) => [key, count]), ['State', 'Count'])}

## Review-Scope Buckets

${markdownTable(bucketCounts.map(([key, count]) => [key, count]), ['Bucket', 'Count'])}

## First Evidence Samples

${evidenceRows.length
    ? markdownTable(evidenceRows, ['Issue', 'Bucket', 'State', 'Matches', 'Files'])
    : 'No evidence samples found.'}

## Notes

- This is a local code-search evidence pass. It does not prove completion by itself.
- No GitHub issues, labels, assignees, milestones, or project fields were changed.
- Review \`implemented\`, \`implemented_but_untested\`, and \`partial\` rows manually before preparing any update batch.
`;
}

function main() {
  const source = JSON.parse(fs.readFileSync(CLASSIFIED_PATH, 'utf8'));
  const rows = source.items.map((row) => {
    const reviewScope = TARGET_BUCKETS.has(row.auditBucket)
      || row.suggestedOwnerArea === 'Frontend/UI'
      || row.suggestedOwnerArea === 'Accessibility/QA';
    const searchTerms = extractTerms(row);
    const matches = reviewScope ? collectMatches(searchTerms) : [];
    const implementationState = inferImplementationState(row, matches, reviewScope);
    const matchedFiles = [...new Set(matches.map((match) => match.file))];

    return {
      ...row,
      reviewScope,
      implementationState,
      codeSearchTermsExpanded: searchTerms,
      codeMatches: matches,
      suggestedNextStep: suggestedNextStep(row, implementationState),
      issue: issueRef(row),
      matchCount: matches.length,
      matchedFiles,
      searchTerms,
    };
  });

  const jsonPath = path.join(OUT_DIR, 'project-1-code-cross-check.json');
  const csvPath = path.join(OUT_DIR, 'project-1-code-cross-check.csv');
  const summaryPath = path.join(OUT_DIR, 'project-1-code-cross-check-summary.md');

  fs.writeFileSync(jsonPath, `${JSON.stringify({ project: source.project, items: rows }, null, 2)}\n`);
  fs.writeFileSync(csvPath, toCsv(rows));
  fs.writeFileSync(summaryPath, buildSummary(source.project, rows));

  console.log(`Wrote ${path.relative(process.cwd(), jsonPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), csvPath)}`);
  console.log(`Wrote ${path.relative(process.cwd(), summaryPath)}`);
  console.log(`Cross-checked ${rows.length} project items.`);
}

main();
