<template>
  <div class="p-4 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      {{ $t('glossary.title') || 'Glossar' }}
    </h1>
  
    <input
      v-model="rawQuery"
      type="text"
      class="input input-bordered w-full mb-6"
      :placeholder="$t('glossary.search') || 'Glossarbegriff suchen...'"
      :aria-label="$t('glossary.search') || 'Glossarbegriff suchen...'"
    >
  
    <div
      v-if="loading"
      class="text-neutral-500"
    >
      Loading...
    </div>
    <div
      v-else-if="filteredGroups.length === 0"
      class="text-neutral-500"
    >
      {{ $t('glossary.noResults') || 'Kein passender Glossarbegriff gefunden.' }}
    </div>

    <div class="flex flex-wrap gap-1 mb-4 text-sm">
      <button
        class="btn btn-xs"
        :class="{ 'btn-active': !activeLetter }"
        @click="activeLetter = null"
      >
        {{ $t('glossary.all') || 'Alle' }}
      </button>
      <button
        v-for="char in alphabet"
        :key="char"
        class="btn btn-xs"
        :class="{
          'btn-outline': activeLetter !== char,
          'btn-active': activeLetter === char,
        }"
        :aria-label="$t('glossary.filterByLetter', { letter: char })"
        :title="$t('glossary.filterByLetter', { letter: char })"
        @click="activeLetter = activeLetter === char ? null : char"
      >
        {{ char }}
      </button>
    </div>

    <div
      v-for="group in filteredGroups"
      :key="group.category"
      class="mb-8"
    >
      <h2 class="text-lg font-semibold mb-2 border-b pb-1">
        {{ group.category }}
      </h2>
      <ul class="list-inside space-y-3">
        <li
          v-for="entry in group.entries"
          :key="entry.term + entry.enumSource"
        >
          <div class="font-medium">
            <span v-html="highlight(entry.term)" />
            <span
              v-if="!entry.isTranslated"
              class="ml-2 italic text-xs text-neutral-400"
            >
              ({{ $t('glossary.untranslated') || 'nicht übersetzt' }})
            </span>
            <span
              v-else
            >
              <span>: </span>
              <span v-html="highlight(entry.label)" />
            </span>
          </div>
  
          <div
            v-if="entry.description"
            class="text-sm text-neutral-700 dark:text-neutral-300 mt-1"
            v-html="highlight(entry.description)"
          />
  
          <details
            v-if="entry.definition"
            class="mt-1 text-xs text-neutral-500"
          >
            <summary class="cursor-pointer underline underline-offset-2">
              {{ $t('glossary.moreInfo') || 'mehr erfahren' }}
            </summary>
            <p
              class="mt-1 pl-2"
              v-html="highlight(entry.definition)"
            />
          </details>
  
          <div class="text-xs text-neutral-400 mt-1">
            ({{ entry.enumSource }})
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
  
  interface GlossaryEntry {
    term: string;
    label: string;
    description: string;
    definition: string;
    enumSource: string;
    category: string;
    isTranslated: boolean;
  }
  
const rawQuery = ref('');
const query = ref('');
let debounceTimer: ReturnType<typeof setTimeout>;
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const activeLetter = ref<string | null>(null);

  
watch(rawQuery, (val) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        query.value = val.trim().toLowerCase();
    }, 150);
});
  
const { data: entriesRaw, pending: loading } = await useFetch<GlossaryEntry[]>('/api/cms/glossary', {
    lazy: false,
    server: false,
});
  
const entries = computed(() =>
    Array.isArray(entriesRaw.value) ? entriesRaw.value : []
);
  
const filteredGroups = computed(() => {
    const q = query.value;
    const filtered = entries.value.filter((entry) => {
        const matchQuery = !q || [entry.term, entry.label, entry.description, entry.definition]
            .filter((s) => typeof s === 'string')
            .some((s) => (s as string).toLowerCase().includes(q));

        const matchLetter = !activeLetter.value || entry.term[0]?.toUpperCase() === activeLetter.value;

        return matchQuery && matchLetter;
    });

    return groupByCategory(filtered);
});

  
function groupByCategory(entries: GlossaryEntry[]) {
    const grouped: Record<string, GlossaryEntry[]> = {};
    for (const entry of entries) {
        const key = `${entry.term}|${entry.enumSource}`;
        if (!grouped[entry.category]) grouped[entry.category] = [];
  
        // prevent duplicates
        if (!grouped[entry.category].some(e => `${e.term}|${e.enumSource}` === key)) {
            grouped[entry.category].push(entry);
        }
    }
    return Object.entries(grouped).map(([category, entries]) => ({
        category,
        entries,
    }));
}
  
function highlight(text: string): string {
    if (!query.value || !text) return text;
    const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}
</script>  