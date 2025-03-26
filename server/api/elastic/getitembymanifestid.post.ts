import {Client} from '@elastic/elasticsearch';

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const documentId:string = body.id.toString();

        const result = await $fetch(`${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_ITEM_BY_MANIFEST}`, {
            method: 'POST',
            body: { documentId }
        });

        if (!result) {
            throw new Error('Failed to fetch data from the API');
        }

        return result.hits.hits;

    }
    catch (e:any) {
        console.log((e as Error).message);
        console.error((e as Error).stack);        
    }
    return null;
});