import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it } from 'vitest';
import { esGetIndexMapping, esSearch, getEsAuditConfig } from './es-client';
import { formatPct, pct, printLine, printMetric, printSection, printTopTerms, toTopTerms } from './report-utils';

interface DataQualitySnapshot {
  generatedAt: string;
  totalRootDocs: number;
  missingRootSourceKeyPct: number;
  missingRootSameAsPct: number;
  suspiciousRootTitleCount: number;
  duplicateHandleBuckets: number;
  duplicateSameAsBuckets: number;
}

function toBucketRecordArray(value: unknown): Array<Record<string, unknown>> {
  const buckets = (value as { buckets?: Array<Record<string, unknown>> } | undefined)?.buckets;
  return Array.isArray(buckets) ? buckets : [];
}

function safeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function sumDocCount(buckets: Array<{ key: string; doc_count: number }>, keys: Set<string>): number {
  return buckets
    .filter((bucket) => keys.has(bucket.key.toLowerCase()))
    .reduce((acc, bucket) => acc + bucket.doc_count, 0);
}

function runSectionHeader(title: string): void {
  printSection(title);
}

function formatDelta(current: number, previous: number): string {
  const delta = current - previous;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(4)}`;
}

function hasMappingPath(mappingProps: Record<string, unknown> | undefined, path: string): boolean {
  if (!mappingProps) {
    return false;
  }

  const parts = path.split('.');
  let current: Record<string, unknown> | undefined = mappingProps;

  for (const part of parts) {
    const field = current?.[part] as Record<string, unknown> | undefined;
    if (!field) {
      return false;
    }

    const nestedProps = field.properties as Record<string, unknown> | undefined;
    const keywordFields = field.fields as Record<string, unknown> | undefined;

    current = nestedProps ?? keywordFields;
  }

  return true;
}

describe('Elasticsearch data-quality report: advanced heuristics', () => {
  it('prints advanced non-blocking quality statistics and trend deltas', async () => {
    const cfg = getEsAuditConfig();

    if (!cfg) {
      printLine('Skipping advanced data-quality report. Missing ES_BASE_URL/ELASTIC_HOST* or ES_INDEX/ELASTIC_INDEX.');
      return;
    }

    const snapshotPath = resolve(process.cwd(), 'logs', 'data-quality', 'quality-snapshot.json');

    let totalRootDocs = 0;
    let missingRootSourceKeyPct = 0;
    let missingRootSameAsPct = 0;
    let suspiciousRootTitleCount = 0;
    let duplicateHandleBuckets = 0;
    let duplicateSameAsBuckets = 0;

    runSectionHeader('Referential integrity heuristics');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          root_handle_count: { cardinality: { field: 'handle.keyword' } },
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              manifestation_of_id_count: {
                cardinality: { field: 'manifestations.has_record.is_manifestation_of.id.keyword' },
              },
              manifestation_link_missing: {
                missing: { field: 'manifestations.has_record.is_manifestation_of.id.keyword' },
              },
              items: {
                nested: { path: 'manifestations.items' },
                aggs: {
                  item_of_id_count: {
                    cardinality: { field: 'manifestations.items.has_record.is_item_of.id.keyword' },
                  },
                  item_link_missing: {
                    missing: { field: 'manifestations.items.has_record.is_item_of.id.keyword' },
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Referential integrity query timed out.');
      }

      const aggs = result.aggregations as Record<string, unknown> | undefined;
      const manifestations = aggs?.manifestations as Record<string, unknown> | undefined;
      const items = manifestations?.items as Record<string, unknown> | undefined;

      const rootHandleCount = safeNumber((aggs?.root_handle_count as { value?: number } | undefined)?.value);
      const manifestationOfIdCount = safeNumber((manifestations?.manifestation_of_id_count as { value?: number } | undefined)?.value);
      const itemOfIdCount = safeNumber((items?.item_of_id_count as { value?: number } | undefined)?.value);
      const manifestationLinkMissing = safeNumber((manifestations?.manifestation_link_missing as { doc_count?: number } | undefined)?.doc_count);
      const itemLinkMissing = safeNumber((items?.item_link_missing as { doc_count?: number } | undefined)?.doc_count);
      const manifestationTotal = safeNumber(manifestations?.doc_count);
      const itemTotal = safeNumber(items?.doc_count);

      printLine(`Root unique handle count: ${rootHandleCount}`);
      printLine(`Manifestation unique is_manifestation_of.id count: ${manifestationOfIdCount}`);
      printLine(`Item unique is_item_of.id count: ${itemOfIdCount}`);
      printMetric({
        label: 'Missing manifestation parent links',
        value: manifestationLinkMissing,
        total: manifestationTotal,
        warnThreshold: 0.01,
      });
      printMetric({
        label: 'Missing item parent links',
        value: itemLinkMissing,
        total: itemTotal,
        warnThreshold: 0.01,
      });
    }
    catch (error) {
      printLine(`WARN: Referential integrity section failed: ${String(error)}`);
    }

    runSectionHeader('Controlled vocabulary conformance');
    try {
      const allowedAccessStatus = new Set(['master', 'distribution', 'viewing', 'archive']);
      const allowedElementType = new Set([
        'positive', 'negative', 'imagenegative', 'duplicatenegative', 'originalnegative', 'subtitles',
        'editdecisionlist', 'soundnegative', 'dcdm', 'dcp', 'duplicatepositive',
      ]);
      const allowedSoundType = new Set(['silent', 'sound']);
      const allowedColourType = new Set(['blackandwhite', 'colour', 'color']);

      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              sound_type_values: {
                terms: { field: 'manifestations.has_record.has_sound_type.keyword', size: 100 },
              },
              colour_type_values: {
                terms: { field: 'manifestations.has_record.has_colour_type.keyword', size: 100 },
              },
              items: {
                nested: { path: 'manifestations.items' },
                aggs: {
                  access_status_values: {
                    terms: { field: 'manifestations.items.has_record.has_access_status.keyword', size: 100 },
                  },
                  element_type_values: {
                    terms: { field: 'manifestations.items.has_record.element_type.keyword', size: 100 },
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Vocabulary conformance query timed out.');
      }

      const manifestations = ((result.aggregations ?? {}) as { manifestations?: Record<string, unknown> }).manifestations;
      const items = manifestations?.items as Record<string, unknown> | undefined;

      const accessBuckets = toTopTerms(items?.access_status_values, 100);
      const elementBuckets = toTopTerms(items?.element_type_values, 100);
      const soundBuckets = toTopTerms(manifestations?.sound_type_values, 100);
      const colourBuckets = toTopTerms(manifestations?.colour_type_values, 100);

      const unknownAccess = accessBuckets.filter((bucket) => !allowedAccessStatus.has(bucket.key.toLowerCase()));
      const unknownElement = elementBuckets.filter((bucket) => !allowedElementType.has(bucket.key.toLowerCase()));
      const unknownSound = soundBuckets.filter((bucket) => !allowedSoundType.has(bucket.key.toLowerCase()));
      const unknownColour = colourBuckets.filter((bucket) => !allowedColourType.has(bucket.key.toLowerCase()));

      printTopTerms('Unknown access_status values', unknownAccess.slice(0, 20));
      printTopTerms('Unknown element_type values', unknownElement.slice(0, 20));
      printTopTerms('Unknown manifestation sound types', unknownSound.slice(0, 20));
      printTopTerms('Unknown manifestation colour types', unknownColour.slice(0, 20));
    }
    catch (error) {
      printLine(`WARN: Controlled vocabulary section failed: ${String(error)}`);
    }

    runSectionHeader('Identifier and URL format checks');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          invalid_root_url_scheme: {
            filter: {
              bool: {
                must: [{ exists: { field: 'url.keyword' } }],
                must_not: [{ wildcard: { 'url.keyword': 'http*' } }],
              },
            },
          },
          whitespace_in_handle: {
            filter: {
              regexp: { 'handle.keyword': '.*\\s+.*' },
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
        },
      });

      if (result.timed_out) {
        printLine('WARN: Identifier format query timed out.');
      }

      const aggs = (result.aggregations ?? {}) as Record<string, { doc_count?: number }>;
      printLine(`Root URLs with non-http scheme: ${safeNumber(aggs.invalid_root_url_scheme?.doc_count)}`);
      printLine(`Handles containing whitespace: ${safeNumber(aggs.whitespace_in_handle?.doc_count)}`);
      printLine(`Potentially malformed same_as.id values: ${safeNumber(aggs.malformed_same_as_id?.doc_count)}`);
    }
    catch (error) {
      printLine(`WARN: Identifier format section failed: ${String(error)}`);
    }

    runSectionHeader('Cross-field consistency checks');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          source_present_issuer_missing_root: {
            filter: {
              bool: {
                must: [{ exists: { field: 'has_record.described_by.has_source_key.keyword' } }],
                must_not: [{ exists: { field: 'has_record.described_by.has_issuer_name.keyword' } }],
              },
            },
          },
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              source_present_issuer_missing_manifestation: {
                filter: {
                  bool: {
                    must: [{ exists: { field: 'manifestations.has_record.described_by.has_source_key.keyword' } }],
                    must_not: [{ exists: { field: 'manifestations.has_record.described_by.has_issuer_name.keyword' } }],
                  },
                },
              },
              items: {
                nested: { path: 'manifestations.items' },
                aggs: {
                  access_status_present_element_type_missing: {
                    filter: {
                      bool: {
                        must: [{ exists: { field: 'manifestations.items.has_record.has_access_status.keyword' } }],
                        must_not: [{ exists: { field: 'manifestations.items.has_record.element_type.keyword' } }],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Cross-field consistency query timed out.');
      }

      const aggs = (result.aggregations ?? {}) as Record<string, unknown>;
      const manifestations = aggs.manifestations as Record<string, unknown> | undefined;
      const items = manifestations?.items as Record<string, unknown> | undefined;

      printLine(`Root records with source key but missing issuer: ${safeNumber((aggs.source_present_issuer_missing_root as { doc_count?: number } | undefined)?.doc_count)}`);
      printLine(`Manifestations with source key but missing issuer: ${safeNumber((manifestations?.source_present_issuer_missing_manifestation as { doc_count?: number } | undefined)?.doc_count)}`);
      printLine(`Items with access status but missing element type: ${safeNumber((items?.access_status_present_element_type_missing as { doc_count?: number } | undefined)?.doc_count)}`);
    }
    catch (error) {
      printLine(`WARN: Cross-field consistency section failed: ${String(error)}`);
    }

    runSectionHeader('Language harmonization checks');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              items: {
                nested: { path: 'manifestations.items' },
                aggs: {
                  language_codes: {
                    terms: { field: 'manifestations.items.has_record.in_language.code.keyword', size: 200 },
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Language harmonization query timed out.');
      }

      const languageBuckets = toTopTerms(((result.aggregations as { manifestations?: { items?: Record<string, unknown> } } | undefined)?.manifestations?.items as Record<string, unknown> | undefined)?.language_codes, 200);

      const legacyCodes = new Set(['ger', 'fre', 'cze', 'chi', 'rum', 'gre']);
      const canonicalMap: Record<string, string> = {
        ger: 'deu',
        fre: 'fra',
        cze: 'ces',
        chi: 'zho',
        rum: 'ron',
        gre: 'ell',
      };

      const legacyCount = sumDocCount(languageBuckets, legacyCodes);
      const total = languageBuckets.reduce((acc, bucket) => acc + bucket.doc_count, 0);

      printMetric({ label: 'Legacy language-code share', value: legacyCount, total, warnThreshold: 0.01 });

      for (const [legacy, canonical] of Object.entries(canonicalMap)) {
        const legacyDocs = languageBuckets.find((bucket) => bucket.key.toLowerCase() === legacy)?.doc_count ?? 0;
        const canonicalDocs = languageBuckets.find((bucket) => bucket.key.toLowerCase() === canonical)?.doc_count ?? 0;
        if (legacyDocs > 0 || canonicalDocs > 0) {
          printLine(`Language pair ${legacy}/${canonical}: legacy=${legacyDocs}, canonical=${canonicalDocs}`);
        }
      }
    }
    catch (error) {
      printLine(`WARN: Language harmonization section failed: ${String(error)}`);
    }

    runSectionHeader('Source-level anomaly heuristics');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          by_source: {
            terms: {
              field: 'has_record.described_by.has_source_key.keyword',
              size: 500,
              missing: '__MISSING_SOURCE_KEY__',
            },
            aggs: {
              missing_same_as: {
                filter: {
                  bool: {
                    must_not: [{ exists: { field: 'has_record.same_as.id.keyword' } }],
                  },
                },
              },
              suspicious_titles: {
                filter: {
                  bool: {
                    must: [{ query_string: { default_field: 'has_record.has_primary_title.has_name', query: '*test* OR *dummy* OR *sample* OR *untitled* OR *tbd* OR *na*' } }],
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Source-level anomaly query timed out.');
      }

      const sourceBuckets = toBucketRecordArray((result.aggregations as { by_source?: unknown }).by_source)
        .map((bucket) => {
          const docs = safeNumber(bucket.doc_count);
          const missingSameAs = safeNumber((bucket.missing_same_as as { doc_count?: number } | undefined)?.doc_count);
          const suspiciousTitles = safeNumber((bucket.suspicious_titles as { doc_count?: number } | undefined)?.doc_count);
          return {
            key: String(bucket.key),
            doc_count: docs,
            missingSameAsRatio: pct(missingSameAs, docs),
            suspiciousTitleRatio: pct(suspiciousTitles, docs),
          };
        })
        .filter((bucket) => bucket.doc_count >= 25)
        .sort((a, b) => b.missingSameAsRatio - a.missingSameAsRatio)
        .slice(0, 15);

      for (const bucket of sourceBuckets) {
        printLine(
          `Source ${bucket.key}: docs=${bucket.doc_count}, missing same_as=${formatPct(bucket.missingSameAsRatio)}, suspicious titles=${formatPct(bucket.suspiciousTitleRatio)}`,
        );
      }
    }
    catch (error) {
      printLine(`WARN: Source-level anomaly section failed: ${String(error)}`);
    }

    runSectionHeader('Structural depth and cardinality heuristics');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              manifestations_per_root: {
                terms: {
                  field: 'manifestations.has_record.is_manifestation_of.id.keyword',
                  min_doc_count: 10,
                  size: 20,
                },
              },
              items: {
                nested: { path: 'manifestations.items' },
                aggs: {
                  items_per_manifestation: {
                    terms: {
                      field: 'manifestations.items.has_record.is_item_of.id.keyword',
                      min_doc_count: 20,
                      size: 20,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Structural heuristics query timed out.');
      }

      const manifestations = ((result.aggregations ?? {}) as { manifestations?: Record<string, unknown> }).manifestations;
      printTopTerms('Roots with high manifestation counts (heuristic)', toTopTerms(manifestations?.manifestations_per_root, 20));
      printTopTerms('Manifestations with high item counts (heuristic)', toTopTerms((manifestations?.items as Record<string, unknown> | undefined)?.items_per_manifestation, 20));
    }
    catch (error) {
      printLine(`WARN: Structural depth section failed: ${String(error)}`);
    }

    runSectionHeader('Near-duplicate title heuristics');
    try {
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          duplicate_titles: {
            terms: {
              field: 'has_record.has_primary_title.has_name.keyword',
              min_doc_count: 2,
              size: 50,
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Near-duplicate title query timed out.');
      }

      printTopTerms('Potential duplicate root titles', toTopTerms((result.aggregations as { duplicate_titles?: unknown } | undefined)?.duplicate_titles, 20));
    }
    catch (error) {
      printLine(`WARN: Near-duplicate section failed: ${String(error)}`);
    }

    runSectionHeader('Text quality placeholder heuristics');
    try {
      const placeholderQuery = '*test* OR *dummy* OR *sample* OR *untitled* OR *tbd* OR *na* OR *lorem* OR *ipsum*';
      const result = await esSearch(cfg, {
        size: 0,
        aggs: {
          root_placeholder_title: {
            filter: {
              query_string: {
                default_field: 'has_record.has_primary_title.has_name',
                query: placeholderQuery,
              },
            },
          },
          manifestations: {
            nested: { path: 'manifestations' },
            aggs: {
              manifestation_placeholder_title: {
                filter: {
                  query_string: {
                    default_field: 'manifestations.has_record.has_primary_title.has_name',
                    query: placeholderQuery,
                  },
                },
              },
              items: {
                nested: { path: 'manifestations.items' },
                aggs: {
                  item_placeholder_title: {
                    filter: {
                      query_string: {
                        default_field: 'manifestations.items.has_record.has_primary_title.has_name',
                        query: placeholderQuery,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (result.timed_out) {
        printLine('WARN: Text-quality placeholder query timed out.');
      }

      const aggs = (result.aggregations ?? {}) as Record<string, unknown>;
      const manifestations = aggs.manifestations as Record<string, unknown> | undefined;
      const items = manifestations?.items as Record<string, unknown> | undefined;

      printLine(`Root placeholders: ${safeNumber((aggs.root_placeholder_title as { doc_count?: number } | undefined)?.doc_count)}`);
      printLine(`Manifestation placeholders: ${safeNumber((manifestations?.manifestation_placeholder_title as { doc_count?: number } | undefined)?.doc_count)}`);
      printLine(`Item placeholders: ${safeNumber((items?.item_placeholder_title as { doc_count?: number } | undefined)?.doc_count)}`);
    }
    catch (error) {
      printLine(`WARN: Text-quality section failed: ${String(error)}`);
    }

    runSectionHeader('Mapping/schema drift checks');
    try {
      const mapping = await esGetIndexMapping(cfg);
      const indexMappingRoot = Object.values(mapping)[0] as { mappings?: { properties?: Record<string, unknown> } } | undefined;
      const props = indexMappingRoot?.mappings?.properties;

      const requiredPaths = [
        'handle.keyword',
        'kip.keyword',
        'url.keyword',
        'has_record.same_as.id.keyword',
        'has_record.described_by.has_source_key.keyword',
        'manifestations.has_record.is_manifestation_of.id.keyword',
        'manifestations.items.has_record.is_item_of.id.keyword',
      ];

      const missingPaths = requiredPaths.filter((path) => !hasMappingPath(props, path));
      if (missingPaths.length === 0) {
        printLine('Mapping drift check: all required paths were found.');
      }
      else {
        printLine(`Mapping drift check: missing ${missingPaths.length} expected paths.`);
        for (const path of missingPaths) {
          printLine(`Missing mapping path: ${path}`);
        }
      }
    }
    catch (error) {
      printLine(`WARN: Mapping drift section failed: ${String(error)}`);
    }

    runSectionHeader('Trend snapshot and deltas');
    try {
      const baselineResult = await esSearch(cfg, {
        size: 0,
        aggs: {
          missing_root_source_key: {
            missing: { field: 'has_record.described_by.has_source_key.keyword' },
          },
          missing_root_same_as_id: {
            missing: { field: 'has_record.same_as.id.keyword' },
          },
          duplicate_handles: {
            terms: { field: 'handle.keyword', min_doc_count: 2, size: 200 },
          },
          duplicate_same_as_ids: {
            terms: { field: 'has_record.same_as.id.keyword', min_doc_count: 2, size: 200 },
          },
        },
      });

      if (baselineResult.timed_out) {
        printLine('WARN: Trend baseline query timed out.');
      }

      totalRootDocs = baselineResult.hits.total.value;
      const baselineAggs = baselineResult.aggregations as Record<string, unknown> | undefined;
      const missingRootSource = safeNumber((baselineAggs?.missing_root_source_key as { doc_count?: number } | undefined)?.doc_count);
      const missingRootSameAs = safeNumber((baselineAggs?.missing_root_same_as_id as { doc_count?: number } | undefined)?.doc_count);
      duplicateHandleBuckets = toTopTerms(baselineAggs?.duplicate_handles, 200).length;
      duplicateSameAsBuckets = toTopTerms(baselineAggs?.duplicate_same_as_ids, 200).length;

      missingRootSourceKeyPct = pct(missingRootSource, totalRootDocs);
      missingRootSameAsPct = pct(missingRootSameAs, totalRootDocs);

      const suspiciousResult = await esSearch(cfg, {
        size: 0,
        query: {
          bool: {
            must: [
              {
                query_string: {
                  default_field: 'has_record.has_primary_title.has_name',
                  query: '*test* OR *dummy* OR *sample* OR *untitled* OR *tbd* OR *na* OR *lorem* OR *ipsum*',
                },
              },
            ],
          },
        },
      });

      suspiciousRootTitleCount = suspiciousResult.hits.total.value;

      const currentSnapshot: DataQualitySnapshot = {
        generatedAt: new Date().toISOString(),
        totalRootDocs,
        missingRootSourceKeyPct,
        missingRootSameAsPct,
        suspiciousRootTitleCount,
        duplicateHandleBuckets,
        duplicateSameAsBuckets,
      };

      let previousSnapshot: DataQualitySnapshot | null = null;
      if (existsSync(snapshotPath)) {
        const raw = readFileSync(snapshotPath, 'utf8');
        previousSnapshot = JSON.parse(raw) as DataQualitySnapshot;
      }

      writeFileSync(snapshotPath, JSON.stringify(currentSnapshot, null, 2), 'utf8');

      printLine(`Snapshot saved to logs/data-quality/quality-snapshot.json at ${currentSnapshot.generatedAt}`);

      if (!previousSnapshot) {
        printLine('No previous snapshot found. Delta report will be available from the next run.');
      }
      else {
        printLine(`Delta total root docs: ${formatDelta(currentSnapshot.totalRootDocs, previousSnapshot.totalRootDocs)}`);
        printLine(`Delta missing root source key pct: ${formatDelta(currentSnapshot.missingRootSourceKeyPct, previousSnapshot.missingRootSourceKeyPct)}`);
        printLine(`Delta missing root same_as.id pct: ${formatDelta(currentSnapshot.missingRootSameAsPct, previousSnapshot.missingRootSameAsPct)}`);
        printLine(`Delta suspicious root title count: ${formatDelta(currentSnapshot.suspiciousRootTitleCount, previousSnapshot.suspiciousRootTitleCount)}`);
        printLine(`Delta duplicate handle buckets: ${formatDelta(currentSnapshot.duplicateHandleBuckets, previousSnapshot.duplicateHandleBuckets)}`);
        printLine(`Delta duplicate same_as.id buckets: ${formatDelta(currentSnapshot.duplicateSameAsBuckets, previousSnapshot.duplicateSameAsBuckets)}`);
      }
    }
    catch (error) {
      printLine(`WARN: Trend snapshot section failed: ${String(error)}`);
    }
  });
});
