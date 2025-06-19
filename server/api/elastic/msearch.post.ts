import Client from '@searchkit/api';
import { config } from '../../../searchConfig_avefi';

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

            const userQueryRaw = indexParams.query || '';
            const isQuoted = userQueryRaw.startsWith('"') && userQueryRaw.endsWith('"');
            const cleanQuery = isQuoted ? userQueryRaw.slice(1, -1).trim() : userQueryRaw;

            const facetFiltersRaw = indexParams['facetFilters'] || [];

            const extractValues = (prefix: string) =>
              facetFiltersRaw
                .flat()
                .filter((v: any) => typeof v === 'string' && v.startsWith(prefix))
                .map((v: string) => v.split(':')[1]);

            const hasColourTypeValues = extractValues('has_colour_type:');
            const hasSoundTypeValues = extractValues('has_sound_type:');
            const hasDurationValues = extractValues('has_duration_has_value:');
            const hasIssuerNameValues = extractValues('has_issuer_name:');
            const inLanguageCodeValues = extractValues('in_language_code:');
            const manifestationEventTypeValues = extractValues('manifestation_event_type:');
            const hasFormatTypeValues = extractValues('has_format_type:');
            const itemElementTypeValues = extractValues('item_element_type:');

            const manifestationMust: any[] = [];

            if (hasColourTypeValues.length > 0) {
              manifestationMust.push({
                terms: {
                  'manifestations.has_record.has_colour_type.keyword': hasColourTypeValues
                }
              });
            }

            if (hasSoundTypeValues.length > 0) {
              manifestationMust.push({
                terms: {
                  'manifestations.has_record.has_sound_type.keyword': hasSoundTypeValues
                }
              });
            }

            if (hasDurationValues.length > 0) {
              manifestationMust.push({
                terms: {
                  'manifestations.has_record.has_duration.has_value.keyword': hasDurationValues
                }
              });
            }

            if (hasIssuerNameValues.length > 0) {
              manifestationMust.push({
                terms: {
                  'manifestations.has_record.described_by.has_issuer_name.keyword': hasIssuerNameValues
                }
              });
            }

            if (inLanguageCodeValues.length > 0) {
              manifestationMust.push({
                terms: {
                  'manifestations.has_record.in_language.code.keyword': inLanguageCodeValues
                }
              });
            }

            if (manifestationEventTypeValues.length > 0) {
              manifestationMust.push({
                nested: {
                  path: 'manifestations.has_record.has_event',
                  query: {
                    terms: {
                      'manifestations.has_record.has_event.type.keyword': manifestationEventTypeValues
                    }
                  }
                }
              });
            }

            const itemsMust: any[] = [];

            if (hasFormatTypeValues.length > 0) {
              itemsMust.push({
                terms: {
                  'manifestations.items.has_record.has_format.type.keyword': hasFormatTypeValues
                }
              });
            }

            if (itemElementTypeValues.length > 0) {
              itemsMust.push({
                terms: {
                  'manifestations.items.has_record.element_type.keyword': itemElementTypeValues
                }
              });
            }

            if (itemsMust.length > 0) {
              manifestationMust.push({
                nested: {
                  path: 'manifestations.items',
                  query: {
                    bool: { must: itemsMust }
                  },
                  inner_hits: {
                    name: 'manifestations_items_hits',
                    size: 10,
                    _source: true
                  }
                }
              });
            }

            const finalNestedFilter =
              manifestationMust.length > 0
                ? [
                    {
                      nested: {
                        path: 'manifestations',
                        query: {
                          bool: { must: manifestationMust }
                        },
                        inner_hits: {
                          name: 'manifestations_hits',
                          size: 10,
                          _source: true
                        }
                      }
                    }
                  ]
                : [];

            const numericRefinements = indexParams['numeric-refinements'] || {};
            const range = numericRefinements['production_in_year'] || {};
            const rangeFilters = [];

            if (range['>='] !== undefined || range['<='] !== undefined) {
              const rangeQuery: any = {};
              if (range['>='] !== undefined) rangeQuery.gte = range['>='];
              if (range['<='] !== undefined) rangeQuery.lte = range['<='];
              rangeFilters.push({ range: { production_in_year: rangeQuery } });
            }

            const prodYearsOnlyActive = numericRefinements['prodYearsOnly']?.['='] === 1;
            const mustExistFilters = prodYearsOnlyActive
              ? [{ exists: { field: 'production_in_year' } }]
              : [];

            if (prodYearsOnlyActive) {
              delete numericRefinements['prodYearsOnly'];
            }

            const originalFilters = sr.body.query?.bool?.filter ?? [];

            const updatedFilters = [
              ...originalFilters,
              ...rangeFilters,
              ...mustExistFilters,
              ...finalNestedFilter
            ];

            const baseQuery = isQuoted
              ? [
                  {
                    wildcard: {
                      'has_record.has_primary_title.has_name.keyword': {
                        value: `*${cleanQuery}*`
                      }
                    }
                  },
                  {
                    multi_match: {
                      query: cleanQuery,
                      type: 'phrase',
                      fields: [
                        'has_record.has_primary_title.has_name^3',
                        'has_record.has_alternative_title.has_name',
                        'production',
                        'directors_or_editors',
                        'castmembers',
                        'subjects'
                      ]
                    }
                  }
                ]
              : [
                  {
                    multi_match: {
                      query: cleanQuery,
                      fields: [
                        'has_record.has_primary_title.has_name^3',
                        'has_record.has_alternative_title.has_name',
                        'production',
                        'directors_or_editors',
                        'castmembers',
                        'subjects'
                      ]
                    }
                  }
                ];

            const queryMustClause = cleanQuery
              ? [
                  {
                    bool: {
                      should: baseQuery
                    }
                  }
                ]
              : [];

            return {
              ...sr,
              body: {
                ...sr.body,
                query: {
                  bool: {
                    must: queryMustClause,
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
