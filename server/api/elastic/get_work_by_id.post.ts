import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

export default defineEventHandler(async (event) => {
  try {
    const client = createElasticsearchClient();
    const runtimeConfig = useRuntimeConfig();

    const body = await readBody(event);
    const documentIds: string[] = body.documentId;
    const result = await client.search({
      index: runtimeConfig.public.ELASTIC_INDEX,
      size: 50,
      query: {
        ids: {
          values: typeof documentIds !== 'string' ? [...documentIds] : documentIds,
        },
      },
      fields: ['creators', 'directors_or_editors', 'production', 'located_in', 'productionyears', 'castmembers', 'subjects'],
    });
    return result.hits.hits;
  } catch (ex) {
    console.log(ex);
    return null;
  }
});
