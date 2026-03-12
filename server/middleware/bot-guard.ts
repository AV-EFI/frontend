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

function isAlwaysPublicPath(path: string): boolean {
  return path === '/robots.txt' || path === '/sitemap.xml';
}

function isSensitivePath(path: string): boolean {
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

function isNeverIndexButFetchablePath(path: string): boolean {
  return path.startsWith('/_nuxt') || path.startsWith('/_');
}

function isAllowedInSchemaMode(path: string): boolean {
  // Always allow robots/sitemap
  if (isAlwaysPublicPath(path)) return true;

  // Public pages you want Google to test
  if (path === '/') return true;
  if (path === '/press' || path.startsWith('/press/')) return true;
  if (path === '/search' || path.startsWith('/search/')) return true;
  if (path.startsWith('/res/')) return true;

  // Optional static pages
  if (path === '/faq') return true;
  if (path === '/imprint') return true;
  if (path === '/contact') return true;

  return false;
}

export default defineEventHandler((event) => {
  const cfg = useRuntimeConfig().public as any;

  const releaseMode = String(cfg.releaseMode ?? 'pre'); // pre | schema | release

  const rateLimitEnabled = Boolean(cfg.rateLimitEnabled);
  const avg = Number(cfg.rateLimitAvg ?? 8);
  const burst = Number(cfg.rateLimitBurst ?? 20);

  const allowlist: string[] = Array.isArray(cfg.schemaTestUaAllowlist)
    ? cfg.schemaTestUaAllowlist
    : ['Googlebot', 'Google-InspectionTool'];

  const ua = String(getRequestHeader(event, 'user-agent') ?? '');
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  const path = event.path || '/';

  const isGoogleTestUa = uaMatchesAllowlist(ua, allowlist);

  // ----------------------------
  // Sensitive/internal routes: never index
  // ----------------------------
  if (isSensitivePath(path)) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');

    if (releaseMode === 'schema') {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
  }

  if (isNeverIndexButFetchablePath(path)) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // ----------------------------
  // SCHEMA MODE:
  // - only selected paths are accessible
  // - Googlebot / InspectionTool can index them
  // - everyone else sees noindex
  // ----------------------------
  if (releaseMode === 'schema') {
    if (!isAllowedInSchemaMode(path)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }

    // robots.txt and sitemap.xml must remain fetchable
    if (!isAlwaysPublicPath(path)) {
      setResponseHeader(
        event,
        'X-Robots-Tag',
        isGoogleTestUa
          ? 'index, follow, max-image-preview:large'
          : 'noindex, nofollow, noarchive'
      );
    }
  }

  // ----------------------------
  // PRE MODE: force noindex everywhere
  // ----------------------------
  if (releaseMode === 'pre') {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  // ----------------------------
  // RELEASE MODE:
  // allow normal indexing unless routeRules or page-level meta override it
  // ----------------------------
  if (releaseMode === 'release') {
    // no forced override here
  }

  // ----------------------------
  // RATE LIMIT
  // ----------------------------
  if (rateLimitEnabled) {
    const key =
  releaseMode === 'schema'
    ? `${ip}:schema:${path.startsWith('/search') ? 'search' : path.startsWith('/res') ? 'res' : 'other'}`
    : path.startsWith('/search')
      ? `${ip}:search`
      : path.startsWith('/res')
        ? `${ip}:res`
        : `${ip}:other`;

    const localAvg = releaseMode === 'schema' ? Math.max(avg, 10) : avg;
    const localBurst = releaseMode === 'schema' ? Math.max(burst, 30) : burst;

    const ok = consumeToken(key, localAvg, localBurst);
    if (!ok) {
      setResponseHeader(event, 'Retry-After', '2');
      throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' });
    }
  }
});