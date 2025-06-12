import Client from '@searchkit/api'
import { config } from '../../../searchConfig_avefi';

export default defineEventHandler(async (event) => {
  const apiClient = Client(config, { debug: true });
  const body = await readBody(event)

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
        
            const facetFiltersRaw = indexParams['facetFilters'] || [];
        
            // Top-level filters
            const hasColourTypeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_colour_type:'))
              .map((v: string) => v.split(':')[1]);
        
            const hasSoundTypeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_sound_type:'))
              .map((v: string) => v.split(':')[1]);
        
            const hasDurationValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_duration_has_value:'))
              .map((v: string) => v.split(':')[1]);
        
            const hasIssuerNameValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_issuer_name:'))
              .map((v: string) => v.split(':')[1]);
        
            const inLanguageCodeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('in_language_code:'))
              .map((v: string) => v.split(':')[1]);
        
            // Items-level filters
            const hasFormatTypeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_format_type:'))
              .map((v: string) => v.split(':')[1]);
        
            const itemElementTypeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('item_element_type:'))
              .map((v: string) => v.split(':')[1]);
        
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
        
            // Combine items-level filters into one nested clause
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
        
            const finalNestedFilter = manifestationMust.length > 0
              ? [{
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
                }]
              : [];
        
            // Numeric refinements
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
        
            const existingFilters = Array.isArray(sr.body.query?.bool?.filter)
              ? sr.body.query.bool.filter
              : [];
        
            const updatedFilters = [
              ...existingFilters,
              ...rangeFilters,
              ...mustExistFilters,
              ...finalNestedFilter
            ];
        
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
    })

    return response;

  } catch (ex) {
    console.error('[Search Error]', ex);
    return null;
  }
});
