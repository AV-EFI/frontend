import { glossaryEntries, type GlossaryEntry, type GlossaryLocale } from '~/data/glossary';

export interface GlossaryMatchSegment {
  type: 'text' | 'term'
  text: string
  entry?: GlossaryEntry
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function useGlossary() {
  const getEntriesForLocale = (locale: GlossaryLocale) =>
    glossaryEntries.map((entry) => ({
      ...entry,
      localizedKeywords: Array.from(new Set([
        entry.term[locale],
        ...entry.keywords[locale],
      ])).sort((a, b) => b.length - a.length),
    }));

  const annotateText = (text: string, locale: GlossaryLocale): GlossaryMatchSegment[] => {
    if (!text.trim()) {
      return [{ type: 'text', text }];
    }

    const localizedEntries = getEntriesForLocale(locale);
    const keywordMap = new Map<string, GlossaryEntry>();

    for (const entry of localizedEntries) {
      for (const keyword of entry.localizedKeywords) {
        keywordMap.set(keyword.toLowerCase(), entry);
      }
    }

    const alternatives = Array.from(keywordMap.keys())
      .sort((a, b) => b.length - a.length)
      .map((keyword) => escapeRegex(keyword));

    if (!alternatives.length) {
      return [{ type: 'text', text }];
    }

    const regex = new RegExp(`(?<![\\p{L}\\p{N}])(${alternatives.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
    const segments: GlossaryMatchSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const value = match[0];
      const end = start + value.length;
      const entry = keywordMap.get(value.toLowerCase());

      if (start > lastIndex) {
        segments.push({
          type: 'text',
          text: text.slice(lastIndex, start),
        });
      }

      if (entry) {
        segments.push({
          type: 'term',
          text: value,
          entry,
        });
      } else {
        segments.push({
          type: 'text',
          text: value,
        });
      }

      lastIndex = end;
    }

    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        text: text.slice(lastIndex),
      });
    }

    return segments.length ? segments : [{ type: 'text', text }];
  };

  return {
    glossaryEntries,
    annotateText,
  };
}
