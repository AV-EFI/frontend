// server/utils/useServerVocab.ts
import { useStorage } from '#imports';
import type { IVocabEntry as vocabEntry } from '@/models/interfaces/manual/IVocabEntry';

/** Read a text file from Nitro server assets (works in dev & prod/prerender). */
async function readAssetText(key: string): Promise<string> {
    const storage = useStorage('assets:');
    const raw = await storage.getItem(key).catch(() => null);
    if (raw == null) throw new Error(`Asset not found: ${key}`);
    if (typeof raw === 'string') return raw;
    if (raw instanceof Uint8Array) return new TextDecoder().decode(raw);
    if (typeof raw === 'object') return JSON.stringify(raw);
    throw new Error(`Unsupported asset type for ${key}: ${typeof raw}`);
}

/** Safe load of locale JSON (handles string/object). */
async function loadLocale(): Promise<any> {
    try {
        const txt = await readAssetText('vocab:locale_messages.json');
        return JSON.parse(txt);
    } catch {
        return {};
    }
}

export async function useServerVocab(): Promise<vocabEntry[]> {
    try {
    // ---- load sources from server assets ----
        const schema1 = await readAssetText('vocab:avefi_schema.ts');
        const schema2 = await readAssetText('vocab:avefi_schema_type_utils.ts');
        const locale = await loadLocale();

        // ---- original parsing logic (with key regex fixed for CamelCase) ----
        const enumRegex   = /export\s+enum\s+(\w+)\s*{([\s\S]*?)}/g;
        const memberRegex = /\/\*\*([\s\S]*?)\*\/\s*([A-Za-z0-9_]+)\s*=\s*['"`]([^'"`]+)['"`]\s*,?/g;
        const files = [schema1, schema2];

        // helpers for labels/translations in multiple shapes
        const normalizeKeyCandidates = (key: string, value?: string) => {
            const base = String(key || '');
            const withoutNumber = base.replace(/^number_/, '');
            const dotted = withoutNumber.replace(/FULL_STOP/g, '.');

            // Candidate priority: most likely locale keys first
            const cands = [
                base,
                withoutNumber,
                dotted,
                value, // sometimes enums store the human string in value
            ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0);

            // de-dupe while preserving order
            return Array.from(new Set(cands));
        };

        const pickLocaleString = (obj: any, k: string): string | undefined => {
            return (obj && typeof obj === 'object' && typeof obj[k] === 'string') ? obj[k] : undefined;
        };

        const getLabelDE = (enumName: string, key: string, value: string): string | undefined => {
            for (const cand of normalizeKeyCandidates(key, value)) {
                // 1) { de: { Key: "…" } }
                const direct = pickLocaleString(locale?.de, cand);
                if (direct) return direct;

                // 2) { "Enum.Key": "…" } or { "Enum.Key": { de: "…" } }
                const dotted = locale?.[`${enumName}.${cand}`];
                if (typeof dotted === 'string') return dotted;
                if (dotted && typeof dotted.de === 'string') return dotted.de;
            }
            return undefined;
        };

        const getLabelEN = (enumName: string, key: string, value: string): string | undefined => {
            for (const cand of normalizeKeyCandidates(key, value)) {
                const direct = pickLocaleString(locale?.en, cand);
                if (direct) return direct;

                const dotted = locale?.[`${enumName}.${cand}`];
                if (typeof dotted === 'string') return dotted; // if you ever store EN flat
                if (dotted && typeof dotted.en === 'string') return dotted.en;
            }
            return undefined;
        };


        const results: vocabEntry[] = [];

        for (const content of files) {
            let enumMatch: RegExpExecArray | null;
            while ((enumMatch = enumRegex.exec(content))) {
                const [, enumName, body] = enumMatch;

                const category = enumName
                    .replace(/ActivityTypeEnum$/, ' Role')
                    .replace(/TypeEnum$/, '')
                    .replace(/Enum$/, '');

                let memberMatch: RegExpExecArray | null;
                while ((memberMatch = memberRegex.exec(body))) {
                    const [, rawComment, keyName, valueStr] = memberMatch;

                    // comment → description/definition
                    const lines = rawComment
                        .replace(/\r?\n/g, '\n')
                        .split('\n')
                        .map(l => l.replace(/^\s*\*\s?/, '').trim())
                        .filter(Boolean);

                    const fallbackDescription = lines[0] ?? '';
                    const fallbackDefinition  = lines.slice(1).join('\n') ?? '';

                    // pick label (what your UI shows after the colon)
                    const de = getLabelDE(enumName, keyName, valueStr);
                    const en = getLabelEN(enumName, keyName, valueStr);
                    const label = de || en || valueStr || keyName;

                    // optionally merge legacy shape { "Enum.Key": { description, definition } }
                    let description = fallbackDescription;
                    let definition  = fallbackDefinition;
                    let isTranslated = Boolean(de || en);
                    const dotted = locale?.[`${enumName}.${keyName}`];
                    if (dotted && typeof dotted === 'object') {
                        if (typeof dotted.description === 'string') {
                            description = dotted.description;
                            isTranslated = true;
                        }
                        if (typeof dotted.definition === 'string') {
                            definition = dotted.definition;
                            isTranslated = true;
                        }
                    }

                    results.push({
                        term: keyName,
                        label,               
                        labels: { de, en },
                        description,
                        definition,
                        enumSource: enumName,
                        category,
                        isTranslated
                    } as vocabEntry);
                }
            }
        }

        return results;
    } catch (err) {
        console.error('Error building vocab:', err);
        return [];
    }
}
