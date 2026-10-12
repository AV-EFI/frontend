import fs from 'node:fs';
import path from 'node:path';
import { root } from './context.mjs';

export const baselinePath = path.join(root, 'scripts', 'security', 'baseline.json');

export function loadBaseline() {
  return JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
}

/**
 * Splits findings into open, tracked (known, decision pending elsewhere), accepted (documented
 * reason) and expired (acceptance older than its review date, so it counts as open again).
 */
export function applyBaseline(findings, baseline, today = new Date().toISOString().slice(0, 10)) {
  const entries = new Map(baseline.entries.map((entry) => [entry.id, entry]));
  const patterns = baseline.entries
    .filter((entry) => entry.id.includes('*'))
    .map((entry) => ({ entry, regex: new RegExp(`^${entry.id.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`) }));
  const lookup = (id) => entries.get(id) ?? patterns.find(({ regex }) => regex.test(id))?.entry;
  const result = { open: [], tracked: [], accepted: [], expired: [] };

  for (const item of findings) {
    const entry = lookup(item.id);
    if (!entry) {
      result.open.push(item);
    } else if (entry.status === 'tracked') {
      result.tracked.push({ ...item, reason: entry.reason, ref: entry.ref });
    } else if (entry.reviewBy && entry.reviewBy < today) {
      result.expired.push({ ...item, reason: entry.reason, reviewBy: entry.reviewBy });
    } else {
      result.accepted.push({ ...item, reason: entry.reason, reviewBy: entry.reviewBy });
    }
  }

  const seen = new Set(findings.map((item) => item.id));
  const stale = baseline.entries.filter((entry) => !entry.id.includes('*') && !seen.has(entry.id));
  return { ...result, stale };
}
