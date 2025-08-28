import { join } from 'node:path';
import { promises as fs } from 'node:fs';

const ENTITIES_FILE = join(process.cwd(), 'assets', 'data', 'entities.json');

export default defineEventHandler(async () => {
    try {
        const raw = await fs.readFile(ENTITIES_FILE, 'utf8');
        const arr = JSON.parse(raw) as Array<any>;
        // reduce to path → { label?, description?, docsUrl? }
        const map: Record<string, { label?: string; description?: string; docsUrl?: string }> = {};
        for (const e of arr) {
            const p = e.explorerPath;
            if (!p) continue;
            if (!map[p]) map[p] = {};
            if (e.label && !map[p].label) map[p].label = e.label;
            if (e.description && !map[p].description) map[p].description = e.description;
            if (e.docsUrl && !map[p].docsUrl) map[p].docsUrl = e.docsUrl;
        }
        return map;
    } catch {
        return {};
    }
});
