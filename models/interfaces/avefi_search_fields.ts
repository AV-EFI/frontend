/* eslint-disable */
export default {
    "meta": {
        "name": "avefi_search_display_fields",
        "version": 1,
        "updated": "2025-09-16",
        "notes": "Field order and Elasticsearch paths for AVefi search display and faceting. Developer-facing keys in English; UI labels in German."
    },
    "workvariant": [
        {
            "key": "work.handle",
            "label_de": "efi Handle",
            "path": "handle",
            "keyword_path": "handle.keyword",
            "type": "keyword",
            "order": 1,
            "show": true,
            "facet": false
        },
        {
            "key": "work.primary_title",
            "label_de": "Primärtitel",
            "path": "has_record.has_primary_title.has_name",
            "keyword_path": "has_record.has_primary_title.has_name.keyword",
            "type": "text_keyword",
            "order": 2,
            "show": true,
            "facet": false
        },
        {
            "key": "work.alternative_titles",
            "label_de": "Alternative Titel",
            "path": "has_record.has_alternative_title.has_name",
            "keyword_path": "has_record.has_alternative_title.has_name.keyword",
            "type": "text_keyword",
            "order": 3,
            "show": true,
            "facet": false
        },
        {
            "key": "work.production_places",
            "label_de": "Produktionsorte",
            "path": "has_record.has_event.located_in.has_name",
            "keyword_path": "has_record.has_event.located_in.has_name.keyword",
            "nested_path": "has_record.has_event",
            "type": "text_keyword",
            "order": 4,
            "show": true,
            "facet": true
        },
        {
            "key": "work.production_years",
            "label_de": "Produktionsjahre",
            "path_display": "years",
            "keyword_path": "years.keyword",
            "range_path": "production_in_year",
            "type": "range+keyword_display",
            "order": 5,
            "show": true,
            "facet": true
        },
        {
            "key": "work.directors_or_editors",
            "label_de": "Regisseure/Editoren",
            "path": "directors_or_editors",
            "keyword_path": "directors_or_editors.keyword",
            "type": "text_keyword",
            "order": 6,
            "show": true,
            "facet": true
        },
        {
            "key": "work.form",
            "label_de": "Form",
            "path": "has_record.has_form",
            "keyword_path": "has_record.has_form.keyword",
            "type": "text_keyword",
            "order": 7,
            "show": true,
            "facet": true
        },
        {
            "key": "work.episode_indicator",
            "label_de": "Episode/Teil-Indikator",
            "path": "is_part_of.id",
            "keyword_path": "is_part_of.id.keyword",
            "type": "text_keyword",
            "order": 8,
            "show": true,
            "facet": false
        },
        {
            "key": "work.production_events",
            "label_de": "Produktions-Events",
            "path": "has_record.has_event",
            "type": "nested_block",
            "order": 9,
            "show": true,
            "facet": false,
            "schema": {
                "date_path": "has_record.has_event.has_date",
                "activity_path": "has_record.has_event.has_activity.category.keyword",
                "place_name_path": "has_record.has_event.located_in.has_name.keyword"
            }
        },
        {
            "key": "work.genre",
            "label_de": "Genre",
            "path": "has_record.has_genre.has_name",
            "keyword_path": "has_record.has_genre.has_name.keyword",
            "type": "text_keyword",
            "order": 10,
            "show": true,
            "facet": true
        },
        {
            "key": "work.subjects",
            "label_de": "Subjects/Themen",
            "path": "has_record.has_subject.has_name",
            "keyword_path": "has_record.has_subject.has_name.keyword",
            "type": "text_keyword",
            "order": 11,
            "show": true,
            "facet": true
        }
    ],
    "manifestation": [
        {
            "key": "manifestation.handle",
            "label_de": "efi Handle",
            "path": "manifestations.handle",
            "keyword_path": "manifestations.handle.keyword",
            "nested_path": "manifestations",
            "type": "keyword",
            "order": 1,
            "show": true,
            "facet": false
        },
        {
            "key": "manifestation.issuer_name",
            "label_de": "Issuer Name",
            "path": "manifestations.has_record.described_by.has_issuer_name",
            "keyword_path": "manifestations.has_record.described_by.has_issuer_name.keyword",
            "nested_path": "manifestations",
            "type": "text_keyword",
            "order": 2,
            "show": true,
            "facet": true
        },
        {
            "key": "manifestation.language",
            "label_de": "Sprache",
            "path": "manifestations.in_language.code",
            "keyword_path": "manifestations.in_language.code.keyword",
            "nested_path": "manifestations",
            "type": "keyword",
            "order": 3,
            "show": true,
            "facet": true
        },
        {
            "key": "manifestation.sound_type",
            "label_de": "Ton (Sound Type)",
            "path": "manifestations.has_record.has_sound_type",
            "keyword_path": "manifestations.has_record.has_sound_type.keyword",
            "nested_path": "manifestations",
            "type": "keyword",
            "order": 4,
            "show": true,
            "facet": true
        },
        {
            "key": "manifestation.colour_type",
            "label_de": "Farbe (Colour Type)",
            "path": "manifestations.has_record.has_colour_type",
            "keyword_path": "manifestations.has_record.has_colour_type.keyword",
            "nested_path": "manifestations",
            "type": "keyword",
            "order": 5,
            "show": true,
            "facet": true
        },
        {
            "key": "manifestation.duration",
            "label_de": "Abspieldauer",
            "path": "manifestations.duration_in_minutes",
            "nested_path": "manifestations",
            "type": "integer",
            "order": 6,
            "show": true,
            "facet": false,
            "alt_paths": [
                "manifestations.has_record.has_duration.has_value"
            ]
        },
        {
            "key": "manifestation.extent",
            "label_de": "Länge / Größe (Extent)",
            "path": "manifestations.has_record.has_extent.has_value",
            "keyword_path": "manifestations.has_record.has_extent.has_value.keyword",
            "nested_path": "manifestations",
            "type": "text_keyword",
            "order": 7,
            "show": true,
            "facet": false
        },
        {
            "key": "manifestation.webresource",
            "label_de": "Webresource-Link",
            "path": "manifestations.has_record.has_webresource",
            "keyword_path": "manifestations.has_record.has_webresource.keyword",
            "nested_path": "manifestations",
            "type": "url",
            "order": 8,
            "show": false,
            "facet": false
        }
    ],
    "item": [
        {
            "key": "item.handle",
            "label_de": "efi Handle",
            "path": "items.handle",
            "keyword_path": "items.handle.keyword",
            "nested_path": "items",
            "type": "keyword",
            "order": 1,
            "show": true,
            "facet": false
        },
        {
            "key": "item.material_type",
            "label_de": "Materialart",
            "path": "items.has_record.has_format.type",
            "keyword_path": "items.has_record.has_format.type.keyword",
            "nested_path": "items",
            "type": "keyword",
            "order": 2,
            "show": true,
            "facet": true,
            "alt_paths": [
                "items.has_record.element_type.keyword"
            ]
        },
        {
            "key": "item.language",
            "label_de": "Sprache",
            "path": "items.in_language.code",
            "keyword_path": "items.in_language.code.keyword",
            "nested_path": "items",
            "type": "keyword",
            "order": 3,
            "show": true,
            "facet": true
        },
        {
            "key": "item.sound_type",
            "label_de": "Ton (Sound Type)",
            "path": "items.has_record.has_sound_type",
            "keyword_path": "items.has_record.has_sound_type.keyword",
            "nested_path": "items",
            "type": "keyword",
            "order": 4,
            "show": true,
            "facet": true
        },
        {
            "key": "item.colour_type",
            "label_de": "Farbe (Colour Type)",
            "path": "items.has_record.has_colour_type",
            "keyword_path": "items.has_record.has_colour_type.keyword",
            "nested_path": "items",
            "type": "keyword",
            "order": 5,
            "show": true,
            "facet": true
        },
        {
            "key": "item.duration",
            "label_de": "Abspieldauer",
            "path": "items.duration_in_minutes",
            "nested_path": "items",
            "type": "integer",
            "order": 6,
            "show": true,
            "facet": false,
            "alt_paths": [
                "items.has_record.has_duration.has_value"
            ]
        },
        {
            "key": "item.extent",
            "label_de": "Länge / Größe (Extent)",
            "path": "items.has_record.has_extent.has_value",
            "keyword_path": "items.has_record.has_extent.has_value.keyword",
            "nested_path": "items",
            "type": "text_keyword",
            "order": 7,
            "show": true,
            "facet": false
        },
        {
            "key": "item.bps",
            "label_de": "BPS",
            "path": "items.has_record.has_frame_rate",
            "keyword_path": "items.has_record.has_frame_rate.keyword",
            "nested_path": "items",
            "type": "keyword",
            "order": 8,
            "show": true,
            "facet": true
        },
        {
            "key": "item.webresource",
            "label_de": "Webresource-Link",
            "path": "items.has_record.has_webresource",
            "keyword_path": "items.has_record.has_webresource.keyword",
            "nested_path": "items",
            "type": "url",
            "order": 9,
            "show": true,
            "facet": false
        }
    ]
};