/* eslint-disable camelcase */
//move creds to server-side for runtime.private access
export const config = {
    connection: {
        //host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
        host: 'https://commerce-demo.es.us-east4.gcp.elastic-cloud.com:9243',
        // if you are authenticating with api key
        // https://www.searchkit.co/docs/guides/setup-elasticsearch#connecting-with-api-key
        apiKey: 'a2Rha1VJTUJMcGU4ajA3Tm9fZ0Y6MjAzX2pLbURTXy1hNm9SUGZGRlhJdw=='
    },
    future: {
        preserveSharedStateOnUnmount: true,
    },
    settings: {
        routing: true,
    },
    search_settings: {
        highlight_attributes: ['title', 'actors', 'directors'],
        search_attributes: [{ field: 'title', weight: 3 }, 'actors', 'directors'],
        result_attributes: ['title', 'actors', 'directors', 'released'],
        facet_attributes: [
            'type',
            { attribute: 'released', field: 'released', type: 'date' },
            { attribute: 'actors', field: 'actors.keyword', type: 'string' },
            { attribute: 'directors', field: 'directors.keyword', type: 'string' }
        ],
        sorting: {
            default: {
                field: '_score',
                order: 'desc'
            }
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
        query_rules: []
    }
};