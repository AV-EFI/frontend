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
    const body = await readBody(event);
    try {
        const response = await apiClient.searchkit.handleInstantSearchRequests(body, {            
            hooks: {
                afterSearch: async (requests, responses) => {
                    return responses;
                },
                beforeSearch: async (searchRequests) => {
                    //console.log("Before search", searchRequests.map((sr) => sr.body.query));
                    //add "fields":["directors", "producers", "countries", "productionyears"]
                    return searchRequests.map((sr) => {
                        return {
                            ...sr,
                            body: {
                                ...sr.body,
                                query: JSON.parse(
                                    JSON.stringify(sr.body.query).replace(
                                        /"fuzziness":"AUTO:4,8"/g,
                                        '"fuzziness":"1"'
                                    )
                                )
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

