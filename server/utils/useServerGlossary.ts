// server/utils/useServerGlossary.ts
import { useStorage } from '#imports';
import type { IGlossaryEntry as GlossaryEntry } from '@/models/interfaces/manual/IGlossaryEntry';

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
        const txt = await readAssetText('glossary:locale_messages.json');
        return JSON.parse(txt);
    } catch {
        return {};
    }
}

export async function useServerGlossary(): Promise<GlossaryEntry[]> {
    try {
    // ---- load sources from server assets ----
        const schema1 = await readAssetText('glossary:avefi_schema.ts');
        const schema2 = await readAssetText('glossary:avefi_schema_type_utils.ts');
        const locale = await loadLocale();

        // ---- original parsing logic (with key regex fixed for CamelCase) ----
        const enumRegex   = /export\s+enum\s+(\w+)\s*{([\s\S]*?)}/g;
        const memberRegex = /\/\*\*([\s\S]*?)\*\/\s*([A-Za-z0-9_]+)\s*=\s*['"`]([^'"`]+)['"`]\s*,?/g;
        const files = [schema1, schema2];

        // helpers for labels/translations in multiple shapes
        const getLabelDE = (enumName: string, key: string, value: string): string | undefined => {
            // 1) language-map: { de: { Key: "…" } }
            if (locale?.de && typeof locale.de === 'object' && typeof locale.de[key] === 'string') return locale.de[key];
            // 2) nested map: { "Enum.Key": { de: "…" } } or { "Enum.Key": "…" }
            const dotted = locale?.[`${enumName}.${key}`];
            if (typeof dotted === 'string') return dotted;
            if (dotted && typeof dotted.de === 'string') return dotted.de;
            // fallback: enum value (usually English label)
            return undefined;
        };
        const getLabelEN = (enumName: string, key: string, value: string): string | undefined => {
            if (locale?.en && typeof locale.en === 'object' && typeof locale.en[key] === 'string') return locale.en[key];
            const dotted = locale?.[`${enumName}.${key}`];
            if (dotted && typeof dotted.en === 'string') return dotted.en;
            return undefined;
        };

        const results: GlossaryEntry[] = [];

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
                        label,                // <-- ✅ now set; UI will show it after the colon
                        description,
                        definition,
                        enumSource: enumName,
                        category,
                        isTranslated
                    } as GlossaryEntry);
                }
            }
        }

        return results;
    } catch (err) {
        console.error('Error building glossary:', err);
        return [];
    }
}
