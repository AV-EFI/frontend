import { describe, it } from 'vitest';
import { esCount, esSearch, getEsAuditConfig } from './es-client';
import {
  printLine,
  printMetric,
  printSection,
  printTopTerms,
  toTopTerms,
} from './report-utils';
import { schemaLevelForField } from './schema-severity';
import { thresholds } from './thresholds';

describe('Elasticsearch data-quality report: root level', () => {
  it('prints root-level completeness, suspicious content, and duplicate identifiers', async () => {
    try {
      const cfg = getEsAuditConfig();

      if (!cfg) {
        printLine('Skipping root data-quality report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
        return;
      }

      const countResult = await esCount(cfg);
      printSection('Root document count');
      printLine(`Total root documents: ${countResult.count}`);

      const completenessResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          missing_root_title: { missing: { field: 'has_record.has_primary_title.has_name.keyword' } },
          missing_root_handle: { missing: { field: 'handle.keyword' } },
          missing_root_kip: { missing: { field: 'kip.keyword' } },
          missing_root_url: { missing: { field: 'url.keyword' } },
          missing_root_issuer: { missing: { field: 'has_record.described_by.has_issuer_name.keyword' } },
          missing_root_source_key: { missing: { field: 'has_record.described_by.has_source_key.keyword' } },
          missing_root_same_as_id: { missing: { field: 'has_record.same_as.id.keyword' } },
          missing_root_type: { missing: { field: 'has_record.type.keyword' } },
        },
      });

      if (completenessResult.timed_out) {
        printLine('WARN: Root completeness query timed out.');
      }

      const total = completenessResult.hits.total.value;
      const aggs = (completenessResult.aggregations ?? {}) as Record<string, { doc_count: number }>;

      printSection('Root completeness overview');
      printMetric({ label: 'Missing root title', value: aggs.missing_root_title?.doc_count ?? 0, total, schemaLevel: schemaLevelForField('has_record.has_primary_title.has_name.keyword') });
      printMetric({ label: 'Missing root handle', value: aggs.missing_root_handle?.doc_count ?? 0, total, schemaLevel: schemaLevelForField('handle.keyword') });
      printMetric({ label: 'Missing root kip', value: aggs.missing_root_kip?.doc_count ?? 0, total, schemaLevel: schemaLevelForField('kip.keyword') });
      printMetric({ label: 'Missing root url', value: aggs.missing_root_url?.doc_count ?? 0, total, schemaLevel: schemaLevelForField('url.keyword') });
      printMetric({ label: 'Missing root issuer', value: aggs.missing_root_issuer?.doc_count ?? 0, total, schemaLevel: schemaLevelForField('has_record.described_by.has_issuer_name.keyword') });
      printMetric({
        label: 'Missing root source key',
        value: aggs.missing_root_source_key?.doc_count ?? 0,
        total,
        warnThreshold: thresholds.maxMissingRootSourceKeyPctWarn,
        schemaLevel: schemaLevelForField('has_record.described_by.has_source_key.keyword'),
      });
      printMetric({
        label: 'Missing root same_as.id',
        value: aggs.missing_root_same_as_id?.doc_count ?? 0,
        total,
        warnThreshold: thresholds.maxMissingRootSameAsPctWarn,
        schemaLevel: schemaLevelForField('has_record.same_as.id.keyword'),
      });
      printMetric({ label: 'Missing root type', value: aggs.missing_root_type?.doc_count ?? 0, total, schemaLevel: schemaLevelForField('has_record.type.keyword') });

      const rootBySourceResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          by_source: {
            terms: {
              field: 'has_record.described_by.has_source_key.keyword',
              size: 200,
              missing: '__MISSING_SOURCE_KEY__',
            },
            aggs: {
              missing_title: {
                filter: {
                  bool: {
                    must_not: [{ exists: { field: 'has_record.has_primary_title.has_name.keyword' } }],
                  },
                },
              },
              missing_handle: {
                filter: {
                  bool: {
                    must_not: [{ exists: { field: 'handle.keyword' } }],
                  },
                },
              },
              missing_source_key: {
                filter: {
                  bool: {
                    must_not: [{ exists: { field: 'has_record.described_by.has_source_key.keyword' } }],
                  },
                },
              },
            },
          },
        },
      });

      if (rootBySourceResult.timed_out) {
        printLine('WARN: Root by-source query timed out.');
      }

      const rootBySourceAggs = (rootBySourceResult.aggregations ?? {}) as Record<string, unknown>;

      printSection('Root quality by source key');
      printTopTerms('Root documents by source key', toTopTerms(rootBySourceAggs.by_source, 20));

      const noManifestationsResult = await esSearch(cfg, {
        size: 0,
        query: {
          bool: {
            must_not: [
              {
                nested: {
                  path: 'manifestations',
                  query: { match_all: {} },
                },
              },
            ],
          },
        },
      });

      if (noManifestationsResult.timed_out) {
        printLine('WARN: Root without manifestations query timed out.');
      }

      printSection('Root records without manifestations');
      printLine(`Count: ${noManifestationsResult.hits.total.value}`);

      const duplicateResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          duplicate_handles: {
            terms: {
              field: 'handle.keyword',
              min_doc_count: 2,
              size: 200,
            },
          },
          duplicate_kip: {
            terms: {
              field: 'kip.keyword',
              min_doc_count: 2,
              size: 200,
            },
          },
          duplicate_same_as_ids: {
            terms: {
              field: 'has_record.same_as.id.keyword',
              min_doc_count: 2,
              size: 200,
            },
          },
        },
      });

      if (duplicateResult.timed_out) {
        printLine('WARN: Duplicate identifiers query timed out.');
      }

      const duplicateAggs = (duplicateResult.aggregations ?? {}) as Record<string, unknown>;
      const duplicateHandles = toTopTerms(duplicateAggs.duplicate_handles, 10);
      const duplicateKip = toTopTerms(duplicateAggs.duplicate_kip, 10);
      const duplicateSameAs = toTopTerms(duplicateAggs.duplicate_same_as_ids, 10);

      printSection('Duplicate root identifiers');
      printMetric({
        label: 'Duplicate handle buckets',
        value: duplicateHandles.length,
        warnThreshold: 1,
        failThreshold: thresholds.maxDuplicateRootHandlesHard,
        schemaLevel: schemaLevelForField('handle.keyword'),
      });
      printMetric({
        label: 'Duplicate kip buckets',
        value: duplicateKip.length,
        warnThreshold: 1,
        failThreshold: thresholds.maxDuplicateRootKipHard,
        schemaLevel: schemaLevelForField('kip.keyword'),
      });
      printMetric({
        label: 'Duplicate same_as.id buckets',
        value: duplicateSameAs.length,
        warnThreshold: 1,
        failThreshold: thresholds.maxDuplicateRootSameAsIdHard,
        schemaLevel: schemaLevelForField('has_record.same_as.id.keyword'),
      });
      printTopTerms('Top duplicate handles', duplicateHandles);
      printTopTerms('Top duplicate kip values', duplicateKip);
      printTopTerms('Top duplicate same_as.id values', duplicateSameAs);

      const suspiciousBySourceResult = await esSearch(cfg, {
        size: 0,
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: 'has_record.has_primary_title.has_name',
                  query: '*test* OR *avefi* OR *demo* OR *dummy* OR *sample* OR *beispiel* OR *foo* OR *bar* OR *lorem* OR *ipsum*',
                },
              },
            ],
            must_not: [
              {
                query_string: {
                  default_field: 'has_record.described_by.has_source_key',
                  query: '*test* OR *demo* OR *dev* OR *sandbox* OR *staging* OR *mock*',
                },
              },
            ],
          },
        },
        aggs: {
          by_source: {
            terms: {
              field: 'has_record.described_by.has_source_key.keyword',
              size: 200,
              missing: '__MISSING_SOURCE_KEY__',
            },
          },
        },
      });

      if (suspiciousBySourceResult.timed_out) {
        printLine('WARN: Suspicious titles by source query timed out.');
      }

      printSection('Suspicious root titles in non-test sources');
      printLine(`Suspicious root title count: ${suspiciousBySourceResult.hits.total.value}`);
      const suspiciousBySourceAggs = (suspiciousBySourceResult.aggregations ?? {}) as Record<string, unknown>;
      printTopTerms('Suspicious root titles by source', toTopTerms(suspiciousBySourceAggs.by_source, 20));

      const missingCoreSampleResult = await esSearch(cfg, {
        size: 25,
        _source: [
          'handle',
          'kip',
          'url',
          'has_record.has_primary_title.has_name',
          'has_record.described_by.has_source_key',
          'has_record.described_by.has_issuer_name',
          'has_record.same_as.id',
        ],
        query: {
          bool: {
            should: [
              { bool: { must_not: [{ exists: { field: 'has_record.has_primary_title.has_name.keyword' } }] } },
              { bool: { must_not: [{ exists: { field: 'handle.keyword' } }] } },
              { bool: { must_not: [{ exists: { field: 'has_record.described_by.has_source_key.keyword' } }] } },
            ],
            minimum_should_match: 1,
          },
        },
      });

      if (missingCoreSampleResult.timed_out) {
        printLine('WARN: Missing core sample query timed out.');
      }

      printSection('Sample root records missing core fields');
      printLine(`Sample size returned: ${missingCoreSampleResult.hits.hits.length}`);
    }
    catch (error) {
      printSection('Root data-quality execution warning');
      printLine(`Query execution failed but report remains non-blocking: ${String(error)}`);
    }
  });
});
