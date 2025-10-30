<template>
  <div class="editor mt-8">
    <div class="grid grid-cols-2">
      <div class="grid grid-cols-1 md:w-[420px] grid-rows-6 mr-0 ml-auto">
        <ViewsWorkViewReduced
          v-model="prev"
          :title="$t('dataset1')"
          class="col-span-full"
        />
      </div>
      <div class="grid grid-cols-1 md:w-[420px] grid-rows-6 ml-0 mr-auto">
        <ViewsWorkViewReduced
          v-model="current"
          :title="$t('dataset2')"
          class="col-span-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses';

const props = defineProps({
    items: {
        type: Array<string>,
        required: true,
        default: () => []
    }
});

const objectListStore = useObjectListStore();

async function getCollectionType(routeParamsId: string): Promise<string> {  
    const { data } = await useApiFetchLocal<Array<ElasticGetByIdResponse>>(
        `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_WORK}`,
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

const { data: current } = await useAsyncData<string|undefined>('current', () =>
    getCollectionType(props.items[1])
);

onMounted(() => {
    if (objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});
</script>
