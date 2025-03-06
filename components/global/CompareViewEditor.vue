<template>
  <div class="mt-4 snap-y px-2">
    <section>
      <div class="flex flex-col lg:flex-row min-h-[80vh]">
        <div class="w-full lg:w-2/3 overflow-auto min-h-screen flex flex-col lg:grid gap-1 lg:grid-cols-8 lg:grid-rows-[48px_minmax(64px,max-content)_minmax(64px,max-content)_64px_minmax(64px,max-content)_64px_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_minmax(64px,max-content)_auto_auto_auto_auto] auto-rows-fr lg:pr-1">
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
        <div class="w-full lg:w-1/3 overflow-scroll">
          <ViewsWorkViewEditorResult
            v-model="mergedDataset"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiListResponse } from '../../models/interfaces/IAVefiWork';

const props = defineProps({
    'items': {
        type: Array<string>,
        required: true,
        default: () => []
    }
});
const mergedDataset = ref({
    efi: "",
    title: "",
    alternative_title: "",
    location: [],
    productionyear: [],
    director: [],
    castmember: [],
    producer: [],
    genre: [],
    subject: [],
    other_id: [],
    last_edit: "Deutsche Kinemathek - Museum für Film und Fernsehen"
});

function onUpdateTargetModelGP(targetPropertyValue: string, targetPropertyName: string, sameAsId: string) {
    console.log(targetPropertyValue, targetPropertyName, sameAsId);
    if (["director", "producer", "location", "productionyear", "castmember", "subject", "genre"].includes(targetPropertyName)) {
        mergedDataset.value[targetPropertyName].push({ name: targetPropertyValue, same_as_id: sameAsId });
    } else if (["other_id"].includes(targetPropertyName)) {
        mergedDataset.value[targetPropertyName].push({ name: targetPropertyValue, type: sameAsId });
    } else {
        console.log(targetPropertyName, targetPropertyValue);
        mergedDataset.value[targetPropertyName] = targetPropertyValue;
    }
}

const objectListStore = useObjectListStore();

async function getCollectionType(routeParamsId: string): Promise<string> {
    const { data } = await useApiFetchLocal<Array<IAVefiListResponse>>(
        `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/getworkvariantbyid`,
        {
            method: 'POST',
            body: JSON.stringify({ documentId: routeParamsId }),
            headers: {
                'Authorization': `ApiKey ${useRuntimeConfig().public.ELASTIC_IMDB_APIKEY}`
            }
        }
    );

    if (data) {
        return JSON.stringify(data?.value?.at(0), null, 2);
    }
    return "";
}

const { data: prev } = await useAsyncData<string>('prev', () =>
    getCollectionType(props.items[0])
);

const { data: current } = await useAsyncData<string | undefined>('current', () =>
    getCollectionType(props.items[1])
);

onMounted(() => {
    if (objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});
</script>
