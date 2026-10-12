const MAX_TRACKED_KEYS = 10_000;

const hitsByKey = new Map<string, number[]>();

/**
 * In-memory sliding-window limiter, scoped to one server process.
 * Returns the seconds to wait when `key` exceeded `limit` hits within `windowMs`, otherwise `0`
 * (and records the hit).
 */
export function consumeRateLimit(key: string, limit: number, windowMs: number, now = Date.now()): number {
  if (hitsByKey.size >= MAX_TRACKED_KEYS) {
    for (const [trackedKey, hits] of hitsByKey) {
      if (now - (hits.at(-1) ?? 0) >= windowMs) hitsByKey.delete(trackedKey);
    }
  }

  const recent = (hitsByKey.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= limit) {
    hitsByKey.set(key, recent);
    return Math.ceil((recent[0]! + windowMs - now) / 1000);
  }

  recent.push(now);
  hitsByKey.set(key, recent);
  return 0;
}
