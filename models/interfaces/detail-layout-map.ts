// detail-layout-map.ts
// Exported JSON-like config describing detail view order and ES field paths
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

// -------- WorkVariant --------
export const workVariant: FieldMapEntry[] = [
    {
        key: 'handle',
        label_de: 'EFI Handle',
        level: 'work',
        orderSuggested: 1,
        order_2025_06_08: 1,
        esPath: 'handle',
        comment: 'Top-level handle',
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
        key: 'handle_2',
        label_de: 'EFI Handle 2',
        level: 'work',
        orderSuggested: null, // X
        order_2025_06_08: 3,
        esPath: null,
        comment: 'Vermutlich Duplikat von "EFI Handle" → Kandidat zum Entfernen.',
    },
    {
        key: 'same_as',
        label_de: 'GND, Filmportal, etc. (Same As)',
        level: 'work',
        orderSuggested: 3,
        order_2025_06_08: 4,
        esPath: ['has_record.same_as.category', 'has_record.same_as.id'],
    },
    {
        key: 'alt_titles',
        label_de: 'Alternative Titel',
        level: 'work',
        orderSuggested: 4,
        order_2025_06_08: 5,
        esPath: 'has_record.has_alternative_title.has_name',
    },
    {
        key: 'production_events',
        label_de: 'Produktions-Events',
        level: 'work',
        orderSuggested: 5,
        order_2025_06_08: 6,
        esPath: 'has_record.has_event', // nested array; see subfields below
        comment: 'Subfelder: has_activity.*, has_date, located_in.*',
    },
    {
        key: 'cast',
        label_de: 'Cast',
        level: 'work',
        orderSuggested: 6,
        order_2025_06_08: 7,
        esPath: 'castmembers',
    },
    {
        key: 'credits',
        label_de: 'Credits',
        level: 'work',
        orderSuggested: 7,
        order_2025_06_08: 8,
        esPath: 'directors_or_editors',
    },
    {
        key: 'production_years',
        label_de: 'Produktionsjahre',
        level: 'work',
        orderSuggested: 9,
        order_2025_06_08: 9,
        esPath: ['years', 'production_in_year'], // convenience string + integer_range
        comment: 'Anzeige bevorzugt "years"; Range als Fallback/Filter.',
    },
    {
        key: 'production_places',
        label_de: 'Produktionsorte',
        level: 'work',
        orderSuggested: 8,
        order_2025_06_08: 10,
        esPath: 'has_record.has_event.located_in.has_name',
        comment: 'Work-Ebene hat keinen eigenen "located_in"; kommt aus Events.',
    },
    {
        key: 'genre',
        label_de: 'Genre',
        level: 'work',
        orderSuggested: 10,
        order_2025_06_08: 11,
        esPath: 'has_record.has_genre.has_name',
    },
    {
        key: 'subjects',
        label_de: 'Schlagwort',
        level: 'work',
        orderSuggested: 11,
        order_2025_06_08: 12,
        esPath: 'subjects',
    },
    {
        key: 'last_modified',
        label_de: 'Letzte Bearbeitung',
        level: 'work',
        orderSuggested: 12,
        order_2025_06_08: 13,
        esPath: 'has_record.described_by.last_modified',
    },
    {
        key: 'episode_indicator',
        label_de: 'Episode/Teil-Indikator',
        level: 'work',
        orderSuggested: null, // X
        order_2025_06_08: null, // X
        esPath: null,
        comment: 'Nicht im Mapping enthalten.',
    },
];

// -------- Manifestation --------
export const manifestation: FieldMapEntry[] = [
    {
        key: 'm_handle',
        label_de: 'EFI Handle',
        level: 'manifestation',
        orderSuggested: 1,
        order_2025_06_08: 1,
        esPath: 'manifestations.handle',
    },
    {
        key: 'm_title',
        label_de: 'Titel',
        level: 'manifestation',
        orderSuggested: 2,
        order_2025_06_08: 2,
        esPath: 'manifestations.has_record.has_primary_title.has_name',
    },
    {
        key: 'm_issuer',
        label_de: 'Datenhaltende Institution',
        level: 'manifestation',
        orderSuggested: 3,
        order_2025_06_08: 3,
        esPath: 'manifestations.has_record.described_by.has_issuer_name',
    },
    {
        key: 'm_web',
        label_de: 'Web-Ressource',
        level: 'manifestation',
        orderSuggested: 4,
        order_2025_06_08: 4,
        esPath: 'manifestations.has_record.has_webresource',
    },
    {
        key: 'm_note',
        label_de: 'Notiz',
        level: 'manifestation',
        orderSuggested: 5,
        order_2025_06_08: 5,
        esPath: 'manifestations.has_record.has_note',
    },
    {
        key: 'm_language',
        label_de: 'Sprache',
        level: 'manifestation',
        orderSuggested: 6,
        order_2025_06_08: 8,
        esPath: null,
        derived: true,
        comment: 'Nicht im Manifestation-Mapping vorhanden; ggf. aus Items aggregieren.',
    },
    {
        key: 'm_sound',
        label_de: 'Ton (Sound Type)',
        level: 'manifestation',
        orderSuggested: 7,
        order_2025_06_08: 10,
        esPath: 'manifestations.has_record.has_sound_type',
    },
    {
        key: 'm_colour',
        label_de: 'Farbe (Colour Type)',
        level: 'manifestation',
        orderSuggested: 8,
        order_2025_06_08: 9,
        esPath: 'manifestations.has_record.has_colour_type',
    },
    {
        key: 'm_duration',
        label_de: 'Abspieldauer',
        level: 'manifestation',
        orderSuggested: 9,
        order_2025_06_08: 6,
        esPath: 'manifestations.has_record.has_duration.has_value',
        comment: 'ISO 8601 Dauer, z. B. PT1H20M.',
    },
    {
        key: 'm_extent',
        label_de: 'Länge / Größe (Extent)',
        level: 'manifestation',
        orderSuggested: 10,
        order_2025_06_08: 7,
        esPath: ['manifestations.has_record.has_extent.has_value', 'manifestations.has_record.has_extent.has_unit'],
    },
    {
        key: 'm_event_type',
        label_de: 'Eventtyp (Event)',
        level: 'manifestation',
        orderSuggested: 11,
        order_2025_06_08: 11,
        esPath: 'manifestations.has_record.has_event.type',
    },
    {
        key: 'm_event_category',
        label_de: 'Manifestationstyp (Event)',
        level: 'manifestation',
        orderSuggested: 12,
        order_2025_06_08: 12,
        esPath: 'manifestations.has_record.has_event.category',
        comment: 'Interpretation: Event-Kategorie als „Typ“.',
    },
    {
        key: 'm_event_agent',
        label_de: 'Herausgeber (Event)',
        level: 'manifestation',
        orderSuggested: 13,
        order_2025_06_08: 13,
        esPath: 'manifestations.has_record.has_event.has_activity.has_agent.has_name',
    },
    {
        key: 'm_event_year',
        label_de: 'Produktionsjahr (Event)',
        level: 'manifestation',
        orderSuggested: 14,
        order_2025_06_08: 14,
        esPath: 'manifestations.has_record.has_event.has_date',
    },
    {
        key: 'm_event_place',
        label_de: 'Ort (Event)',
        level: 'manifestation',
        orderSuggested: 15,
        order_2025_06_08: 15,
        esPath: 'manifestations.has_record.has_event.located_in.has_name',
    },
    {
        key: 'm_items',
        label_de: 'Exemplare',
        level: 'manifestation',
        orderSuggested: 16,
        order_2025_06_08: 16,
        esPath: 'manifestations.has_item', // relation to item ids
    },
];

// -------- Item --------
export const item: FieldMapEntry[] = [
    {
        key: 'i_handle',
        label_de: 'EFI Handle',
        level: 'item',
        orderSuggested: 1,
        order_2025_06_08: 1,
        esPath: 'items.handle',
    },
    {
        key: 'i_status',
        label_de: 'Status',
        level: 'item',
        orderSuggested: 2,
        order_2025_06_08: 2,
        esPath: 'items.has_record.has_access_status',
    },
    {
        key: 'i_element_type',
        label_de: 'Materialart',
        level: 'item',
        orderSuggested: 3,
        order_2025_06_08: 6,
        esPath: 'items.has_record.element_type',
    },
    {
        key: 'i_format',
        label_de: 'Format',
        level: 'item',
        orderSuggested: 4,
        order_2025_06_08: 4,
        esPath: 'items.has_record.has_format.type', // object or array; use .type
        comment: 'Mehrfach möglich: has_format ist Array oder Objekt.',
    },
    {
        key: 'i_language',
        label_de: 'Sprache',
        level: 'item',
        orderSuggested: 5,
        order_2025_06_08: 9,
        esPath: ['items.has_record.in_language.code', 'items.has_record.in_language.usage'],
        comment: 'Anzeige: code (usage, …); Facet auf code.keyword.',
    },
    {
        key: 'i_sound',
        label_de: 'Ton (Sound Type)',
        level: 'item',
        orderSuggested: 6,
        order_2025_06_08: 10,
        esPath: 'items.has_record.has_sound_type',
    },
    {
        key: 'i_colour',
        label_de: 'Farbe (Colour Type)',
        level: 'item',
        orderSuggested: 7,
        order_2025_06_08: 7,
        esPath: 'items.has_record.has_colour_type',
    },
    {
        key: 'i_web',
        label_de: 'Webressource',
        level: 'item',
        orderSuggested: 8,
        order_2025_06_08: 8,
        esPath: 'items.has_record.has_webresource',
        comment: 'UX: ggf. weiter nach oben neben Handle ziehen.',
    },
    {
        key: 'i_duration',
        label_de: 'Abspieldauer',
        level: 'item',
        orderSuggested: 9,
        order_2025_06_08: 3,
        esPath: 'items.has_record.has_duration.has_value',
        comment: 'ISO 8601 Dauer, z. B. PT45M.',
    },
    {
        key: 'i_extent',
        label_de: 'Länge / Größe (Extent)',
        level: 'item',
        orderSuggested: 10,
        order_2025_06_08: 5,
        esPath: ['items.has_record.has_extent.has_value', 'items.has_record.has_extent.has_unit'],
    },
    {
        key: 'i_fps',
        label_de: 'BPS',
        level: 'item',
        orderSuggested: 11,
        order_2025_06_08: null, // X
        esPath: 'items.has_record.has_frame_rate',
        comment: 'BPS = Bilder pro Sekunde (Frame Rate).',
    },
];

// -------- Combined export --------
export const detailLayout = {
    workVariant,
    manifestation,
    item,
};

export default detailLayout;