<template>
  <div class="mt-4 snap-y">
    <section>
      <div class="flex min-h-[80vh]">
        <div class="w-1/2 overflow-auto min-h-screen grid grid-cols-4 grid-rows-[48px_minmax(64px,max-content)_auto_64px_minmax(64px,max-content)_64px_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_auto_auto_auto_auto] auto-rows-fr">
          <ViewsWorkViewEditor
            v-model="prev"
            :title="$t('Dataset1')"
            @update-target-model-g-p="onUpdateTargetModelGP"
          />
          <ViewsWorkViewEditor
            v-model="current"
            :title="$t('Dataset2')" 
            @update-target-model-g-p="onUpdateTargetModelGP"
          />
        </div>
        <div class="w-1/2 overflow-scroll">
          <ViewsWorkViewEditorResult v-model="mergedDataset" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiListResponse } from '../../models/interfaces/IAVefiWork';
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
    castmembers: [],
    producers: [],
    productionyears: [],
    subjects: []
});

function onUpdateTargetModelGP (targetPropertyValue:string, targetPropertyName:string) {

    if(["directors", "producers", "countries", "productionyears", "castmembers", "subjects"].includes(targetPropertyName)) {
        mergedDataset.value[targetPropertyName].push({name: targetPropertyValue, gnd: null});
    }
    else if(["other_ids"].includes(targetPropertyName)) {
        mergedDataset.value[targetPropertyName].push({name: targetPropertyValue, type: "defaultType"});
    } else {
        mergedDataset.value[targetPropertyName] = targetPropertyValue;
    }
}

const objectListStore = useObjectListStore();

async function getCollectionType (routeParamsId:string):Promise<string> {  
    const { data } = await useApiFetchLocal<Array<IAVefiListResponse>>(
        `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/getworkvariantbyid`,
        {
            method: 'POST',
            body: JSON.stringify({documentId: routeParamsId}),
            headers: {
                'Authorization': `ApiKey ${useRuntimeConfig().public.ELASTIC_IMDB_APIKEY}`
            }
        }
    );
    
    if(data) {
        return JSON.stringify(data?.value?.at(0), null, 2);
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