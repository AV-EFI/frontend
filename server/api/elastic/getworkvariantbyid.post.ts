import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        const body = await readBody(event);
        const documentIds:string[] = body.documentId;
        const result = await client.search({
            index: useRuntimeConfig().public.ELASTIC_INDEX,
            query: {
                "ids" : {
                    "values" : typeof (documentIds) !== 'string' ? [...documentIds]: documentIds
                }
            },
        });
        return result.hits.hits;
    }
    catch(ex) {
        console.log(ex);
        return null;
    }
});