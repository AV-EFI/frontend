<template>
  <div class="form mt-8">
    <label
      for="language"
      class="mr-2"
    >Type:</label>
    <select
      id="language"
      v-model="selected"
      class="w-40 py-1 px-3 mr-4 rounded border border-gray-500"
    >
      <option
        v-for="item in list"
        :key="item.title"
        :value="item"
      >
        {{ item.title }}
      </option>
    </select>
    <label
      for="mode"
      class="mr-2"
    >Mode:</label>
    <select
      id="mode"
      v-model="mode"
      class="w-40 py-1 px-3 mr-4 rounded border border-gray-500"
    >
      <option
        v-for="val in modes"
        :key="val"
      >
        {{ val }}
      </option>
    </select>
    <label
      for="theme"
      class="mr-2"
    >Theme:</label>
    <select
      id="theme"
      v-model="theme"
      class="w-40 py-1 px-3 mr-4 rounded border border-gray-500"
    >
      <option
        v-for="val in themes"
        :key="val"
      >
        {{ val }}
      </option>
    </select>
    <label
      for="folding"
      class="mr-2"
    >Folding:</label>
    <input
      id="folding"
      v-model="folding"
      type="checkbox"
      class="form-checkbox"
    >
  </div>
  <div class="editor mt-8">
    <section>
      <h2 class="text-2xl font-bold mb-4">
        Editor
      </h2>
      <div>
        <h3 class="text-xl mb-4">
          Prev
        </h3>
        <textarea
          class="p-4 rounded-lg border-2 border-gray-500"
          v-html="prev"
        />
      </div>
      <div>
        <h3 class="text-xl mb-4">
          Current
        </h3>
        <textarea
          class="p-4 rounded-lg border-2 border-gray-500"
          v-html="current"
        />
      </div>
    </section>
  </div>
  <div class="viewer">
    <section class="mt-8 min-h-96">
      <h2 class="text-2xl font-bold mb-4">
        Diff
      </h2>
      <p class="text-gray-100 mb-4">
        inputDelay and virtualScroll option are set for large text diff.
      </p>
      <Diff
        :mode="mode"
        :theme="theme"
        :language="selected?.language"
        :prev="prev"
        :current="current"
        :folding="folding"
        :input-delay="selected?.inputDelay"
        :virtual-scroll="selected?.virtualScroll"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    'items': {
        type: Array,
        required:true,
        default: () => []
    }
});
import type { Mode, Theme } from 'types/VueDiffTypes.ts';
import { ref } from 'vue';
import type IAVefiListResponse from '../../models/interfaces/IAVefiWork';

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

const modes = ref<Mode[]>(['split', 'unified']);
const mode = ref<Mode>('split');
const selected = ref<ListItem | null>(null);
const themes = ref<Theme[]>(['light','dark', 'custom']);
const theme = ref<Theme>('light');
const folding = ref(false);
const list = ref<ListItem[]>([
    {
        key: 'json',
        title: 'json',
        language: 'json',
        inputDelay: 0,
        virtualScroll: false,
    },
    {
        key: 'javascript',
        title: 'javascript',
        language: 'javascript',
        inputDelay: 0,
        virtualScroll: false,
    },
    {
        key: 'html',
        title: 'html',
        language: 'html',
        inputDelay: 0,
        virtualScroll: false,
    },
    {
        key: 'css',
        title: 'css',
        language: 'css',
        inputDelay: 0,
        virtualScroll: false,
    },
    {
        key: 'yaml',
        title: 'yaml',
        language: 'yaml',
        inputDelay: 0,
        virtualScroll: false,
    }
]);

async function getCollectionType (routeParamsId:number):Promise<string> {  
    const { data } = await useApiFetchLocal<IAVefiListResponse>(`/api/work-levels/${routeParamsId}?populate=*`, {method: 'GET'});
    if(data) {
        return JSON.stringify(data.value, null, 2);
    }
    return "";
}

const { data: prev } = await useAsyncData<string>('prev', () =>
    getCollectionType((props.items[0] as number))
);

const { data: current } = await useAsyncData<string|undefined>('current', () =>
    getCollectionType(props.items[1] as number)
);

selected.value = list.value[0];
</script>

<style lang="scss">
.editor {
  section {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    h2 {
      width: 100%;
    }

    div {
      width: calc(50% - 10px);
    }

    textarea {
      width: 100%;
      height: 200px;
    }
  }
}

.vue-diff-theme-custom {
  @import 'highlight.js/scss/vs2015.scss'; // import theme
  background-color: #000; // Set background color
}
</style>