<template>
  <div class="flex flex-row lg:flex-row justify-between lg:items-center">
    <div
      v-if="type === 'searchresult'"
      :class="['flex justify-center flex-col w-4/5']"
    >
      <h4 class="col-span-full text-xs text-primary-700 dark:text-primary-300 text-sm">
        {{ manifestation?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-primary-950 dark:text-primary-200 my-1">
        {{ manifestation?.has_record?.described_by?.has_issuer_name }}
      </h4>
      <div class="col-span-full text-sm 2xl:text-md text-primary-700 dark:text-neutral-200 flex flex-row">
        <span
          v-if="manifestation?.has_record?.has_event?.has_date"
          class="flex flex-row justify-start items-center"
        >
          {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation?.has_record?.has_colour_type"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('has_colour')"
          />
          {{ $t(manifestation.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="manifestation?.has_record?.in_language"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date || manifestation.has_record?.has_colour_type">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:language"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('in_language_code')"
          />
          {{ manifestation?.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </div>
      <div class="flex flex-row mt-1">
        <div
          v-if="allItemsEmpty"
          class="badge bg-warning-300 text-white z-10"
          :title="$t('emptyItemsLong')"
          :alt="$t('emptyItemsLong')"
        >
          <Icon
            class="text-lg"
            name="mi:document-empty"
          />
              &nbsp;
          {{ $t('emptyItemsShort') }}
        </div>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col justify-center w-4/5"
    >
      <h4 class="col-span-full text-xs text-primary-700 dark:text-primary-300 text-sm">
        {{ manifestation?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-primary-950 dark:text-primary-200 my-1 xl:text-base">
        {{ manifestation?.has_record?.described_by?.has_issuer_name }}
      </h4>
      <div class="col-span-full text-sm 2xl:text-md text-primary-700 dark:text-neutral-200 flex flex-row">
        <span
          v-if="manifestation?.has_record?.has_event?.has_date"
          class="flex flex-row justify-start items-center"
        >
          {{ manifestation._source.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation?.has_record?.has_colour_type"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation?.has_record?.has_event?.has_date">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('has_colour')"
          />
          {{ $t(manifestation?.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="manifestation?.has_record?.in_language"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation?.has_record?.has_event?.has_date || manifestation?.has_record?.has_colour_type">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:language"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('in_language_code')"
          />
          {{ manifestation?.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </div>
      <div class="flex flex-row mt-1">
        <div
          v-if="allItemsEmpty"
          class="badge bg-warning-300 text-white z-10"
          :title="$t('emptyItemsLong')"
          :alt="$t('emptyItemsLong')"
        >
          <Icon
            class="text-lg"
            name="mi:document-empty"
          />
              &nbsp;
          {{ $t('emptyItemsShort') }}
        </div>
      </div>
    </div>
    <div class="max-md:flex max-md:justify-end">
      <MicroEfiCopyComp
        :handle="manifestation?.handle ?? manifestation?.handle"
        class="z-10 relative"
        :comp-size="compSize"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
    manifestation: Object as PropType<any>,
    type: String as PropType<string>,
    compSize: {
        type: String as PropType<string>,
        default: 'md',
    },
    isTwin: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
    allItemsEmpty: {
        type: Boolean as PropType<boolean>,
        default: false,
    },
});

</script>

<style lang="css">
.collapse-arrow > .collapse-title:after {
  top: 50%;
}
</style>