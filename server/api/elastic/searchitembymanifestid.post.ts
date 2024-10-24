import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        const body = await readBody(event);
        const documentId:string = body.id.toString();

        const result = await client.search({
            index: useRuntimeConfig().public.ELASTIC_INDEX,
            query: {
                bool: {
                    must: {
                        match: {
                            "has_record.is_item_of.id.keyword": documentId
                        }
                    }
                }
            }
        });

        return result.hits.hits;

    }
    catch (e:any) {
        console.log((e as Error).message);
        console.error((e as Error).stack);        
    }
    return null;
});