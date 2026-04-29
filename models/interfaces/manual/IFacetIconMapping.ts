/* eslint-disable */
/**
 * Interface and configuration for facet icon mappings
 * Maps attribute names to Tabler icon names for use in search facets
 */

export interface IFacetIconMapping {
  [attributeName: string]: string;
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
