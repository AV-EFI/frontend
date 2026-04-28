import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type Severity = 'OK' | 'WARN' | 'FAIL';

/**
 * Schema-derived severity level for a DQ finding.
 * Derived from model.yaml (AVefi LinkML schema) analysis.
 *   'error'   — Field is required:true in the schema; any violation is a schema error.
 *   'warning' — Field is optional but important for completeness or usability.
 *   'info'    — Optional enrichment field; absence is expected and normal.
 */
export type SchemaLevel = 'error' | 'warning' | 'info';

const REPORT_DIR = resolve(process.cwd(), 'logs', 'data-quality');
const REPORT_PATH = resolve(REPORT_DIR, 'quality-statistics.md');
const IDENTIFIERS_PATH = resolve(REPORT_DIR, 'quality-failing-identifiers.md');

const SUMMARY_START = '<!-- SUMMARY_START -->';
const SUMMARY_END = '<!-- SUMMARY_END -->';

let reportInitialized = false;
let identifiersInitialized = false;
const executiveSummaryEntries = new Map<string, string>();

function readTextFile(path: string): string {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function writeTextFile(path: string, content: string): void {
  writeFileSync(path, content, 'utf8');
}

function ensureReportInitialized(): void {
  if (reportInitialized) {
    return;
  }

  if (!existsSync(REPORT_DIR)) {
    mkdirSync(REPORT_DIR, { recursive: true });
  }

  if (!existsSync(REPORT_PATH)) {
    writeFileSync(
      REPORT_PATH,
      [
        '# Elasticsearch Data Quality Statistics',
        '',
        `Generated: ${new Date().toISOString()}`,
        '',
        '## Executive Summary',
        '',
        SUMMARY_START,
        '- Executive summary will be populated during the run.',
        SUMMARY_END,
        '',
        '## Legend and Interpretation',
        '',
        '- Severity labels:',
        '  - [OK]: metric is within configured thresholds.',
        '  - [WARN]: metric exceeded a warning threshold and should be reviewed.',
        '  - [FAIL]: metric exceeded a hard threshold and should be prioritized.',
        '- Schema level tags (based on models/interfaces/schema/model.yaml):',
        '  - [schema:error]   — field is required:true in model.yaml; any violation is a schema error.',
        '  - [schema:warning] — field is optional in schema but important for completeness/usability.',
        '  - [schema:info]    — optional enrichment field; absence is expected and normal.',
        '  - When [schema:error] and count > 0, severity is automatically raised to at least [WARN].',
        '- Heuristic sections are directional signals, not strict validation errors.',
        '- Placeholder heuristics count records whose title-like fields match words such as test, dummy, sample, untitled, tbd, na, lorem, or ipsum.',
        '- High counts in heuristic sections indicate where to sample and triage first, often by source key.',
        '- Prioritization rule of thumb: high volume + high ratio + business-critical field = first remediation target.',
        '',
      ].join('\n'),
      'utf8',
    );
  }

  reportInitialized = true;
}

function ensureIdentifiersInitialized(): void {
  if (identifiersInitialized) {
    return;
  }

  if (!existsSync(REPORT_DIR)) {
    mkdirSync(REPORT_DIR, { recursive: true });
  }

  if (!existsSync(IDENTIFIERS_PATH)) {
    writeFileSync(
      IDENTIFIERS_PATH,
      [
        '# Elasticsearch Failing Document Identifiers',
        '',
        `Generated: ${new Date().toISOString()}`,
        '',
      ].join('\n'),
      'utf8',
    );
  }

  identifiersInitialized = true;
}

function appendMarkdown(line: string): void {
  ensureReportInitialized();
  appendFileSync(REPORT_PATH, `${line}\n`, 'utf8');
}

export function getQualityStatisticsReportPath(): string {
  ensureReportInitialized();
  return REPORT_PATH;
}

export function getQualityFailingIdentifiersPath(): string {
  ensureIdentifiersInitialized();
  return IDENTIFIERS_PATH;
}

function updateExecutiveSummaryInReport(): void {
  ensureReportInitialized();
  const content = readTextFile(REPORT_PATH);
  if (!content.includes(SUMMARY_START) || !content.includes(SUMMARY_END)) {
    return;
  }

  const summaryLines = executiveSummaryEntries.size === 0
    ? ['- Executive summary will be populated during the run.']
    : Array.from(executiveSummaryEntries.entries()).map(([label, value]) => `- ${label}: ${value}`);

  const startIndex = content.indexOf(SUMMARY_START);
  const endIndex = content.indexOf(SUMMARY_END);
  if (startIndex < 0 || endIndex < 0 || endIndex <= startIndex) {
    return;
  }

  const before = content.slice(0, startIndex + SUMMARY_START.length);
  const after = content.slice(endIndex);
  const updated = `${before}\n${summaryLines.join('\n')}\n${after}`;
  writeTextFile(REPORT_PATH, updated);
}

export function setExecutiveSummaryMetric(label: string, value: string): void {
  executiveSummaryEntries.set(label, value);
  updateExecutiveSummaryInReport();
}

export function printFailingIdentifiers(ruleLabel: string, identifiers: string[]): void {
  ensureIdentifiersInitialized();
  const unique = Array.from(new Set(identifiers.map((value) => value.trim()).filter((value) => value.length > 0))).sort();

  appendFileSync(IDENTIFIERS_PATH, `\n## ${ruleLabel}\n\n`, 'utf8');
  appendFileSync(IDENTIFIERS_PATH, `Total identifiers: ${unique.length}\n\n`, 'utf8');

  if (unique.length === 0) {
    appendFileSync(IDENTIFIERS_PATH, '- none\n', 'utf8');
    return;
  }

  for (const id of unique) {
    appendFileSync(IDENTIFIERS_PATH, `- ${id}\n`, 'utf8');
  }
}

export function pct(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return part / total;
}

export function formatPct(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

export function severityFromValue(
  value: number,
  warnThreshold: number,
  failThreshold?: number,
): Severity {
  if (typeof failThreshold === 'number' && value > failThreshold) {
    return 'FAIL';
  }
  if (value > warnThreshold) {
    return 'WARN';
  }
  return 'OK';
}

export function severityFromCount(
  value: number,
  warnThreshold: number,
  failThreshold?: number,
): Severity {
  return severityFromValue(value, warnThreshold, failThreshold);
}

export function printSection(title: string): void {
  console.log(`\n[DATA-QUALITY] ${title}`);
  appendMarkdown('');
  appendMarkdown(`## ${title}`);
  appendMarkdown('');
}

export function printLine(line: string): void {
  console.log(`[DATA-QUALITY] ${line}`);
  appendMarkdown(`- ${line}`);
}

export function printMetric(details: {
  label: string;
  value: number;
  total?: number;
  warnThreshold?: number;
  failThreshold?: number;
  /** Schema-derived severity level from model.yaml analysis. */
  schemaLevel?: SchemaLevel;
}): void {
  const { label, value, total, warnThreshold, failThreshold, schemaLevel } = details;

  const schemaTag = schemaLevel ? ` [schema:${schemaLevel}]` : '';
  const displayLabel = `${label}${schemaTag}`;

  if (typeof total === 'number') {
    const ratio = pct(value, total);
    let severity: Severity;
    if (typeof warnThreshold === 'number') {
      severity = severityFromValue(ratio, warnThreshold, failThreshold);
      if (schemaLevel === 'error' && value > 0 && severity === 'OK') severity = 'WARN';
    } else if (schemaLevel === 'error' && value > 0) {
      severity = 'WARN';
    } else {
      severity = 'OK';
    }
    printLine(`${displayLabel}: ${value}/${total} (${formatPct(ratio)}) [${severity}]`);
    return;
  }

  let severity: Severity;
  if (typeof warnThreshold === 'number') {
    severity = severityFromCount(value, warnThreshold, failThreshold);
    if (schemaLevel === 'error' && value > 0 && severity === 'OK') severity = 'WARN';
  } else if (schemaLevel === 'error' && value > 0) {
    severity = 'WARN';
  } else {
    severity = 'OK';
  }
  printLine(`${displayLabel}: ${value} [${severity}]`);
}

export interface TermsBucket {
  key: string;
  doc_count: number;
}

export function toTopTerms(value: unknown, limit = 10): TermsBucket[] {
  const buckets = (value as { buckets?: TermsBucket[] } | undefined)?.buckets ?? [];
  return buckets.slice(0, limit);
}

export function printTopTerms(label: string, buckets: TermsBucket[]): void {
  if (buckets.length === 0) {
    console.log(`[DATA-QUALITY] ${label}: none`);
    appendMarkdown(`- ${label}: none`);
    return;
  }

  console.log(`[DATA-QUALITY] ${label}:`);
  appendMarkdown(`- ${label}:`);
  for (const bucket of buckets) {
    console.log(`[DATA-QUALITY]   - ${bucket.key}: ${bucket.doc_count}`);
    appendMarkdown(`  - ${bucket.key}: ${bucket.doc_count}`);
  }
}
