<template>
  <div class="p-4 mx-auto max-w-7xl">
    <!-- Search -->
    <div class="mb-4">
      <input
        v-model="rawQuery"
        type="text"
        class="input input-bordered w-full"
        :placeholder="$t('glossary.search') || 'Search glossary…'"
        :aria-label="$t('glossary.search') || 'Search glossary…'"
      >
    </div>

    <!-- A–Z -->
    <div class="flex flex-wrap gap-1 mb-4 text-sm">
      <div class="w-full mb-2">
        <button
          class="btn btn-xs"
          :class="{ 'btn-active': !activeLetter }"
          @click="activeLetter=null"
        >
          {{ $t('glossary.all') || 'All' }}
        </button>
      </div>
      <button
        v-for="char in alphabet"
        :key="char"
        class="btn btn-xs"
        :class="{ 'btn-outline': activeLetter!==char, 'btn-active': activeLetter===char }"
        :aria-label="$t('glossary.filterByLetter', { letter: char })"
        :title="$t('glossary.filterByLetter', { letter: char })"
        @click="activeLetter = activeLetter===char ? null : char"
      >
        {{ char }}
      </button>
    </div>

    <!-- Loading / empty -->
    <div
      v-if="loading"
      class="text-neutral-500"
    >
      Loading…
    </div>
    <div
      v-else-if="filteredGroups.length===0"
      class="text-neutral-500"
    >
      {{ $t('glossary.noResults') || 'No results.' }}
    </div>

    <!-- Groups -->
    <section
      v-for="group in filteredGroups"
      :key="group.category"
      class="mb-8"
    >
      <h2 class="text-lg font-semibold mb-2 border-b pb-1">
        {{ group.category }}
      </h2>

      <ul class="space-y-3">
        <li
          v-for="entry in group.entries"
          :id="rowId(entry)"
          :key="entry.term + entry.enumSource"
          :ref="(el:any)=>setRowRef(entry, el)"
          class="rounded-xl border border-base-200 bg-base-100 transition-all"
          :class="isOpen(entry) ? 'grid lg:grid-cols-[1fr,minmax(300px,34rem)]' : 'block'"
        >
          <!-- LEFT: entry content -->
          <div class="p-3">
            <div class="font-medium flex items-center gap-2 flex-wrap">
              <span
                class="text-base"
                v-html="highlight(entry.term)"
              />
              <span
                v-if="!entry.isTranslated"
                class="italic text-xs text-neutral-400"
              >
                ({{ $t('glossary.untranslated') || 'not translated' }})
              </span>
              <template v-else>
                <span>:</span>
                <span v-html="highlight(entry.label)" />
              </template>

              <button
                class="btn btn-ghost btn-xs ml-auto"
                @click="togglePreview(entry)"
              >
                {{ $t('glossary.preview') || 'Preview' }}
              </button>
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
                {{ $t('glossary.moreInfo') || 'learn more' }}
              </summary>
              <p
                class="mt-1 pl-2"
                v-html="highlight(entry.definition)"
              />
            </details>

            <div class="text-xs text-neutral-400 mt-2 flex items-center gap-2">
              <span>( {{ entry.enumSource }} )</span>
              <a
                v-if="docUrl(entry)"
                :href="docUrl(entry)"
                target="_blank"
                rel="noopener"
                class="link link-primary"
              >
                {{ $t('glossary.viewDocs') || 'Documentation' }}
              </a>
            </div>
          </div>

          <!-- RIGHT: inline preview (only for this row) -->
          <transition name="slidein">
            <div
              v-if="isOpen(entry)"
              class="border-l border-base-200 bg-base-100 min-h-[16rem]"
            >
              <!-- Header -->
              <div class="flex items-center gap-2 px-3 py-2 border-b border-base-200">
                <strong class="truncate">{{ $t('glossary.preview') || 'Preview' }}</strong>
                <span class="opacity-60 text-sm truncate">· {{ entry.term }}</span>
                <div class="ml-auto flex items-center gap-2">
                  <a
                    v-if="previewUrl"
                    :href="previewUrl"
                    target="_blank"
                    rel="noopener"
                    class="btn btn-ghost btn-xs"
                  >
                    {{ $t('glossary.openInNewTab') || 'Open in new tab' }}
                  </a>
                  <button
                    class="btn btn-ghost btn-xs"
                    @click="closePreview"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div
                ref="previewScrollEl"
                class="h-[60vh] overflow-auto"
              >
                <iframe
                  v-if="previewUrl && !forceInline"
                  :key="previewUrl"
                  :src="previewUrl"
                  class="w-full h-[60vh] border-0"
                  @load="onIframeLoad"
                />
                <div
                  v-else-if="inlineHtml"
                  class="p-4 prose prose-sm max-w-none"
                  v-html="inlineHtml"
                />
                <div
                  v-else
                  class="p-4 text-sm opacity-70"
                >
                  {{ $t('glossary.loading') || 'Loading…' }}
                </div>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import type { IGlossaryEntry as GlossaryEntry } from '~/models/interfaces/manual/IGlossaryEntry';

const DOCS_BASE = 'https://av-efi.github.io/av-efi-schema/';

/* ---------- state ---------- */
const rawQuery = ref(''); const query = ref('');
let debounceTimer: ReturnType<typeof setTimeout>;
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const activeLetter = ref<string | null>(null);

const { data: entriesRaw, pending: loading } = await useFetch<GlossaryEntry[]>('/api/cms/glossary', {
    lazy: false, server: false,
});
const entries = computed(() => Array.isArray(entriesRaw.value) ? entriesRaw.value : []);

/* ---------- search ---------- */
watch(rawQuery, (val) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { query.value = (val ?? '').trim().toLowerCase(); }, 150);
});

const filteredGroups = computed(() => {
    const q = query.value;
    const filtered = entries.value.filter((entry) => {
        const hay = [entry.term, entry.label, entry.description, entry.definition].filter((s): s is string => typeof s === 'string');
        const matchQuery = !q || hay.some((s) => s.toLowerCase().includes(q));
        const matchLetter = !activeLetter.value || entry.term?.[0]?.toUpperCase() === activeLetter.value;
        return matchQuery && matchLetter;
    });
    return groupByCategory(filtered);
});

function groupByCategory(list: GlossaryEntry[]) {
    const grouped: Record<string, GlossaryEntry[]> = {};
    for (const entry of list) {
        const key = `${entry.term}|${entry.enumSource}`;
        const cat = entry.category || 'Misc';
        if (!grouped[cat]) grouped[cat] = [];
        if (!grouped[cat].some((e) => `${e.term}|${e.enumSource}` === key)) grouped[cat].push(entry);
    }
    return Object.entries(grouped).map(([category, entries]) => ({ category, entries }));
}

function highlight(text: string): string {
    if (!query.value || !text) return text;
    const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

/* ---------- docs url ---------- */
function docUrl(entry: GlossaryEntry): string | '' {
    const src = (entry.enumSource || '').trim();
    if (!src) return `${DOCS_BASE}schema_overview/`;
    if (/Enum$/.test(src)) return `${DOCS_BASE}${src.replace(/\s+/g, '')}/`;
    return `${DOCS_BASE}schema_overview/`;
}

/* ---------- inline preview per row ---------- */
const openKey = ref<string>('');               // which row is open
const previewUrl = ref<string>('');            // url for iframe / inline
const inlineHtml = ref<string>('');            // sanitized html fallback
const forceInline = ref(false);
const previewScrollEl = ref<HTMLElement | null>(null);
let iframeTimer: any = null;

const rowMap = new Map<string, HTMLElement>();
const rowId = (e: GlossaryEntry) => `glrow-${e.term.replace(/[^a-z0-9_-]/gi,'_')}-${(e.enumSource||'').replace(/[^a-z0-9_-]/gi,'_')}`;
function setRowRef(e: GlossaryEntry, el: HTMLElement | null) {
    const k = rowId(e);
    if (el) rowMap.set(k, el); else rowMap.delete(k);
}
const isOpen = (e: GlossaryEntry) => openKey.value === rowId(e);

async function togglePreview(entry: GlossaryEntry) {
    const k = rowId(entry);
    if (openKey.value === k) { closePreview(); return; }
    openKey.value = k;
    previewUrl.value = docUrl(entry);
    inlineHtml.value = '';
    forceInline.value = false;

    // scroll the clicked row into comfortable view
    await nextTick();
    const row = rowMap.get(k);
    row?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // fallback to inline if iframe blocked
    clearTimeout(iframeTimer);
    iframeTimer = setTimeout(async () => {
        if (!forceInline.value && previewUrl.value) {
            await loadInlineHtml(previewUrl.value!);
            if (inlineHtml.value) forceInline.value = true;
        }
    }, 1200);
}

function closePreview() {
    openKey.value = '';
    previewUrl.value = '';
    inlineHtml.value = '';
    forceInline.value = false;
    clearTimeout(iframeTimer);
}

function onIframeLoad() {
    clearTimeout(iframeTimer);
}

/* fetch + sanitize docs (inline fallback) */
async function loadInlineHtml(url: string) {
    try {
        const res = await fetch(url, { mode: 'cors' });
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const main = doc.querySelector('main') || doc.querySelector('#main-content') || doc.querySelector('article') || doc.body;

        // absolutize links, open new tab
        main.querySelectorAll('a[href]').forEach((a: HTMLAnchorElement) => {
            const href = a.getAttribute('href') || '';
            if (href.startsWith('#')) return;
            try {
                a.setAttribute('href', new URL(href, url).toString());
                a.setAttribute('target', '_blank');
                a.setAttribute('rel', 'noopener');
            } catch {}
        });
        main.querySelectorAll('img[src]').forEach((img: HTMLImageElement) => {
            const src = img.getAttribute('src') || '';
            try { img.setAttribute('src', new URL(src, url).toString()); } catch {}
            img.style.maxWidth = '100%'; img.style.height = 'auto';
        })
        ;['header','footer','nav','.site-header','.site-footer'].forEach(sel=>{
            main.querySelectorAll(sel).forEach(n=>n.remove());
        });
        inlineHtml.value = main.innerHTML || '';
    } catch {
        inlineHtml.value = '';
    }
}
</script>

<style scoped>
/* Slide-in animation for the right preview panel */
.slidein-enter-active,
.slidein-leave-active {
  transition: transform .18s ease, opacity .18s ease;
}
.slidein-enter-from,
.slidein-leave-to {
  transform: translateX(24px);
  opacity: 0;
}

/* Inline docs prose tweaks */
.prose :where(h1,h2,h3){ margin-top:.75rem; }
.prose table{ width:100%; border-collapse:collapse; }
.prose th,.prose td{ border:1px solid var(--fallback-bc,#e5e7eb); padding:.25rem .5rem; }

/* Small helper for line clamp if needed */
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
</style>
