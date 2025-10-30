 
import { join } from 'node:path';
import { promises as fs } from 'node:fs';

/* eslint-disable */

// ⬇️ make sure this is exported
export type EntitiesEntry = {
  kind: 'class' | 'slot' | 'enum' | 'enumMember';
  name: string;
  label?: string;
  description?: string;
  explorerPath: string;
  owner?: string;
  docsUrl?: string;
};

// (keep the rest as-is)
export type UserTooltipStore = {
  updatedAt: string;
  entries: Record<string, { de?: string; en?: string }>;
};

const ASSETS = join(process.cwd(), 'assets', 'data');
const ENTITIES_JSON = join(ASSETS, 'entities.json');       // from your generator
const LOCALE_MESSAGES = join(ASSETS, 'schema', 'locale_messages.json'); // copied by your generator
const USER_TOOLTIPS = join(process.cwd(), 'var', 'cms', 'user-tooltips.json'); // pick a writable place

async function readJSON<T>(file: string, fallback: T): Promise<T> {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) as T; }
  catch { return fallback; }
}

export async function loadEntities(): Promise<EntitiesEntry[]> {
  return readJSON<EntitiesEntry[]>(ENTITIES_JSON, []);
}

export async function loadLocale(): Promise<Record<string, Record<string, string>>> {
  return readJSON<Record<string, Record<string, string>>>(LOCALE_MESSAGES, {});
}

export async function loadUserTooltips(): Promise<UserTooltipStore> {
  return readJSON<UserTooltipStore>(USER_TOOLTIPS, { updatedAt: '', entries: {} });
}

/** Given a canonical explorerPath, return the slot record (if any) */
export function findSlotByPath(entities: EntitiesEntry[], path: string): EntitiesEntry | null {
  // Paths for slots in entities.json are canonical (not the raw object dot-paths).
  // We match by exact explorerPath for slots, else try best-effort by tail segment.
  const slot = entities.find(e => e.kind === 'slot' && e.explorerPath === path);
  if (slot) return slot;

  const tail = path.split('.').pop() || '';
  const alt = entities.find(e => e.kind === 'slot' && e.name === tail);
  return alt || null;
}

/** Resolve label in lang from (1) entities label via locale_messages -> (2) slot.name as fallback */
export function labelForPath(entities: EntitiesEntry[], locale: any, path: string, lang: 'de'|'en'): string {
  const slot = findSlotByPath(entities, path);
  if (!slot) return path.split('.').pop() || path;

  // entities.label was itself created with locale_messages at build time
  const l = slot.label || slot.name;
  if (!l) return slot.name || path;

  // If you want to force locale lookup (optional), uncomment:
  // const msg = (locale?.[lang]?.[slot.name] ?? null) || (locale?.[lang]?.[l] ?? null);
  // return msg || l;

  return l;
}

/** Tooltip resolution: (1) user store exact path, (2) i18n.tooltip.<leaf>, (3) i18n.tooltip.<class> (manifestation/item), else '' */
export function tooltipForPath(user: UserTooltipStore, i18n: Record<string, string>, path: string, lang: 'de'|'en'): string {
  const u = user.entries[path]?.[lang];
  if (u && u.trim()) return u.trim();

  const leaf = (path.split('.').pop() || '').replace(/\[\]$/, '');
  const leafKey = `tooltip.${leaf}`;
  if (i18n[leafKey] && i18n[leafKey] !== leafKey) return String(i18n[leafKey]);

  const cls = (() => {
    const segs = path.split('.');
    for (let i = segs.length - 1; i >= 0; i--) {
      const s = segs[i];
      if (s.endsWith('[]')) return s.slice(0, -2).toLowerCase(); // manifestation | item
    }
    return null;
  })();
  if (cls) {
    const clsKey = `tooltip.${cls}`;
    if (i18n[clsKey] && i18n[clsKey] !== clsKey) return String(i18n[clsKey]);
  }
  return '';
}

/** Flatten all leaf‑like candidate paths from a dot‑path object
 *  We produce "display paths" (object traversal paths), then map them to canonical explorerPaths via a provided map.
 */
export function collectLeafObjectPaths(obj: unknown, base = ''): string[] {
  const out: string[] = [];
  const push = (p: string) => { if (!out.includes(p)) out.push(p); };

  const walk = (v: any, p: string) => {
    if (v === null || v === undefined) { push(p); return; }
    if (Array.isArray(v)) {
      if (v.length === 0) { push(`${p}[]`); return; }
      // arrays: include a generic [] path + also look into first element for structure
      push(`${p}[]`);
      walk(v[0], `${p}[]`);
      return;
    }
    if (typeof v === 'object') {
      const keys = Object.keys(v);
      if (keys.length === 0) { push(p); return; }
      for (const k of keys) {
        const np = p ? `${p}.${k}` : k;
        walk(v[k], np);
      }
      return;
    }
    push(p);
  };

  walk(obj as any, base);
  return out.filter(Boolean);
}
