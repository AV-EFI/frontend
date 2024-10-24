import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });

        const body = await readBody(event);
        const documentId:string = body.id.toString();

        const resultManifest = await client.search({
            index: useRuntimeConfig().public.ELASTIC_INDEX,
            query: {
                bool: {
                    must: {
                        match: {
                            "has_record.is_manifestation_of.id.keyword": documentId
                        }
                    }
                }
            }
        });

        for (const manifest of resultManifest.hits.hits) {
            if(manifest._source?.handle) {
                const resultItems = await getitemsbymanifestid(manifest._source?.handle);
                console.log("*****************");
                console.log(resultItems);
                manifest._source.items = resultItems;
            }
        }

        return resultManifest.hits.hits;

    }
    catch (e:any) {
        console.log((e as Error).message);
        console.error((e as Error).stack);        
    }
    return null;
});

/*helpers*/
async function getitemsbymanifestid (manifest_id:string) {
    console.log("getitemsbymanifestid");
    const client = new Client({ node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC });
    const resultItems = await client.search({
        index: useRuntimeConfig().public.ELASTIC_INDEX,
        query: {
            bool: {
                must: {
                    match: {
                        "has_record.is_item_of.id.keyword": manifest_id
                    }
                }
            }
        }
    });
    console.log("####################");
    console.log(resultItems.hits.hits);
    if(resultItems.hits.hits) {
        return resultItems.hits.hits;
    }
    return null;
}
