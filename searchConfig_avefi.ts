/* eslint-disable camelcase */

import type { SearchkitConfig } from "searchkit";

//move creds to server-side for runtime.private access
export const config:SearchkitConfig = {
    connection: {
        //host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
        host: 'http://141.5.105.237:9200',
        // if you are authenticating with api key
        // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
        //apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    },
    search_settings: {        
        search_attributes: [
            { field: 'has_record.has_primary_title.has_name', weight: 3 }, 
            { field: 'production', weight: 1 },
            { field: 'directors_or_editors', weight: 1 },
            { field: 'castmembers', weight: 1 },
            { field: 'subjects', weight: 1 },
        ],
        highlight_attributes: [
            'has_record.has_primary_title.has_name',
            'production',
            'directors_or_editors',
            'castmembers',
            'subjects',
        ],
        result_attributes: [
            'has_record.has_primary_title.has_name',
            'has_record.category',
            'subjects',
            'handle',
            'production',
            'directors_or_editors',
            'castmembers',
            'has_record.has_genre.has_name',
            'years',
            'has_record.has_event.located_in',
            'manifestations.handle',
            'manifestations.has_record.has_duration.has_value',
            'manifestations.has_record.described_by.has_issuer_name',
            'manifestations.items.has_record.has_format.type',
            'manifestations.has_record.has_colour_type',
            'manifestations.has_record.has_sound_type',
            'manifestations.has_record.in_language.code',
            'manifestations.items'
        ],    
        facet_attributes: [
            { 
                attribute: 'has_sound_type', 
                field: 'has_record.has_sound_type.keyword',  // field must be a keyword type field
                type: 'string',
                nestedPath: 'manifestations'
            },
            { 
                attribute: 'in_language_code', 
                field: 'has_record.in_language.code.keyword',  // field must be a keyword type field
                type: 'string',
                nestedPath: 'manifestations'
            },
            { 
                attribute: 'has_genre_has_name', 
                field: 'has_record.has_genre.has_name.keyword',  // field must be a keyword type field
                type: 'string',
            },
            { 
                attribute: 'subjects', 
                field: 'subjects.keyword',  // field must be a keyword type field
                type: 'string',
            },
            {
                attribute: "directors_or_editors",
                field: "directors_or_editors.keyword",
                type: "string"
            },
            {
                attribute: "castmembers",
                field: "castmembers.keyword",
                type: "string"
            },
            {
                attribute: "production",
                field: "production.keyword",
                type: "string"
            },
            {
                attribute: "years",
                field: "years.keyword",
                type: "string"
            },
            {
                attribute: "located_in_has_name",
                field: "located_in.has_name.keyword",
                type: "string",
                nestedPath: 'has_record.has_event'

            },
            {
                attribute: "has_duration_has_value",
                field: "has_record.has_duration.has_value.keyword",
                type: "string",
                nestedPath: 'manifestations'
            },
            {
                attribute: "has_issuer_name",
                field: "has_record.described_by.has_issuer_name.keyword",
                type: "string",
                nestedPath: 'manifestations'
            },
            {
                attribute: "has_format_type",
                field: "has_record.has_format.type.keyword",
                type: "string",
                nestedPath: 'manifestations.items'
            },
            {
                attribute: "has_issuer_name",
                field: "items.has_record.described_by.has_issuer_name.keyword",
                type: "string",
                nestedPath: 'manifestations'
            },
            { 
                attribute: 'has_colour_type', 
                field: 'has_record.has_colour_type.keyword',  // field must be a keyword type field
                type: 'string',
                nestedPath: 'manifestations'
            }
        ],        
        sorting: {
            default: [
                {
                    field: '_score',
                    order: 'desc'
                },
                {
                    field: 'has_record.has_primary_title.has_name.keyword',
                    order: 'asc'
                },
                {
                    field: 'has_record.category.keyword',
                    order: 'desc'
                },
            ],
            _title_asc: {
                field: 'has_record.has_primary_title.has_name',
                order: 'asc'
            },        
            _title_desc: {
                field: 'has_record.has_primary_title.has_name',
                order: 'desc'
            },
            _country_asc: {
                field: 'country',
                order: 'asc'
            },
            _country_desc: {
                field: 'country',
                order: 'desc'
            },        
            _year_asc: {
                field: 'year',
                order: 'asc'
            },        
            _year_desc: {
                field: 'year',
                order: 'desc'
            },
            _directors_asc: {
                field: 'directors_or_editors',
                order: 'asc'
            },
            _directors_desc: {
                field: 'directors_or_editors',
                order: 'desc'
            },        
            _production_asc: {
                field: 'production',
                order: 'asc'
            },
            _production_desc: {
                field: 'production',
                order: 'desc'
            },
        },
        //snippet_attributes: ['plot'],
    }
};