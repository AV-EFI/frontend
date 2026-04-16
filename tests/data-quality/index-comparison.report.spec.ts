import { describe, it } from 'vitest';
import { esCount, esSearch, getEsAuditConfig, type EsAuditConfig } from './es-client';
import { formatPct, pct, printFailingIdentifiers, printLine, printSection, toTopTerms } from './report-utils';

interface IndexMetrics {
  index: string;
  totalDocs: number;
  missingTitle: number;
  missingSourceKey: number;
  missingSameAsId: number;
  placeholderTitleCount: number;
  malformedSameAsId: number;
  duplicateSameAsBuckets: number;
}

const DEFAULT_BASELINE_INDEX = '21.11155-denormalised-work';
const DEFAULT_CANDIDATE_INDEX = '21.11155-denormalised-work-testbed';

function createIndexConfig(cfg: EsAuditConfig, index: string): EsAuditConfig {
  return {
    ...cfg,
    index,
  };
}

function delta(current: number, baseline: number): string {
  const value = current - baseline;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}`;
}

function deltaPct(currentRatio: number, baselineRatio: number): string {
  const points = (currentRatio - baselineRatio) * 100;
  const sign = points > 0 ? '+' : '';
  return `${sign}${points.toFixed(2)}pp`;
}

function toHandleList(hits: Array<{ _source?: { handle?: string } }>): string[] {
  return hits
    .map((hit) => hit._source?.handle)
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
}

async function collectMetrics(cfg: EsAuditConfig): Promise<IndexMetrics> {
  const placeholderQuery = '*test* OR *dummy* OR *sample* OR *untitled* OR *tbd* OR *na* OR *lorem* OR *ipsum*';

  const countResult = await esCount(cfg);

  const summaryResult = await esSearch(cfg, {
    size: 0,
    aggs: {
      missing_title: {
        missing: { field: 'has_record.has_primary_title.has_name.keyword' },
      },
      missing_source_key: {
        missing: { field: 'has_record.described_by.has_source_key.keyword' },
      },
      missing_same_as: {
        missing: { field: 'has_record.same_as.id.keyword' },
      },
      placeholder_title: {
        filter: {
          query_string: {
            default_field: 'has_record.has_primary_title.has_name',
            query: placeholderQuery,
          },
        },
      },
      malformed_same_as_id: {
        filter: {
          bool: {
            must: [{ exists: { field: 'has_record.same_as.id.keyword' } }],
            must_not: [{ regexp: { 'has_record.same_as.id.keyword': '[0-9a-f]{32}' } }],
          },
        },
      },
      duplicate_same_as: {
        terms: {
          field: 'has_record.same_as.id.keyword',
          min_doc_count: 2,
          size: 200,
        },
      },
    },
  });

  const aggs = (summaryResult.aggregations ?? {}) as Record<string, unknown>;

  return {
    index: cfg.index,
    totalDocs: countResult.count,
    missingTitle: ((aggs.missing_title as { doc_count?: number } | undefined)?.doc_count) ?? 0,
    missingSourceKey: ((aggs.missing_source_key as { doc_count?: number } | undefined)?.doc_count) ?? 0,
    missingSameAsId: ((aggs.missing_same_as as { doc_count?: number } | undefined)?.doc_count) ?? 0,
    placeholderTitleCount: ((aggs.placeholder_title as { doc_count?: number } | undefined)?.doc_count) ?? 0,
    malformedSameAsId: ((aggs.malformed_same_as_id as { doc_count?: number } | undefined)?.doc_count) ?? 0,
    duplicateSameAsBuckets: toTopTerms(aggs.duplicate_same_as, 200).length,
  };
}

async function collectFailingHandles(cfg: EsAuditConfig): Promise<void> {
  const placeholderQuery = '*test* OR *dummy* OR *sample* OR *untitled* OR *tbd* OR *na* OR *lorem* OR *ipsum*';

  const [missingSourceRes, missingSameAsRes, placeholderRes] = await Promise.all([
    esSearch<{ handle?: string }>(cfg, {
      size: 500,
      _source: ['handle'],
      query: {
        bool: {
          must_not: [{ exists: { field: 'has_record.described_by.has_source_key.keyword' } }],
        },
      },
    }),
    esSearch<{ handle?: string }>(cfg, {
      size: 500,
      _source: ['handle'],
      query: {
        bool: {
          must_not: [{ exists: { field: 'has_record.same_as.id.keyword' } }],
        },
      },
    }),
    esSearch<{ handle?: string }>(cfg, {
      size: 500,
      _source: ['handle'],
      query: {
        query_string: {
          default_field: 'has_record.has_primary_title.has_name',
          query: placeholderQuery,
        },
      },
    }),
  ]);

  printFailingIdentifiers(`[${cfg.index}] Missing source key (sample up to 500 handles)`, toHandleList(missingSourceRes.hits.hits));
  printFailingIdentifiers(`[${cfg.index}] Missing same_as.id (sample up to 500 handles)`, toHandleList(missingSameAsRes.hits.hits));
  printFailingIdentifiers(`[${cfg.index}] Placeholder-like titles (sample up to 500 handles)`, toHandleList(placeholderRes.hits.hits));
}

describe('Elasticsearch data-quality report: denormalised index comparison', () => {
  it('compares baseline and testbed denormalised-work indices', async () => {
    const baseCfg = getEsAuditConfig();

    if (!baseCfg) {
      printLine('Skipping index comparison report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
      return;
    }

    const baselineIndex = process.env.ES_COMPARE_BASELINE_INDEX?.trim() || DEFAULT_BASELINE_INDEX;
    const candidateIndex = process.env.ES_COMPARE_CANDIDATE_INDEX?.trim() || DEFAULT_CANDIDATE_INDEX;

    const baselineCfg = createIndexConfig(baseCfg, baselineIndex);
    const candidateCfg = createIndexConfig(baseCfg, candidateIndex);

    printSection('Denormalised index comparison');
    printLine(`Baseline index: ${baselineIndex}`);
    printLine(`Candidate index: ${candidateIndex}`);

    try {
      const [baseline, candidate] = await Promise.all([
        collectMetrics(baselineCfg),
        collectMetrics(candidateCfg),
      ]);

      const baselineMissingSourceRatio = pct(baseline.missingSourceKey, baseline.totalDocs);
      const candidateMissingSourceRatio = pct(candidate.missingSourceKey, candidate.totalDocs);
      const baselineMissingSameAsRatio = pct(baseline.missingSameAsId, baseline.totalDocs);
      const candidateMissingSameAsRatio = pct(candidate.missingSameAsId, candidate.totalDocs);
      const baselinePlaceholderRatio = pct(baseline.placeholderTitleCount, baseline.totalDocs);
      const candidatePlaceholderRatio = pct(candidate.placeholderTitleCount, candidate.totalDocs);

      printLine(`Total docs: baseline=${baseline.totalDocs}, candidate=${candidate.totalDocs}, delta=${delta(candidate.totalDocs, baseline.totalDocs)}`);
      printLine(`Missing title ratio: baseline=${formatPct(pct(baseline.missingTitle, baseline.totalDocs))}, candidate=${formatPct(pct(candidate.missingTitle, candidate.totalDocs))}`);
      printLine(`Missing source key ratio: baseline=${formatPct(baselineMissingSourceRatio)}, candidate=${formatPct(candidateMissingSourceRatio)}, delta=${deltaPct(candidateMissingSourceRatio, baselineMissingSourceRatio)}`);
      printLine(`Missing same_as.id ratio: baseline=${formatPct(baselineMissingSameAsRatio)}, candidate=${formatPct(candidateMissingSameAsRatio)}, delta=${deltaPct(candidateMissingSameAsRatio, baselineMissingSameAsRatio)}`);
      printLine(`Placeholder title ratio (work titles): baseline=${formatPct(baselinePlaceholderRatio)}, candidate=${formatPct(candidatePlaceholderRatio)}, delta=${deltaPct(candidatePlaceholderRatio, baselinePlaceholderRatio)}`);
      printLine(`Malformed same_as.id count: baseline=${baseline.malformedSameAsId}, candidate=${candidate.malformedSameAsId}, delta=${delta(candidate.malformedSameAsId, baseline.malformedSameAsId)}`);
      printLine(`Duplicate same_as.id buckets: baseline=${baseline.duplicateSameAsBuckets}, candidate=${candidate.duplicateSameAsBuckets}, delta=${delta(candidate.duplicateSameAsBuckets, baseline.duplicateSameAsBuckets)}`);

      await Promise.all([
        collectFailingHandles(baselineCfg),
        collectFailingHandles(candidateCfg),
      ]);
    }
    catch (error) {
      printLine(`WARN: Denormalised index comparison failed: ${String(error)}`);
    }
  });
});
