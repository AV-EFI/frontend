import { defineCachedEventHandler } from '#imports';
import topIssuersData from '~/data/top-issuers.json';

interface Issuer {
  name: string;
  id: string | null;
  doc_count: number;
}

interface EsBucket {
  key: string;
  doc_count: number;
  issuer_id?: {
    buckets?: Array<{ key: string }>;
  };
}

interface EsResponse {
  aggregations?: {
    issuers?: {
      buckets?: EsBucket[];
    };
  };
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig();

  const host = config.ELASTIC_HOST_INTERNAL || config.ELASTIC_HOST_PUBLIC;
  const index = config.public.ELASTIC_INDEX;
  const apiKey = config.ELASTIC_APIKEY;

  if (!host || !index) {
    return topIssuersData;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers.Authorization = `ApiKey ${apiKey}`;
  }

  try {
    const response = await $fetch<EsResponse>(`${host}/${index}/_search`, {
      method: 'POST',
      headers,
      body: {
        size: 0,
        aggs: {
          issuers: {
            terms: {
              field: 'has_issuer_name.keyword',
              size: 10,
              order: {
                _count: 'desc',
              },
            },
            aggs: {
              issuer_id: {
                terms: {
                  field: 'has_issuer_id.keyword',
                  size: 1,
                },
              },
            },
          },
        },
      },
    });

    const buckets = response.aggregations?.issuers?.buckets || [];

    return {
      generated_at: new Date().toISOString(),
      issuers: buckets.map((bucket) => ({
        name: bucket.key,
        id: bucket.issuer_id?.buckets?.[0]?.key || null,
        doc_count: bucket.doc_count,
      })),
    };
  } catch (error) {
    console.error('[top-issuers] elastic query failed', error);
    return topIssuersData;
  }
}, {
  maxAge: 60 * 15,
  swr: true,
});