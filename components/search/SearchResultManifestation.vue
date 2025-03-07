<template>
  <div
    v-for="manifestation in manifestation_items"
    :key="manifestation.id"
    class="collapse collapse-arrow"
  >
    <input
      type="checkbox"
      class="manifestation-checkbox"
    >
    <div class="collapse-title bg-slate-100 dark:bg-slate-700 dark:text-whitefont-medium">
      <p class="text-sm">
        {{ manifestation?.handle }}
      </p>
      <h3 class="font-bold text-primary-900 dark:text-primary-200">
        {{ manifestation?.has_record?.described_by?.has_issuer_name }}
      </h3>
    </div>
    <div class="collapse-content bg-slate-50 dark:bg-slate-800 dark:text-white">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div class="col-span-1">
          <MicroLabelComp label-text="in_language_code" />
          <SearchHighlightListComp
            :items="manifestation?.has_record?.in_language?.map(lang => lang.code)"
            :hilite="item._highlightResult?.manifestations?.has_record?.in_language?.code?.matchedWords"                  
            class="mb-2"
          />
        </div>
        <div class="col-span-1">
          <MicroLabelComp label-text="has_colour" />
          <SearchHighlightSingleComp 
            :item="manifestation?.has_record?.has_colour_type"
            :hitlite="item._highlightResult?.manifestations?.has_record?.has_colour_type?.matchedWords"                  
            class="mb-2"
          />
        </div>
      </div>
      <hr class="my-2">
      <h4 class="font-bold text-item-900 dark:text-item-200 pl-1 underline decoration-item">
        {{ $t('items') }}
      </h4>
      <div
        v-for="exemplar in manifestation.items"
        :key="exemplar.id"
        class="grid grid-cols-1 md:grid-cols-4 gap-2 bg-slate-200 rounded-lg p-2 dark:bg-slate-900 dark:text-white mt-2"
      >
        <div class="row-start-1 col-span-3">
          <DetailKeyValueComp
            keytxt="EFI"
            :valtxt="exemplar?.handle"
            :clip="true"                  
            class="mb-2"
          />
        </div>
        <div class="row-start-1 col-start-4 col-span-1 flex flex-col justify-center">
          <a
            v-if="exemplar?.has_record?.has_webresource"
            :href="exemplar?.has_record?.has_webresource"
            target="_blank"
            class="link link-primary dark:link-accent"
          ><Icon
            name="formkit:linkexternal"
          />&nbsp;{{ $t('webresource') }}</a>
        </div>

        <div class="row-start-2 col-span-1">
          <MicroLabelComp label-text="has_format" />
          <SearchHighlightListComp
            :items="exemplar?.has_record?.has_format?.map(form => form.type)"
            :hilite="item._highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"
                  
            class="mb-2"
          />
        </div>
        <div class="row-start-2 col-span-1">
          <MicroLabelComp label-text="in_language_code" />
          <SearchHighlightSingleComp
            :item="exemplar?.has_record?.in_language?.code"
            :hitlite="item._highlightResult?.manifestations?.items.has_record?.in_language?.code?.matchedWords"
                  
            class="mb-2"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

const props = defineProps({
    manifestation_items: {
        type: Object,
        required: true,
    },
});

</script>