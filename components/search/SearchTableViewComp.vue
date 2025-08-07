<template>
  <EasyDataTable
    table-class-name="customize_table w-[300px] md:w-auto"
    table-theme-color="var(--primary)"
    :headers="headers"
    :items="items"
    alternating
    buttons-pagination
    show-index
    hide-footer
    :rows-per-page="10"
  >
    <!-- header templates untouched, aria not needed here -->

    <template #item-has_record.has_primary_title.has_name="item">
      <div
        class="w-full flex flex-row"
        role="region"
        :aria-label="item?.has_record?.has_primary_title?.has_name"
      >
        <!-- inner content unchanged -->
      </div>
    </template>

    <!-- no changes needed in these item cell templates -->

    <template #expand="item">
      <div
        v-if="!productionDetailsChecked" 
        class="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 py-2 md:ml-[64px] md:pl-4 bg-slate-50 dark:bg-gray-800 dark:text-white"
        role="region"
        :aria-label="`${$t('detailsFor')} ${item?.has_record?.has_primary_title?.has_name}`"
      >
        <!-- content untouched -->
      </div>

      <div
        v-for="manifestation in item?.manifestations"
        :key="manifestation.id"
        class="collapse collapse-arrow rounded-none md:pl-[64px]"
        role="group"
        :aria-labelledby="`manifestation-header-${manifestation.id}`"
      >
        <input
          type="checkbox"
          class="manifestation-checkbox"
          :aria-expanded="false"
        >
        <div
          :id="`manifestation-header-${manifestation.id}`"
          class="collapse-title py-2 bg-slate-100 dark:bg-slate-700 dark:text-white font-medium"
        >
          <DetailManifestationHeaderComp
            :manifestation="manifestation"
            type="searchresult"
            comp-size="sm"
          />
        </div>
        <div
          class="collapse-content bg-slate-50 dark:bg-gray-800 dark:text-white"
          role="region"
          :aria-label="`${$t('itemsFor')} ${manifestation.handle}`"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
            <!-- content untouched -->
          </div>
          <hr class="my-2">
          <h4
            id="items-heading"
            class="font-bold text-item-900 dark:text-item-200 pl-1 underline decoration-item"
            :title="$t('tooltip.item')"
          >
            {{ $t('items') }}
          </h4>
          <table
            class="table border-collapse border border-slate-400 table-sm max-w-full mt-2"
            role="table"
            :aria-labelledby="'items-heading'"
          >
            <thead class="bg-slate-200 dark:bg-slate-900 dark:text-white">
              <tr role="row">
                <th
                  scope="col"
                  class="border border-slate-300"
                >
                  efi
                </th>
                <th
                  scope="col"
                  class="border border-slate-300"
                  :title="$t('tooltip.format')"
                >
                  {{ $t('has_format') }}
                </th>
                <th
                  scope="col"
                  class="border border-slate-300"
                >
                  {{ $t('item_element_type') }}
                </th>
                <th
                  scope="col"
                  class="border border-slate-300"
                >
                  {{ $t('in_language_code') }}
                </th>
                <th
                  scope="col"
                  class="border border-slate-300"
                >
                  {{ $t('webresource') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="exemplar in manifestation.items"
                :key="exemplar.id"
                class="bg-slate-100 dark:bg-gray-800 dark:text-white"
                role="row"
              >
                <td
                  class="border border-slate-200 dark:border-slate-600"
                  role="cell"
                >
                  <p class="text-xs">
                    {{ exemplar.handle }}
                  </p>
                  <LazyMicroEfiCopyComp
                    :handle="exemplar.handle"
                    comp-size="sm"
                    class="z-10 relative hidden"
                  />
                </td>
                <td
                  class="border border-slate-200 dark:border-slate-600"
                  role="cell"
                >
                  <SearchHighlightListComp
                    :items="exemplar?.has_record?.has_format?.map(form => form.type) || []"
                    :hilite="item._highlightResult?.manifestations?.items.has_record?.has_format.matchedWords"
                    font-size="text-xs"
                    class="mb-2"
                  />
                </td>
                <td
                  class="border border-slate-200 dark:border-slate-600"
                  role="cell"
                >
                  <SearchHighlightSingleComp
                    :item="exemplar?.has_record.element_type"
                    :hitlite="item._highlightResult?.manifestations?.items.has_record?.element_type?.matchedWords"
                    class="mb-2"
                  />
                </td>
                <td
                  class="border border-slate-200 dark:border-slate-600"
                  role="cell"
                >
                  <SearchHighlightSingleComp
                    :item="exemplar?.has_record?.in_language?.code"
                    :hitlite="item._highlightResult?.manifestations?.items.has_record?.in_language?.code?.matchedWords"
                    font-size="text-xs"
                    class="mb-2"
                  />
                </td>
                <td
                  class="border border-slate-200 dark:border-slate-600"
                  role="cell"
                >
                  <a
                    v-if="exemplar?.has_record?.has_webresource"
                    :href="exemplar?.has_record?.has_webresource"
                    target="_blank"
                    class="link link-primary dark:link-accent text-xs"
                  >
                    <Icon name="formkit:linkexternal" />&nbsp;{{ $t('webresource') }}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </EasyDataTable>
</template>
<script lang="ts" setup>
import type { MovingImageRecordContainer } from '~/models/interfaces/schema/avefi_schema.ts';

defineProps({
    'items': {
        type: Array as PropType<Array<MovingImageRecordContainer>>,
        required:true
    },
    showAdminStats: {
        type: Boolean,
        required: false,
        default: false,
    },
    productionDetailsChecked: {
        type: Boolean,
        required: true,
    }
});

const headers = [
    { text: 'title', value: 'has_record.has_primary_title.has_name' },
    { text: 'alternativetitle', value: 'has_record.has_alternative_title.has_name' },
    { text: 'country', value: 'has_record.has_event.located_in.has_name' },
    { text: 'year', value: 'years' },
    { text: 'directors_or_editors', value: 'directors_or_editors' },
    { text: 'avefi:ProductionEvent', value: 'production' }
];

</script>
<style lang="css">
.vue3-easy-data-table__body.customize_table td.expand, td.expand, td.expand:hover {
  background-color: var(--primary-900)!important;
}

.avefi-dark .vue3-easy-data-table__body.customize_table td.expand, td.expand, td.expand:hover {
  background-color: var(--slate-950)!important;
}


</style>