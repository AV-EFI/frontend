import fs from 'fs';
import path from 'path';

interface GlossaryEntry {
  term: string;
  label: string;
  description: string;
  definition: string;
  enumSource: string;
  category: string;
  isTranslated: boolean;
}

export function useServerGlossary(): GlossaryEntry[] {
  try {
    const baseDir = path.resolve(process.cwd(), 'models', 'interfaces');
    const files = ['av_efi_schema.ts', 'av_efi_schema_type_utils_extended.ts'];
    const localePath = path.resolve(baseDir, 'locale_messages.json');

    let localeJson: Record<string, any> = {};
    if (fs.existsSync(localePath)) {
      localeJson = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    }

    const glossaryEntries: GlossaryEntry[] = [];

    const enumRegex = /export enum (\w+)\s*{([\s\S]*?)}/gm;
    const commentRegex = /\/\*\*(.*?)\*\/\s*(\w+)\s*=\s*["']?(\w+)["']?,?/gs;

    for (const file of files) {
      const filePath = path.join(baseDir, file);
      if (!fs.existsSync(filePath)) continue;

      const content = fs.readFileSync(filePath, 'utf-8');
      let match;

      while ((match = enumRegex.exec(content))) {
        const [_, enumName, body] = match;
        const category = enumName
          .replace(/ActivityTypeEnum$/, ' Role')
          .replace(/TypeEnum$/, '')
          .replace(/Enum$/, '');

        let commentMatch;
        while ((commentMatch = commentRegex.exec(body))) {
          const [, rawComment, key] = commentMatch;

          // Split and clean comment lines
          const commentLines = rawComment
            .replace(/\r?\n/g, '\n')
            .split('\n')
            .map((l) => l.replace(/^\s*\*\s?/, '').trim())
            .filter(Boolean);

          const fallbackDescription = commentLines[0] ?? '';
          const fallbackDefinition = commentLines.length > 1
            ? commentLines.slice(1).join(' ')
            : '';

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

          const existing = glossaryEntries.find(e =>
            e.term === key && e.enumSource === enumName
          );
          if (existing) continue;
          

        }
      }
    }

    return glossaryEntries;
  } catch (error) {
    console.error('Error reading glossary files:', error);
    return [];
  }
}
