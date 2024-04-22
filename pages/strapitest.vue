<template>
  <p>test</p>
</template>

<script setup lang="ts">
import type { Strapi4ResponseData, Strapi4ResponseMany } from '@nuxtjs/strapi/dist/runtime/types';
import type { Credits } from '~/projects/avefi_proto/src/api/credits/content-types/credits/credits';
const client = useStrapiClient();

const { find } = useStrapi4();
const { findOne } = useStrapi();
const route = useRoute();
//const restaurantId: number = +route.params.id // cast to number
const creditsId: number = 1; // cast to number
/*
const responseOne = await findOne("credits", creditsId);
console.log(responseOne);
*/
//console.log(responseOne.data.attributes.CreditsRole);

const response:Strapi4ResponseMany<Credits> = await find('creditss');
const data:Strapi4ResponseData<Credits>[]|undefined = response.data;
console.log(data);
console.log(typeof (data));
//const credits:Credits[] = data;

//const data:Strapi4ResponseData<Credits>[]|undefined = response.data;

//const crdts:Credits|undefined = data?.at(0);

//console.log(crdts?.attributes.CreditsFirstName);
//console.log(crdts?.attributes.CreditsRole);

//const response2 = await findOne('work-levels', 1);
//console.log(response2);

</script>