<template>
  <div
    v-for="exemplar in items"
    :key="exemplar?.id"
    class="grid grid-cols-4 gap-x-2 gap-y-0 mb-4 grid-rows-[minmax(0,1fr)] px-2 md: ml-4 md:px-2 py-2 dark:text-white border-l-2 border-item"
  >
    <div class="col-span-full row-start-1 mb-2">
      <MicroDividerComp
        class="mx-auto lg:mt-[5px] mb-4"
        label-text="avefi:Item" 
        in-class="item"
      />
    </div>
    <div class="col-span-full md:col-span-2 row-start-2">
      <DetailKeyValueComp 
        :id="exemplar._id ?? exemplar?.handle?.replace('21.11155/', '') ?? exemplar?.handle"
        :keytxt="$t('EFI')"
        :valtxt="exemplar?.handle"
        class="w-full mb-2"
        :clip="false"
      />
    </div>
    <div class="col-span-full md:col-span-1 md:row-start-2 flex flex-col justify-end">
      <MicroLabelComp label-text="webresource" />
      <a
        v-if="exemplar?.has_record?.has_webresource"
        :href="exemplar?.has_record?.has_webresource"
        target="_blank"
        class="link link-primary dark:link-accent mt-auto"
      >
        <Icon name="formkit:linkexternal" />&nbsp;{{ $t('webresource') }}
      </a>
      <p v-else>
        -
      </p>
    </div>
    <div class="col-span-full md:col-span-1 md:row-start-2 flex flex-col justify-end">
      <MicroEfiCopyComp
        :handle="exemplar?.handle"
        category="item"
        class="ml-auto"
      />
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="has_format" />
      <SearchHighlightListComp
        :items="exemplar?.has_record?.has_format?.map(form => form.type) || []"
        :hilite="highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"                  
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="item_element_type" />
      <SearchHighlightSingleComp
        :item="exemplar?.has_record?.element_type || null"
        :hitlite="highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
        class="mb-2"
      />
    </div>
    <div class="col-span-full md:col-span-1">
      <MicroLabelComp label-text="in_language_code" />
      <SearchHighlightListComp
        :items="exemplar?.has_record?.in_language?.flatMap((il) => `${$t(il?.code)} (${il?.usage?.map((usage) => $t(usage)).join(', ')})`) || []"
        :hilite="highlightResult?.manifestations?.items?.has_record?.in_language?.code?.matchedWords"
        class="mb-2"
      />
    </div>
    <div
      v-if="exemplar?.has_record?.has_webresource"
      class="col-span-full flex flex-col justify-end row-start-8"
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
    productionDetailsChecked: {
        type: Boolean,
        required: false,
        default: false,
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    },
});
</script>