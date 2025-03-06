<template>
  <div class="flex flex-col lg:flex-row justify-between lg:items-center">
    <div
      v-if="type == 'searchresult'"
      :class="['flex justify-center flex-col w-4/5']"
    >
      <h4 class="col-span-full text-xs 2xl:text-sm">
        {{ manifestation?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-primary-900 dark:text-primary-200 text-sm my-1">
        {{ manifestation.has_record?.described_by?.has_issuer_name }}
      </h4>
      <div class="col-span-full text-sm 2xl:text-md text-primary-700 dark:text-neutral-200 flex flex-row">
        <span
          v-if="manifestation.has_record?.has_event?.has_date"
          class="flex flex-row justify-start items-center"
        >
          {{ manifestation.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation.has_record?.has_colour_type"
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
          v-if="manifestation.has_record?.in_language"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation.has_record?.has_event?.has_date || manifestation.has_record?.has_colour_type">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:language"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('in_language_code')"
          />
          {{ manifestation.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </div>
    </div>
    <div
      v-else
      class="flex flex-col justify-center"
    >
      <h4 class="col-span-full text-xs 2xl:text-sm">
        {{ manifestation._source?.handle }}
      </h4>
      <h4 class="col-span-full font-bold text-primary-900 dark:text-primary-200 text-sm my-1 xl:text-base">
        {{ manifestation._source.has_record?.described_by?.has_issuer_name }}
      </h4>
      <div class="col-span-full text-sm 2xl:text-md text-primary-700 dark:text-neutral-200 flex flex-row">
        <span
          v-if="manifestation._source?.has_record?.has_event?.has_date"
          class="flex flex-row justify-start items-center"
        >
          {{ manifestation._source.has_record?.has_event?.map(event => `${event?.has_date} (${$t(event?.type)})`).join(', ') }}
        </span>
        <span
          v-if="manifestation._source?.has_record?.has_colour_type"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation._source?.has_record?.has_event?.has_date">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:paint-outline"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('has_colour')"
          />
          {{ $t(manifestation._source?.has_record?.has_colour_type) }}
        </span>
        <span
          v-if="manifestation._source?.has_record?.in_language"
          class="flex flex-row items-center"
        >
          <template v-if="manifestation._source?.has_record?.has_event?.has_date || manifestation._source?.has_record?.has_colour_type">
            <span class="flex flex-row items-center">&nbsp;&nbsp;</span></template>
          <Icon
            name="mdi:language"
            class="w-4 h-4 mr-1 inline-block"
            :alt="$t('in_language_code')"
          />
          {{ manifestation._source?.has_record?.in_language?.map(language => `${$t(language.code)}`).join(', ') }}
        </span>
      </div>
    </div>
    <div>
      <MicroEfiCopyComp
        :handle="manifestation?.handle?? manifestation._source?.handle"
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
});
</script>

<style lang="css">
.collapse-arrow > .collapse-title:after {
top: 50%;
}
</style>