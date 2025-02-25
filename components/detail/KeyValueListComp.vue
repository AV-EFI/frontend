<template>
  <div class="flex flex-col">
    <MicroLabelComp
      v-if="keytxt"
      :label-text="keytxt"
    />    
    <div
      v-if="!ul"
      class="flex flex-row flex-wrap items-center"
    >
      <GlobalClipboardComp
        v-for="val in valtxt"
        :key="val?.has_name ?? val"
        :class="fontSize"
        class="flex items-center mr-2 min-w-6"
        :display-text="val?.has_name ?? val"
      />
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        :class="fontSize"
        class="flex items-center"
      />        
    </div>
    <div
      v-else
      :class="['max-h-64', overflowY, {'bg-slate-100 dark:bg-slate-800 p-2 rounded-lg': bgColor}]"
    >
      <ul v-if="valtxt">
        <li
          v-for="val in valtxt"
          :key="val?.has_name ?? val"
          class="flex flex-row items-center flex-wrap"
          :class="`${fontSize}`"
        >
          {{ val?.has_name ?? val }}
          <DetailSameAsComp
            v-if="sameAs"
            :same-as-data="val.same_as"
            :class="fontSize"
          />
        </li>
      </ul>
      <span v-else>
        -
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    keytxt: {
        type: String,
        required: false,
        default: null
    },
    valtxt: {
        type: Array<Object>,
        required: true
    },
    sameAs: {
        type: Boolean,
        default: false
    },
    ul: {
        type: Boolean,
        default: false
    },
    bgColor: {
        type: Boolean,
        default: false
    },
    fontSize: {
        type: String,
        required: false,
        default: "text-base",
    },
    overflowY: {
        type: String,
        default: 'overflow-y-auto'
    }
});

let sameAsData = {};
if (props.keytxt !== 'avefi:Subject') {
    sameAsData = {
        item: {
            id: props.valtxt?.same_as?.id,
            category: props.valtxt?.same_as?.category
        }
    };
} else {
    sameAsData = {
        item: {
            id: props.valtxt,
            category: props.keytxt
        }
    };
}
</script>