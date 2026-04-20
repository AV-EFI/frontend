import { Client } from '@elastic/elasticsearch';
import { createError } from 'h3';

function normalizeElasticNode(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function getElasticsearchNodes(): string[] {
  const runtimeConfig = useRuntimeConfig();
  const envLabel = normalizeElasticNode(runtimeConfig.public?.ENV_LABEL).toLowerCase();
  const isLocalLike =
    envLabel === 'local'
    || envLabel === 'dev'
    || process.env.NODE_ENV !== 'production';

  const preferredCandidates = isLocalLike
    ? [
      runtimeConfig.private?.ELASTIC_HOST_PUBLIC,
      runtimeConfig.private?.ELASTIC_HOST_INTERNAL,
      process.env.ELASTIC_HOST_PUBLIC,
      process.env.ELASTIC_HOST_INTERNAL,
      process.env.ELASTIC_HOST,
    ]
    : [
      runtimeConfig.private?.ELASTIC_HOST_INTERNAL,
      runtimeConfig.private?.ELASTIC_HOST_PUBLIC,
      process.env.ELASTIC_HOST_INTERNAL,
      process.env.ELASTIC_HOST_PUBLIC,
      process.env.ELASTIC_HOST,
    ];

  return preferredCandidates
    .map(normalizeElasticNode)
    .filter((value, index, all) => value.length > 0 && all.indexOf(value) === index);
}

export function getElasticsearchNode(): string {
  const node = getElasticsearchNodes()[0];

  if (!node) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Elasticsearch host is not configured',
    });
  }

  return node;
}

export function getElasticsearchApiKey(): string | undefined {
  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.private?.ELASTIC_APIKEY ?? process.env.ELASTIC_APIKEY;
  return typeof apiKey === 'string' && apiKey.trim().length > 0 ? apiKey.trim() : undefined;
}

export function createElasticsearchClient(): Client {
  const node = getElasticsearchNode();
  const apiKey = getElasticsearchApiKey();

  return new Client(
    apiKey
      ? { node, auth: { apiKey } }
      : { node },
  );
}
