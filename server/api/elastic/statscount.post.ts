import { defineEventHandler, readBody } from 'h3';
import { z } from 'zod';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';
import { parseRequestBody } from '../../utils/requestBody';

const bodySchema = z.object({
  query: z.object({
    term: z.string().regex(/^[A-Za-z0-9._:/-]{1,100}$/),
    cat: z.string().regex(/^[A-Za-z0-9_]{1,50}$/),
  }),
});

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const index = runtimeConfig.public.ELASTIC_INDEX_DETAIL;
  const client = createElasticsearchClient();
  const { query } = parseRequestBody(bodySchema, await readBody(event));

  try {
    const institutionid: string = `https://w3id.org/isil/${query.term}`;

    const integratedQuery = {
      bool: {
        must: [
          { term: { 'has_record.category.keyword': query.cat } },
          { term: { 'has_record.described_by.has_issuer_id.keyword': institutionid } },
        ],
      },
    };

    const response = await client.count({
      index,
      query: integratedQuery,
    });

    return {
      success: true,
      data: response.count,
    };
  } catch (error: unknown) {
    console.error('statscount failed:', error);
    return {
      success: false,
      message: 'An error occurred while processing the request.',
    };
  }
});
