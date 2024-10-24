<template>
  <div class="mt-4">
    <section>
      <div class="grid grid-cols-7 xl:grid-cols-8 gap-2 w-100 grid-rows-[48px_64px_64px_auto_auto_auto_64px_64px_auto_auto_auto_auto_auto_auto] auto-rows-fr">
        <ViewsWorkViewEditorStretched
          v-model="prev"
          @update-target-model-g-p="onUpdateTargetModelGP"
        />
        <ViewsWorkViewEditorStretched
          v-model="current"
          @update-target-model-g-p="onUpdateTargetModelGP"
        />
        <ViewsWorkViewEditorResultStretched v-model="mergedDataset" />
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
const mergedDataset = ref({
    title: "",
    other_ids: [],
    countries: [],
    directors: [],
    actors: [],
    keywords: []
});

function onUpdateTargetModelGP (targetPropertyValue:string, targetPropertyName:string) {
    if(["countries", "directors", "actors", "keywords"].includes(targetPropertyName)) {
        mergedDataset.value[targetPropertyName].push({name: targetPropertyValue, gnd: 12345});
    }
    else if(["other_ids"].includes(targetPropertyName)) {
        mergedDataset.value[targetPropertyName].push({name: targetPropertyValue, type: "defaultType"});
    } else {
        mergedDataset.value[targetPropertyName] = targetPropertyValue;
    }
}

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
<style>
</style>