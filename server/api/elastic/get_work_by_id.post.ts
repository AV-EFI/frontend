import { z } from 'zod';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';
import { parseRequestBody } from '../../utils/requestBody';

const documentIdSchema = z.string().min(1).max(500);
const bodySchema = z.object({
  documentId: z.union([documentIdSchema, z.array(documentIdSchema).min(1).max(50)]),
});

export default defineEventHandler(async (event) => {
  const { documentId: documentIds } = parseRequestBody(bodySchema, await readBody(event));

  try {
    const client = createElasticsearchClient();
    const runtimeConfig = useRuntimeConfig();

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
