/* eslint-disable */
/**
 * Interface and configuration for facet icon mappings
 * Maps attribute names to Tabler icon names for use in search facets
 */

export interface IFacetIconMapping {
  [attributeName: string]: string;
}

export type FacetLevel = 'work' | 'manifestation' | 'item';

export interface IFacetLevelMapping {
  [attributeName: string]: FacetLevel;
}

/**
 * Comprehensive facet icon mapping for all available search fields
 * Maps Elasticsearch attribute names to Tabler icon names
 */
export const FACET_ICON_MAP: IFacetIconMapping = {
  // Language fields
  'lang': 'tabler-language',
  'in_language': 'tabler-language',
  'in_language_code': 'tabler-language',
  'manifestations.in_language.code': 'tabler-language',
  'items.in_language.code': 'tabler-language',

  // Color/Colour type fields
  'colour': 'tabler-palette',
  'has_colour': 'tabler-palette',
  'has_colour_type': 'tabler-palette',
  'manifestations.has_record.has_colour_type': 'tabler-palette',
  'items.has_record.has_colour_type': 'tabler-palette',

  // Sound type fields
  'sound': 'tabler-volume',
  'has_sound_type': 'tabler-volume',
  'manifestations.has_record.has_sound_type': 'tabler-volume',
  'items.has_record.has_sound_type': 'tabler-volume',

  // Access/status fields
  'accessStatus': 'tabler-lock-open',
  'has_access_status': 'tabler-lock-open',
  'items.has_record.has_access_status': 'tabler-lock-open',

  // Duration fields
  'duration': 'tabler-clock-hour-3',
  'has_duration_has_value': 'tabler-clock-hour-3',
  'item_duration_in_minutes': 'tabler-clock-hour-3',
  'duration_in_minutes': 'tabler-clock-hour-3',
  'manifestations.duration_in_minutes': 'tabler-clock-hour-3',
  'items.duration_in_minutes': 'tabler-clock-hour-3',
  'manifestations.has_record.has_duration.has_value': 'tabler-clock-hour-3',
  'items.has_record.has_duration.has_value': 'tabler-clock-hour-3',

  // Extent/Size fields
  'extent': 'tabler-ruler',
  'avefi:Extent': 'tabler-ruler',
  'has_extent_has_value': 'tabler-ruler',
  'manifestations.has_record.has_extent.has_value': 'tabler-ruler',
  'items.has_record.has_extent.has_value': 'tabler-ruler',

  // Material/Format/Element type fields
  'elementType': 'tabler-movie',
  'item_element_type': 'tabler-movie',
  'format': 'tabler-disc',
  'has_format_type': 'tabler-disc',
  'items.has_record.has_format.type': 'tabler-disc',
  'items.has_record.element_type': 'tabler-movie',

  // Event and production fields
  'eventType': 'tabler-calendar-event',
  'prod_events': 'tabler-calendar-event',
  'manifestation_event_type': 'tabler:topology-star-ring-2',
  'has_record.has_event': 'tabler-calendar-event',
  'mfYear': 'tabler-calendar',
  'production_year_start': 'tabler-calendar',
  'production_year_end': 'tabler-calendar',
  'production_in_year': 'tabler-calendar',
  'years': 'tabler-calendar',

  // Location fields
  'mfPlace': 'tabler-map-pin',
  'located_in': 'tabler-map-pin',
  'located_in_has_name': 'tabler-map-pin',
  'has_record.has_event.located_in.has_name': 'tabler-map-pin',

  // Genre fields
  'genre': 'tabler-category',
  'has_genre_has_name': 'tabler-category',
  'has_record.has_genre.has_name': 'tabler-category',

  // Subject/Topic fields
  'subject': 'tabler-tag',
  'subjects': 'tabler-tag',
  'has_record.has_subject.has_name': 'tabler-tag',

  // People fields
  'creators': 'tabler-chair-director',
  'directors_or_editors': 'tabler-chair-director',
  'castmembers': 'tabler-users',

  // Production/Company fields
  'issuer': 'tabler-building',
  'production': 'tabler-building-factory',
  'has_issuer_name': 'tabler-building',
  'manifestations.has_record.described_by.has_issuer_name': 'tabler-building',

  // Form fields
  'form': 'tabler-shape',
  'has_form': 'tabler-shape',
  'has_record.has_form': 'tabler-shape',

  // Handle/ID fields
  'handle': 'tabler-id',
  'manifestations.handle': 'tabler-id',
  'items.handle': 'tabler-id',

  // Title fields
  'has_record.has_primary_title.has_name': 'tabler-text-recognition',
  'has_record.has_alternative_title.has_name': 'tabler-text-recognition',
  'title': 'tabler-text-recognition',

  // Technical fields
  'fps': 'tabler-refresh',
  'items.has_record.has_frame_rate': 'tabler-refresh',
  'bps': 'tabler-refresh',

  // Web resource fields
  'has_record.has_webresource': 'tabler-link',
  'manifestations.has_record.has_webresource': 'tabler-link',
  'items.has_record.has_webresource': 'tabler-link',

  // Episode/Part indicator
  'episode': 'tabler-hierarchy',
  'is_part_of.id': 'tabler-hierarchy'
};

/**
 * Attribute level mapping for fields whose UI should signal where the data lives.
 * Keep ambiguous display aliases explicit here instead of inferring from icon keys.
 */
export const FACET_LEVEL_MAP: IFacetLevelMapping = {
  // Work-level fields
  'located_in': 'work',
  'located_in_has_name': 'work',
  'years': 'work',
  'creators': 'work',
  'directors_or_editors': 'work',
  'castmembers': 'work',
  'form': 'work',
  'has_form': 'work',
  'prod_events': 'work',
  'genre': 'work',
  'has_genre_has_name': 'work',
  'subject': 'work',
  'subjects': 'work',
  'episode': 'work',
  'is_part_of.id': 'work',

  // Manifestation-level fields
  'eventType': 'manifestation',
  'manifestation_event_type': 'manifestation',
  'mfYear': 'manifestation',
  'mfPlace': 'manifestation',
  'issuer': 'manifestation',
  'has_issuer_name': 'manifestation',
  'manifestations.handle': 'manifestation',
  'manifestations.has_record.described_by.has_issuer_name': 'manifestation',
  'manifestations.has_record.has_event': 'manifestation',
  'manifestations.has_record.has_colour_type': 'manifestation',
  'manifestations.has_record.has_sound_type': 'manifestation',
  'manifestations.has_record.has_duration.has_value': 'manifestation',
  'manifestations.has_record.has_extent.has_value': 'manifestation',
  'manifestations.has_record.has_webresource': 'manifestation',

  // Item/exemplar-level fields
  'accessStatus': 'item',
  'has_access_status': 'item',
  'format': 'item',
  'has_format_type': 'item',
  'elementType': 'item',
  'item_element_type': 'item',
  'lang': 'item',
  'in_language': 'item',
  'in_language_code': 'item',
  'sound': 'item',
  'has_sound_type': 'item',
  'colour': 'item',
  'has_colour_type': 'item',
  'duration': 'item',
  'has_duration_has_value': 'item',
  'item_duration_in_minutes': 'item',
  'extent': 'item',
  'has_extent_has_value': 'item',
  'fps': 'item',
  'bps': 'item',
  'has_frame_rate': 'item',
  'has_webresource': 'item',
  'items.handle': 'item',
  'items.has_record.has_access_status': 'item',
  'items.has_record.has_format.type': 'item',
  'items.has_record.element_type': 'item',
  'items.has_record.in_language.code': 'item',
  'items.has_record.has_colour_type': 'item',
  'items.has_record.has_sound_type': 'item',
  'items.has_record.has_duration.has_value': 'item',
  'items.has_record.has_extent.has_value': 'item',
  'items.has_record.has_frame_rate': 'item',
  'items.has_record.has_webresource': 'item',
  'items.duration_in_minutes': 'item',
};

const FACET_LEVEL_CLASS_MAP: Record<FacetLevel, Record<'badge' | 'border' | 'bg', string>> = {
  work: {
    badge: 'badge-work',
    border: 'border-work',
    bg: 'bg-work',
  },
  manifestation: {
    badge: 'badge-manifestation',
    border: 'border-manifestation',
    bg: 'bg-manifestation',
  },
  item: {
    badge: 'badge-item',
    border: 'border-item',
    bg: 'bg-item',
  },
};

const FACET_LEVEL_TOKEN_MAP: Record<FacetLevel, string> = {
  work: 'var(--color-work)',
  manifestation: 'var(--color-manifestation)',
  item: 'var(--color-item)',
};

/**
 * Get the appropriate icon for a given attribute name
 * @param attributeName - The Elasticsearch attribute name
 * @param fallback - Fallback icon if no specific mapping exists
 * @returns Tabler icon name
 */
export function getFacetIcon(attributeName: string, fallback: string = 'tabler-adjustments-horizontal'): string {
  return FACET_ICON_MAP[attributeName] || fallback;
}

/**
 * Check if an attribute has a specific icon mapping
 * @param attributeName - The Elasticsearch attribute name
 * @returns boolean indicating if a specific icon exists
 */
export function hasFacetIcon(attributeName: string): boolean {
  return attributeName in FACET_ICON_MAP;
}

/**
 * Get the data level for a given attribute name.
 * @param attributeName - The Elasticsearch attribute or display alias
 * @param fallback - Fallback level if no specific mapping exists
 * @returns level where the field belongs
 */
export function getFacetLevel(attributeName: string, fallback?: FacetLevel): FacetLevel | undefined {
  return FACET_LEVEL_MAP[attributeName] || fallback;
}

/**
 * Get an existing level class for a given attribute name.
 * @param attributeName - The Elasticsearch attribute or display alias
 * @param kind - Which class family to return
 * @param fallback - Fallback class if no specific mapping exists
 * @returns CSS class for the field level
 */
export function getFacetLevelClass(
  attributeName: string,
  kind: 'badge' | 'border' | 'bg' = 'badge',
  fallback: string = ''
): string {
  const level = getFacetLevel(attributeName);
  return level ? FACET_LEVEL_CLASS_MAP[level][kind] : fallback;
}

/**
 * Get a CSS color token for a given attribute name.
 * @param attributeName - The Elasticsearch attribute or display alias
 * @param fallback - Fallback CSS color if no specific mapping exists
 * @returns CSS color token for the field level
 */
export function getFacetLevelColor(attributeName: string, fallback: string = ''): string {
  const level = getFacetLevel(attributeName);
  return level ? FACET_LEVEL_TOKEN_MAP[level] : fallback;
}
