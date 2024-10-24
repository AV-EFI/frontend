import QueryDslTextQueryType, { SearchRequest } from '@searchkit/api';
import Client, { SearchkitConfig } from '@searchkit/api';
import {config} from '@/searchConfig_avefi';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';


export default defineEventHandler(async (event) => {
    const apiClient = Client(config, {debug: true});
    const body = await readBody(event);
    console.log("body");
    console.log(body);
    console.log("body");
    try {
        //body = body.replace("avefi:", "avefi\:");
        const response = await apiClient.searchkit.handleInstantSearchRequests(body, {
            hooks: {
                beforeSearch: async (searchRequests) => {
                    return searchRequests.map((sr:SearchRequest) => {
                        console.log("beforeSearch");
                        console.log(sr);

                        if(sr.body.query) {
                            const quer:QueryDslQueryContainer = sr.body.query;
                            if(quer.bool) {
                                console.log("quer.bool");
                                console.log(quer.bool);
                                sr.body.query = quer;
                                console.log(sr.body.query);
                            }
                        }
                        return {
                            ...sr,
                            body: {
                                ...sr.body,
                                // track_total_hits: true
                            }
                        };
                    });                            

                }
            },
            /* executed as sth like this:
            "query": {
                "bool": {
                    "filter": [{
                        "bool": {
                            "must": [{
                                "exists": {
                                    "field": "has_record.category"
                                }
                            }, {
                                "match_phrase": {
                                    "handle": "*-TEST"
                                }
                            }]
                        }
                    }],
                    "must": {
                        "bool": {
                            "should": [{
                                "bool": {
                                    "should": [{
                                        "multi_match": {
                                            "query": "warte lie",
                                            "fields": ["has_record.has_primary_title.has_name^3", "has_record.category.keyword"],
                                            "fuzziness": "AUTO:4,8"
                                        }
                                    }, {
                                        "multi_match": {
                                            "query": "warte lie",
                                            "fields": ["has_record.has_primary_title.has_name^1.5", "has_record.category.keyword"],
                                            "type": "bool_prefix"
                                        }
                                    }]
                                }
                            }, {
                                "multi_match": {
                                    "query": "warte lie",
                                    "type": "phrase",
                                    "fields": ["has_record.has_primary_title.has_name^6", "has_record.category.keyword"]
                                }
                            }]
                        }
                    }
                }
            },
            */
            /*
            getQuery(query, search_attributes, config) {
                console.log(config);
                console.log(query);
                console.log(search_attributes);

                return; 

            },
            */
            getBaseFilters: () => {
                return [
                    {
                        bool: {
                            must: [
                                {
                                    exists: {
                                        field: "has_record.category"
                                    }
                                },
                                {
                                    match_phrase: {
                                        "handle": "*-TEST"
                                    }
                                }
                            ],
                        },
                    }
                ];        
            }
        });
        return response;
    }
    catch (ex) {
        console.log(ex);
        return null;
    }

    /*
    const { hits } = await client.search({
        index: useRuntimeConfig().public.ELASTIC_INDEX,
        body: {
            query: {
                match: {
                    has_record.is_item_of: documentId
                }
            }
        }
    });
    console.log(hits.hits);
    return hits.hits;

    */
});