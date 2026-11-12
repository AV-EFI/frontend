import Client from '@searchkit/api';
import { z } from 'zod';
import {config} from '@/searchConfig_avefi';
import { parseRequestBody } from '../../utils/requestBody';

// Searchkit expects the InstantSearch multi-search format: a list of { indexName, params } requests.
const bodySchema = z.array(
  z.looseObject({ indexName: z.string().min(1).max(200), params: z.record(z.string(), z.unknown()).optional() }),
).min(1).max(20);

export default defineEventHandler(async (event) => {

  //    if (!session) {
  //        return { status: 'unauthenticated!' };
  //    }
  const body = parseRequestBody(bodySchema, await readBody(event));
  const session = await getAuthSession(event);
  const apiClient = Client(config);
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

