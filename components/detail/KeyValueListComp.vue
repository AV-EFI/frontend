<template>
  <div
    class="flex flex-col"
    role="group"
    :aria-label="`${$t(keytxt)}: ${Array.isArray(valtxt) ? valtxt.map(v => v?.has_name ?? v).join(', ') : ''}`"
  >
    <!-- LABEL (fixed baseline, space always reserved) -->
    <div class="h-4 flex items-start">
      <MicroLabelComp
        v-if="keytxt"
        :label-text="keytxt"
      />
    </div>

    <!-- CONTENT (single normalized offset) -->
    <div class="mt-1">
      <!-- NON-LIST DISPLAY -->
      <div
        v-if="!ul"
        class="flex flex-row flex-wrap items-start min-h-8 h-8 leading-5 hover:bg-slate-100 dark:hover:bg-slate-700"
        role="group"
        :aria-label="$t(keytxt)"
      >
        <!-- CLIPBOARD MODE -->
        <template v-if="clip">
          <GlobalClipboardComp
            v-for="val in valtxt"
            :key="val?.has_name ?? val"
            :display-text="val?.has_name ?? val"
            :copy-text="clipText ? clipText : (val?.has_name ?? val)"
            class="flex items-start h-8 leading-5 mr-2 min-w-6"
            :class="fontSize"
          />
        </template>

        <!-- TEXT MODE -->
        <span
          v-else
          class="flex-grow h-8 flex items-start leading-5 text-xs"
          :aria-label="`${$t(keytxt)}: ${valtxt.map(v => v?.has_name ?? v).join(', ')}`"
        >
          {{ valtxt.map(v => v?.has_name ?? $t(v)).join(', ') }}
        </span>

        <!-- SAME AS -->
        <DetailSameAsComp
          v-if="sameAs"
          :same-as-data="sameAsData"
          :type="sameAsType"
          class="h-8 flex items-start"
          :class="fontSize"
        />
      </div>

      <!-- LIST DISPLAY -->
      <div
        v-else
        :class="[
          'min-h-8',
          'max-h-32',
          overflowY,
          'overflow-x-visible'
        ]"
      >
        <!-- background & padding moved INSIDE to preserve baseline -->
        <div
          :class="[
            { 'bg-slate-100 dark:bg-gray-800 p-2 rounded-lg': bgColor },
            overflowY,
          ]"
        >
          <ul
            v-if="valtxt"
            role="list"
            :aria-label="$t(keytxt)"
          >
            <li
              v-for="val in valtxt"
              :key="val?.has_name ?? val"
              class="flex flex-row items-start justify-between min-h-6 leading-5 hover:bg-slate-100 dark:hover:bg-slate-700"
              role="listitem"
              :aria-label="`${$t(keytxt)}: ${val?.has_name ?? val}`"
              :class="fontSize"
            >
              <span
                class="flex-grow flex items-start leading-5"
                :class="[narrow ? 'w-3/4' : '']"
              >
                {{ val?.has_name ?? $t(val) }}
              </span>

              <DetailSameAsComp
                v-if="sameAs"
                :same-as-data="val.same_as"
                :type="sameAsType"
                class="flex items-start flex-shrink-0 mr-4"
                :class="fontSize"
              />
            </li>
          </ul>

          <span
            v-else
            aria-hidden="true"
          >
            -
          </span>
        </div>
      </div>
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
        type: Array<object>,
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
        default: 'text-sm'
    },
    overflowY: {
        type: String,
        default: 'overflow-y-auto'
    },
    clip: {
        type: Boolean,
        default: true
    },
    clipText: {
        type: String,
        default: null
    },
    sameAsType: {
        type: String,
        default: 'film'
    },
    narrow: {
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
