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

function isAllowedInSchemaMode(path: string): boolean {
  // ✅ Always allow: robots + sitemap
  if (path === '/robots.txt' || path === '/sitemap.xml') return true;

  // ✅ Allow only selected pages
  if (path === '/') return true;
  if (path === '/press' || path.startsWith('/press/')) return true;

  // ✅ Allow detail pages only
  if (path.startsWith('/res/')) return true;

  // ❌ Everything else is blocked (incl. /search)
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
    : ['Googlebot', 'Bingbot', 'Google-InspectionTool'];

  const ua = String(getRequestHeader(event, 'user-agent') ?? '');
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown';
  const path = event.path || '/';

  // ----------------------------
  // SCHEMA MODE: hard allowlist by path + UA
  // ----------------------------
  if (releaseMode === 'schema') {
    // 1) Path allowlist
    if (!isAllowedInSchemaMode(path)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }

    // 2) UA allowlist (anti-“random bot”)
    //    Note: UA spoofing is possible; this is still useful as a pre-WAF guard.
    if (!uaMatchesAllowlist(ua, allowlist)) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }

    // 3) Make sure allowed pages are indexable for the test phase
    //    (search is blocked anyway; so safe)
    setResponseHeader(event, 'X-Robots-Tag', 'index, follow');
  }

  // ----------------------------
  // PRE MODE: force noindex everywhere (except you may still want sitemap/robots fetchable)
  // ----------------------------
  if (releaseMode === 'pre') {
    // allow sitemap/robots still fetchable but noindex
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  }

  // ----------------------------
  // RATE LIMIT (optional, for all modes if enabled)
  // ----------------------------
  if (rateLimitEnabled) {
    // In schema-mode, requests are already heavily gated; keep it anyway.
    const key =
      releaseMode === 'schema'
        ? `${ip}:schema`
        : path.startsWith('/search')
          ? `${ip}:search`
          : path.startsWith('/res')
            ? `${ip}:res`
            : `${ip}:other`;

    // Optionally: schema-mode a bit looser because only a few UAs pass
    const localAvg = releaseMode === 'schema' ? Math.max(avg, 10) : avg;
    const localBurst = releaseMode === 'schema' ? Math.max(burst, 30) : burst;

    const ok = consumeToken(key, localAvg, localBurst);
    if (!ok) {
      setResponseHeader(event, 'Retry-After', '2');
      throw createError({ statusCode: 429, statusMessage: 'Too Many Requests' });
    }
  }
});