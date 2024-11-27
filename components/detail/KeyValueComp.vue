<template>
  <div class="flex flex-col">
    <MicroLabelComp :label-text="keytxt" />
    <div class="flex flex-row">
      <GlobalClipboardComp
        v-if="clip"
        class="text-sm"
        :display-text="valtxt"
      />
      <span
        v-else
        class="text-sm"
      >{{ valtxt }}</span>
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        class="text-sm"
      />        
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
        type: String,
        required: true
    },
    'sameAs': {
        type: Boolean,
        default: false
    },
    'clip': {
        type: Boolean,
        default: true
    }
});
const sameAsData = {
    item: {
        id: props.valtxt,
        category: props.keytxt
    }
};
</script>