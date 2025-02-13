<template>
  <ais-panel
    :class-names="{
      'ais-Panel': 'collapse collapse-arrow',
      'ais-Panel-body': 'collapse-content !pl-0 pr-0! bg-slate-50 dark:bg-slate-900 dark:text-white text-xs',
      'ais-Panel-header': 'collapse-title bg-slate-100 dark:bg-slate-800 dark:text-white !min-h-5 !mb-0 flex flex-row justify-between'
    }"
    tabindex="4"
  >
    <template #header="{ hasRefinements }">
      <h4 
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
        :class-names="
          {
            'ais-RefinementList-labelText' : 'text-xs',
            'ais-RefinementList-checkbox' : 'checkbox checkbox-xs',
            'ais-RefinementList-count' : 'badge badge-secondary font-bold text-white text-xs'
          }"
      >
        <template #showMoreLabel="{ isShowingMore }">
          {{ !isShowingMore ? 'More' : 'Less' }}
        </template>
        <template #default="{items, refine, searchForItems, isShowingMore, canToggleShowMore, toggleShowMore}">
          <ais-search-box
            v-if="isSearchable"
            class="p-1"
          >
            <div
              class="text-sm flex items-center w-full py-1.5 px-2.5 rounded-xl border border-zinc-300 bg-white focus-within:ring-1 focus-within:!ring-primary-400 focus-within:!border-primary-400 group-data-[invalid]:border-red-400 group-data-[invalid]:ring-1 group-data-[invalid]:ring-red-400 group-data-[disabled]:bg-zinc-100 group-data-[disabled]:!cursor-not-allowed shadow-sm group-[]/repeater:shadow-none group-[]/multistep:shadow-none dark:bg-transparent dark:border-zinc-300 dark:group-data-[disabled]:bg-zinc-800/5 dark:group-data-[invalid]:border-red-400 dark:group-data-[invalid]:ring-red-400 formkit-inner !rounded-3xl"
            >
              <label
                class="flex items-center -ml-0.5 mr-1.5 text-sm h-[1em] w-[1em] shrink-0 [&amp;>svg]:w-full text-zinc-600 dark:text-zinc-300 formkit-prefixIcon formkit-icon"
                for="input_0"
              ><svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 15 16"
              ><path
                d="M6.5,13.02c-1.41,0-2.82-.54-3.89-1.61-1.04-1.04-1.61-2.42-1.61-3.89s.57-2.85,1.61-3.89c2.14-2.14,5.63-2.14,7.78,0,1.04,1.04,1.61,2.42,1.61,3.89s-.57,2.85-1.61,3.89c-1.07,1.07-2.48,1.61-3.89,1.61Zm0-10c-1.15,0-2.3,.44-3.18,1.32-.85,.85-1.32,1.98-1.32,3.18s.47,2.33,1.32,3.18c1.75,1.75,4.61,1.75,6.36,0,.85-.85,1.32-1.98,1.32-3.18s-.47-2.33-1.32-3.18c-.88-.88-2.03-1.32-3.18-1.32Z"
                fill="currentColor"
              /><path
                d="M13.5,15c-.13,0-.26-.05-.35-.15l-3.38-3.38c-.2-.2-.2-.51,0-.71,.2-.2,.51-.2,.71,0l3.38,3.38c.2,.2,.2,.51,0,.71-.1,.1-.23,.15-.35,.15Z"
                fill="currentColor"
              /></svg>
              </label>
              <input
                type="search"
                class="appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-zinc-700 min-w-0 min-h-[1em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 group-data-[disabled]:!cursor-not-allowed dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none p-0 focus:ring-0 formkit-input !text-sm p-1 !rounded-3xl"
                :placeholder="$t('search')"
                @input="(e) => {searchForItems(e?.currentTarget?.value)}"
              >
            </div>
          </ais-search-box>
          <ul class="ais-RefinementList">
            <li
              v-for="item in items"
              :key="item.value"
              class="ais-RefinementList-item max-w-[250px]"
            >
              <label
                class="ais-RefinementList-label"
                for="checkbox"
                @click="refine(item.value)"
              >
                <input
                  class="ais-RefinementList-checkbox checkbox checkbox-xs"
                  type="checkbox"
                  name="checkbox"
                  :value="item.value"
                  :checked="item.isRefined??'checked'"
                >
                <span v-if="translateLabel">
                  {{ $t(item.label.replace('_',':')) }}
                </span>
                <ais-highlight
                  v-else
                  attribute="item"
                  :title="item.label"                  
                  :class-names="{
                    'ais-Highlight': 'max-w-[200px] overflow-hidden text-ellipsis'
                  }"
                  :hit="item"                  
                />
                <span class="ais-RefinementList-count badge badge-secondary text-xs font-bold text-white">{{ item.count }}</span>
              </label>
            </li>
          </ul>
          <button
            class="btn btn-sm btn-primary btn-outline btn-block"
            :disabled="!canToggleShowMore"
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
</script>