import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        const body = await readBody(event);
        const documentId = body.documentId;
        const result = await client.search(
            {
                index: useRuntimeConfig().public.ELASTIC_INDEX_DETAIL,
                size: 50,
                query: {
                    bool: {
                        must: {
                            match: {
                                'has_record.is_part_of.id': documentId
                            }
                        }
                    }
                }
            });

        return result.hits.hits;
    }
    catch(ex) {
        console.log(ex);
        return null;
    }
});