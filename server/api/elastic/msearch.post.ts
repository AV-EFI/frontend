import Client from '@searchkit/api';
import { config } from '@/searchConfig_avefi';

export default defineEventHandler(async (event) => {
  const apiClient = Client(config, { debug: true });
  const body = await readBody(event);

  try {
    const response = await apiClient.searchkit.handleInstantSearchRequests(body, {
      hooks: {
        afterSearch: async (requests, responses) => responses,
        beforeSearch: async (searchRequests) => {
          return searchRequests.map((sr) => {
            const indexName = sr.indexName;

            const allParams = sr.request?.params || {};
            const indexParams =
              allParams[indexName] && typeof allParams[indexName] === 'object'
                ? allParams[indexName]
                : allParams;

            const numericFilters = indexParams['numeric-filters'] || [];
            const optionalFilters = indexParams?.['optional-filters'] || [];
            const filters = indexParams?.filters || {};

            const isFacetQuery = !!sr.body?.aggs;

            const includeMissingYearsCheckboxEnabled =
              indexParams?.[`${indexName}[includeMissingProductionYear]`] === '1' ||
              optionalFilters.includes('production_in_year IS NULL');

            const parsed = numericFilters.reduce((acc, expr) => {
              const [field, operator, value] = expr.trim().split(/\s+/);
              if (!field || !operator || !value) return acc;
              const normalizedField = field.replace('.gte', '').replace('.lte', '');
              acc[normalizedField] = acc[normalizedField] || {};
              if (operator === '>=') acc[normalizedField].gte = Number(value);
              if (operator === '<=') acc[normalizedField].lte = Number(value);
              if (operator === '>') acc[normalizedField].gt = Number(value);
              if (operator === '<') acc[normalizedField].lt = Number(value);
              return acc;
            }, {});

            const rangeFilters = Object.entries(parsed).map(([field, range]) => {
              if (field === 'production_in_year') {
                const shouldFilters = [
                  {
                    range: {
                      [field]: {
                        ...range,
                        relation: 'intersects'
                      }
                    }
                  }
                ];

                if (!includeMissingYearsCheckboxEnabled) {
                  shouldFilters.push({
                    bool: {
                      must_not: {
                        exists: { field }
                      }
                    }
                  });
                }

                return {
                  bool: {
                    should: shouldFilters,
                    minimum_should_match: 1
                  }
                };
              }

              return {
                range: {
                  [field]: range
                }
              };
            });

            const nestedFacetFieldMap = {
              in_language_code: {
                path: 'manifestations',
                field: 'manifestations.has_record.in_language.code.keyword'
              },
              has_sound_type: {
                path: 'manifestations',
                field: 'manifestations.has_record.has_sound_type.keyword'
              },
              has_colour_type: {
                path: 'manifestations',
                field: 'manifestations.has_record.has_colour_type.keyword'
              },
              has_duration_has_value: {
                path: 'manifestations',
                field: 'manifestations.has_record.has_duration.has_value.keyword'
              },
              has_issuer_name: {
                path: 'manifestations',
                field: 'manifestations.has_record.described_by.has_issuer_name.keyword'
              },
              has_format_type: {
                path: 'manifestations.items',
                field: 'manifestations.items.has_record.has_format.type.keyword'
              },
              item_element_type: {
                path: 'manifestations.items',
                field: 'manifestations.items.has_record.element_type.keyword'
              }
            };

            // Group all nested filters by path
            const nestedGroupedFilters = {};

            for (const [facetKey, values] of Object.entries(filters)) {
              const def = nestedFacetFieldMap[facetKey];
              if (!def || !Array.isArray(values) || values.length === 0) continue;

              if (!nestedGroupedFilters[def.path]) {
                nestedGroupedFilters[def.path] = [];
              }

              nestedGroupedFilters[def.path].push({
                terms: {
                  [def.field]: values
                }
              });
            }

            // Create exactly one nested clause per path
            const nestedFacetFilters = Object.entries(nestedGroupedFilters).map(([path, queries]) => {
              const clause = {
                path,
                query: {
                  bool: {
                    must: queries
                  }
                }
              };

              if (!isFacetQuery) {
                clause.inner_hits = {
                  name: `matching_${path.replace(/\./g, '_')}`,
                  _source: true
                };
              }

              return { nested: clause };
            });

            const existingFilters = sr.body.query?.bool?.filter || [];

            const updatedFilters = [
              ...(Array.isArray(existingFilters) ? existingFilters : [existingFilters]),
              ...rangeFilters,
              ...nestedFacetFilters
            ];

            // Remove all automatically injected inner_hits (from Searchkit or Algolia bridge)
            function stripExtraInnerHits(query) {
              if (typeof query !== 'object' || query === null) return;

              if (query.nested) {
                if (query.nested.inner_hits) {
                  delete query.nested.inner_hits;
                }
                if (query.nested.query) {
                  stripExtraInnerHits(query.nested.query);
                }
              }

              if (query.bool) {
                ['must', 'should', 'filter', 'must_not'].forEach((clause) => {
                  if (Array.isArray(query.bool[clause])) {
                    query.bool[clause].forEach(stripExtraInnerHits);
                  } else if (query.bool[clause]) {
                    stripExtraInnerHits(query.bool[clause]);
                  }
                });
              }
            }

            if (sr.body?.query) {
              stripExtraInnerHits(sr.body.query);
            }

            return {
              ...sr,
              body: {
                ...sr.body,
                query: {
                  bool: {
                    ...sr.body.query?.bool,
                    filter: updatedFilters
                  }
                }
              }
            };
          });
        }
      }
    });

    return response;
  } catch (ex) {
    console.error('[Search Error]', ex);
    return null;
  }
});
