<template>
  <div class="flex flex-col">
    <MicroLabelComp :label-text="keytxt" />    
    <div
      v-if="!ul"
      class="flex flex-row"
    >
      <GlobalClipboardComp
        v-for="val in valtxt"
        :key="val?.has_name?? val"
        class="text-sm"
        :display-text="val?.has_name?? val"
      />
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        class="text-sm"
      />        
    </div>
    <div
      v-else
      class="max-h-full overflow-y-auto"
    >
      <ul>
        <li
          v-for="val in valtxt"
          :key="val?.has_name?? val"
        >
          <span class="text-sm">
            {{ val?.has_name?? val }}
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
    'keytxt': {
        type: String,
        required: true
    },
    'valtxt': {
        type: Array<Object>,
        required: true
    },
    'sameAs': {
        type: Boolean,
        default: false
    },
    'ul': {
        type: Boolean,
        default: false
    }
});
let sameAsData = {};
if(props.keytext !== 'avefi:Subject') {
    console.log(props.valtxt);
    sameAsData = {
        item: {
            id: props.valtxt?.same_as?.id,
            category: props.valtxt?.same_as?.category
        }
    };
}
else {
    sameAsData = {
        item: {
            id: props.valtxt,
            category: props.keytxt
        }
    };
}
</script>