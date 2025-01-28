<template>
  <div class="editor mt-8">
    <section>
      <div class="flex flex-col md:flex-row justify-center">
        <div class="w-full md:w-96 mb-4 md:mb-0">
          <h3 class="text-xl mb-4 dark:text-white">
            {{ $t('dataset1') }}
          </h3>
          <ViewsWorkViewReduced v-model="prev" />
        </div>
        <div class="w-full md:w-96 md:ml-2">
          <h3 class="text-xl mb-4 dark:text-white">
            {{ $t('dataset2') }}
          </h3>
          <ViewsWorkViewReduced v-model="current" />
        </div>
      </div>
    </section>    
  </div>
</template>

<script setup lang="ts">
import type { IAVefiListResponse, IAVefiSingleResponse } from '../../models/interfaces/IAVefiWork';

const props = defineProps({
    items: {
        type: Array<string>,
        required: true,
        default: () => []
    }
});

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

const { data: current } = await useAsyncData<string|undefined>('current', () =>
    getCollectionType(props.items[1])
);

onMounted(() => {
    if (objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});
</script>
