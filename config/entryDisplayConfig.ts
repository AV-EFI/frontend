import type { Level } from '~/types/iconEntry';

export const PRIMARY_ENTRY_KEYS = ['located_in', 'years', 'creators'] as const;
export const THEMATIC_ENTRY_KEYS = ['form', 'prod_events', 'production', 'genre'] as const;
export const VOLATILE_ENTRY_KEYS = ['subject'] as const;

export const ENTRY_ORDER: Record<Level, string[]> = {
  work: ['located_in', 'years', 'creators', 'form', 'episode', 'prod_events', 'production', 'genre', 'subject'],
  manifestation: ['eventType', 'mfYear', 'mfPlace'],
  item: ['format', 'elementType', 'lang', 'sound', 'colour', 'duration', 'extent', 'fps'],
};

/** How many segments to show before the expand toggle appears. */
export const VISIBLE_LIMIT_DEFAULT = 5;
export const VISIBLE_LIMIT_BY_KEY: Record<string, number | 'responsive'> = {
  creators: 3,
  subject: 'responsive',
};
export const VISIBLE_LIMIT_RESPONSIVE = { mobile: 2, desktop: 5 } as const;

/** Maps entry keys to their corresponding clickable-facet attribute names. */
export const FACET_ATTRIBUTE_BY_ENTRY_KEY: Record<string, string> = {
  located_in: 'located_in_has_name',
  creators: 'creators',
  form: 'has_form',
  production: 'production',
  genre: 'has_genre_has_name',
  subject: 'subjects',
  eventType: 'manifestation_event_type',
  mfPlace: 'located_in_has_name',
  accessStatus: 'has_access_status',
  format: 'has_format_type',
  elementType: 'item_element_type',
  lang: 'in_language_code',
  sound: 'has_sound_type',
  colour: 'has_colour_type',
  years: 'productionyear',
  duration: 'has_duration_has_value',
  extent: 'has_extent_has_value',
};
