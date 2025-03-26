export default defineEventHandler(async (event:any) => {
    try {
        const body = await readBody(event);
        const documentId:string = body.id.toString();
        const result = await getmanifestbyworkid(documentId);
        return result;
    }
    catch (e:any) {
        console.log((e as Error).message);
        console.error((e as Error).stack);        
    }
    return null;
});

/*helpers*/
async function getmanifestbyworkid(documentId: string) {
    try {
        const resultManifest = await $fetch(`${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_MANIFEST_BY_WORK}/${documentId}`, {
            method: 'POST',
            body: { documentId }
        });

        for (const manifest of resultManifest?.hits?.hits) {
            if (manifest._source?.handle) {
                const resultItems = await getitemsbymanifestid(manifest._source?.handle);
                manifest._source.items = resultItems;
            }
        }

        return resultManifest.hits.hits;

    } catch (e: any) {
        console.log((e as Error).message);
        console.error((e as Error).stack);
    }
    return null;
}

async function getitemsbymanifestid(handle: string) {
    try {
        const resultItems = await $fetch(`${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_ITEMS_BY_MANIFEST}/${handle}`, {
            method: 'POST',
            body: { handle }
        });

        return resultItems?.hits?.hits || [];

    } catch (e: any) {
        console.log((e as Error).message);
        console.error((e as Error).stack);
    }
    return [];
}
