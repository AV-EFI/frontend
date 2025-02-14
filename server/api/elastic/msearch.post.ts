import Client from '@searchkit/api';
import {config} from '@/searchConfig_avefi';

const crushObj = (obj:any = {}) => Object.keys(obj || {}).reduce((acc:any, cur:any) => {
    if (typeof obj[cur] === 'object') {
        acc = { ...acc, ...crushObj(obj[cur])};
    } else { acc[cur] = obj[cur]; }
    return acc;
}, {});

export default defineEventHandler(async (event) => {

    const apiClient = Client(config, {debug: true});
    console.log(apiClient);
    console.log(config);

    const body = await readBody(event);
    try {
        //body = body.replace("avefi:", "avefi\:");
        console.log(body);

        const response = await apiClient.searchkit.handleInstantSearchRequests(body, {            
            hooks: {
                afterSearch: async (requests, responses) => {
                    console.log(requests);
                    return responses;
                },
                beforeSearch: async (searchRequests) => {
                    //add "fields":["directors", "producers", "countries", "productionyears"]
                    return searchRequests.map((sr) => {
                        return {
                            ...sr,
                            body: {
                                ...sr.body,
                                //fields: ["directors", "producers", "countries", "productionyears", "castmembers", "subjects"],
                                //track_total_hits: false
                            }
                        };
                    });            
                }
            },
        });
        return response;
    }
    catch (ex) {
        console.log(ex);
        return null;
    }
});

