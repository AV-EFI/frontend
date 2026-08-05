import Client from '@searchkit/api';
import {config} from '@/searchConfig_avefi';

export default defineEventHandler(async (event) => {

  //    if (!session) {
  //        return { status: 'unauthenticated!' };
  //    }
  const session = await getAuthSession(event);
  const apiClient = Client(config, {debug: true});
  const body = await readBody(event);
  const institution = typeof session?.user?.institution === 'string' ? session.user.institution : '';
  const institutionid:string = `https://w3id.org/isil/${institution}`;
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

