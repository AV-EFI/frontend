<template>
  <div
    v-for="exemplar in items"
    :key="exemplar?.id"
    class="grid grid-cols-4 gap-x-2 gap-y-0 mb-4 grid-rows-[minmax(0,1fr)] px-4 py-2 dark:text-white"
  >
    <div class="col-span-full row-start-1">
      <MicroDividerComp
        class="mx-auto lg:mt-[5px] mb-4"
        label-text="avefi:Item" 
      />
    </div>
    <div class="col-span-full lg:col-span-2 row-start-2 border-l-2 border-item pl-2">
      <DetailKeyValueComp 
        :keytxt="$t('EFI')"
        :valtxt="exemplar?.handle"
        class="w-full"
        :clip="false"
      />
    </div>
    <div class="col-span-full lg:col-span-1 row-start-2 flex flex-col justify-end mr-4">
      <MicroLabelComp label-text="webresource" />
      <a
        v-if="exemplar?.has_record?.has_webresource"
        :href="exemplar?.has_record?.has_webresource"
        target="_blank"
        class="link link-primary dark:link-accent mt-auto md:mb-2"
      >
        <Icon name="formkit:linkexternal" />&nbsp;{{ $t('webresource') }}
      </a>
      <p v-else>
        -
      </p>
    </div>
    <div class="col-span-full lg:col-span-1 row-start-2 flex flex-col justify-end mr-4">
      <MicroEfiCopyComp
        :handle="exemplar?.handle"
        class="ml-auto mr-4"
      />
    </div>
    <div class="col-span-full md:col-span-1 row-start-3 border-l-2 border-item pl-2">
      <MicroLabelComp label-text="has_format" />
      <SearchHighlightListComp
        :items="exemplar?.has_record?.has_format?.map(form => form.type)"
        :hilite="highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"                  
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-1 row-start-3">
      <MicroLabelComp label-text="item_element_type" />
      <SearchHighlightSingleComp
        :item="exemplar?.has_record?.element_type"
        :hitlite="highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-2 row-start-3">
      <MicroLabelComp label-text="in_language_code" />
      <SearchHighlightListComp
        :items="exemplar?.has_record?.in_language?.flatMap((il) => `${$t(il?.code)} (${il?.usage?.map((usage) => $t(usage)).join(', ')})`)"
        :hilite="highlightResult?.manifestations?.items?.has_record?.in_language?.code?.matchedWords"
        class="mb-2"
      />
    </div>
    <div
      v-if="exemplar?.has_record?.has_webresource"
      class="col-span-full md:col-span-1 flex flex-col justify-end row-start-3"
    />
  </div>
</template>
<script setup lang="ts">
defineProps({
    items: {
        type: Array,
        required: true,
    },
    highlightResult: {
        type: Object,
        required: false,
        default: () => ({}),
    },
});
</script>