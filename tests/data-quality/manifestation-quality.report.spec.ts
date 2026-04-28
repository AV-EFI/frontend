import { describe, it } from 'vitest';
import { esSearch, getEsAuditConfig } from './es-client';
import {
  printLine,
  printMetric,
  printSection,
  printTopTerms,
  toTopTerms,
} from './report-utils';
import { schemaLevelForField } from './schema-severity';
import { thresholds } from './thresholds';

interface MissingAggregation {
  doc_count: number;
}

interface ManifestationCompletenessAggregations {
  doc_count: number;
  missing_manifestation_title?: MissingAggregation;
  missing_manifestation_handle?: MissingAggregation;
  missing_manifestation_issuer?: MissingAggregation;
  missing_manifestation_source_key?: MissingAggregation;
  missing_is_manifestation_of?: MissingAggregation;
  missing_manifestation_sound_type?: MissingAggregation;
  missing_manifestation_colour_type?: MissingAggregation;
}

describe('Elasticsearch data-quality report: manifestation level', () => {
  it('prints manifestation-level completeness, suspicious titles, and value distributions', async () => {
    try {
      const cfg = getEsAuditConfig();

      if (!cfg) {
        printLine('Skipping manifestation data-quality report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
        return;
      }

      const manifestationCompletenessResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              'missing_manifestation_title': {
                missing: { field: 'manifestations.has_record.has_primary_title.has_name.keyword' },
              },
              'missing_manifestation_handle': {
                missing: { field: 'manifestations.handle.keyword' },
              },
              'missing_manifestation_issuer': {
                missing: { field: 'manifestations.has_record.described_by.has_issuer_name.keyword' },
              },
              'missing_manifestation_source_key': {
                missing: { field: 'manifestations.has_record.described_by.has_source_key.keyword' },
              },
              'missing_is_manifestation_of': {
                missing: { field: 'manifestations.has_record.is_manifestation_of.id.keyword' },
              },
              'missing_manifestation_sound_type': {
                missing: { field: 'manifestations.has_record.has_sound_type.keyword' },
              },
              'missing_manifestation_colour_type': {
                missing: { field: 'manifestations.has_record.has_colour_type.keyword' },
              },
            },
          },
        },
      });

      if (manifestationCompletenessResult.timed_out) {
        printLine('WARN: Manifestation completeness query timed out.');
      }

      const manifestationAggs = ((manifestationCompletenessResult.aggregations ?? {}) as {
        manifestations?: ManifestationCompletenessAggregations;
      }).manifestations;

      const manifestationTotal = manifestationAggs?.doc_count ?? 0;

      printSection('Manifestation completeness overview');
      printLine(`Total manifestations: ${manifestationTotal}`);
      printMetric({
        label: 'Missing manifestation title',
        value: manifestationAggs?.missing_manifestation_title?.doc_count ?? 0,
        total: manifestationTotal,
        schemaLevel: schemaLevelForField('manifestations.has_record.has_primary_title.has_name.keyword'),
      });
      printMetric({
        label: 'Missing manifestation handle',
        value: manifestationAggs?.missing_manifestation_handle?.doc_count ?? 0,
        total: manifestationTotal,
        schemaLevel: schemaLevelForField('manifestations.handle.keyword'),
      });
      printMetric({
        label: 'Missing manifestation issuer',
        value: manifestationAggs?.missing_manifestation_issuer?.doc_count ?? 0,
        total: manifestationTotal,
        schemaLevel: schemaLevelForField('manifestations.has_record.described_by.has_issuer_name.keyword'),
      });
      printMetric({
        label: 'Missing manifestation source key',
        value: manifestationAggs?.missing_manifestation_source_key?.doc_count ?? 0,
        total: manifestationTotal,
        warnThreshold: thresholds.maxMissingManifestationSourceKeyPctWarn,
        schemaLevel: schemaLevelForField('manifestations.has_record.described_by.has_source_key.keyword'),
      });
      printMetric({
        label: 'Missing manifestation is_manifestation_of.id',
        value: manifestationAggs?.missing_is_manifestation_of?.doc_count ?? 0,
        total: manifestationTotal,
        schemaLevel: schemaLevelForField('manifestations.has_record.is_manifestation_of.id.keyword'),
      });
      printMetric({
        label: 'Missing manifestation sound type',
        value: manifestationAggs?.missing_manifestation_sound_type?.doc_count ?? 0,
        total: manifestationTotal,
        schemaLevel: schemaLevelForField('manifestations.has_record.has_sound_type.keyword'),
      });
      printMetric({
        label: 'Missing manifestation colour type',
        value: manifestationAggs?.missing_manifestation_colour_type?.doc_count ?? 0,
        total: manifestationTotal,
        schemaLevel: schemaLevelForField('manifestations.has_record.has_colour_type.keyword'),
      });

      const suspiciousManifestationTitlesResult = await esSearch(cfg, {
        size: 50,
        _source: [
          'handle',
          'has_record.has_primary_title.has_name',
          'has_record.described_by.has_source_key',
          'manifestations.handle',
          'manifestations.has_record.has_primary_title.has_name',
          'manifestations.has_record.described_by.has_source_key',
          'manifestations.has_record.described_by.has_issuer_name',
        ],
        query: {
          nested: {
            path: 'manifestations',
            query: {
              bool: {
                must: [
                  {
                    'query_string': {
                      'default_field': 'manifestations.has_record.has_primary_title.has_name',
                      query: '*test* OR *avefi* OR *demo* OR *dummy* OR *sample* OR *beispiel* OR *foo* OR *bar* OR *lorem* OR *ipsum*',
                    },
                  },
                ],
                'must_not': [
                  {
                    'query_string': {
                      'default_field': 'manifestations.has_record.described_by.has_source_key',
                      query: '*test* OR *demo* OR *dev* OR *sandbox* OR *staging* OR *mock*',
                    },
                  },
                  {
                    'query_string': {
                      'default_field': 'manifestations.has_record.described_by.has_issuer_name',
                      query: '*test* OR *demo* OR *dev* OR *sandbox* OR *staging* OR *mock*',
                    },
                  },
                ],
              },
            },
            'inner_hits': {
              size: 10,
              _source: [
                'manifestations.handle',
                'manifestations.has_record.has_primary_title.has_name',
                'manifestations.has_record.described_by.has_source_key',
                'manifestations.has_record.described_by.has_issuer_name',
              ],
            },
          },
        },
      });

      if (suspiciousManifestationTitlesResult.timed_out) {
        printLine('WARN: Suspicious manifestation titles query timed out.');
      }

      printSection('Manifestation suspicious titles in non-test sources');
      printLine(`Suspicious manifestation title root hits: ${suspiciousManifestationTitlesResult.hits.total.value}`);

      const manifestationsWithoutItemsResult = await esSearch(cfg, {
        size: 25,
        _source: [
          'handle',
          'has_record.has_primary_title.has_name',
          'has_record.described_by.has_source_key',
        ],
        query: {
          nested: {
            path: 'manifestations',
            query: {
              bool: {
                'must_not': [
                  {
                    nested: {
                      path: 'manifestations.items',
                      query: {
                        'match_all': {},
                      },
                    },
                  },
                ],
              },
            },
            'inner_hits': {
              size: 10,
              _source: [
                'manifestations.handle',
                'manifestations.has_record.has_primary_title.has_name',
                'manifestations.has_record.described_by.has_source_key',
                'manifestations.has_record.described_by.has_issuer_name',
              ],
            },
          },
        },
      });

      if (manifestationsWithoutItemsResult.timed_out) {
        printLine('WARN: Manifestations without items query timed out.');
      }

      printSection('Manifestations without items');
      printLine(`Root hits with at least one manifestation without items: ${manifestationsWithoutItemsResult.hits.total.value}`);

      const valueDistributionsResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              'sound_type_values': {
                terms: {
                  field: 'manifestations.has_record.has_sound_type.keyword',
                  size: 100,
                },
              },
              'colour_type_values': {
                terms: {
                  field: 'manifestations.has_record.has_colour_type.keyword',
                  size: 100,
                },
              },
            },
          },
        },
      });

      if (valueDistributionsResult.timed_out) {
        printLine('WARN: Manifestation value distributions query timed out.');
      }

      const valueAggs = ((valueDistributionsResult.aggregations ?? {}) as {
        manifestations?: Record<string, unknown>;
      }).manifestations;

      printSection('Manifestation value distributions');
      printTopTerms('Sound type values', toTopTerms(valueAggs?.sound_type_values, 20));
      printTopTerms('Colour type values', toTopTerms(valueAggs?.colour_type_values, 20));
    }
    catch (error) {
      printSection('Manifestation data-quality execution warning');
      printLine(`Query execution failed but report remains non-blocking: ${String(error)}`);
    }
  });
});
