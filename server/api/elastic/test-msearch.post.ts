import Client, { SearchkitConfig, ElasticsearchResponseBody } from '@searchkit/api';
import {config} from '@/searchConfig_avefi';
import {Client as EsClient} from '@elastic/elasticsearch';


export default defineEventHandler(async (event) => {
    const apiClient = Client(config, {debug: true});
    const body = await readBody(event);

    try {
        //body = body.replace("avefi:", "avefi\:");
        const esClient = new EsClient({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });
        const result = esClient.search({
            "aggs": {
                "level_grouping": {
                    "composite": {
                        "sources": [
                            { 
                                "work_id": { 
                                    "terms": {
                                        "field": "has_record.is_manifestation_of.id.keyword"
                                    } 
                                }
                            },
                            {
                                "category": { 
                                    "terms": { 
                                        "field": "has_record.category.keyword"
                                    }
                                }
                            },
                            {
                                "title": { 
                                    "terms": { 
                                        "field": "has_record.has_primary_title.has_name.keyword"
                                    }
                                }
                            }
                        ]
                    }, 
                    "aggs": {
                        "tops": {
                            "top_hits": {
                                "size": 30
                            }
                        }
                    }
                }
            }
        });

        return await result as ElasticsearchResponseBody;
        /*
        const response = await apiClient.searchkit.handleInstantSearchRequests(body,
            {
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
                                    },
                                ],
                            },
                        }
                    ];        
                }
            });
        return response;
        */
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