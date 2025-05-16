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

    const filters = indexParams?.filters || {};
    const numericFilters = indexParams['numeric-filters'] || [];

    const parsedRanges = numericFilters.reduce((acc, expr) => {
      const [field, operator, value] = expr.trim().split(/\s+/);
      if (!field || !operator || !value) return acc;
      const base = field.replace('.gte', '').replace('.lte', '');
      acc[base] = acc[base] || {};
      if (operator === '>=') acc[base].gte = +value;
      if (operator === '<=') acc[base].lte = +value;
      return acc;
    }, {});

    const rangeFilters = Object.entries(parsedRanges).map(([field, range]) => ({
      range: { [field]: range }
    }));

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

    const nestedGrouped = {};
    for (const [facetKey, values] of Object.entries(filters)) {
      const def = nestedFacetFieldMap[facetKey];
      if (!def || !Array.isArray(values)) continue;
      nestedGrouped[def.path] ||= [];
      nestedGrouped[def.path].push({ terms: { [def.field]: values } });
    }

    // Ensure we don’t add more than one nested filter for the same path
    const nestedFilters = Object.entries(nestedGrouped).map(([path, musts]) => ({
      nested: {
        path,
        query: { bool: { must: musts } },
        inner_hits: {
          name: `matching_${path.replace(/\./g, '_')}`,
          _source: true
        }
      }
    }));

    const existingFilters = sr.body.query?.bool?.filter || [];
    const updatedFilters = [
      ...(Array.isArray(existingFilters) ? existingFilters : [existingFilters]),
      ...rangeFilters,
      ...nestedFilters
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
    });

    return response;
  } catch (ex) {
    console.error('[Search Error]', ex);
    return null;
  }
});
