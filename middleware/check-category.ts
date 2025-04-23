import { ca, is } from "@formkit/i18n";

export default defineNuxtRouteMiddleware(async (to) => {
    const id = to.params.id as string;
    // Simulated logic to determine the category, e.g., from a database or API
    const response = await $fetch(`/api/elastic/wmi_mapping`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: 'GET',
        params: { documentId: id }
    });
    console.log('###');
    console.log('response', response);
    console.log('###');

    if (!response) {
        return navigateTo('/404'); // Handle error or redirect to a 404 page
    }
    const category = Array.isArray(response) && response.length > 0 ? response[0]._source?.category : undefined; // Assuming the API response contains a 'category' field
    console.log('category', category);
    
    if (category === 'avefi:Item') {
        const is_item_of_id = response[0]._source?.is_item_of_id?.replace('21.11155/','');
        if(is_item_of_id) {
            console.log('is_item_of_id', is_item_of_id);
        }

        const response_manifest = await $fetch(`/api/elastic/wmi_mapping`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            method: 'GET',
            params: { documentId: is_item_of_id }
        });

        if (!response_manifest) {
            return navigateTo('/404'); // Handle error or redirect to a 404 page
        }
        const manifest_ids = response_manifest[0]?._source?.is_manifestation_of_ids; // Assuming the API response contains a 'category' field
        console.log(manifest_ids);

        if(manifest_ids.length < 2) {
            const manifest_id = manifest_ids[0].replace('21.11155/','');
            console.log('manifest_id', manifest_id);
            return navigateTo(`/film/${manifest_id}#${id}`);
        } 

        return navigateTo(`/film/multi?ids=${manifest_ids.map((m) => m.replace('21.11155/','')).join(',')}&itemid=${is_item_of_id}`);
        

        //const workId = getWorkIdByItemId(id); // Again, replace with real logic
        //return navigateTo(`/film/${workId}#${id}`);
    }

    if(category === 'avefi:Manifestation') {
        const is_manifest_of_id = response[0]._source?.is_manifestation_of_ids;
        
        if(is_manifest_of_id.length < 1) {
            console.log('is_manifest_of_id', is_manifest_of_id);
            return navigateTo(`/film/${is_manifest_of_id[0]}#${id}`);
        }

        return navigateTo(`/film/multi?ids=${is_manifest_of_id.map((m) => m.replace('21.11155/','')).join(',')}&itemid=${id}`);

    }

    // Continue as normal
});
