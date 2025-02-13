<template>
  <div class="flex flex-col">
    <MicroLabelComp
      v-if="keytxt"
      :label-text="keytxt"
    />    
    <div
      v-if="!ul"
      class="flex flex-row flex-wrap"
    >
      <GlobalClipboardComp
        v-for="val in valtxt"
        :key="val?.has_name ?? val"
        :class="fontSize"
        :display-text="val?.has_name ?? val"
      />
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        :class="fontSize"
      />        
    </div>
    <div
      v-else
      :class="['max-h-64', overflowY, {'bg-slate-100 dark:bg-slate-800 p-2 rounded-lg': bgColor}]"
    >
      <ul>
        <li
          v-for="val in valtxt"
          :key="val?.has_name ?? val"
        >
          <span :class="fontSize">
            {{ val?.has_name ?? val }}
            <DetailSameAsComp
              v-if="sameAs"
              :same-as-data="val.same_as"
              :class="fontSize"
            />
          </span>
        </li>
      </ul>
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