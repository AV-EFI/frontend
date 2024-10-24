import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        const body = await readBody(event);
        const documentId:string = body.documentId.toString();

        const result = await client.search({
            index: useRuntimeConfig().public.ELASTIC_INDEX,
            query: {
                "ids" : {
                    "values" : [documentId]
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