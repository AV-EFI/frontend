/*
export default defineEventHandler(async (event) => {
    const documentId = getQuery(event).documentId;

    if (!documentId) {
        return { error: 'documentId is required' };
    }

    const elasticsearchClient = useElasticsearchClient();
    const result = await elasticsearchClient.get({
        index: 'your-index-name',
        id: documentId,
    });

    return result._source || { error: 'Document not found' };
    //const cache = useStorage('cache');
    //const data = await cache.getItem((useRuntimeConfig().public.WMI_CACHE_KEY as string));
    //return data || { error: 'Data not available yet' };
});
*/

import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        const documentId = String(await getQuery(event).documentId);
        console.log('documentId', documentId);
        if (!documentId) {
            return { error: 'documentId is required' };
        }
        const result = await client.search({
            index: useRuntimeConfig().public.ELASTIC_INDEX_MAPPING,
            query: {
                "ids" : {
                    "values" : documentId
                }
            },
        });
        console.log(result);
        return result.hits.hits;
    }
    catch(ex) {
        console.log(ex);
        return null;
    }
});