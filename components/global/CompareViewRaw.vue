<template>
  <div class="border-1 border-base-200 dark:border-neutral-400">
    <div class="">
      <div class="editor mt-2">
        <section>
          <h2 class="text-2xl font-bold mb-4">
            {{ $t('comparison') }}
          </h2>
          <div class="w-1/2 p-1">
            <h3 class="text-xl mb-4">
              {{ $t('dataset1') }}
            </h3>
            <textarea
              v-if="prev"
              class="p-4 rounded-lg border-2 border-gray-500"
              v-html="prev"
            />
          </div>
          <div class="w-1/2 p-1">
            <h3 class="text-xl mb-4">
              {{ $t('dataset2') }}
            </h3>
            <textarea
              class="p-4 rounded-lg border-2 border-gray-500"
              v-html="current"
            />
          </div>
        </section>    
      </div>
    </div>
  </div>
  <div class="viewer flex flex-row flex-wrap w-full">
    <section class="mt-4 w-full min-w-96 min-h-96">
      <h2 class="text-2xl font-bold mb-4">
        Diff
      </h2>
      <Diff
        mode="unified"
        class="w-full min-w-96"
        theme="light"
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

//import type { Mode, Theme } from 'types/VueDiffTypes';
import type { IAVefiSingleResponse} from '../../models/interfaces/IAVefiWork';
const objectListStore = useObjectListStore();

interface ListItem {
  key: string;
  title: string;
  language: string;
  inputDelay: number;
  virtualScroll:
    | false
    | {
        height: number;
        lineMinHeight: number;
        delay: number;
      };
}

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

<style lang="scss" scoped>
  @import '/assets/scss/vs.css'; // import theme
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

    textarea {
      width: 100%;
      height: 200px;
    }
  }
}

.vue-diff-theme-custom {
  background-color: #000; // Set background color
}
</style>