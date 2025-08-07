<template>
  <ais-panel
    role="region"
    :aria-labelledby="`facet-title-${attributeName}`"
    :class-names="{
      'ais-Panel': 'collapse collapse-arrow bg-white border-2 border-base-300 dark:border-primary-600 rounded-lg mb-2 max-md:!w-[90vw]',
      'ais-Panel-body': 'collapse-content !pl-0 !pr-0 mx-1 bg-gray-50 dark:bg-slate-900 dark:text-white text-xs ',
      'ais-Panel-header': 'collapse-title bg-white dark:bg-gray-800 dark:text-white !min-h-5 !mb-0 flex flex-row justify-between'
    }"
    :title="$t('showFacetsFor', { headerText: $t(headerText), category: $t(category) })"
  >
    <template #header="{ hasRefinements }">
      <h4
        :id="`facet-title-${attributeName}`"
        class="my-auto font-bold"
        :class="!hasRefinements?'text-primary-200 dark:text-primary-600':'text-primary-600 dark:text-primary-100'"
      >
        {{ $t(headerText) }}
      </h4>
      <MicroBadgeCategoryComp
        v-if="category"
        :category="category"
        :dense="true"
        class="my-auto"
      />
    </template>

    <template #default>
      <ais-refinement-list
        :attribute="attributeName"
        :operator="operatorType"
        :sort-by="['isRefined', 'count', 'name:asc']"
        :searchable="isSearchable"
        :limit="5"
        :show-more="true"
        :show-more-limit="10"
        :class-names="{
          'ais-RefinementList-labelText': 'text-xs',
          'ais-RefinementList-checkbox': 'checkbox checkbox-xs',
          'ais-RefinementList-count': 'badge badge-secondary font-bold text-white text-xs'
        }"
      >
        <template #noResults="{ query }">
          {{ $t('noResults') }}
        </template>

        <template #showMoreLabel="{ isShowingMore }">
          {{ !isShowingMore ? 'More' : 'Less' }}
        </template>

        <template #default="{ items, refine, searchForItems, isShowingMore, canToggleShowMore, toggleShowMore }">
          <div
            v-if="!items.length"
            class="max-w-[250px] mx-auto my-2"
          >
            <p>{{ $t('noResults') }}</p>
            <p>{{ $t('tryAdjustingFacets') }}</p>
          </div>

          <ais-search-box
            v-if="isSearchable && items.length > 0"
            class="p-1 max-w-[250px] mx-auto"
          >
            <div class="formkit-inner !rounded-3xl">
              <label
                :aria-label="$t('searchInFacet', { facetName: $t(headerText) })"
                :for="inputId"
                class="label-text !text-sm !mb-0 !p-0 !text-neutral-500 dark:!text-neutral-300"
              >
                <!-- search icon -->
              </label>
              <input
                :id="inputId"
                type="search"
                class="!text-sm p-1 !rounded-3xl w-full bg-white dark:bg-gray-800 text-neutral-700 dark:text-neutral-300 focus:outline-none ring-primary-200 ring-2 focus:ring-2 focus:ring-primary-500 px-2"
                :placeholder="$t('search')"
                @input="(e) => { searchForItems(e?.currentTarget?.value) }"
              >
            </div>
          </ais-search-box>

          <ul
            v-if="items.length > 0"
            class="ais-RefinementList py-2 max-md:max-w-[300px]"
          >
            <li
              v-for="item in items"
              :key="item.value"
              class="ais-RefinementList-item max-w-[250px]"
            >
              <label
                class="ais-RefinementList-label"
                :aria-label="$t('refineBy', { label: item.label })"
                for="checkbox"
                @click="refine(item.value)"
              >
                <input
                  class="ais-RefinementList-checkbox checkbox-primary checkbox checkbox-xs"
                  type="checkbox"
                  name="checkbox"
                  :value="item.value"
                  :checked="item.isRefined ?? 'checked'"
                  :aria-checked="item.isRefined"
                  :title="$t('refineBy', { label: item.label })"
                  :aria-label="$t('refineBy', { label: item.label })"
                >
                <span v-if="translateLabel">
                  {{ $t(item.label.replace('_', ':')) }}
                </span>
                <ais-highlight
                  v-else
                  attribute="item"
                  :title="$t(item.label)"
                  :class-names="{
                    'ais-Highlight': 'max-w-[200px] overflow-hidden text-ellipsis'
                  }"
                  :hit="item"
                />
                <span class="ais-RefinementList-count badge bg-neutral text-xs font-bold text-white">
                  {{ item.count }}
                </span>
              </label>
            </li>
          </ul>

          <button
            v-if="items.length > 0"
            class="btn btn-xs btn-primary btn-outline btn-block mx-auto"
            :disabled="!canToggleShowMore"
            :aria-expanded="isShowingMore.toString()"
            @click="toggleShowMore"
          >
            {{ !isShowingMore ? $t('showMore') : $t('showLess') }}
          </button>
        </template>
      </ais-refinement-list>
    </template>
  </ais-panel>
</template>

<script lang="ts" setup>
const props = defineProps({
    headerText: String,
    attributeName: String,
    operatorType: {
        type: String,
        default: 'or'
    },
    isSearchable: {
        type: Boolean,
        default: true
    },
    translateLabel: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        default: null
    }
});

const inputId = `facet-search-${props.attributeName}_${Math.random().toString(36).substring(2, 15)}`;

</script>
