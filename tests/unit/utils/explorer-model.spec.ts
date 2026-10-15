import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import de from '~/i18n/locales/de';
import en from '~/i18n/locales/en';
import { explorerDe, explorerEn } from '~/i18n/locales/explorer';
import explorerSchema from '~/assets/data/explorerSchema.json';
import { fieldTerm } from '~/utils/explorer/fieldTerms';
import { FURTHER_LINKS, schemaDocsUrl, vocabularyUrl } from '~/utils/explorer/links';
import {
  LEVELS,
  MATCH_FIELD_KIND,
  RULES,
  getGroup,
  groupDetailFields,
  groupsOfLevel,
  levelCoverage,
  matchFieldCount,
  requiredFieldCount,
  sharedGroups,
} from '~/utils/explorer/model';
import { LEVEL_CLASS, getSchemaClass, getSlot, getSlotByRef, levelSlots, type LevelId } from '~/utils/explorer/schemaModel';

const LEVEL_IDS = LEVELS.map((level) => level.id);

describe('explorer schema data', () => {
  test('matches the schema snapshot it was generated from', () => {
    // Line endings are normalised: the file is CRLF in a Windows checkout and LF in CI.
    const digest = createHash('sha256')
      .update(readFileSync('models/interfaces/schema/model.yaml', 'utf-8').replace(/\r\n/g, '\n'))
      .digest('hex')
      .slice(0, 12);

    // Fails after a schema update until `corepack yarn generate:explorer-schema` has been run.
    expect(explorerSchema.modelDigest).toBe(digest);
  });

  test('resolves inherited fields for the three levels', () => {
    expect(levelSlots('work').map((slot) => slot.name)).toEqual(
      expect.arrayContaining(['has_primary_title', 'has_event', 'type', 'is_variant_of']),
    );
    expect(levelSlots('manifestation').map((slot) => slot.name)).toEqual(
      expect.arrayContaining(['is_manifestation_of', 'has_item', 'has_note', 'has_webresource']),
    );
    expect(levelSlots('item').map((slot) => slot.name)).toEqual(
      expect.arrayContaining(['has_colour_type', 'has_sound_type', 'has_frame_rate', 'is_item_of', 'is_copy_of']),
    );
  });

  test('knows the required fields of each level', () => {
    const required = (level: LevelId) => levelSlots(level).filter((slot) => slot.required).map((slot) => slot.name);

    expect(required('work')).toEqual(expect.arrayContaining(['category', 'has_primary_title', 'type']));
    expect(required('manifestation')).toEqual(expect.arrayContaining(['category', 'is_manifestation_of']));
    expect(required('item')).toEqual(expect.arrayContaining(['category', 'is_item_of']));
    expect(requiredFieldCount()).toBe(LEVEL_IDS.flatMap(required).length);
  });

  test('names the levels as the schema does', () => {
    expect(getSchemaClass('WorkVariant').labelDe).toBe('Werk');
    expect(getSchemaClass('Item').labelDe).toBe('Exemplar');
  });
});

describe('explorer field groups', () => {
  test.each(LEVEL_IDS)('shows every field of the %s level exactly once', (level) => {
    const shown = [...groupsOfLevel(level), ...sharedGroups()].flatMap((group) => group.slots);
    const inSchema = levelSlots(level).map((slot) => slot.name);

    expect([...shown].sort()).toEqual([...inSchema].sort());
    expect(levelCoverage(level)).toEqual({ shown: inSchema.length, total: inSchema.length });
  });

  test('only names fields the schema has', () => {
    for (const group of [...LEVELS.flatMap((level) => groupsOfLevel(level.id)), ...sharedGroups()]) {
      for (const ref of groupDetailFields(group)) expect(() => getSlotByRef(ref)).not.toThrow();
      for (const ref of group.matchFields ?? []) expect(Object.keys(MATCH_FIELD_KIND)).toContain(ref);
    }
    for (const rule of Object.values(RULES)) {
      for (const ref of rule.fields) expect(() => getSlotByRef(ref)).not.toThrow();
    }
  });

  test('counts the match fields of the work match', () => {
    expect(matchFieldCount()).toBe(5);
    expect(getGroup('s_title').matchFields).toEqual(['Title.has_name']);
  });

  test('keeps the item rule on the manifestation side of the relation', () => {
    expect(getSlot('Item', 'is_item_of').required).toBe(true);
    expect(getSlot('Manifestation', 'is_manifestation_of').required).toBe(true);
    expect(LEVEL_CLASS.item).toBe('Item');
  });
});

describe('explorer field terms', () => {
  test('prefers the importer term over the schema alias', () => {
    expect(fieldTerm('WorkVariant', getSlot('WorkVariant', 'has_primary_title'), 'de')).toBe('Haupttitel');
    expect(fieldTerm('Item', getSlot('Item', 'has_colour_type'), 'de')).toBe('Farbe');
    expect(fieldTerm('Item', getSlot('Item', 'has_colour_type'), 'en')).toBe('Colour');
  });

  test('falls back to the schema alias and never invents a term', () => {
    expect(fieldTerm('Item', getSlot('Item', 'is_copy_of'), 'de')).toBe('Kopie von');
    expect(fieldTerm('Item', getSlot('Item', 'is_copy_of'), 'en')).toBe('Copy of');

    const newField = { ...getSlot('Item', 'is_copy_of'), name: 'has_new_field', labelDe: null, labelEn: null };
    expect(fieldTerm('Item', newField, 'de')).toBeNull();
  });

  test('tells the work type apart from the other type fields', () => {
    expect(fieldTerm('WorkVariant', getSlot('WorkVariant', 'type'), 'de')).toBe('Werkart');
    expect(fieldTerm('Title', getSlot('Title', 'type'), 'de')).toBe('Titeltyp');
  });
});

describe('explorer texts', () => {
  const faq = (locale: { faq: { sections: { definitions: { content: unknown } } } }) => (locale.faq.sections.definitions.content as string[])
    .join(' ')
    .replace(/<[^>]+>/g, '');
  const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

  test('quote the definitions of the FAQ word for word', () => {
    const german = faq(de);
    expect(german).toContain(lowerFirst(explorerDe.levels.work.definition));
    expect(german).toContain(explorerDe.levels.item.definition);
    expect(german).toContain(explorerDe.levels.item.hint);
    expect(german).toContain(explorerDe.levels.work.hint);
    expect(german).toContain(explorerDe.levels.manifestation.hint);
    expect(de.tooltip.manifestation).toBe(explorerDe.levels.manifestation.definition);

    const english = faq(en);
    expect(english).toContain(lowerFirst(explorerEn.levels.work.definition));
    expect(english).toContain(explorerEn.levels.item.definition);
    expect(english).toContain(explorerEn.levels.manifestation.definition);
    expect(english).toContain(explorerEn.levels.manifestation.hint);
    expect(english).toContain(explorerEn.levels.work.hint);
    expect(english).toContain(explorerEn.levels.item.hint);
  });

  test('use Werk, Manifestation and Exemplar as level names', () => {
    expect(explorerDe.levels.work.word).toBe('Werk');
    expect(explorerDe.levels.manifestation.word).toBe('Manifestation');
    expect(explorerDe.levels.item.word).toBe('Exemplar');
    const german = JSON.stringify(explorerDe);
    expect(german).not.toMatch(/Fassung/);
    // "Kopie" only names the relation is_copy_of.
    expect(german.match(/Kopie/g)).toHaveLength(1);
    expect(explorerDe.groups.i_relations.plain).toContain('Kopie');
  });

  test('exist in both languages with the same structure', () => {
    const shape = (value: unknown): unknown => {
      if (Array.isArray(value)) return value.map(shape);
      if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, shape(child)]));
      }
      return typeof value;
    };

    expect(shape(explorerEn)).toEqual(shape(explorerDe));
  });
});

describe('explorer links', () => {
  test('point to the schema documentation and the vocabulary page', () => {
    expect(schemaDocsUrl()).toBe('https://av-efi.github.io/av-efi-schema/');
    expect(schemaDocsUrl('has_format')).toBe('https://av-efi.github.io/av-efi-schema/has_format/');
    expect(vocabularyUrl('ColourTypeEnum')).toBe('/vocab?q=ColourTypeEnum');
  });

  test('link FAQ sections that exist', () => {
    const sections = de.faq.sections as Record<string, unknown>;
    for (const link of FURTHER_LINKS.filter((candidate) => candidate.href.startsWith('/faq#'))) {
      const key = link.href.replace('/faq#faq-sections-', '');
      expect(Object.keys(sections)).toContain(key.charAt(0).toLowerCase() + key.slice(1));
    }
  });
});
