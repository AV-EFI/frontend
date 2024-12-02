/* eslint-disable camelcase */

import type { AggregationsFiltersAggregate, AggregationsFiltersBucket } from "@elastic/elasticsearch/lib/api/types";
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
        highlight_attributes: [
            'has_record.has_primary_title.has_name',
            'producers',
            'directors',
            'castmembers'
        ],
        search_attributes: [
            { field: 'producers', weight: 3 },
            { field: 'directors', weight: 3 },
            { field: 'castmembers', weight: 3 },
            { field: 'has_record.has_primary_title.has_name', weight: 3 }, 
            { field: 'has_record.category.keyword',weight: 3 }
        ],
        result_attributes: [
            'has_record.has_primary_title.has_name',             
            'has_record.category',
            'has_record.has_colour_type',
            'has_record.has_event',
            'has_record.is_manifestation_of',
            'handle',
            'producers',
            'directors',
            'castmembers'
        ],    
        facet_attributes: [
            { 
                attribute: 'has_record.category', 
                field: 'has_record.category.keyword',  // field must be a keyword type field
                type: 'string',
            },
            { 
                attribute: 'has_record.has_colour_type', 
                field: 'has_record.has_colour_type.keyword',  // field must be a keyword type field
                type: 'string',
            },
            { 
                attribute: 'has_record.has_event.has_date', 
                field: 'has_record.has_event.has_date.keyword',  // field must be a keyword type field
                type: 'string',
            },
            { 
                attribute: 'has_record.has_subject.has_name', 
                field: 'has_record.has_subject.has_name.keyword',  // field must be a keyword type field
                type: 'string',
            },
            {
                field: "directors",
                attribute: "directors",
                type: "string"
            },
            {
                field: "castmembers",
                attribute: "castmembers",
                type: "string"
            },
            {
                field: "producers",
                attribute: "producers",
                type: "string"
            },
            {
                field: "productionyears",
                attribute: "productionyears",
                type: "string"
            },
            {
                field: "countries",
                attribute: "countries",
                type: "string"
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
            ]
            //activate only when replica indices are available
            /*
            ,
            imdb_movies: {
                field: '_score',
                order: 'desc'
            },
            imdb_movies_title_asc: {
                field: 'imdb_movies_title',
                order: 'asc'
            },
            _title_desc: {
                field: 'title',
                order: 'desc'
            }
                */
        },
        //snippet_attributes: ['plot'],
    }
};