import Client from '@searchkit/api'
import { config } from '@/searchConfig_avefi'

export default defineEventHandler(async (event) => {
  const apiClient = Client(config, { debug: true })
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
        
            // Extract filter values
            const hasColourTypeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_colour_type:'))
              .map((v: string) => v.split(':')[1]);
        
            const hasFormatTypeValues = facetFiltersRaw
              .flat()
              .filter((v: any) => typeof v === 'string' && v.startsWith('has_format_type:'))
              .map((v: string) => v.split(':')[1]);
        
            // Build nested filters inside manifestations
            const manifestationMust: any[] = [];
        
            if (hasColourTypeValues.length > 0) {
              manifestationMust.push({
                terms: { 'manifestations.has_record.has_colour_type.keyword': hasColourTypeValues }
              });
            }
        
            if (hasFormatTypeValues.length > 0) {
              manifestationMust.push({
                nested: {
                  path: 'manifestations.items',
                  query: {
                    terms: { 'manifestations.items.has_record.has_format.type.keyword': hasFormatTypeValues }
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

    return response
  } catch (ex) {
    console.error('[Search Error]', ex)
    return null
  }
});
