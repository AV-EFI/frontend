import { z } from 'zod';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';
import { parseRequestBody } from '../../utils/requestBody';

const bodySchema = z.object({ documentId: z.string().min(1).max(500) });

export default defineEventHandler(async (event) => {
  const { documentId } = parseRequestBody(bodySchema, await readBody(event));

  try {
    const client = createElasticsearchClient();
    const runtimeConfig = useRuntimeConfig();

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
