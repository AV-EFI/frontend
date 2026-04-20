import { createError, getRequestHeader, getRequestURL } from 'h3';
import type { H3Event } from 'h3';

function getAllowedOrigins(event: H3Event): Set<string> {
  const runtimeConfig = useRuntimeConfig();
  const configured = String(runtimeConfig.private?.CMS_MUTATION_ORIGIN_ALLOWLIST ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  const requestOrigin = getRequestURL(event).origin;
  return new Set([requestOrigin, ...configured]);
}

function parseOriginFromReferer(referer: string): string | null {
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

export function requireCmsMutationsEnabled(event: H3Event): void {
  const runtimeConfig = useRuntimeConfig();
  const enabled = String(runtimeConfig.private?.CMS_MUTATIONS_ENABLED ?? 'false') === 'true';

  if (!enabled) {
    throw createError({
      statusCode: 503,
      statusMessage: 'CMS mutations are disabled',
    });
  }

  const allowedOrigins = getAllowedOrigins(event);
  const origin = getRequestHeader(event, 'origin');
  const referer = getRequestHeader(event, 'referer');

  if (origin) {
    if (!allowedOrigins.has(origin)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid request origin',
      });
    }
    return;
  }

  if (referer) {
    const refererOrigin = parseOriginFromReferer(referer);
    if (!refererOrigin || !allowedOrigins.has(refererOrigin)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid request referer',
      });
    }
    return;
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'Missing origin headers',
  });
}
