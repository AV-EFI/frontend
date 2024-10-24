<template>
  <div class="editor mt-8">
    <section>
      <div class="flex flex-row justify-center">
        <div class="w-96">
          <h3 class="text-xl mb-4">
            Datensatz 1
          </h3>
          <ViewsWorkViewReduced v-model="prev" />
        </div>
        <div class="w-96 ml-2">
          <h3 class="text-xl mb-4">
            Datensatz 2
          </h3>
          <ViewsWorkViewReduced v-model="current" />
        </div>
      </div>
    </section>    
  </div>
</template>

<script setup lang="ts">
import type { IAVefiListResponse, IAVefiSingleResponse } from '../../models/interfaces/IAVefiWork';

/*
const route = useRoute();
const items = new Array();
items[0] = route.query.prev;
items[1] = route.query.next;
*/
const props = defineProps({
    'items': {
        type: Array<string>,
        required:true,
        default: () => []
    }
});

const objectListStore = useObjectListStore();

async function getCollectionType (routeParamsId:string):Promise<string> {  
    const { data } = await useApiFetchLocal<IAVefiSingleResponse>(`${useRuntimeConfig().public.ELASTIC_HOST_PUBLIC}/${useRuntimeConfig().public.ELASTIC_INDEX}/_doc/${routeParamsId}`, {method: 'GET'});
    if(data) {
        return JSON.stringify(data.value, null, 2);
    }
    return "";
}

const { data: prev } = await useAsyncData<string>('prev', () =>
    getCollectionType(props.items[0])
);

const { data: current } = await useAsyncData<string|undefined>('current', () =>
    getCollectionType(props.items[1])
);

onMounted(() => {
    if(objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});

</script>