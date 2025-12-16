/* eslint-disable camelcase */
import type { SearchkitConfig } from "searchkit";

// move creds to server-side for runtime.private access
export const config: SearchkitConfig = {
    connection: {
        host: "http://141.5.105.237:9200",
    },
    search_settings: {
        search_attributes: [
            { field: "has_record.has_primary_title.has_name", weight: 2 },
            { field: "has_record.has_alternative_title.has_name", weight: 2 },
            { field: "production", weight: 1 },
            { field: "directors_or_editors", weight: 1 },
            { field: "subjects", weight: 1 },
        ],
        highlight_attributes: [
            "has_record.has_primary_title.has_name",
            "has_record.has_alternative_title.has_name",
            "production",
            "directors_or_editors",
            "subjects",
        ],
        result_attributes: [
            "@timestamp",
            "has_record.described_by",
            "has_record.has_primary_title.has_name",
            "has_record.has_alternative_title",
            "has_record.category",
            "has_record.has_form",
            "has_record.is_part_of",
            "subjects",
            "handle",
            "production",
            "directors_or_editors",
            "castmembers",
            "has_record.has_genre.has_name",
            "years",
            "has_record.has_event.located_in",

            // ---- Manifestation-level event type (needed for rendering) ----
            "manifestations.has_record.has_event.type",
            "manifestations.has_event.type",

            // ---- Manifestation basics that may still be useful in details ----
            "manifestations.handle",
            "manifestations.has_record.described_by.has_issuer_name",
            "manifestations.has_record.is_manifestation_of",

            // ---- ITEMS (exemplar level) – shown + faceted ----
            "manifestations.items",
            "manifestations.items.has_record.has_access_status",
            "manifestations.items.has_record.has_format.type",
            "manifestations.items.has_record.has_colour_type",
            "manifestations.items.has_record.has_sound_type",
            "manifestations.items.has_record.in_language.code",
            "manifestations.items.has_record.element_type",
            "manifestations.items.has_record.has_duration.has_value", // string duration
            "manifestations.items.has_record.has_extent.has_value",   // length string
            "manifestations.items.duration_in_minutes",               // numeric duration

            // work-level numeric window (range field helpers if you use them)
            "production_in_year.lte",
            "production_in_year.gte",
        ],
        facet_attributes: [
            // ----- Work-level numeric filters -----
            {
                attribute: "production_year_start",
                field: "production_in_year.lte",
                type: "numeric",
            },
            {
                attribute: "production_year_end",
                field: "production_in_year.gte",
                type: "numeric",
            },

            // ----- Work-level strings -----
            {
                attribute: "has_genre_has_name",
                field: "has_record.has_genre.has_name.keyword",
                type: "string",
            },
            {
                attribute: "subjects",
                field: "subjects.keyword",
                type: "string",
            },
            {
                attribute: "directors_or_editors",
                field: "directors_or_editors.keyword",
                type: "string",
            },
            {
                attribute: "castmembers",
                field: "castmembers.keyword",
                type: "string",
            },
            {
                attribute: "production",
                field: "production.keyword",
                type: "string",
            },
            // Work-level: event locations (nested)
            {
                attribute: "located_in_has_name",
                field: "located_in.has_name.keyword",
                type: "string",
                nestedPath: "has_record.has_event",
            },
            // ----- Manifestation-level facets -----
            {
                attribute: "manifestation_event_type",
                field: "type.keyword",
                type: "string",
                nestedPath: "manifestations.has_record.has_event",
            },
            {
                attribute: "has_issuer_name",
                field: "has_record.described_by.has_issuer_name.keyword",
                type: "string",
                nestedPath: "manifestations",
            },            
            // ----- Item-level (exemplare) -----
            {
                attribute: "has_access_status",
                field: "has_record.has_access_status.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            {
                attribute: "has_format_type",
                field: "has_record.has_format.type.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            {
                attribute: "has_colour_type",
                field: "has_record.has_colour_type.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            {
                attribute: "has_sound_type",
                field: "has_record.has_sound_type.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            {
                attribute: "in_language_code",
                field: "has_record.in_language.code.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            {
                attribute: "has_duration_has_value",
                field: "has_record.has_duration.has_value.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            {
                attribute: "has_extent_has_value",
                field: "has_record.has_extent.has_value.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },
            /*
            {
                attribute: "item_duration_in_minutes",
                field: "duration_in_minutes",
                type: "numeric",
                nestedPath: "manifestations.items",
            },
            */
            {
                attribute: "item_element_type",
                field: "has_record.element_type.keyword",
                type: "string",
                nestedPath: "manifestations.items",
            },

            // Work-level form
            {
                attribute: "has_form",
                field: "has_record.has_form.keyword",
                type: "string",
            },
        ],
        sorting: {
            default: [
                { field: "_score", order: "desc" },
                { field: "has_record.has_primary_title.has_name.keyword", order: "asc" },
            ],
            _title_asc: {
                field: "has_record.has_primary_title.has_name",
                order: "asc",
            },
            _title_desc: {
                field: "has_record.has_primary_title.has_name",
                order: "desc",
            },
            _country_asc: {
                field: "country",
                order: "asc",
            },
            _country_desc: {
                field: "country",
                order: "desc",
            },
            _year_asc: {
                field: "year",
                order: "asc",
            },
            _year_desc: {
                field: "year",
                order: "desc",
            },
            _directors_asc: {
                field: "directors_or_editors",
                order: "asc",
            },
            _directors_desc: {
                field: "directors_or_editors",
                order: "desc",
            },
            _production_asc: {
                field: "production",
                order: "asc",
            },
            _production_desc: {
                field: "production",
                order: "desc",
            },
        },
    // snippet_attributes: ['plot'],
    },
};
