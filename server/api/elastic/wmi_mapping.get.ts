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

import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

export default defineEventHandler(async (event) => {
  try {
    const client = createElasticsearchClient();
    const runtimeConfig = useRuntimeConfig();
    const documentId = String(await getQuery(event).documentId);

    if (!documentId) {
      return { error: 'documentId is required' };
    }
    const result = await client.search({
      index: runtimeConfig.public.ELASTIC_INDEX_MAPPING,
      query: {
        ids: {
          values: documentId,
        },
      },
    });

    return result.hits.hits;
  } catch (ex) {
    console.log(ex);
    return null;
  }
});
