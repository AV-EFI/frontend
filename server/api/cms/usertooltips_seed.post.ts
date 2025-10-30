/* eslint-disable */
import { join } from 'node:path';
import { promises as fs } from 'node:fs';
import { readUserGlossary, writeUserGlossary } from '../../utils/userGlossaryStore';

type I18nPayload = {
  en?: Record<string, string>;
  de?: Record<string, string>;
  showDetail?: boolean; // whether to show in detail view
  showSearch?: boolean; // whether to show in search results
};

// Adjust this if your build places entities elsewhere
const ENTITIES_FILE = join(process.cwd(), 'assets', 'data', 'entities.json');

// 🔧 Put schema-specific fallbacks here if auto-resolution can’t find a slot.
// LEFT: i18n key, RIGHT: canonical explorerPath (slot-level)
const ALIASES: Record<string, string> = {
  // Example guesses — confirm against your schema tree and tweak:
  // 'format': 'MovingImageRecord.WorkVariant.manifestations[].items[].has_format_type',
  // 'elementType': 'MovingImageRecord.WorkVariant.manifestations[].items[].has_element_type',
  // 'manifestation': 'MovingImageRecord.WorkVariant.manifestations[]',
  // 'item': 'MovingImageRecord.WorkVariant.manifestations[].items[]',
  // 'webresource': 'MovingImageRecord.WorkVariant.manifestations[].items[].has_web_resource_url',
};

type Entity = {
  kind: 'class' | 'slot' | 'enum' | 'enumMember';
  name: string;
  label?: string;
  explorerPath: string;
  owner?: string;
  description?: string;
  docsUrl?: string;
};

function norm(s: string | undefined): string {
  return (s || '').trim().toLowerCase();
}

async function loadEntities(): Promise<Entity[]> {
  const raw = await fs.readFile(ENTITIES_FILE, 'utf8');
  return JSON.parse(raw) as Entity[];
}

function resolveKeyToPaths(key: string, entities: Entity[]): string[] {
  const k = norm(key);
  const out = new Set<string>();

  // 1) exact slot name match
  for (const e of entities) {
    if (e.kind === 'slot' && norm(e.name) === k) {
      out.add(e.explorerPath); // slot paths are canonical leaf paths
    }
  }

  // 2) label match
  if (!out.size) {
    for (const e of entities) {
      if (e.kind === 'slot' && norm(e.label) === k) {
        out.add(e.explorerPath);
      }
    }
  }

  // 3) alias fallback
  if (!out.size && ALIASES[key]) {
    out.add(ALIASES[key]);
  }

  return Array.from(out);
}

export default defineEventHandler(async (event) => {
  // Auth/ACL goes here if needed.

  const body = (await readBody<I18nPayload>(event)) || {};
  const de: Record<string, string> = body.de || {};
  const en: Record<string, string> = body.en || {};
  const showDetail = body.showDetail ?? true; // default to true if not specified
  const showSearch = body.showSearch ?? true; // default to true if not specified

  const entities = await loadEntities();
  const current = await readUserGlossary();

  // Build reverse index of existing paths to avoid overwriting
  const existingPaths = new Set(Object.keys(current.entries));

  const seeded: Array<{ key: string; path: string }> = [];
  const collisions: Array<{ key: string; path: string }> = [];
  const unresolved: string[] = [];

  // union of keys in EN/DE
  const keys = Array.from(new Set([...Object.keys(en), ...Object.keys(de)])).sort();

  for (const key of keys) {
    const paths = resolveKeyToPaths(key, entities);

    if (!paths.length) {
      unresolved.push(key);
      continue;
    }

    const textDe = (de[key] || '').trim();
    const textEn = (en[key] || '').trim();
    if (!textDe && !textEn) {
      // No content to seed, skip
      continue;
    }

    for (const p of paths) {
      if (existingPaths.has(p)) {
        // Don’t overwrite existing user content
        collisions.push({ key, path: p });
        continue;
      }
      current.entries[p] = { de: textDe, en: textEn };
      existingPaths.add(p);
      seeded.push({ key, path: p });
    }
  }

  current.updatedAt = new Date().toISOString();
  await writeUserGlossary(current);

  return {
    ok: true,
    seededCount: seeded.length,
    seeded,
    collisions,
    unresolved, // keys we couldn’t resolve → add to ALIASES above
    updatedAt: current.updatedAt,
  };
});
