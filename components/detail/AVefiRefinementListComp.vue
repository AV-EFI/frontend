<template>
  <ais-refinement-list
    :attribute="attributeName"
    :searchable="true"
    @click="(event) => event.stopPropagation()"    
  >
    <template
      #default="{
        items,
        isFromSearch,
        refine,
        createURL,
        searchForItems
      }"
    >
      <input
        class="ais-SearchBox-input appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 group-data-[disabled]:!cursor-not-allowed dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none focus:ring-0 formkit-input !p-3 !rounded-3xl"
        :placeholder="$t('search')"
        @input="searchForItems($event?.currentTarget?.value)"
      >
      <ul>
        <li v-if="isFromSearch && !items.length">
          No results.
        </li>
        <li
          v-for="item in items"
          :key="item.value"
        >
          <a
            :href="createURL(item)"
            :style="{ fontWeight: item.isRefined ? 'bold' : '' }"
            @click.prevent="(e) => {e.preventDefault(); refine(`${item}`);}"
          >
            <span>{{ $t(item.label) }}</span>
            <div class="badge text-white badge-secondary">{{ item.count.toLocaleString() }}</div>
          </a>
        </li>
      </ul>
    </template>
  </ais-refinement-list>
</template>
<script setup lang=ts>
defineProps({
    attributeName: {
        type: String,
        required: true
    }
});
</script>