<template>
  <div class="ml-2">
    <NuxtLayout
      name="partial-grid-2-1"
      class="mt-2"
    >
      <template #left>
        <h4
          class="text-md capitalize col-span-full text-primary-900 dark:text-primary-100 text-ellipsis text-wrap overflow-hidden max-w-full"
          :alt="$t('items')"
        >
          {{ $t('items') }}
        </h4>  
      </template>
    </NuxtLayout>
    <MicroDividerComp
      in-class="item"
      label-text="avefi:Item"
    /> 
    <EasyDataTable
      table-class-name="customize_table"
      table-theme-color="var(--primary)"
      :headers="headers"
      :items="itemList"
      alternating
      buttons-pagination
      show-index
      :rows-per-page="10"
    >
      <template #header-_source.has_record.in_language.spoken="header">
        <div class="customize-header">
          {{ $t(header.text) }}
        </div>
      </template>
      <template #header-_source.has_record.in_language.subtitles="header">
        <div class="customize-header">
          {{ $t(header.text) }}
        </div>
      </template>
      <template #header-_source.has_record.has_webresource="header">
        <div class="customize-header">
          {{ $t(header.text) }}
        </div>
      </template>
      <template #loading>
        loading items ...
      </template>
      <template
        #item-_source.has_record.has_webresource="item"
      >
        <a
          :href="item._source.has_record.has_webresource"
          target="_blank"
          class="link link-primary dark:link-accent"
        ><Icon
          name="formkit:linkexternal"
        />&nbsp;{{ $t('webresource') }}</a>
      </template>
      <template
        #item-actions="item"
      >
        <div class="w-full h-full flex flex-row">
          <a
            target="_blank"
            :href="`/film/${item._id}`"
            class="btn btn-primary btn-xs"
          >Details →</a>
        </div>
      </template>
      <template #item-_source.has_record.in_language.spoken="item">
        {{ item._source?.has_record?.in_language?.filter(function(in_lang) { return in_lang.usage == 'SpokenLanguage';}).map(function (in_lang) {return $t(in_lang.code); }).join(',') }}
      </template>
      <template #item-_source.has_record.in_language.subtitles="item">
        {{ item._source?.has_record?.in_language?.filter(function(in_lang) { return in_lang.usage == 'Subtitles';}).map(function (in_lang) {return $t(in_lang.code); }).join(',') }}
      </template>
      <template #empty-message>
        <span>nothing here</span>
      </template>
      <template
        #expand="item"
      >
        <div
          v-if="item._source?.has_record?.in_language"
          class="flex flex-col p-4 ml-4"
        >
          <MicroLabelComp
            label-text="language"
          />
          <div class="flex flex-col">
            <ul>
              <li
                v-for="in_lang in item._source?.has_record?.in_language"
                :key="in_lang.code"
                :value="in_lang"
                class="flex flex-row"
              >
                <span>{{ $t(in_lang.code) }}</span>
                &nbsp;
                (<span>{{ in_lang.usage.map(function (usage) {return $t(usage); }).join(',') }}</span>)
              </li>
            </ul>
          </div>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>
<script lang="ts" setup>
const itemList = defineModel({type: Array as PropType<AVefiFEManifestation[]>, required: true});
const headers: Header[] = [
    { text: "Institution", value: "_source.has_record.described_by.has_issuer_name", sortable:true },
    { text: "SpokenLanguage", value: "_source.has_record.in_language.spoken", sortable:true },
    { text: "Subtitles", value: "_source.has_record.in_language.subtitles", sortable:true },
    { text: "webresource", value: "_source.has_record.has_webresource", sortable:false },    
];

console.log(itemList);
</script>