<template>
  <div
    class="flex flex-col"
    role="group"
    :aria-label="translateKey ? 
      `${$t(keytxt)}: ${typeof valtxt === 'string' ? $t(valtxt) : valtxt}`
      : `${keytxt}: ${$t(valtxt)}`"
  >
    <MicroLabelComp 
      :label-text="keytxt" 
      :translate-key="translateKey"
    />
    <div class="flex flex-row">
      <GlobalClipboardComp
        v-if="clip"
        class="max-sm:break-all"
        :class="fontSize"
        :display-text="valtxt"
        :copy-text="clipText ? clipText : valtxt"
      />
      <span
        v-else
        :class="[fontSize, narrow?'break-all w-3/4':'']"
      >{{ $t(valtxt) }}</span>
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        :class="fontSize"
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
        required: false,
        default: '-'
    },
    'sameAs': {
        type: Boolean,
        default: false
    },
    'clip': {
        type: Boolean,
        default: true
    },
    clipText: {
        type: String,
        default: null
    },
    fontSize: {
        type: String,
        default: 'text-base'
    },
    narrow: {
        type: Boolean,
        default: false
    },
    translateKey: {
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