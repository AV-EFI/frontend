import type { ExplorerLocale } from './fieldTerms';

export interface VocabularyValue {
  term: string;
  label: string;
  definition: string;
}

interface VocabularyEntry {
  term: string;
  label?: string;
  labels?: Partial<Record<ExplorerLocale, string>>;
  definition?: string;
  enumSource?: string;
}

let byEnum: Promise<Map<string, VocabularyEntry[]>> | null = null;

/** The vocabulary is large, so it is loaded only when a field with a value list is opened. */
function loadVocabulary(): Promise<Map<string, VocabularyEntry[]>> {
  byEnum ??= import('~/assets/data/vocab.json').then((module) => {
    const grouped = new Map<string, VocabularyEntry[]>();
    for (const entry of module.default as VocabularyEntry[]) {
      if (!entry.enumSource) continue;
      const list = grouped.get(entry.enumSource) ?? [];
      list.push(entry);
      grouped.set(entry.enumSource, list);
    }
    return grouped;
  });
  return byEnum;
}

/** Values of one value list ("ColourTypeEnum") with their confirmed labels. Empty for fields without a value list. */
export async function loadEnumValues(enumName: string, locale: ExplorerLocale): Promise<VocabularyValue[]> {
  const entries = (await loadVocabulary()).get(enumName) ?? [];
  return entries.map((entry) => ({
    term: entry.term,
    label: entry.labels?.[locale] ?? entry.label ?? entry.term,
    definition: entry.definition ?? '',
  }));
}
