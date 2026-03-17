// server/middleware/bot-guard.ts
import {
  defineEventHandler,
  getRequestHeader,
  getRequestIP,
  setResponseHeader,
  createError,
} from 'h3';

type Bucket = { tokens: number; lastRefill: number };
const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

// Token Bucket: avg = tokens/sec, burst = max tokens
function consumeToken(key: string, avg: number, burst: number): boolean {
  const t = nowMs();
  const b = buckets.get(key) ?? { tokens: burst, lastRefill: t };

  const elapsedSec = Math.max(0, (t - b.lastRefill) / 1000);
  const refill = elapsedSec * avg;

  b.tokens = Math.min(burst, b.tokens + refill);
  b.lastRefill = t;

  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}

function uaMatchesAllowlist(ua: string, allow: string[]): boolean {
  const u = ua.toLowerCase();
  return allow.some((a) => a && u.includes(a.toLowerCase()));
}

function isBotUa(ua: string): boolean {
  return /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|twitterbot|applebot|duckduckbot|yandex|baiduspider|semrushbot|ahrefsbot|mj12bot|dotbot|petalbot|seznambot|sogou/i.test(ua);
}

function isAlwaysPublicPath(path: string): boolean {
  return path === '/robots.txt' || path === '/sitemap.xml';
}

function isSensitivePagePath(path: string): boolean {
  return (
    path.startsWith('/protected') ||
    path.startsWith('/admin') ||
    path === '/login' ||
    path === '/logout' ||
    path === '/signout' ||
    path === '/normdata' ||
    path === '/explorer-poc'
  );
}

/**
 * Internal/framework/runtime paths that must stay fetchable.
 * These must never be indexed.
 */
function isInternalFrameworkPath(path: string): boolean {
  return (
    path.startsWith('/_nuxt/') ||
    path.startsWith('/_i18n/') ||
    path.startsWith('/__sitemap__/') ||
    path.startsWith('/api/_nuxt_icon/') ||
    path.startsWith('/matomo/') ||
    path.endsWith('/_payload.json') ||
    path === '/_payload.json'
  );
}

/**
 * Public API/runtime endpoints used by the frontend.
 * These should stay fetchable in release mode, but never be indexed.
 */
function isPublicRuntimeOrApiPath(path: string): boolean {
  return (
    isInternalFrameworkPath(path) ||
    path === '/api/cms/getcmscontent' ||
    path === '/api/cms/modelhints' ||
    path === '/api/cms/modeltree' ||
    path === '/api/cms/usertooltips' ||
    path === '/api/cms/vocab' ||
    path === '/api/elastic/fallbacks' ||
    path === '/api/elastic/issuers' ||
    path === '/api/elastic/msearch' ||
    path === '/api/elastic/msearch_inst' ||
    path === '/api/elastic/query_suggest' ||
    path === '/api/elastic/suggestions' ||
    path === '/api/elastic/statscount' ||
    path === '/api/elastic/get_work_by_id' ||
    path === '/api/elastic/get_work_by_is_part_of' ||
    path === '/api/press-kit.zip' ||
    path === '/rest/v1/frontend/search'
  );
}

/**
 * Sensitive/private API endpoints that should not be open in pre/schema modes.
 * In release mode they are still marked noindex, but not blanket-blocked here
 * unless you want to harden them further elsewhere.
 */
function isSensitiveApiPath(path: string): boolean {
  return (
    path.startsWith('/api/poc/') ||
    path === '/api/cms/usertooltips_seed' ||
    path === '/api/cms/decorate' ||
    path === '/api/elastic/cache_top_values'
  );
}

function isNeverIndexButFetchablePath(path: string): boolean {
  return isPublicRuntimeOrApiPath(path);
}

export default defineEventHandler((event) => {
  const cfg = useRuntimeConfig().public as any;

  const releaseMode = String(cfg.releaseMode ?? 'pre'); // pre | release
  const rateLimitEnabled = Boolean(cfg.rateLimitEnabled);
  const avg = Number(cfg.rateLimitAvg ?? 8);
  const burst = Number(cfg.rateLimitBurst ?? 20);
  const allowlist: string[] = Array.isArray(cfg.botUaAllowlist)
    ? cfg.botUaAllowlist
    : [
      'Googlebot',
      'Google-InspectionTool',
      'Bingbot',
      'msnbot',
      'Applebot',
      'DuckDuckBot',
      'DuckAssistBot',
      'Twitterbot',
      'OAI-SearchBot',
      'GPTBot',
      'Claude-SearchBot',
      'PerplexityBot',
    ];
  const ua = String(getRequestHeader(event, 'user-agent') ?? '');
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  const path = event.path || '/';
  const isAllowedBotUa = uaMatchesAllowlist(ua, allowlist);
  const isBotRequest = isBotUa(ua);

  // ----------------------------
  // Sensitive public page routes
  // ----------------------------
  if (isSensitivePagePath(path)) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // ----------------------------
  // Sensitive API routes
  // ----------------------------
  if (isSensitiveApiPath(path)) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');

    if (releaseMode === 'pre') {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
  }

  // ----------------------------
  // Framework/runtime/API paths that must remain fetchable
  // but must never be indexed
  // ----------------------------
  if (isNeverIndexButFetchablePath(path)) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // ----------------------------
  // PRE MODE: force noindex everywhere
  // ----------------------------
  if (releaseMode === 'pre') {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // ----------------------------
  // RELEASE MODE:
  // - allowlisted bots can crawl/index normal public HTML pages
  // - non-allowlisted bots are rejected
  // - runtime/api paths already got noindex above
  // ----------------------------
  if (releaseMode === 'release') {
    if (isBotRequest && !isAlwaysPublicPath(path) && !isNeverIndexButFetchablePath(path)) {
      if (!isAllowedBotUa) {
        setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
      }

      if (!isSensitivePagePath(path)) {
        setResponseHeader(event, 'X-Robots-Tag', 'index, follow, max-image-preview:large');
      }
    }
  }

  // ----------------------------
  // RATE LIMIT
  // ----------------------------
  if (rateLimitEnabled) {
    const bucket =
      path.startsWith('/api/elastic/') || path === '/rest/v1/frontend/search'
        ? 'api-search'
        : path.startsWith('/api/cms/')
          ? 'api-cms'
          : path.startsWith('/api/')
            ? 'api-other'
            : path.startsWith('/matomo/')
              ? 'matomo'
              : path.startsWith('/search')
                ? 'search-page'
                : path.startsWith('/res')
                  ? 'res-page'
                  : 'other';

    const key = `${ip}:${releaseMode}:${bucket}`;

    const localAvg =
      bucket === 'api-search'
        ? Math.max(4, avg)
        : avg;

    const localBurst =
      bucket === 'api-search'
        ? Math.max(10, Math.floor(burst / 2))
        : burst;

    const ok = consumeToken(key, localAvg, localBurst);
    if (!ok) {
      setResponseHeader(event, 'Retry-After', '2');
      throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' });
    }
  }
});
