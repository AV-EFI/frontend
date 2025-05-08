import Client from '@searchkit/api';
import {config} from '@/searchConfig_avefi';

const crushObj = (obj:any = {}) => Object.keys(obj || {}).reduce((acc:any, cur:any) => {
    if (typeof obj[cur] === 'object') {
        acc = { ...acc, ...crushObj(obj[cur])};
    } else { acc[cur] = obj[cur]; }
    return acc;
}, {});

export default defineEventHandler(async (event) => {

    const apiClient = Client(config, {debug: true});
    const body = await readBody(event);
    try {
        const response = await apiClient.searchkit.handleInstantSearchRequests(body, {            
            hooks: {
                afterSearch: async (requests, responses) => {
                    return responses;
                },
                beforeSearch: async (searchRequests) => {
                    return searchRequests.map((sr) => {
                        const indexName = sr.indexName;

                        console.log('[DEBUG] Search request:', JSON.stringify(sr, null, 2));

                        // 1. Handle both multi-index and flat routing formats
                        const allParams = sr.request?.params || {};
                        const indexParams =
      allParams[indexName] && typeof allParams[indexName] === 'object'
          ? allParams[indexName] // Multi-index format
          : allParams;           // Flat/simple format

                        const numericFilters = indexParams['numeric-filters'] || [];
                        const query = indexParams.query || '';

                        console.log('[DEBUG] Routing params:', JSON.stringify(indexParams, null, 2));

                        // 2. Parse numeric filters like "production_year_start >= 1850"
                        const parsed = numericFilters.reduce((acc: any, expr: string) => {
                            const [field, operator, value] = expr.trim().split(/\s+/);
                            if (!field || !operator || !value) return acc;
                            acc[field] = acc[field] || {};
                            if (operator === '>=') acc[field].gte = Number(value);
                            if (operator === '<=') acc[field].lte = Number(value);
                            if (operator === '>') acc[field].gt = Number(value);
                            if (operator === '<') acc[field].lt = Number(value);
                            return acc;
                        }, {});

                        const rangeFilters = Object.entries(parsed).map(([field, range]) => ({
                            range: { [field]: range }
                        }));

                        const existingFilters = sr.body.query?.bool?.filter || [];

                        const updatedFilters = [
                            ...(Array.isArray(existingFilters) ? existingFilters : [existingFilters]),
                            ...rangeFilters
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
            },
        });
        return response;
    }
    catch (ex) {
        console.log(ex);
        return null;
    }
});

