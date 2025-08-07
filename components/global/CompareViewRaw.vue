<template>
  <div class="border-1 border-base-200 dark:border-neutral">
    <div class="">
      <div class="editor mt-2">
        <section>
          <h2 class="text-2xl font-bold mb-4">
            {{ $t('comparison') }}
          </h2>
          <div class="w-full md:w-1/2 p-1">
            <h3 class="text-xl mb-4">
              {{ $t('dataset1') }}
            </h3>
            <textarea
              v-if="prev"
              class="p-4 w-[80vw] md:w-full h-[75vh] rounded-lg border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 dark:text-white"
              v-html="prev"
            />
          </div>
          <div class="w-full md:w-1/2 p-1">
            <h3 class="text-xl mb-4">
              {{ $t('dataset2') }}
            </h3>
            <textarea
              class="p-4 w-[80vw] md:w-full h-[75vh] rounded-lg border-2 border-gray-500 dark:border-gray-300 dark:bg-gray-800 dark:text-white"
              v-html="current"
            />
          </div>
        </section>    
      </div>
    </div>
  </div>
  <div class="viewer flex flex-col md:flex-row flex-wrap w-full">
    <section class="mt-4 w-full min-h-96">
      <h2 class="text-2xl font-bold mb-4">
        Diff
      </h2>
      <Diff
        mode="unified"
        class="w-[80vw] lg:w-full"
        theme="diffTheme"
        language="json"
        :prev="prev"
        :current="current"
        :folding="true"
        :input-delay="10"
        :virtual-scroll="false"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import type { IAVefiListResponse } from '../../models/interfaces/IAVefiWork';
const props = defineProps({
    'items': {
        type: Array<string>,
        required:true,
        default: () => []
    }
});

const objectListStore = useObjectListStore();

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return 'avefi_light';
}

const colorModeCookie = ref(getCookie('avefi-color-mode') || 'avefi_light');
console.log('Color mode cookie:', colorModeCookie.value);

watch(colorModeCookie, (newValue) => {
    console.log('Color mode changed:', newValue);
});

async function getCollectionType (routeParamsId:string):Promise<string> {  
    const { data } = await useApiFetchLocal<Array<IAVefiListResponse>>(
        `${useRuntimeConfig().public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_WORK}`,
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

<style lang="scss" scoped>
//@import '/assets/scss/vs.css'; // import theme
@import '/assets/scss/monokai.css'; // import theme

.editor {
  section {
    display: flex;
    min-height: 100px;
    min-width: 100px;
    justify-content: space-between;
    flex-wrap: wrap;

    h2 {
      width: 100%;
    }
  }
}



</style>
