import { join } from 'node:path';
import { promises as fs } from 'node:fs';

const DATA_DIR = join(process.cwd(), 'server', 'data');
const FILE_PATH = join(DATA_DIR, 'userGlossary.json');

export interface UserGlossaryEntry {
  // path ties a tooltip to a property in your model tree, e.g. "work.has_primary_title"
  path: string
  de: string
  en: string
  showDetail?: boolean // whether to show in detail view
  showSearch?: boolean // whether to show in search results
}

export interface UserGlossaryFile {
  entries: Record<string, { de: string; en: string }>
  updatedAt: string
}

async function ensureDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readUserGlossary(): Promise<UserGlossaryFile> {
    await ensureDir();
    try {
        const raw = await fs.readFile(FILE_PATH, 'utf8');
        return JSON.parse(raw) as UserGlossaryFile;
    } catch {
        const empty: UserGlossaryFile = { entries: {}, updatedAt: new Date().toISOString() };
        await writeUserGlossary(empty);
        return empty;
    }
}

export async function writeUserGlossary(data: UserGlossaryFile) {
    await ensureDir();
    data.updatedAt = new Date().toISOString();
    await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function arrayToFile(entries: UserGlossaryEntry[]): UserGlossaryFile {
    const map: UserGlossaryFile['entries'] = {};
    for (const e of entries) {
        map[e.path] = { de: e.de ?? '', en: e.en ?? '', showDetail: e.showDetail, showSearch: e.showSearch };
    }
    return { entries: map, updatedAt: new Date().toISOString() };
}

export function fileToArray(file: UserGlossaryFile): UserGlossaryEntry[] {
    return Object.entries(file.entries)
        .map(([path, v]) => ({ path, de: v.de ?? '', en: v.en ?? '', showDetail: v.showDetail, showSearch: v.showSearch }))
        .sort((a, b) => a.path.localeCompare(b.path));
}
