import type { SchemaSlot } from './schemaModel';

export type ExplorerLocale = 'de' | 'en';

type Term = { de: string; en: string };

/**
 * Terms the AVefi importer uses for its mapping targets (src/i18n/locales/{de,en}/mapping.json,
 * MIT, (c) 2026 Andreas Kasper for the AVefi project). They take precedence over the schema's
 * own aliases so that archivists see the same words here and in the importer.
 */
const IMPORTER_TERMS: Record<string, Term> = {
  has_primary_title: { de: 'Haupttitel', en: 'Main title' },
  has_alternative_title: { de: 'Weiterer Titel', en: 'Alternative title' },
  'WorkVariant.type': { de: 'Werkart', en: 'Work type' },
  variant_type: { de: 'Variantentyp', en: 'Variant type' },
  has_form: { de: 'Form', en: 'Form' },
  has_genre: { de: 'Genre', en: 'Genre' },
  has_subject: { de: 'Schlagwort', en: 'Subject' },
  element_type: { de: 'Elementart', en: 'Element type' },
  has_colour_type: { de: 'Farbe', en: 'Colour' },
  has_sound_type: { de: 'Ton', en: 'Sound' },
  has_frame_rate: { de: 'Bildfrequenz', en: 'Frame rate' },
  has_access_status: { de: 'Zugangsstatus', en: 'Access status' },
  has_duration: { de: 'Laufzeit', en: 'Duration' },
  has_format: { de: 'Format', en: 'Format' },
  in_language: { de: 'Sprache', en: 'Language' },
  has_note: { de: 'Anmerkung', en: 'Note' },
  has_webresource: { de: 'Weblink', en: 'Web link' },
};

/**
 * Plain-language terms for fields the importer has no target for. They translate the schema
 * name word for word and follow the schema's own pattern ("Variante von", "Kopie von").
 * Editorial draft: to be agreed with the project glossary.
 */
const DRAFT_TERMS: Record<string, Term> = {
  category: { de: 'Kategorie', en: 'Category' },
  has_identifier: { de: 'Kennung', en: 'Identifier' },
  same_as: { de: 'Verknüpfung', en: 'Link' },
  has_event: { de: 'Ereignis', en: 'Event' },
  is_manifestation_of: { de: 'Manifestation von', en: 'Manifestation of' },
  has_item: { de: 'Exemplare', en: 'Items' },
  is_item_of: { de: 'Exemplar von', en: 'Item of' },
  is_part_of: { de: 'Teil von', en: 'Part of' },
  'Event.has_date': { de: 'Datum', en: 'Date' },
  'Event.located_in': { de: 'Ort', en: 'Place' },
  'Event.has_activity': { de: 'Aktivität', en: 'Activity' },
  'Activity.type': { de: 'Art der Aktivität', en: 'Kind of activity' },
  'Activity.has_agent': { de: 'Beteiligte', en: 'Participant' },
  'Agent.has_name': { de: 'Name', en: 'Name' },
  'Agent.has_alternate_name': { de: 'Weiterer Name', en: 'Alternative name' },
  'Agent.type': { de: 'Art', en: 'Kind' },
  'Title.has_name': { de: 'Titel', en: 'Title' },
  'Title.has_ordering_name': { de: 'Sortiertitel', en: 'Ordering title' },
  'Title.type': { de: 'Titeltyp', en: 'Title type' },
  has_issuer_id: { de: 'Kennung des Datengebers', en: 'Data provider ID' },
  has_issuer_name: { de: 'Datengeber', en: 'Data provider' },
  last_modified: { de: 'Zuletzt geändert', en: 'Last modified' },
  id: { de: 'EFI-Kennung', en: 'EFI identifier' },
};

/**
 * The words shown for a field: importer term, then the draft term, then the schema's own alias.
 * Null means no agreed term exists; the explorer then shows the technical name alone.
 */
export function fieldTerm(classId: string, slot: SchemaSlot, locale: ExplorerLocale): string | null {
  const keys = [`${classId}.${slot.name}`, slot.name];
  for (const table of [IMPORTER_TERMS, DRAFT_TERMS]) {
    for (const key of keys) if (table[key]) return table[key][locale];
  }
  return (locale === 'de' ? slot.labelDe : slot.labelEn) ?? null;
}
