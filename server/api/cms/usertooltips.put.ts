// server/api/cms/usertooltips.put.ts
/* eslint-disable */
import { readUserGlossary, writeUserGlossary } from '../../utils/userGlossaryStore';

const toBool = (v) => {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'boolean') return v;
  const s = String(v).trim().toLowerCase();
  if (['1','true','yes','y','on'].includes(s)) return true;
  if (['0','false','no','n','off'].includes(s)) return false;
  return undefined;
};

export default defineEventHandler(async (event) => {
  const payload = await readBody(event);
  const rows = Array.isArray(payload?.entries) ? payload.entries : [];

  const clean = {};
  for (const r of rows) {
    const path = String(r?.path ?? '').trim();
    if (!path) continue;

    const de = String(r?.de ?? '').trim();
    const en = String(r?.en ?? '').trim();
    const showDetail = toBool(r?.showDetail);
    const showSearch = toBool(r?.showSearch);

    // keep if any content present (text or flags)
    const hasAny = de || en || showDetail !== undefined || showSearch !== undefined;
    if (!hasAny) continue;

    const entry = {};
    if (de) entry.de = de;
    if (en) entry.en = en;
    if (showDetail !== undefined) entry.showDetail = showDetail;
    if (showSearch !== undefined) entry.showSearch = showSearch;

    clean[path] = entry;
  }

  const existing = (await readUserGlossary()) ?? { entries: {}, updatedAt: null };
  const now = new Date().toISOString();
  const next = { ...existing, entries: clean, updatedAt: now };

  await writeUserGlossary(next);

  return { ok: true, updatedAt: now };
});
