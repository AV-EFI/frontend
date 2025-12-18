<template>
  <div
    class="flex flex-col"
    role="group"
    :aria-label="translateKey
      ? `${$t(keytxt)}: ${typeof valtxt === 'string' ? $t(valtxt) : valtxt}`
      : `${keytxt}: ${$t(valtxt)}`"
  >
    <!-- LABEL (normalized height, space always reserved) -->
    <div class="h-4 flex items-start">
      <MicroLabelComp
        :label-text="keytxt"
        :translate-key="translateKey"
      />
    </div>

    <!-- CONTENT (single normalized margin) -->
    <div class="mt-1">
      <div class="flex flex-row items-start min-h-8 h-8 leading-5">

        <!-- CLIPBOARD MODE -->
        <GlobalClipboardComp
          v-if="clip"
          class="flex items-start h-8 leading-5 max-sm:break-all"
          :class="fontSize"
          :display-text="valtxt"
          :copy-text="clipText ? clipText : valtxt"
        />

        <!-- TEXT MODE -->
        <span
          v-else
          class="flex-grow h-8 flex items-start leading-5"
          :class="[narrow ? 'break-all w-3/4' : '']"
        >
          {{ $t(valtxt) }}
        </span>

        <!-- SAME AS -->
        <DetailSameAsComp
          v-if="sameAs"
          :same-as-data="sameAsData"
          class="h-8 flex items-start"
          :class="fontSize"
        />
      </div>
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
        type: String,
        required: false,
        default: '-'
    },
    sameAs: {
        type: Boolean,
        default: false
    },
    clip: {
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
