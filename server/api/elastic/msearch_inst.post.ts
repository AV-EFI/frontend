import Client, { SearchkitConfig } from '@searchkit/api';
import {config} from '@/searchConfig_avefi';
import { getServerSession } from '#auth';


const crushObj = (obj:any = {}) => Object.keys(obj || {}).reduce((acc:any, cur:any) => {
    if (typeof obj[cur] === 'object') {
        acc = { ...acc, ...crushObj(obj[cur])};
    } else { acc[cur] = obj[cur]; }
    return acc;
}, {});

export default defineEventHandler(async (event) => {

    const session = await getServerSession(event);
    if (!session) {
        return { status: 'unauthenticated!' };
    }
    const apiClient = Client(config, {debug: true});
    const body = await readBody(event);
    const institutionid:string = `https://w3id.org/isil/${session?.user?.institution}`;
    try {
        const response = await apiClient.searchkit.handleInstantSearchRequests(body, {            
            hooks: {
                afterSearch: async (requests, responses) => {
                    return responses;
                },
                beforeSearch: async (searchRequests) => {
                    //add "fields":["directors", "producers", "countries", "productionyears"]
                    return searchRequests.map((sr) => {
                        return {
                            ...sr,
                            body: {
                                ...sr.body,
                                fields: ["directors", "producers", "countries", "productionyears", "castmembers", "subjects"],
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
                            must: {
                                match: {
                                    "has_record.described_by.has_issuer_id.keyword": institutionid
                                }
                            }
                        }
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

