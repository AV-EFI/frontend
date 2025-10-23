import fs from 'fs';
import path from 'path';

import { IGlossaryEntry as GlossaryEntry } from '@/models/interfaces/manual/IGlossaryEntry';

export function useServerGlossary(): GlossaryEntry[] {
    try {
        // Your tree shows: models/interfaces/schema
        const baseDir = path.resolve(process.cwd(), 'models', 'interfaces', 'schema');
        const files = ['avefi_schema.ts', 'avefi_schema_type_utils.ts'];
        const localePath = path.resolve(baseDir, 'locale_messages.json');

        let localeJson: Record<string, any> = {};
        if (fs.existsSync(localePath)) {
            try {
                localeJson = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
            } catch (e) {
                console.warn('locale_messages.json could not be parsed. Proceeding without translations.');
            }
        }

        const glossaryEntries: GlossaryEntry[] = [];

        // Support both `export enum` and `export const enum`
        const enumRegex = /export\s+(?:const\s+)?enum\s+(\w+)\s*{([\s\S]*?)}/g;

        // More tolerant: captures JSDoc, KEY, VALUE (value until a quote/whitespace/comma/closing brace)
        // Allows underscores in key; allows dashes/dots/etc. in value.
        const commentRegex = /\/\*\*([\s\S]*?)\*\/\s*([\w_]+)\s*=\s*["']?([^"'=\s,}]+)["']?\s*,?/g;

        for (const file of files) {
            const filePath = path.join(baseDir, file);
            if (!fs.existsSync(filePath)) continue;

            const content = fs.readFileSync(filePath, 'utf-8');
            let enumMatch: RegExpExecArray | null;

            while ((enumMatch = enumRegex.exec(content))) {
                const [, enumName, body] = enumMatch;

                const category =
          enumName
              .replace(/ActivityTypeEnum$/, ' Role')
              .replace(/TypeEnum$/, '')
              .replace(/Enum$/, '');

                let memberMatch: RegExpExecArray | null;
                while ((memberMatch = commentRegex.exec(body))) {
                    const [, rawComment, key /*, value*/] = memberMatch;

                    // Skip duplicates (same enum + same key)
                    if (glossaryEntries.some(e => e.term === key && e.enumSource === enumName)) {
                        continue;
                    }

                    // Clean JSDoc lines
                    const commentLines = rawComment
                        .replace(/\r?\n/g, '\n')
                        .split('\n')
                        .map(l => l.replace(/^\s*\*\s?/, '').trim())
                        .filter(Boolean);

                    const fallbackDescription = commentLines[0] ?? '';
                    const fallbackDefinition =
                    commentLines.length > 1 ? commentLines.slice(1).join(' ') : '';

                    const translated = localeJson?.de?.[key] ?? null;

                    glossaryEntries.push({
                        term: key,
                        label: translated || key,
                        description: fallbackDescription,
                        definition: fallbackDefinition,
                        enumSource: enumName,
                        category,
                        isTranslated: !!translated,
                    });
                }
            }
        }

        console.log(`Glossary entries loaded: ${glossaryEntries.length}`);
        return glossaryEntries;
    } catch (error) {
        console.error('Error reading glossary files:', error);
        return [];
    }
}
