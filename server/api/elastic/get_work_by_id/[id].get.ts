import { defineEventHandler, getRouterParam } from 'h3';
import { $fetch } from 'ofetch';
import { getElasticsearchApiKey, getElasticsearchNode } from '~/server/utils/elasticsearchRuntime';

export default defineEventHandler(async (event) => {
  // Extract the ID from the route
  const id = getRouterParam(event, 'id');
  if (!id) {
    return { error: 'Missing ID parameter' };
  }

  // Example: Query Elasticsearch (replace with your actual host and query)
  const elasticHost = getElasticsearchNode();
  const index = process.env.ELASTIC_INDEX || 'your_index';
  const url = `${elasticHost}/${index}/_doc/${id}`;
  const apiKey = getElasticsearchApiKey();
  const headers = apiKey ? { Authorization: `ApiKey ${apiKey}` } : undefined;

  try {
    const result = await $fetch(url, { headers });
    console.log('Elasticsearch result:', result);

    if(result) {
      const backend_response = {
        "handle": result._source.handle,
        "_index": result._index,
        "_id": result._id,
        "_score": 1,
        "_ignored": [
          "manifestations.has_record.has_note.keyword"
        ],
        "compound_record": {
          "_source": { ...result?._source }
        }
      };
      return backend_response;
    }
    return { error: 'Document not found' };
  } catch (error) {
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return { error: errorMessage };
  }
});
