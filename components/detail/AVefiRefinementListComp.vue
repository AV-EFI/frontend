<template>
  <ais-refinement-list
    :attribute="attributeName"
    :searchable="true"
    @click="(event: any) => event.stopPropagation()"
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
      <!-- Search input -->
      <input
        type="search"
        role="searchbox"
        autocomplete="off"
        class="ais-SearchBox-input appearance-none [color-scheme:light] dark:[color-scheme:dark] selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow outline-none bg-transparent selection:bg-bali-hai-100 placeholder:!text-zinc-300 group-data-[disabled]:!cursor-not-allowed dark:placeholder:!text-zinc-200/50 dark:!text-zinc-300 border-none focus:ring-0 formkit-input !p-3 !rounded-3xl"
        :placeholder="$t('search')"
        :aria-label="$t(attributeName)"
        @input="searchForItems(($event?.target as HTMLInputElement)?.value)"
      >

      <!-- Facet list -->
      <ul
        role="listbox"
        :aria-label="$t(attributeName)"
        class="mt-2 space-y-1"
      >
        <li
          v-if="isFromSearch && !items.length"
          role="option"
          aria-disabled="true"
        >
          {{ $t('noResults') }}
        </li>

        <li
          v-for="item in items"
          :key="item.value"
          role="option"
          :aria-selected="item.isRefined"
        >
          <a
            :href="createURL(item)"
            :style="{ fontWeight: item.isRefined ? 'bold' : '' }"
            class="flex justify-between items-center"
            @click.prevent="(e: Event) => { e.preventDefault(); refine(`${item}`); }"
          >
            <span>{{ $t(item.label) }}</span>
            <div class="badge text-white badge-secondary">{{ item.count.toLocaleString() }}</div>
          </a>
        </li>
      </ul>
    </template>
  </ais-refinement-list>
</template>

<script setup lang="ts">
defineProps({
  attributeName: {
    type: String,
    required: true
  }
});
</script>