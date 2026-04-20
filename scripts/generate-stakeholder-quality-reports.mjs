import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT_DIR = resolve(process.cwd(), 'logs', 'data-quality');
const REPORT_PATH = resolve(ROOT_DIR, 'quality-statistics.md');
const IDENTIFIERS_PATH = resolve(ROOT_DIR, 'quality-failing-identifiers.md');
const OUT_DIR = resolve(ROOT_DIR, 'stakeholders');

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseSections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const prelude = [];
  const sections = new Map();

  let currentTitle = null;
  let currentLines = [];
  let sawSection = false;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      sawSection = true;
      if (currentTitle) {
        sections.set(currentTitle, currentLines.slice());
      }
      currentTitle = line.slice(3).trim();
      currentLines = [line];
      continue;
    }

    if (!sawSection) {
      prelude.push(line);
      continue;
    }

    if (currentTitle) {
      currentLines.push(line);
    }
  }

  if (currentTitle) {
    sections.set(currentTitle, currentLines.slice());
  }

  return {
    prelude,
    sections,
  };
}

function buildDoc(title, subtitle, onboarding, prelude, selectedSections, identifiersPath, includeIdentifiers) {
  const generatedAt = new Date().toISOString();
  const body = [];

  body.push(`# ${title}`);
  body.push('');
  body.push(`Generated: ${generatedAt}`);
  body.push('');
  body.push(subtitle);
  body.push('');

  body.push('## Audience and Reading Order');
  body.push('');
  body.push(`- Primary audience: ${onboarding.primaryAudience}`);
  body.push(`- Read first: ${onboarding.readFirst}`);
  body.push(`- Then review: ${onboarding.reviewNext}`);
  body.push(`- Typical action: ${onboarding.typicalAction}`);
  body.push('');

  const preludeWithoutTitle = prelude.filter((line) => {
    const trimmed = line.trim();
    if (trimmed === '# Elasticsearch Data Quality Statistics') {
      return false;
    }
    if (trimmed.startsWith('Generated:')) {
      return false;
    }
    return true;
  });
  if (preludeWithoutTitle.length > 0) {
    body.push(...preludeWithoutTitle);
    body.push('');
  }

  for (const lines of selectedSections) {
    body.push(...lines);
    body.push('');
  }

  if (includeIdentifiers) {
    body.push('## Identifier Samples');
    body.push('');
    if (existsSync(identifiersPath)) {
      body.push('See logs/data-quality/quality-failing-identifiers.md for sampled failing handles per rule.');
    }
    else {
      body.push('No failing-identifier sample file was found for this run.');
    }
    body.push('');
  }

  return `${body.join('\n').trim()}\n`;
}

function pickSections(sectionMap, titles) {
  return titles
    .map((title) => sectionMap.get(title))
    .filter((value) => Array.isArray(value));
}

export function generateStakeholderQualityReports(options = {}) {
  const rootDir = options.rootDir ? resolve(options.rootDir) : ROOT_DIR;
  const reportPath = options.reportPath ? resolve(options.reportPath) : resolve(rootDir, 'quality-statistics.md');
  const identifiersPath = options.identifiersPath ? resolve(options.identifiersPath) : resolve(rootDir, 'quality-failing-identifiers.md');
  const outDir = options.outDir ? resolve(options.outDir) : resolve(rootDir, 'stakeholders');

  if (!existsSync(reportPath)) {
    console.log('[DATA-QUALITY] Stakeholder report generation skipped: quality-statistics.md not found.');
    return [];
  }

  const content = readFileSync(reportPath, 'utf8');
  const { prelude, sections } = parseSections(content);

  const stakeholderConfigs = [
    {
      name: 'Frontend and UX',
      subtitle: 'Focus on data symptoms that affect search quality, discoverability, and user trust.',
      onboarding: {
        primaryAudience: 'Frontend developers and UX/product-design collaborators',
        readFirst: 'Text quality placeholder heuristics',
        reviewNext: 'Near-duplicate title heuristics and language harmonization checks',
        typicalAction: 'prioritize UX-visible data cleanup tasks that improve search result quality and user trust',
      },
      fileName: 'frontend-ux.md',
      includeIdentifiers: false,
      sectionTitles: [
        'Legend and Interpretation',
        'Text quality placeholder heuristics',
        'Near-duplicate title heuristics',
        'Language harmonization checks',
        'Denormalised index comparison',
        'Trend snapshot and deltas',
      ],
    },
    {
      name: 'Backend',
      subtitle: 'Focus on schema, integrity, and contract-level quality risks in ingestion and indexing.',
      onboarding: {
        primaryAudience: 'Backend and ingestion pipeline engineers',
        readFirst: 'Referential integrity heuristics',
        reviewNext: 'Identifier and URL format checks, then mapping/schema drift checks',
        typicalAction: 'fix contract and mapping issues before release or reindex',
      },
      fileName: 'backend.md',
      includeIdentifiers: true,
      sectionTitles: [
        'Legend and Interpretation',
        'Referential integrity heuristics',
        'Identifier and URL format checks',
        'Cross-field consistency checks',
        'Mapping/schema drift checks',
        'Denormalised index comparison',
      ],
    },
    {
      name: 'Data Engineer',
      subtitle: 'Full operational view for root-cause analysis, source triage, and migration comparisons.',
      onboarding: {
        primaryAudience: 'Data engineers and ETL/index maintainers',
        readFirst: 'Source-level anomaly heuristics and completeness overviews',
        reviewNext: 'Denormalised index comparison and identifier samples',
        typicalAction: 'identify highest-impact source cohorts and create targeted remediation batches',
      },
      fileName: 'data-engineer.md',
      includeIdentifiers: true,
      sectionTitles: [
        'Executive Summary',
        'Legend and Interpretation',
        'Source-level anomaly heuristics',
        'Root completeness overview',
        'Manifestation completeness overview',
        'Item completeness overview',
        'Controlled vocabulary conformance',
        'Language harmonization checks',
        'Text quality placeholder heuristics',
        'Denormalised index comparison',
        'Trend snapshot and deltas',
      ],
    },
    {
      name: 'Project Manager',
      subtitle: 'Decision view with trend and rollout comparison highlights.',
      onboarding: {
        primaryAudience: 'Project and delivery managers',
        readFirst: 'Executive Summary and denormalised index comparison',
        reviewNext: 'Trend deltas and source-level anomaly summary',
        typicalAction: 'decide rollout readiness and assign follow-up ownership',
      },
      fileName: 'project-manager.md',
      includeIdentifiers: false,
      sectionTitles: [
        'Executive Summary',
        'Legend and Interpretation',
        'Denormalised index comparison',
        'Trend snapshot and deltas',
        'Source-level anomaly heuristics',
      ],
    },
    {
      name: 'Data Delivering Institutions',
      subtitle: 'Partner-facing quality observations focused on data completeness and content quality by source behavior.',
      onboarding: {
        primaryAudience: 'External data-providing institutions and partner contacts',
        readFirst: 'Root quality by source key and suspicious root titles',
        reviewNext: 'Placeholder heuristics and root completeness overview',
        typicalAction: 'align on feed-level corrections and metadata improvements in source systems',
      },
      fileName: 'data-delivering-institutions.md',
      includeIdentifiers: true,
      sectionTitles: [
        'Legend and Interpretation',
        'Source-level anomaly heuristics',
        'Suspicious root titles in non-test sources',
        'Text quality placeholder heuristics',
        'Root quality by source key',
        'Root completeness overview',
      ],
    },
  ];

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const writtenFiles = [];

  for (const config of stakeholderConfigs) {
    const selectedSections = pickSections(sections, config.sectionTitles);
    const doc = buildDoc(
      `Elasticsearch Data Quality Report: ${config.name}`,
      config.subtitle,
      config.onboarding,
      prelude,
      selectedSections,
      identifiersPath,
      config.includeIdentifiers,
    );

    const targetFile = resolve(outDir, config.fileName || `${slugify(config.name)}.md`);
    writeFileSync(targetFile, doc, 'utf8');
    writtenFiles.push(targetFile);
    console.log(`[DATA-QUALITY] Wrote stakeholder report: ${targetFile}`);
  }

  return writtenFiles;
}

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(resolve(process.argv[1])).href
  : false;

if (isDirectRun) {
  generateStakeholderQualityReports();
}
