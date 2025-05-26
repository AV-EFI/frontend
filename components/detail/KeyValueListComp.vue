<template>
  <div
    class="flex flex-col"
    role="group"
    :aria-label="`${$t(keytxt)}: ${Array.isArray(valtxt) ? valtxt.map(v => v?.has_name ?? v).join(', ') : ''}`"
  >
    <MicroLabelComp
      v-if="keytxt"
      :label-text="keytxt"
    />

    <!-- Non-list display (Clipboard mode) -->
    <div
      v-if="!ul"
      class="flex flex-row flex-wrap items-center justify-content-between hover:bg-slate-100 dark:hover:bg-slate-700"
      role="group"
      :aria-label="$t(keytxt)"
    >
      <GlobalClipboardComp
        v-for="val in valtxt"
        v-if="clip"
        :key="val?.has_name ?? val"
        :class="fontSize"
        class="flex items-center mr-2 min-w-6"
        :display-text="val?.has_name ?? val"
      />
      <span
        v-if="!clip"
        class="flex-grow"
        :class="fontSize"
        :aria-label="`${$t(keytxt)}: ${valtxt.map(v => v?.has_name ?? v).join(', ')}`"
      >
        {{ valtxt.map(v => v?.has_name ?? v).join(', ') }}
      </span>
      <DetailSameAsComp
        v-if="sameAs"
        :same-as-data="sameAsData"
        :type="sameAsType"
        :class="fontSize"
        class="flex items-end"
      />
    </div>

    <!-- List display (ul=true) -->
    <div
      v-else
      :class="['max-h-64', overflowY, 'overflow-x-visible', {'bg-slate-100 dark:bg-slate-800 p-2 rounded-lg': bgColor}]"
    >
      <ul
        v-if="valtxt"
        role="list"
        :aria-label="$t(keytxt)"
      >
        <li
          v-for="val in valtxt"
          :key="val?.has_name ?? val"
          class="flex flex-row items-center justify-between flex-wrap hover:bg-slate-100 dark:hover:bg-slate-700"
          :class="`${fontSize}`"
          role="listitem"
          :aria-label="`${$t(keytxt)}: ${val?.has_name ?? val}`"
        >
          <span class="flex-grow">
            {{ val?.has_name ?? val }}
          </span>
          <DetailSameAsComp
            v-if="sameAs"
            :same-as-data="val.same_as"
            :type="sameAsType"
            class="flex-shrink-0 flex flex-row mr-4"
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
    },
    clip: {
        type: Boolean,
        default: true
    },
    sameAsType: {
        type: String,
        default: 'film'
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