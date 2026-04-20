import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface EsSearchResponse<TSource = unknown> {
  took: number;
  timed_out: boolean;
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: Array<{ _source?: TSource }>;
  };
  aggregations?: Record<string, unknown>;
}

interface EsCountResponse {
  count: number;
}

export interface EsAuditConfig {
  baseUrl: string;
  index: string;
  apiKey?: string;
}

let cachedDotEnvLocal: Record<string, string> | null = null;

function parseDotEnv(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const eqIndex = line.indexOf('=');
    if (eqIndex <= 0) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function getDotEnvLocal(): Record<string, string> {
  if (cachedDotEnvLocal) {
    return cachedDotEnvLocal;
  }

  const filePath = resolve(process.cwd(), '.env.local');

  if (!existsSync(filePath)) {
    cachedDotEnvLocal = {};
    return cachedDotEnvLocal;
  }

  const content = readFileSync(filePath, 'utf8');
  cachedDotEnvLocal = parseDotEnv(content);
  return cachedDotEnvLocal;
}

function firstDefined(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

export function getEsAuditConfig(): EsAuditConfig | null {
  const dotEnvLocal = getDotEnvLocal();

  const baseUrl = firstDefined(
    process.env.ES_BASE_URL,
    dotEnvLocal.ES_BASE_URL,
    process.env.ELASTIC_HOST_PUBLIC,
    dotEnvLocal.ELASTIC_HOST_PUBLIC,
    process.env.ELASTIC_GWDG_HOST,
    dotEnvLocal.ELASTIC_GWDG_HOST,
    process.env.ELASTIC_HOST_INTERNAL,
    dotEnvLocal.ELASTIC_HOST_INTERNAL,
    process.env.ELASTIC_HOST,
    dotEnvLocal.ELASTIC_HOST,
  );

  const index = firstDefined(
    process.env.ES_INDEX,
    dotEnvLocal.ES_INDEX,
    process.env.ELASTIC_INDEX,
    dotEnvLocal.ELASTIC_INDEX,
    process.env.ELASTIC_GWDG_INDEX,
    dotEnvLocal.ELASTIC_GWDG_INDEX,
  );

  const apiKey = firstDefined(
    process.env.ES_API_KEY,
    dotEnvLocal.ES_API_KEY,
    process.env.ELASTIC_APIKEY,
    dotEnvLocal.ELASTIC_APIKEY,
  );

  if (!baseUrl || !index) {
    return null;
  }

  return { baseUrl: baseUrl.replace(/\/+$/, ''), index, apiKey };
}

function buildHeaders(apiKey?: string): HeadersInit {
  return {
    ...(apiKey ? { Authorization: `ApiKey ${apiKey}` } : {}),
    'Content-Type': 'application/json',
  };
}

export async function esSearch<TSource = unknown>(
  cfg: EsAuditConfig,
  body: Record<string, unknown>,
): Promise<EsSearchResponse<TSource>> {
  const response = await fetch(`${cfg.baseUrl}/${encodeURIComponent(cfg.index)}/_search`, {
    method: 'POST',
    headers: buildHeaders(cfg.apiKey),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Elasticsearch _search failed (${response.status}): ${payload}`);
  }

  return (await response.json()) as EsSearchResponse<TSource>;
}

export async function esCount(
  cfg: EsAuditConfig,
  body: Record<string, unknown> = { query: { match_all: {} } },
): Promise<EsCountResponse> {
  const response = await fetch(`${cfg.baseUrl}/${encodeURIComponent(cfg.index)}/_count`, {
    method: 'POST',
    headers: buildHeaders(cfg.apiKey),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Elasticsearch _count failed (${response.status}): ${payload}`);
  }

  return (await response.json()) as EsCountResponse;
}

export async function esGetIndexMapping(cfg: EsAuditConfig): Promise<Record<string, unknown>> {
  const response = await fetch(`${cfg.baseUrl}/${encodeURIComponent(cfg.index)}/_mapping`, {
    method: 'GET',
    headers: buildHeaders(cfg.apiKey),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Elasticsearch _mapping failed (${response.status}): ${payload}`);
  }

  return (await response.json()) as Record<string, unknown>;
}
