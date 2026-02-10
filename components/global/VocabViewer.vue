<template>
  <div class="p-4 mx-auto max-w-7xl">
    <!-- Search -->
    <div class="mb-4">
      <input v-model="rawQuery" type="text" class="input input-bordered w-full"
        :placeholder="$t('vocab.search') || 'Search vocabulary…'"
        :aria-label="$t('vocab.search') || 'Search vocabulary…'">
    </div>

    <!-- A–Z -->
    <div class="flex flex-wrap gap-1 mb-4 text-sm">
      <div class="w-full mb-2">
        <button class="btn btn-xs" :class="{ 'btn-active': !activeLetter }" @click="activeLetter=null">
          {{ $t('vocab.all') || 'All' }}
        </button>
      </div>
      <button v-for="char in alphabet" :key="char" class="btn btn-xs"
        :class="{ 'btn-outline': activeLetter!==char, 'btn-active': activeLetter===char }"
        :aria-label="$t('vocab.filterByLetter', { letter: char })" :title="$t('vocab.filterByLetter', { letter: char })"
        @click="activeLetter = activeLetter===char ? null : char">
        {{ char }}
      </button>
    </div>

    <!-- Loading / empty -->
    <div v-if="loading" class="text-neutral-500">
      Loading…
    </div>
    <div v-else-if="filteredGroups.length===0" class="text-neutral-500">
      {{ $t('vocab.noResults') || 'No results.' }}
    </div>

    <!-- Groups -->
    <section v-for="group in filteredGroups" :key="group.category" class="mb-8">
      <h2 class="text-lg font-semibold mb-2 border-b pb-1" v-html="highlight(group.category)">
      </h2>
      <ul class="flex flex-row flex-wrap gap-1 lg:gap-2">
        <li v-for="entry in group.entries" :id="rowId(entry)" :key="entry.term + entry.enumSource + query"
          :ref="(el:any)=>setRowRef(entry, el)"
          class="rounded-xl border border-base-200 bg-base-100 transition-all w-full lg:w-[calc(50%_-_0.25rem)]"
          :class="isOpen(entry) ? 'grid lg:grid-cols-[1fr,minmax(300px,34rem)]' : 'block'">
          <!-- LEFT: entry content -->
          <div class="p-3">
            <div class="flex flex-row max-w-md">
              <span class="text-xs text-neutral-500">
                <code>{{ displayTerm(entry.term) }}</code>
              </span>
              <button class="btn btn-ghost btn-xs ml-auto" @click="togglePreview(entry)">
                {{ $t('vocab.preview') || 'Preview' }}
              </button>
            </div>

            <div class="font-medium flex items-center gap-2 flex-wrap">
              <!-- DE + EN always shown (when present), with stable layout -->
              <span class="text-base">
                <span class="text-xs text-neutral-500">DE: </span>
                <span v-html="highlight(labelDe(entry))" />
                <span class="text-neutral-400 mx-2">|</span>
                <span class="text-xs text-neutral-500">EN: </span>
                <span v-html="highlight(labelEn(entry))" />
              </span>

              <button class="btn btn-ghost btn-xs" :title="$t('vocab.copyLink') || 'Copy link to term'"
                @click="copyTermLink(rowId(entry))">
                <Icon name="tabler:link" />
              </button>
            </div>

            <div v-if="entry.description" class="text-xs text-neutral-600 dark:text-neutral-300 mt-1 lg:w-96"
              v-html="highlight(entry.description)" />
            <details v-if="entry.definition" class="mt-1 text-xs text-neutral-500">
              <summary class="cursor-pointer underline underline-offset-2">
                {{ $t('vocab.moreInfo') || 'learn more' }}
              </summary>
              <p class="mt-1 pl-2" v-html="highlight(entry.definition)" />
            </details>

            <div class="text-xs text-neutral-400 mt-2 flex items-center gap-2">
              <span>( {{ entry.enumSource }} )</span>
              <a v-if="docUrl(entry)" :href="docUrl(entry)" target="_blank" rel="noopener" class="link link-primary">
                {{ $t('vocab.viewDocs') || 'Documentation' }}
              </a>
            </div>
          </div>

          <!-- RIGHT: inline preview (only for this row) -->
          <transition name="slidein">
            <div v-if="isOpen(entry)" class="border-l border-base-200 bg-base-100 min-h-[16rem]">
              <!-- Header -->
              <div class="flex items-center gap-2 px-3 py-2 border-b border-base-200">
                <strong class="truncate">{{ $t('vocab.preview') || 'Preview' }}</strong>
                <span class="opacity-60 text-sm truncate">· {{ entry.term }}</span>
                <div class="ml-auto flex items-center gap-2">
                  <a v-if="previewUrl" :href="previewUrl" target="_blank" rel="noopener" class="btn btn-ghost btn-xs">
                    {{ $t('vocab.openInNewTab') || 'Open in new tab' }}
                  </a>
                  <button class="btn btn-ghost btn-xs" @click="closePreview">
                    <Icon name="tabler:x" />
                  </button>
                </div>
              </div>

              <!-- Body -->
              <div ref="previewScrollEl" class="lg:h-[60vh] overflow-auto">
                <iframe v-if="previewUrl && !forceInline" :key="previewUrl" :src="previewUrl"
                  class="w-full h-[60vh] border-0" @load="onIframeLoad" />
                <div v-else-if="inlineHtml" class="p-4 prose prose-sm max-w-none" v-html="inlineHtml" />
                <div v-else class="p-4 text-sm opacity-70">
                  {{ $t('vocab.loading') || 'Loading…' }}
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
import { ref, computed, watch, nextTick, onMounted } from 'vue';

/**
 * New structure:
 * - entry.labels?: { de?: string; en?: string }
 * - entry.label is still present for back-compat
 */
type VocabLabels = { de?: string | null; en?: string | null };
type VocabEntry = {
  term: string;
  label?: string;
  labels?: VocabLabels;
  description?: string;
  definition?: string;
  enumSource: string;
  category: string;
  isTranslated: boolean;
};

const DOCS_BASE = 'https://av-efi.github.io/av-efi-schema/';

/* ---------- state ---------- */
// Accept props for initial query and anchor
const props = defineProps({
    initQuery: { type: String, default: '' },
    initAnchor: { type: String, default: '' }
});
const emit = defineEmits(['update-query']);

const rawQuery = ref(props.initQuery);
const query = ref(props.initQuery);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let skipNextInitQuerySync = false;
let latestEmittedQuery: string | null = null;

const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const activeLetter = ref<string | null>(null);

function cleanLabel(v?: string | null): string {
    return typeof v === 'string' ? v.trim() : '';
}

/**
 * New canonical sources: entry.labels.de / entry.labels.en
 * Legacy fallback: entry.label (only if labels are missing)
 */
function labelDe(entry: VocabEntry): string {
    const de = cleanLabel(entry.labels?.de);
    if (de) return de;

    // legacy fallback (older vocab.json often had German here)
    const legacy = cleanLabel(entry.label);
    if (legacy) return legacy;

    return '—';
}

function labelEn(entry: VocabEntry): string {
    const en = cleanLabel(entry.labels?.en);
    if (en) return en;

    // do NOT pretend legacy label is English
    return '—';
}

function displayTerm(term: string): string {
    if (!term) return '';
    // number_17FULL_STOP5mmFilm -> 17.5mmFilm
    return term.replace(/^number_/, '').replace(/FULL_STOP/g, '.');
}
// Sync activeLetter with URL query
watch(activeLetter, (val) => {
  emit('update-query', rawQuery.value, val || undefined);
});

const { locale } = useI18n();

/**
 * Normalize locale to 'de' | 'en' for vocab labels.
 * Anything else falls back to 'en' behavior.
 */
const uiLang = computed<'de' | 'en'>(() => {
    const l = String(locale.value || '').toLowerCase();
    if (l.startsWith('de')) return 'de';
    return 'en';
});
const secondaryLang = computed<'de' | 'en'>(() => (uiLang.value === 'de' ? 'en' : 'de'));
const secondaryLangTag = computed(() => secondaryLang.value.toUpperCase());

const { data: entriesRaw, pending: loading } = await useFetch<VocabEntry[]>('/api/cms/vocab', {
    lazy: false,
    server: true,
});
const entries = computed(() => Array.isArray(entriesRaw.value) ? entriesRaw.value : []);

/* ---------- label resolution (new structure) ---------- */
function labelForLang(entry: VocabEntry, lang: 'de' | 'en'): string {
    const fromLabels = entry.labels?.[lang];
    if (typeof fromLabels === 'string' && fromLabels.trim()) return fromLabels.trim();

    // Back-compat: existing single label (often de in your current file)
    if (typeof entry.label === 'string' && entry.label.trim()) return entry.label.trim();

    return entry.term;
}


function secondaryLabel(entry: VocabEntry): string | null {
    const other = entry.labels?.[secondaryLang.value];
    const cur = entry.labels?.[uiLang.value];

    // Only show if it truly adds information (not identical to current)
    if (!other || !String(other).trim()) return null;
    if (cur && String(cur).trim() && String(cur).trim() === String(other).trim()) return null;

    return String(other).trim();
}

function secondaryLabelAria(entry: VocabEntry): string {
    const other = secondaryLabel(entry);
    if (!other) return '';
    return `${secondaryLangTag.value}: ${other}`;
}

/* ---------- search ---------- */
watch(rawQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    query.value = (val ?? '').trim().toLowerCase();
    latestEmittedQuery = query.value;
    skipNextInitQuerySync = true;
    emit('update-query', query.value, activeLetter.value || undefined);
    debounceTimer = null;
  }, 150);
});

// Watch for prop changes (route updates)
watch(
    () => props.initQuery,
    (val) => {
        const next = String(val ?? '');

        if (skipNextInitQuerySync && next === latestEmittedQuery) {
          skipNextInitQuerySync = false;
          return;
        }

        if (rawQuery.value === next) {
          query.value = next.trim().toLowerCase();
          return;
        }

        skipNextInitQuerySync = false;
        rawQuery.value = next;
        query.value = next.trim().toLowerCase();
    },
    { immediate: true }
);

// Scroll to anchor on mount or when anchor changes
function scrollToAnchor(anchor: string) {
    if (!process.client || !anchor) return;
    nextTick(() => {
        const el = document.getElementById(anchor);
        if (el) {
            const yOffset = -80; // Adjust for navbar height (e.g. 80px)
            const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    });
}
if (process.client) {
    onMounted(() => scrollToAnchor(props.initAnchor));
    watch(() => props.initAnchor, (val) => scrollToAnchor(val));
}

const filteredGroups = computed(() => {
    const q = query.value;

    const filtered = entries.value.filter((entry) => {
    // Search should consider:
    // - term
    // - display label (current locale)
    // - the other locale label (if present)
    // - legacy entry.label
    // - description/definition
        const hay = [
            entry.term,
            displayTerm(entry.term),
            labelDe(entry),
            labelEn(entry),
            entry.enumSource,
            entry.category,
            entry.description,
            entry.definition
        ].filter((s): s is string => typeof s === 'string' && !!s);

        const matchQuery = !q || hay.some((s) => s.toLowerCase().includes(q));
        const firstChar = (labelDe(entry) !== '—' ? labelDe(entry) : labelEn(entry))?.[0]?.toUpperCase();
        const matchLetter = !activeLetter.value || firstChar === activeLetter.value;
  
        return matchQuery && matchLetter;
    });

    return groupByCategory(filtered);
});

function groupByCategory(list: VocabEntry[]) {
    const grouped: Record<string, VocabEntry[]> = {};
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
function docUrl(entry: VocabEntry): string | '' {
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
const rowId = (e: VocabEntry) => `glrow-${e.term.replace(/[^a-z0-9_-]/gi,'_')}-${(e.enumSource||'').replace(/[^a-z0-9_-]/gi,'_')}`;
function setRowRef(e: VocabEntry, el: HTMLElement | null) {
    const k = rowId(e);
    if (el) rowMap.set(k, el); else rowMap.delete(k);
}
const isOpen = (e: VocabEntry) => openKey.value === rowId(e);

async function togglePreview(entry: VocabEntry) {
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
        });

        ;['header','footer','nav','.site-header','.site-footer'].forEach(sel=>{
            main.querySelectorAll(sel).forEach(n=>n.remove());
        });

        inlineHtml.value = main.innerHTML || '';
    } catch {
        inlineHtml.value = '';
    }
}

// Copy deep link
function copyTermLink(anchor: string) {
    if (!process.client) return;
    const url = `${window.location.origin}${window.location.pathname}?q=${rawQuery.value}${activeLetter.value ? `&letter=${activeLetter.value}` : ''}#${anchor}`;
    navigator.clipboard.writeText(url);
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
.prose :where(h1, h2, h3) {
  margin-top: .75rem;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
}

.prose th,
.prose td {
  border: 1px solid var(--fallback-bc, #e5e7eb);
  padding: .25rem .5rem;
}

/* Small helper for line clamp if needed */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
