<template>
  <div class="flex flex-col">
    <MicroLabelComp :label-text="keytxt" />    
    <div
      v-if="!ul"
      class="flex flex-row flex-wrap"
    >
      <GlobalClipboardComp
        v-for="val in valtxt"
        :key="val?.has_name ?? val"
        class="text-sm"
        :display-text="val?.has_name ?? val"
      />
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        class="text-sm"
      />        
    </div>
    <div
      v-else
      class="max-h-64 overflow-y-auto"
      :class="{'bg-slate-100 dark:bg-slate-800 p-2 rounded-lg': bgColor}"
    >
      <ul>
        <li
          v-for="val in valtxt"
          :key="val?.has_name ?? val"
          class="py-1"
        >
          <span class="text-sm">
            {{ val?.has_name ?? val }}
            <DetailSameAsComp
              v-if="sameAs"
              :same-as-data="val.same_as"
              class="text-sm"
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
        required: true
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