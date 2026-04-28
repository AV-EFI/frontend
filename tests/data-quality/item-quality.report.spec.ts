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

describe('Elasticsearch data-quality report: item level', () => {
  it('prints item-level completeness, suspicious titles, and value distributions', async () => {
    try {
      const cfg = getEsAuditConfig();

      if (!cfg) {
        printLine('Skipping item data-quality report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
        return;
      }

      const itemCompletenessResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: {
              path: 'manifestations',
            },
            aggs: {
              items: {
                nested: {
                  path: 'manifestations.items',
                },
                aggs: {
                  missing_item_title: {
                    missing: {
                      field: 'manifestations.items.has_record.has_primary_title.has_name.keyword',
                    },
                  },
                  missing_item_handle: {
                    missing: {
                      field: 'manifestations.items.handle.keyword',
                    },
                  },
                  missing_item_kip: {
                    missing: {
                      field: 'manifestations.items.kip.keyword',
                    },
                  },
                  missing_item_url: {
                    missing: {
                      field: 'manifestations.items.url.keyword',
                    },
                  },
                  missing_item_issuer: {
                    missing: {
                      field: 'manifestations.items.has_record.described_by.has_issuer_name.keyword',
                    },
                  },
                  missing_item_source_key: {
                    missing: {
                      field: 'manifestations.items.has_record.described_by.has_source_key.keyword',
                    },
                  },
                  missing_access_status: {
                    missing: {
                      field: 'manifestations.items.has_record.has_access_status.keyword',
                    },
                  },
                  missing_element_type: {
                    missing: {
                      field: 'manifestations.items.has_record.element_type.keyword',
                    },
                  },
                  missing_language_code: {
                    missing: {
                      field: 'manifestations.items.has_record.in_language.code.keyword',
                    },
                  },
                  missing_is_item_of: {
                    missing: {
                      field: 'manifestations.items.has_record.is_item_of.id.keyword',
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (itemCompletenessResult.timed_out) {
        printLine('WARN: Item completeness query timed out.');
      }

      const itemAggs = ((itemCompletenessResult.aggregations ?? {}) as {
      manifestations?: {
        items?: Record<string, { doc_count: number }>;
      };
    }).manifestations?.items;

      const totalItems = itemAggs?.doc_count ?? 0;

      printSection('Item completeness overview');
      printLine(`Total items: ${totalItems}`);
      printMetric({ label: 'Missing item title',       value: itemAggs?.missing_item_title?.doc_count ?? 0,   total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.has_record.has_primary_title.has_name.keyword') });
      printMetric({ label: 'Missing item handle',      value: itemAggs?.missing_item_handle?.doc_count ?? 0,  total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.handle.keyword') });
      printMetric({ label: 'Missing item kip',         value: itemAggs?.missing_item_kip?.doc_count ?? 0,     total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.kip.keyword') });
      printMetric({ label: 'Missing item url',         value: itemAggs?.missing_item_url?.doc_count ?? 0,     total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.url.keyword') });
      printMetric({ label: 'Missing item issuer',      value: itemAggs?.missing_item_issuer?.doc_count ?? 0,  total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.has_record.described_by.has_issuer_name.keyword') });
      printMetric({ label: 'Missing item source key',  value: itemAggs?.missing_item_source_key?.doc_count ?? 0, total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.has_record.described_by.has_source_key.keyword') });
      printMetric({
        label: 'Missing item access status',
        value: itemAggs?.missing_access_status?.doc_count ?? 0,
        total: totalItems,
        warnThreshold: thresholds.maxMissingItemAccessStatusPctWarn,
        schemaLevel: schemaLevelForField('manifestations.items.has_record.has_access_status.keyword'),
      });
      printMetric({ label: 'Missing item element type', value: itemAggs?.missing_element_type?.doc_count ?? 0, total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.has_record.element_type.keyword') });
      printMetric({
        label: 'Missing item language code',
        value: itemAggs?.missing_language_code?.doc_count ?? 0,
        total: totalItems,
        warnThreshold: thresholds.maxMissingItemLanguagePctWarn,
        schemaLevel: schemaLevelForField('manifestations.items.has_record.in_language.code.keyword'),
      });
      printMetric({ label: 'Missing item is_item_of.id', value: itemAggs?.missing_is_item_of?.doc_count ?? 0, total: totalItems, schemaLevel: schemaLevelForField('manifestations.items.has_record.is_item_of.id.keyword') });

      const suspiciousItemTitlesResult = await esSearch(cfg, {
        size: 50,
        _source: [
          'handle',
          'has_record.has_primary_title.has_name',
        ],
        query: {
          nested: {
            path: 'manifestations',
            query: {
              nested: {
                path: 'manifestations.items',
                query: {
                  bool: {
                    must: [
                      {
                        query_string: {
                          default_field: 'manifestations.items.has_record.has_primary_title.has_name',
                          query: '*test* OR *avefi* OR *demo* OR *dummy* OR *sample* OR *beispiel* OR *foo* OR *bar* OR *lorem* OR *ipsum*',
                        },
                      },
                    ],
                    must_not: [
                      {
                        query_string: {
                          default_field: 'manifestations.items.has_record.described_by.has_source_key',
                          query: '*test* OR *demo* OR *dev* OR *sandbox* OR *staging* OR *mock*',
                        },
                      },
                      {
                        query_string: {
                          default_field: 'manifestations.items.has_record.described_by.has_issuer_name',
                          query: '*test* OR *demo* OR *dev* OR *sandbox* OR *staging* OR *mock*',
                        },
                      },
                    ],
                  },
                },
                inner_hits: {
                  size: 10,
                  _source: [
                    'manifestations.items.handle',
                    'manifestations.items.kip',
                    'manifestations.items.url',
                    'manifestations.items.has_record.has_primary_title.has_name',
                    'manifestations.items.has_record.described_by.has_source_key',
                    'manifestations.items.has_record.described_by.has_issuer_name',
                  ],
                },
              },
            },
          },
        },
      });

      if (suspiciousItemTitlesResult.timed_out) {
        printLine('WARN: Suspicious item titles query timed out.');
      }

      printSection('Item suspicious titles in non-test sources');
      printLine(`Suspicious item title root hits: ${suspiciousItemTitlesResult.hits.total.value}`);

      const distributionsResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: {
              path: 'manifestations',
            },
            aggs: {
              items: {
                nested: {
                  path: 'manifestations.items',
                },
                aggs: {
                  access_status_values: {
                    terms: {
                      field: 'manifestations.items.has_record.has_access_status.keyword',
                      size: 100,
                    },
                  },
                  element_type_values: {
                    terms: {
                      field: 'manifestations.items.has_record.element_type.keyword',
                      size: 100,
                    },
                  },
                  language_codes: {
                    terms: {
                      field: 'manifestations.items.has_record.in_language.code.keyword',
                      size: 100,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (distributionsResult.timed_out) {
        printLine('WARN: Item distributions query timed out.');
      }

      const distributionAggs = ((distributionsResult.aggregations ?? {}) as {
      manifestations?: {
        items?: Record<string, unknown>;
      };
    }).manifestations?.items;

      printSection('Item value distributions');
      printTopTerms('Access status values', toTopTerms(distributionAggs?.access_status_values, 20));
      printTopTerms('Element type values', toTopTerms(distributionAggs?.element_type_values, 20));
      printTopTerms('Language codes', toTopTerms(distributionAggs?.language_codes, 20));
    }
    catch (error) {
      printSection('Item data-quality execution warning');
      printLine(`Query execution failed but report remains non-blocking: ${String(error)}`);
    }
  });
});
