import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

export default defineEventHandler(async (event) => {
  try {
    const client = createElasticsearchClient();
    const runtimeConfig = useRuntimeConfig();

    const body = await readBody(event);
    const documentId = body.documentId;
    const result = await client.search({
      index: runtimeConfig.public.ELASTIC_INDEX_DETAIL,
      size: 50,
      query: {
        bool: {
          must: {
            match: {
              'has_record.is_part_of.id': documentId,
            },
          },
        },
      },
    });

    return result.hits.hits;
  } catch (ex) {
    console.log(ex);
    return null;
  }
});
