import QueryDslTextQueryType, { SearchRequest } from '@searchkit/api';
import Client, { SearchkitConfig } from '@searchkit/api';
import {config} from '@/searchConfig_avefi';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

const crushObj = (obj:any = {}) => Object.keys(obj || {}).reduce((acc:any, cur:any) => {
    if (typeof obj[cur] === 'object') {
        acc = { ...acc, ...crushObj(obj[cur])};
    } else { acc[cur] = obj[cur]; }
    return acc;
}, {});

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
                afterSearch: async (requests, responses) => {
                    return responses;
                },
                beforeSearch: async (searchRequests) => {
                    //add "fields":["directors", "producers", "country", "productionyear"]
                    return searchRequests.map((sr) => {
                        return {
                            ...sr,
                            body: {
                                ...sr.body,
                                fields: ["directors", "producers", "country", "productionyear"],
                                track_total_hits: true
                            }
                        };
                    });            
                }
            },
            getBaseFilters: () => {
                return [
                    {
                        bool: {
                            must: [
                                {
                                    exists: {
                                        field: "has_record.category"
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
});

