/* eslint-disable */
// search-layout-map.ts
// Exported JSON-like config describing SEARCH view order and ES field paths
// Aligned to the provided Elasticsearch mapping (Sept 2025).

export type Level = 'work' | 'manifestation' | 'item';

export type FieldMapEntry = {
  key: string;                    // stable key for UI/code
  label_de: string;               // display label from your table
  level: Level;                   // where this appears
  orderSuggested: number | null;  // "Reihenfolge (Vorschlag)"
  order_2025_06_08: number | null; // "Reihenfolge (08.06.25)"
  esPath: string | string[] | null; // ES field path(s) from index root (absolute)
  comment?: string;               // notes from table or mapping caveats
  derived?: boolean;              // true if not directly stored (aggregation/compute)
};

// -------- WorkVariant (Search) --------
export const search_workVariant: FieldMapEntry[] = [
    {
        key: 'handle',
        label_de: 'EFI Handle',
        level: 'work',
        orderSuggested: 1,
        order_2025_06_08: 1,
        esPath: 'handle',
        comment: 'Keine Änderungen',
    },
    {
        key: 'primary_title',
        label_de: 'Primärtitel',
        level: 'work',
        orderSuggested: 2,
        order_2025_06_08: 2,
        esPath: 'has_record.has_primary_title.has_name',
    },
    {
        key: 'alt_titles',
        label_de: 'Alternative Titel',
        level: 'work',
        orderSuggested: 3,
        order_2025_06_08: 3,
        esPath: 'has_record.has_alternative_title.has_name',
    },
    {
        key: 'production_places',
        label_de: 'Produktionsorte',
        level: 'work',
        orderSuggested: 4,
        order_2025_06_08: 4,
        esPath: 'has_record.has_event.located_in.has_name',
        comment: 'Work-Ebene hat keinen eigenen "located_in"; kommt aus Events.',
    },
    {
        key: 'production_years',
        label_de: 'Produktionsjahre',
        level: 'work',
        orderSuggested: 5,
        order_2025_06_08: 5,
        esPath: ['years', 'production_in_year'], // convenience string + integer_range
    },
    {
        key: 'directors_or_editors',
        label_de: 'Regisseure/Editoren',
        level: 'work',
        orderSuggested: 6,
        order_2025_06_08: 6,
        esPath: 'directors_or_editors',
    },
    {
        key: 'form',
        label_de: 'Form',
        level: 'work',
        orderSuggested: 7,
        order_2025_06_08: 7,
        esPath: 'has_record.has_form',
    },
    {
        key: 'episode_indicator',
        label_de: 'Episode/Teil-Indikator',
        level: 'work',
        orderSuggested: 8,
        order_2025_06_08: 8,
        esPath: null,
        comment: 'Nicht im Mapping enthalten.',
    },
    {
        key: 'production_events',
        label_de: 'Produktions-Events',
        level: 'work',
        orderSuggested: 9,
        order_2025_06_08: 9,
        esPath: 'has_record.has_event',
        comment: 'Subfelder: has_activity.*, has_date, located_in.*',
    },
    {
        key: 'genre',
        label_de: 'Genre',
        level: 'work',
        orderSuggested: 10,
        order_2025_06_08: 10,
        esPath: 'has_record.has_genre.has_name',
    },
    {
        key: 'subjects',
        label_de: 'Subjects/Themen',
        level: 'work',
        orderSuggested: 11,
        order_2025_06_08: 11,
        esPath: 'subjects',
    },
];

// -------- Manifestation (Search) --------
export const search_manifestation: FieldMapEntry[] = [
    {
        key: 'm_handle',
        label_de: 'EFI Handle',
        level: 'manifestation',
        orderSuggested: 1,
        order_2025_06_08: 1,
        esPath: 'manifestations.handle',
    },
    {
        key: 'm_issuer',
        label_de: 'Issuer Name',
        level: 'manifestation',
        orderSuggested: 2,
        order_2025_06_08: 2,
        esPath: 'manifestations.has_record.described_by.has_issuer_name',
    },
    {
        key: 'm_language',
        label_de: 'Sprache',
        level: 'manifestation',
        orderSuggested: 3,
        order_2025_06_08: 3,
        esPath: null,
        derived: true,
        comment: 'Nicht im Manifestation-Mapping vorhanden; ggf. aus Items der Manifestation aggregieren.',
    },
    {
        key: 'm_sound',
        label_de: 'Ton (Sound Type)',
        level: 'manifestation',
        orderSuggested: 4,
        order_2025_06_08: 5,
        esPath: 'manifestations.has_record.has_sound_type',
        comment: '03–07 Reihenfolge analog zu Item.',
    },
    {
        key: 'm_colour',
        label_de: 'Farbe (Colour Type)',
        level: 'manifestation',
        orderSuggested: 5,
        order_2025_06_08: 4,
        esPath: 'manifestations.has_record.has_colour_type',
    },
    {
        key: 'm_duration',
        label_de: 'Abspieldauer',
        level: 'manifestation',
        orderSuggested: 6,
        order_2025_06_08: 6,
        esPath: 'manifestations.has_record.has_duration.has_value',
    },
    {
        key: 'm_extent',
        label_de: 'Länge / Größe (Extent)',
        level: 'manifestation',
        orderSuggested: 7,
        order_2025_06_08: 7,
        esPath: ['manifestations.has_record.has_extent.has_value', 'manifestations.has_record.has_extent.has_unit'],
    },
];

// -------- Item (Search) --------
export const search_item: FieldMapEntry[] = [
    {
        key: 'i_handle',
        label_de: 'EFI Handle',
        level: 'item',
        orderSuggested: 1,
        order_2025_06_08: 1,
        esPath: 'items.handle',
    },
    {
        key: 'i_element_type',
        label_de: 'Materialart',
        level: 'item',
        orderSuggested: 2,
        order_2025_06_08: 7,
        esPath: 'items.has_record.element_type',
        comment: 'Materialart von 07 auf 02.',
    },
    {
        key: 'i_language',
        label_de: 'Sprache',
        level: 'item',
        orderSuggested: 3,
        order_2025_06_08: 2,
        esPath: ['items.has_record.in_language.code', 'items.has_record.in_language.usage'],
    },
    {
        key: 'i_sound',
        label_de: 'Ton (Sound Type)',
        level: 'item',
        orderSuggested: 4,
        order_2025_06_08: 4,
        esPath: 'items.has_record.has_sound_type',
        comment: 'Neben Sprache.',
    },
    {
        key: 'i_colour',
        label_de: 'Farbe (Colour Type)',
        level: 'item',
        orderSuggested: 5,
        order_2025_06_08: 3,
        esPath: 'items.has_record.has_colour_type',
        comment: 'Farbe nach Materialart oder gut auf 05?',
    },
    {
        key: 'i_duration',
        label_de: 'Abspieldauer',
        level: 'item',
        orderSuggested: 6,
        order_2025_06_08: 5,
        esPath: 'items.has_record.has_duration.has_value',
    },
    {
        key: 'i_extent',
        label_de: 'Länge / Größe (Extent)',
        level: 'item',
        orderSuggested: 7,
        order_2025_06_08: 6,
        esPath: ['items.has_record.has_extent.has_value', 'items.has_record.has_extent.has_unit'],
    },
    {
        key: 'i_fps',
        label_de: 'BPS',
        level: 'item',
        orderSuggested: 8,
        order_2025_06_08: null, // X
        esPath: 'items.has_record.has_frame_rate',
        comment: 'Zur Suchanzeige dazu?',
    },
    {
        key: 'i_web',
        label_de: 'Webresource-Link',
        level: 'item',
        orderSuggested: 9,
        order_2025_06_08: 8,
        esPath: 'items.has_record.has_webresource',
    },
];

// -------- Combined export --------
export const searchLayout = {
    workVariant: search_workVariant,
    manifestation: search_manifestation,
    item: search_item,
};

export default searchLayout;
