/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, readBody } from 'h3';
import { createElasticsearchClient } from '../../utils/elasticsearchRuntime';

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const index = runtimeConfig.public.ELASTIC_INDEX_DETAIL;
  const client = createElasticsearchClient();

  try {
    const body = await readBody(event);
    if (!body) {
      throw new Error('Invalid request: "index" and "query" fields are required.');
    }

    const { query } = body;
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
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'An error occurred while processing the request.',
    };
  }
});
