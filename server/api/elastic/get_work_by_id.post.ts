import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        console.log('****');
        console.timeLog(useRuntimeConfig().public.ELASTIC_HOST_PUBLIC, 'get_work_by_id');

        const body = await readBody(event);
        const documentIds:string[] = body.documentId;
        const result = await client.search({
            index: useRuntimeConfig().public.ELASTIC_INDEX,
            size: 50,
            query: {
                "ids" : {
                    "values" : typeof (documentIds) !== 'string' ? [...documentIds]: documentIds
                }
            },
            fields: ["directors_or_editors", "production", "located_in", "productionyears", "castmembers", "subjects"]
        });
        return result.hits.hits;
    }
    catch(ex) {
        console.log(ex);
        return null;
    }
});