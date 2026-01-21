<template>
  <section
    v-if="Array.isArray(parts) && parts.length"
    class="w-full"
    role="region"
    :aria-label="$t('parts') || 'Parts'"
  >
    <div class="my-2">
      <h2 class="font-bold text-xl">
        {{ type == 'parts' ? $t('parts') : $t('workVariants') }}
      </h2>
    </div>
    <div
      v-for="part in parts"
      :key="part?.handle || part?.url || Math.random()"
      class="card bg-white border-base-200 border-2 shadow-md rounded-xl dark:bg-gray-800 w-full hover:shadow-xl mb-4 text-neutral-900 dark:text-white"
      role="region"
      :aria-label="`${$t('title')}: ${get(part,'has_record.has_primary_title.has_name') || part?.handle || '(Untitled Part)'}`"
    >
      <!-- Header -->
      <header class="card-body p-4 pb-2">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="w-4/5 md:w-4/5">
            <!-- PID / handle copy -->
            <GlobalClipboardComp
              v-if="part?.handle"
              class="text-regular flex flex-row items-center whitespace-break-spaces text-xs dark:text-gray-300"
              :display-text="`${part.handle}`"
              :copy-text="`${runtime.public.AVEFI_COPY_PID_URL}${part.handle}`"
            />

            <!-- Title + category -->
            <h2
              :id="`part-title-${part?.handle ?? idxFallback()}`"
              class="card-title text-lg font-semibold"
            >
            <NuxtLink
                v-if="part?.handle"
                :to="`/res/${part.handle}`"
                class="link dark:link-white no-underline hover:underline"
                :alt="$t('detailviewlink')"
                :title="$t('detailviewlink')"
                target="_blank"
              >
                {{ get(part,'has_record.has_primary_title.has_name') || part?.handle || $t('title') }}
              </NuxtLink>
              <MicroBadgeCategoryComp
                :category="part?.has_record?.category || 'avefi:WorkVariantPart'"
                :dense="false"
                class="ml-2"
              />
            </h2>

            <!-- Alternative titles (if any) -->
            <h3 v-if="Array.isArray(get(part,'has_record.has_alternative_title'))">
              <ul>
                <li
                  v-for="alt in (get(part,'has_record.has_alternative_title') || [])"
                  :key="alt?.id || alt?.has_name"
                >
                  {{ alt?.has_name }} <span v-if="alt?.type">({{ $t(alt.type) }})</span>
                </li>
              </ul>
            </h3>
          </div>

          <!-- Right actions -->
          <div class="w-full md:w-1/5 flex flex-row flex-wrap justify-end items-end mr-0 mt-2 md:my-auto">
            <NuxtLink
              v-if="part?.handle"
              :to="`/res/${part.handle}`"
              class="btn btn-circle btn-outline btn-md mr-2"
              :aria-label="$t('detailviewlink')"
              :title="$t('detailviewlink')"
              target="_blank"
            >
               <Icon name="tabler:eye" class="text-2xl" :alt="$t('detailviewlink')" />
            </NuxtLink>

            <a
              v-else-if="part?.url"
              :href="part.url"
              class="btn btn-circle btn-outline btn-md mr-2"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="$t('open')"
              :title="$t('open')"
            >
               <Icon name="tabler:external-link" class="text-2xl" :alt="$t('open')" />
            </a>

            <GlobalActionContextComp v-if="part" :item="part" />
          </div>
        </div>
        <SearchGenericIconList
          :data="part"
          level="work"
          class="mt-2"
        />
      </header>

      <!-- Optional highlight snippets (if your parts carry _highlightResult too) -->
      <Transition name="fade" mode="out-in">
        <div
          v-if="showHighlight && getHighlightSnippets(part).length > 0"
          class="my-2 ml-3 text-sm highlight-snippets"
        >
          <span>✨ <strong>{{ $t('lookWhatWeFound') }}</strong></span>
          <ul>
            <SearchHighlightMatchComp
              v-for="(entry, i) in getHighlightSnippets(part)"
              :key="i + entry.value"
              :value="entry.value"
              :field="entry.key"
            />
          </ul>
        </div>
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import GenericIconList from '../search/GenericIconList.vue';

const { t: $t } = useI18n();
const runtime = useRuntimeConfig();

type NameObj = { has_name?: string };
type AltTitle = NameObj & { id?: string | number; type?: string };
type LocatedIn = { has_name?: string };
type Event = { located_in?: LocatedIn[] };
type DescribedBy = { has_issuer_name?: string };

type Part = {
  handle?: string;
  url?: string;
  '@timestamp'?: string;
  category?: string;
  years?: string[]; // label(s) like "1958–1961"
  directors_or_editors?: string[];
  has_record?: {
    has_primary_title?: NameObj;
    has_alternative_title?: AltTitle[];
    has_event?: Event[];
    has_form?: string[];
    described_by?: DescribedBy[];
  };
  _highlightResult?: any;
  [k: string]: any;
};

const props = defineProps<{
  parts: Part[];
  showAdminStats?: boolean;
  type: {
    type: string;
    default: 'parts';
  }
}>();

const isExpandedLocal = ref(false);
const showHighlight = ref(true);

// ---- helpers mirroring your WorkViewComp patterns ----
function get(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((o, p) => (o && o[p] != null ? o[p] : undefined), obj);
}

function formatDate(v?: string) {
    if (!v) return '';
    try { return new Date(v).toLocaleString('de-DE'); } catch { return ''; }
}

function yearsDisplay(p: Part): string {
    const years = p?.years;
    if (Array.isArray(years) && years.length) return years.join(', ');
    const range = get(p, 'production_in_year');
    if (range && typeof range === 'object') {
        const from = (range.gte ?? range.gt ?? '');
        const to = (range.lte ?? range.lt ?? '');
        return [from, to].filter(Boolean).join('–');
    }
    return '';
}

function getForms(p: Part): string[] {
    const arr = get(p, 'has_record.has_form');
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
}

function getDirectors(p: Part): string[] {
    return Array.isArray(p?.directors_or_editors) ? p!.directors_or_editors!.filter(Boolean) : [];
}

function getLocations(p: Part): string[] {
    const events = get(p, 'has_record.has_event') || [];
    const set = new Set<string>();
    (events as Event[]).forEach(ev => (ev?.located_in || []).forEach(l => l?.has_name && set.add(l.has_name)));
    return Array.from(set);
}

// optional highlights (same logic style you use)
function getValueByPath(obj: any, path: string) {
    return path.split('.').reduce((o, p) => (o && o[p] ? o[p] : null), obj);
}
function getHighlightSnippets(item: Part) {
    const result: Array<{key: string; value: string}> = [];
    const highlights = item?._highlightResult || {};
    const fieldsToInclude: Record<string,string> = {
        title: 'has_record.has_primary_title.has_name',
        AlternativeTitle: 'has_record.has_alternative_title.has_name',
        production: 'production',
        directors_or_editors: 'directors_or_editors',
        has_form: 'has_record.has_form',
        genre: 'has_record.has_genre.has_name',
        subject: 'subjects',
    };
    for (const [labelKey, path] of Object.entries(fieldsToInclude)) {
        const entry = getValueByPath(highlights, path);
        const entries = Array.isArray(entry) ? entry : [entry];
        for (const e of entries) {
            if (e?.matchLevel !== 'none' && Array.isArray(e?.matchedWords) && e.matchedWords.length > 0 && typeof e.value === 'string') {
                result.push({ key: labelKey, value: e.value });
            }
        }
    }
    return result;
}

// simple unique fallback for missing handle
function idxFallback() {
    return Math.random().toString(36).slice(2);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
