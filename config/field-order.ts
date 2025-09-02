// config/field-order.ts
export type ViewKind = 'detail' | 'search';
export type EntityKind = 'workVariant' | 'manifestation' | 'item';

export interface FieldOrderConfig {
    order: string[];
    hidden?: string[];
    aliases?: Record<string, string[]>;
    pin?: {
        before?: Record<string, string[]>;
        after?: Record<string, string[]>;
    };
}

export type UIOrderConfig = Record<ViewKind, Record<EntityKind, FieldOrderConfig>>;

export const UI_FIELD_ORDER: UIOrderConfig = {
    detail: {
        workVariant: {
            order: [
                'efi_handle', 'primary_title', 'same_as', 'alternative_titles',
                'production_events', 'cast', 'credits',
                'production_years', 'production_places',
                'genre', 'subjects', 'last_modified', 'episode_indicator'
            ],
            hidden: ['efi_handle_2'],
            aliases: {
                efi_handle: ['handle', 'has_record.described_by.has_issuer_id'],
                primary_title: ['has_record.has_primary_title.has_name'],
                alternative_titles: ['has_record.has_alternative_title.has_name'],
                same_as: ['same_as.id'],
                production_years: ['production_in_year', 'years.keyword'],
                production_places: ['has_record.has_event[].located_in.has_name'],
                cast: ['castmembers', 'has_record.has_event[].has_activity[].has_agent.has_name'],
                credits: ['directors_or_editors', 'has_record.has_event[].has_activity[].has_agent.has_name'],
                genre: ['has_record.has_genre.has_name'],
                subjects: ['has_record.has_subject.has_name', 'subjects'],
                episode_indicator: ['is_part_of.id'],
                last_modified: ['@timestamp']
            }
        },
        manifestation: {
            order: [
                'efi_handle', 'title', 'holding_institution', 'web_resource', 'note',
                'duration', 'extent', 'language', 'colour_type', 'sound_type',
                'event_type', 'manifestation_type', 'publisher', 'production_year', 'place',
                'items'
            ],
            aliases: {
                efi_handle: ['handle'],
                title: ['has_primary_title.has_name', 'has_record.has_primary_title.has_name'],
                holding_institution: ['has_record.described_by.has_issuer_name'],
                web_resource: ['has_webresource', 'same_as.id'],
                note: ['has_note'],
                duration: ['has_duration.has_value'],
                extent: ['has_extent.has_value'],
                extent_unit: ['has_extent.has_unit'],
                language: ['in_language.code'],
                colour_type: ['has_colour_type'],
                sound_type: ['has_sound_type'],
                event_type: ['has_event[].type', 'has_event[].category'],
                publisher: ['has_event[].has_activity[].has_agent.has_name'],
                production_year: ['has_event[].has_date'],
                place: ['has_event[].located_in.has_name'],
                items: ['has_item.id']
            },
            // hidden, pin, etc. can be added as needed
        },
        item: {
            order: [
                'efi_handle', 'status', 'duration', 'format', 'extent', 'material_type',
                'colour_type', 'web_resource', 'language', 'sound_type'
            ],
            hidden: ['bps'],
            aliases: {
                efi_handle: ['handle'],
                status: ['has_record.has_access_status'],
                material_type: ['element_type', 'has_format.category'],
                format: ['has_format.type'],
                duration: ['has_duration.has_value'],
                extent: ['has_extent.has_value'],
                extent_unit: ['has_extent.has_unit'],
                language: ['in_language.code'],
                colour_type: ['has_colour_type'],
                sound_type: ['has_sound_type'],
                web_resource: ['has_webresource', 'same_as.id'],
                bps: ['has_frame_rate']
            }
        }
    },
    search: {
        workVariant: { order: [] },
        manifestation: { order: [] },
        item: { order: [] }
    }
};
