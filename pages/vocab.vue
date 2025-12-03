<!-- pages/vocab.vue -->
<template>
  <div class="p-6 mx-auto max-w-6xl space-y-6">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">
        {{ $t('vocab.pageTitle') }}
      </h1>
      <p class="text-sm text-base-content/70">
        {{ $t('vocab.pageDescription') }}
      </p>
    </header>

    <!-- Controls -->
    <div class="flex flex-wrap items-end gap-4">
      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text text-sm font-medium">{{ $t('vocab.field') }}</span>
        </label>
        <div class="relative">
          <select
            v-model="selectedField"
            class="select select-bordered select-sm w-full"
            :disabled="pending"
            @change="reload"
          >
            <option
              v-for="opt in fieldOptions"
              :key="opt.key"
              :value="opt.key"
            >
              {{ opt.label }}
            </option>
          </select>
          <span
            v-if="pending"
            class="loading loading-spinner loading-xs absolute right-10 top-1/2 -translate-y-1/2"
          ></span>
        </div>
      </div>

      <div class="form-control w-full max-w-xs">
        <label class="label">
          <span class="label-text text-sm font-medium">{{ $t('vocab.filter') }}</span>
        </label>
        <div class="relative">
          <input
            v-model="filter"
            type="text"
            class="input input-bordered input-sm w-full"
            :class="{ 'pr-8': pending }"
            :placeholder="$t('vocab.filterPlaceholder')"
          >
          <span
            v-if="pending"
            class="loading loading-spinner loading-xs absolute right-3 top-1/2 -translate-y-1/2"
          ></span>
        </div>
      </div>

      <div class="form-control">
        <label class="label cursor-pointer gap-2">
          <input
            v-model="showOnlyWithNormdata"
            type="checkbox"
            class="checkbox checkbox-sm"
            :disabled="pending"
          >
          <span class="label-text text-sm">{{ $t('vocab.onlyWithNormdata') }}</span>
        </label>
      </div>

      <div class="form-control w-32">
        <label class="label">
          <span class="label-text text-sm font-medium">{{ $t('vocab.perPage') }}</span>
        </label>
        <select
          v-model="pageSize"
          class="select select-bordered select-sm"
        >
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>

      <div class="relative inline-block ml-auto">
        <button
          class="btn btn-sm btn-primary"
          :alt="'Export Data'"
          :title="'Export Data'"
          aria-haspopup="true"
          :aria-expanded="String(menuOpen)"
          aria-controls="export-menu"
          :disabled="!sortedRows.length"
          @click="toggleMenu"
          @keydown.enter.prevent="toggleMenu"
          @keydown.space.prevent="toggleMenu"
        >
          <Icon name="tabler:download" class="w-4 h-4" />
          <span class="ml-1">{{ $t('vocab.export') }}</span>
        </button>
        <div
          v-if="menuOpen"
          id="export-menu"
          role="menu"
          class="absolute z-30 mt-2 bg-base-100 border border-base-300 rounded shadow-lg w-56"
          style="top: calc(100% + 5px); right: 0;"
        >
          <ul class="menu menu-compact">
            <li role="none">
              <button
                role="menuitem"
                tabindex="0"
                class="w-full text-left"
                @click="exportData('current', 'csv')"
                @keydown.enter.prevent="exportData('current', 'csv')"
                @keydown.space.prevent="exportData('current', 'csv')"
              >
                <Icon name="tabler:table" class="w-4 h-4" />
                {{ $t('vocab.currentPageCSV') }}
              </button>
            </li>
            <li role="none">
              <button
                role="menuitem"
                tabindex="0"
                class="w-full text-left"
                @click="exportData('current', 'json')"
                @keydown.enter.prevent="exportData('current', 'json')"
                @keydown.space.prevent="exportData('current', 'json')"
              >
                <Icon name="tabler:braces" class="w-4 h-4" />
                {{ $t('vocab.currentPageJSON') }}
              </button>
            </li>
            <li role="none">
              <button
                role="menuitem"
                tabindex="0"
                class="w-full text-left"
                @click="exportData('current', 'xml')"
                @keydown.enter.prevent="exportData('current', 'xml')"
                @keydown.space.prevent="exportData('current', 'xml')"
              >
                <Icon name="tabler:code" class="w-4 h-4" />
                {{ $t('vocab.currentPageXML') }}
              </button>
            </li>
            <li class="menu-title">
              <span>{{ $t('vocab.fullExportTitle') }}</span>
            </li>
            <li role="none">
              <button
                role="menuitem"
                tabindex="0"
                class="w-full text-left"
                :disabled="exportingAll"
                @click="exportAllResults(false)"
                @keydown.enter.prevent="exportAllResults(false)"
                @keydown.space.prevent="exportAllResults(false)"
              >
                <Icon v-if="exportingAll" name="tabler:loader" class="w-4 h-4 animate-spin" />
                <Icon v-else name="tabler:database-export" class="w-4 h-4" />
                {{ $t('vocab.allFilteredResults') }}
              </button>
            </li>
            <li role="none">
              <button
                role="menuitem"
                tabindex="0"
                class="w-full text-left"
                :disabled="exportingAllUnfiltered"
                @click="exportAllResults(true)"
                @keydown.enter.prevent="exportAllResults(true)"
                @keydown.space.prevent="exportAllResults(true)"
              >
                <Icon v-if="exportingAllUnfiltered" name="tabler:loader" class="w-4 h-4 animate-spin" />
                <Icon v-else name="tabler:database" class="w-4 h-4" />
                {{ $t('vocab.completeDataset') }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Info about limited results -->
    <div v-if="totalResults && totalResults > 100" class="alert alert-info">
      <Icon name="tabler:info-circle" class="w-5 h-5" />
      <span>
        {{ $t('vocab.limitedResultsInfo', { total: totalResults }) }}
      </span>
    </div>

    <!-- Alphabetic Filter -->
    <div class="border border-base-300 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-sm font-medium">{{ $t('vocab.filterByLetter') }}</span>
        <button
          class="btn btn-xs"
          :class="{ 'btn-active': !activeLetter }"
          :disabled="pending"
          @click="activeLetter = null"
        >
          {{ $t('vocab.all') }}
        </button>
        <span
          v-if="pending"
          class="loading loading-spinner loading-xs ml-2"
        ></span>
      </div>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="char in alphabet"
          :key="char"
          class="btn btn-xs"
          :class="{ 'btn-outline': activeLetter !== char, 'btn-active': activeLetter === char }"
          :disabled="pending"
          @click="activeLetter = activeLetter === char ? null : char"
        >
          {{ char }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border border-base-300 rounded-lg relative">
      <!-- Loading overlay -->
      <div
        v-if="pending"
        class="absolute inset-0 bg-base-100/90 backdrop-blur-sm z-20 flex items-center justify-center"
      >
        <div class="flex flex-col items-center gap-2">
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <span class="text-sm text-base-content/70">{{ $t('vocab.loading') }}</span>
        </div>
      </div>
      
      <table class="table table-zebra table-sm w-full">
        <thead>
          <tr>
            <th class="w-12 text-right">#</th>
            <th class="w-80">
              <button
                class="flex items-center gap-1 hover:text-primary"
                :disabled="pending"
                @click="toggleSort('value')"
              >
                {{ $t('vocab.value') }}
                <Icon
                  v-if="sortBy === 'value'"
                  :name="sortOrder === 'asc' ? 'tabler:arrow-up' : 'tabler:arrow-down'"
                  class="w-3 h-3"
                />
              </button>
            </th>
            <th>{{ $t('vocab.normdata') }}</th>
            <th class="w-80">
              <button
                class="flex items-center gap-1 hover:text-primary"
                :disabled="pending"
                @click="toggleSort('provider')"
              >
                {{ $t('vocab.provider') }}
                <Icon
                  v-if="sortBy === 'provider'"
                  :name="sortOrder === 'asc' ? 'tabler:arrow-up' : 'tabler:arrow-down'"
                  class="w-3 h-3"
                />
              </button>
            </th>
            <th class="w-20">
              <button
                class="flex items-center gap-1 hover:text-primary"
                :disabled="pending"
                @click="toggleSort('docCount')"
              >
                <span class="text-right block w-full">{{ $t('vocab.docs') }}</span>
                <Icon
                  v-if="sortBy === 'docCount'"
                  :name="sortOrder === 'asc' ? 'tabler:arrow-up' : 'tabler:arrow-down'"
                  class="w-3 h-3"
                />
              </button>
            </th>
            <th class="w-16"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="pending">
            <td colspan="6" class="text-center py-8 text-base-content/70">
              {{ $t('vocab.loading') }}
            </td>
          </tr>
          <tr
            v-else-if="!sortedRows.length"
          >
            <td colspan="6" class="text-center py-8 text-base-content/70">
              {{ $t('vocab.noEntries') }}
            </td>
          </tr>
          <tr
            v-for="(row, idx) in paginatedRows"
            :key="row.value + '|' + idx"
          >
            <td class="text-right text-xs">
              {{ (currentPage - 1) * pageSize + idx + 1 }}
            </td>
            <td class="text-xs break-words">
              <span v-html="highlightText(row.value)"></span>
            </td>
            <td class="max-w-md">
              <div v-if="row.normdataRefs.length" class="space-y-1">
                <div
                  v-for="(ref, refIdx) in row.normdataRefs"
                  :key="refIdx"
                  class="flex items-start gap-2 flex-wrap"
                >
                  <a
                    :href="getExternalUrl(ref)"
                    class="link link-primary text-xs break-all"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span v-html="highlightText(ref.id)"></span>
                  </a>
                  <span
                    v-if="ref.category"
                    class="badge badge-sm badge-outline whitespace-nowrap"
                  >
                    <span v-html="highlightText(ref.category)"></span>
                  </span>
                </div>
              </div>
              <span v-else class="text-xs text-base-content/60">—</span>
            </td>
            <td class="text-xs break-words">
              <span v-html="highlightText(row.provider || '—')"></span>
            </td>
            <td class="text-right text-xs whitespace-nowrap">
              {{ row.docCount }}
            </td>
            <td class="text-center">
              <div class="dropdown dropdown-end relative">
                <button
                  tabindex="0"
                  class="btn btn-ghost btn-xs"
                  :aria-label="'Actions for ' + row.value"
                >
                  <Icon name="tabler:dots-vertical" class="w-4 h-4" />
                </button>
                <ul
                  tabindex="0"
                  class="dropdown-content menu menu-compact p-2 shadow bg-base-100 border border-base-300 rounded-box w-52 absolute right-0 top-full mt-1 z-[100]"
                >
                  <li>
                    <a @click.prevent="exportSingleRow(row)">
                      <Icon name="tabler:download" class="w-4 h-4" />
                      {{ $t('vocab.exportRow') }}
                    </a>
                  </li>
                  <li>
                    <a :href="getFacetSearchUrl(row.value)" target="_blank" rel="noopener">
                      <Icon name="tabler:search" class="w-4 h-4" />
                      {{ $t('vocab.showInSearch') }}
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-4">
      <button
        class="btn btn-sm"
        :disabled="currentPage === 1"
        @click="currentPage = 1"
      >
        <Icon name="tabler:chevrons-left" class="w-4 h-4" />
      </button>
      <button
        class="btn btn-sm"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <Icon name="tabler:chevron-left" class="w-4 h-4" />
      </button>
      
      <div class="flex items-center gap-1">
        <template v-for="page in visiblePages" :key="page">
          <button
            v-if="typeof page === 'number'"
            class="btn btn-sm"
            :class="{ 'btn-active': currentPage === page }"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <span v-else class="px-2">...</span>
        </template>
      </div>

      <button
        class="btn btn-sm"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <Icon name="tabler:chevron-right" class="w-4 h-4" />
      </button>
      <button
        class="btn btn-sm"
        :disabled="currentPage === totalPages"
        @click="currentPage = totalPages"
      >
        <Icon name="tabler:chevrons-right" class="w-4 h-4" />
      </button>

      <span class="text-sm ml-4">
        {{ $t('vocab.page') }} {{ currentPage }} {{ $t('vocab.of') }} {{ totalPages }} ({{ sortedRows.length }} {{ $t('vocab.entries') }})
      </span>
    </div>

    <p class="text-xs text-base-content/60 mt-4">
      {{ $t('vocab.disclaimer') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useSeoMeta, useSchemaOrg, defineWebPage } from '#imports';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const runtimeConfig = useRuntimeConfig();

// SEO & Schema.org setup
const seoField = route.query.field as string | undefined;
const seoFilter = route.query.filter as string | undefined;
const seoNormdata = route.query.normdata === 'true';

// Field labels mapping (can be extended)
const fieldLabels: Record<string, { de: string; en: string }> = {
    has_genre: { de: 'Genre', en: 'Genre' },
    has_subject: { de: 'Schlagwörter', en: 'Keywords' },
    has_colour_type: { de: 'Farbtyp', en: 'Colour Type' },
    has_sound_type: { de: 'Ton', en: 'Sound' },
};

const currentLocale = useI18n().locale.value;
const fieldLabel = seoField ? (fieldLabels[seoField]?.[currentLocale as 'de' | 'en'] || seoField) : undefined;

// Dynamic title
const pageTitle = computed(() => {
    if (fieldLabel && seoFilter) {
        return t('seo.vocab.titleWithFieldAndFilter', { field: fieldLabel, filter: seoFilter });
    }
    if (fieldLabel) {
        return t('seo.vocab.titleWithField', { field: fieldLabel });
    }
    return t('seo.vocab.title');
});

// Dynamic description
const pageDescription = computed(() => {
    if (fieldLabel && seoFilter) {
        return t('seo.vocab.descriptionWithFieldAndFilter', { field: fieldLabel, filter: seoFilter });
    }
    if (fieldLabel) {
        return t('seo.vocab.descriptionWithField', { field: fieldLabel });
    }
    return t('seo.vocab.description');
});

const canonical = (runtimeConfig.public.siteUrl || 'https://www.av-efi.net') + '/vocab';

// Meta tags
useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogImage: runtimeConfig.public.siteOgImage || ((runtimeConfig.public.siteUrl || 'https://www.av-efi.net') + '/img/avefi-og-image.png'),
    ogType: 'website',
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
});

// Schema.org
useSchemaOrg([
    defineWebPage({
        '@id': canonical,
        name: pageTitle.value.replace(' | AVefi', '').replace(' – AVefi', ''),
        description: pageDescription.value,
        url: canonical,
    }),
]);

type FieldKey = 'has_subject' | 'has_genre'

interface NormdataRef {
  id: string
  category: string
}

interface Row {
  value: string
  normdataRefs: NormdataRef[]
  provider: string | null
  docCount: number
}

const fieldOptions = computed(() => [
    { key: 'has_subject' as FieldKey, label: t('vocab.fields.hasSubject') },
    { key: 'has_genre' as FieldKey, label: t('vocab.fields.hasGenre') },
]);

const selectedField = ref<FieldKey>((route.query.field as FieldKey) || 'has_subject');
const filter = ref((route.query.filter as string) || '');
const showOnlyWithNormdata = ref(route.query.normdata === 'true');
const activeLetter = ref<string | null>((route.query.letter as string) || null);
const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'];

// Pagination
const currentPage = ref(parseInt((route.query.page as string) || '1', 10));
const pageSize = ref(parseInt((route.query.size as string) || '50', 10));

// Sorting
type SortKey = 'value' | 'provider' | 'docCount'
const sortBy = ref<SortKey>((route.query.sortBy as SortKey) || 'docCount');
const sortOrder = ref<'asc' | 'desc'>((route.query.sortOrder as 'asc' | 'desc') || 'desc');

// Update URL when state changes
watch([selectedField, filter, showOnlyWithNormdata, activeLetter, currentPage, pageSize, sortBy, sortOrder], () => {
    const query: Record<string, string> = {};
  
    if (selectedField.value !== 'has_subject') {
        query.field = selectedField.value;
    }
    if (filter.value) {
        query.filter = filter.value;
    }
    if (showOnlyWithNormdata.value) {
        query.normdata = 'true';
    }
    if (activeLetter.value) {
        query.letter = activeLetter.value;
    }
    if (currentPage.value > 1) {
        query.page = String(currentPage.value);
    }
    if (pageSize.value !== 50) {
        query.size = String(pageSize.value);
    }
    if (sortBy.value !== 'docCount') {
        query.sortBy = sortBy.value;
    }
    if (sortOrder.value !== 'desc') {
        query.sortOrder = sortOrder.value;
    }
  
    // Update URL without navigation
    router.replace({ query });
}, { deep: true });

const { data, pending, refresh } = useFetch(() => {
    const url = `/api/elastic/vocab/${selectedField.value}`;
    const params = new URLSearchParams();
    if (activeLetter.value) {
        params.append('letter', activeLetter.value);
    }
    return params.toString() ? `${url}?${params.toString()}` : url;
}, {
    immediate: true,
    watch: [activeLetter, selectedField],
});

const rows = computed<Row[]>(() => (data.value?.rows as Row[]) || []);
const totalResults = computed(() => data.value?.total || 0);

const filteredRows = computed(() => {
    let filtered = rows.value;
  
    // Filter by normdata presence
    if (showOnlyWithNormdata.value) {
        filtered = filtered.filter(r => r.normdataRefs.length > 0);
    }
  
    // Letter filtering is now done server-side, no need to filter here
  
    // Filter by search query
    const q = filter?.value?.trim().toLowerCase();
    if (q) {
        filtered = filtered.filter((r) => {
            const matchesValue = r.value.toLowerCase().includes(q);
            const matchesNormdata = r.normdataRefs.some(ref => 
                ref.id.toLowerCase().includes(q) || ref.category.toLowerCase().includes(q)
            );
            const matchesProvider = r.provider && r.provider.toLowerCase().includes(q);
            return matchesValue || matchesNormdata || matchesProvider;
        });
    }
  
    return filtered;
});

const sortedRows = computed(() => {
    const sorted = [...filteredRows.value];
  
    sorted.sort((a, b) => {
        let compareResult = 0;
    
        if (sortBy.value === 'value') {
            compareResult = a.value.localeCompare(b.value);
        } else if (sortBy.value === 'provider') {
            const providerA = a.provider || '';
            const providerB = b.provider || '';
            compareResult = providerA.localeCompare(providerB);
        } else if (sortBy.value === 'docCount') {
            compareResult = a.docCount - b.docCount;
        }
    
        return sortOrder.value === 'asc' ? compareResult : -compareResult;
    });
  
    return sorted;
});

function toggleSort(key: SortKey) {
    if (sortBy.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortBy.value = key;
        sortOrder.value = key === 'docCount' ? 'desc' : 'asc';
    }
    currentPage.value = 1; // Reset to first page when sorting changes
}

// Pagination computed properties
const totalPages = computed(() => {
    if (pageSize.value === Infinity) return 1;
    return Math.ceil(sortedRows.value.length / pageSize.value);
});

const paginatedRows = computed(() => {
    if (pageSize.value === Infinity) return sortedRows.value;
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return sortedRows.value.slice(start, end);
});

const visiblePages = computed(() => {
    const pages: (number | string)[] = [];
    const total = totalPages.value;
    const current = currentPage.value;
  
    if (total <= 7) {
    // Show all pages if 7 or fewer
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
    // Always show first page
        pages.push(1);
    
        if (current > 3) {
            pages.push('...');
        }
    
        // Show pages around current
        const start = Math.max(2, current - 1);
        const end = Math.min(total - 1, current + 1);
    
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
    
        if (current < total - 2) {
            pages.push('...');
        }
    
        // Always show last page
        pages.push(total);
    }
  
    return pages;
});

// Reset page when filters change
watch([filter, showOnlyWithNormdata], () => {
    currentPage.value = 1;
});

// Reset page when letter changes (data will refetch automatically)
watch(activeLetter, () => {
    currentPage.value = 1;
});

const { getNormdataUrl } = useNormdataUrl();

function getExternalUrl(ref: NormdataRef): string {
    return getNormdataUrl(ref.category, ref.id);
}

function reload() {
    refresh();
}

// Export menu
const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const exportingAll = ref(false);
const exportingAllUnfiltered = ref(false);

async function exportData(scope: 'current', format: 'csv' | 'json' | 'xml') {
    menuOpen.value = false;
  
    if (!sortedRows.value.length) {
        return;
    }

    const filename = `avefi_vocab_${selectedField.value}_page${currentPage.value}_${new Date().toISOString().slice(0, 10)}`;

    try {
        if (format === 'csv') {
            exportCsv(filename);
        } else if (format === 'json') {
            exportJson(filename);
        } else if (format === 'xml') {
            exportXml(filename);
        }
    } catch (err) {
        console.error('Export failed:', err);
    }
}

async function exportAllResults(ignoreFilters: boolean = false) {
    const stateRef = ignoreFilters ? exportingAllUnfiltered : exportingAll;
  
    if (stateRef.value) return;
  
    stateRef.value = true;
  
    try {
    // Call backend to export all results for this field
        const params = new URLSearchParams();
        params.append('export', 'true');
    
        // Only apply letter filter if not ignoring filters
        if (!ignoreFilters && activeLetter.value) {
            params.append('letter', activeLetter.value);
        }
    
        const response = await fetch(`/api/elastic/vocab/${selectedField.value}?${params.toString()}`);
    
        if (!response.ok) {
            throw new Error('Export failed');
        }
    
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
    
        const filterSuffix = ignoreFilters ? 'complete' : (activeLetter.value || 'filtered');
        a.download = `avefi_vocab_${selectedField.value}_all_${filterSuffix}_${new Date().toISOString().slice(0, 10)}.csv`;
    
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Export all failed:', err);
        alert('Export fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
        stateRef.value = false;
    }
}

function exportSingleRow(row: Row) {
    const filename = `avefi_vocab_${selectedField.value}_${row.value.substring(0, 30)}_${new Date().toISOString().slice(0, 10)}`;
    const header = ['value', 'normdata_id', 'normdata_category', 'provider', 'docCount'];
    const lines = [header.join(';')];
  
    if (row.normdataRefs.length > 0) {
        for (const ref of row.normdataRefs) {
            lines.push(
                [
                    row.value,
                    ref.id,
                    ref.category,
                    row.provider || '',
                    String(row.docCount),
                ]
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(';')
            );
        }
    } else {
        lines.push(
            [
                row.value,
                '',
                '',
                row.provider || '',
                String(row.docCount),
            ]
                .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                .join(';')
        );
    }

    downloadBlob(lines.join('\r\n'), `${filename}.csv`, 'text/csv;charset=utf-8;');
}

function getFacetSearchUrl(value: string): string {
    const baseUrl = '/search/index';
    const indexName = '21.11155-denormalised-work';
  
    // Map field keys to facet parameter names
    const facetMap: Record<FieldKey, string> = {
        'has_subject': 'subjects',
        'has_genre': 'has_genre_has_name',
    };
  
    const facetName = facetMap[selectedField.value];
    const encodedValue = encodeURIComponent(value);
  
    // Build URL with facet parameter
    const url = `${baseUrl}?${indexName}%5BrefinementList%5D%5B${facetName}%5D%5B0%5D=${encodedValue}`;
  
    return url;
}

function exportCsv(filename: string) {
    const header = ['value', 'normdata_id', 'normdata_category', 'provider', 'docCount'];
    const lines = [header.join(';')];
  
    for (const r of sortedRows.value) {
        if (r.normdataRefs.length > 0) {
            // One row per normdata reference
            for (const ref of r.normdataRefs) {
                lines.push(
                    [
                        r.value,
                        ref.id,
                        ref.category,
                        r.provider || '',
                        String(r.docCount),
                    ]
                        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                        .join(';')
                );
            }
        } else {
            // No normdata, single row
            lines.push(
                [
                    r.value,
                    '',
                    '',
                    r.provider || '',
                    String(r.docCount),
                ]
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(';')
            );
        }
    }

    downloadBlob(lines.join('\r\n'), `${filename}.csv`, 'text/csv;charset=utf-8;');
}

function exportJson(filename: string) {
    const jsonData = sortedRows.value.map(r => ({
        value: r.value,
        normdataRefs: r.normdataRefs,
        provider: r.provider,
        docCount: r.docCount
    }));
  
    downloadBlob(JSON.stringify(jsonData, null, 2), `${filename}.json`, 'application/json');
}

function exportXml(filename: string) {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<vocabulary field="${selectedField.value}">\n`;
  
    for (const r of sortedRows.value) {
        xml += `  <entry>\n`;
        xml += `    <value>${escapeXml(r.value)}</value>\n`;
        xml += `    <docCount>${r.docCount}</docCount>\n`;
    
        if (r.provider) {
            xml += `    <provider>${escapeXml(r.provider)}</provider>\n`;
        }
    
        if (r.normdataRefs.length > 0) {
            xml += `    <normdataRefs>\n`;
            for (const ref of r.normdataRefs) {
                xml += `      <normdata>\n`;
                xml += `        <id>${escapeXml(ref.id)}</id>\n`;
                xml += `        <category>${escapeXml(ref.category)}</category>\n`;
                xml += `      </normdata>\n`;
            }
            xml += `    </normdataRefs>\n`;
        }
    
        xml += `  </entry>\n`;
    }
  
    xml += `</vocabulary>`;
  
    downloadBlob(xml, `${filename}.xml`, 'application/xml');
}

function escapeXml(text: string): string {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function downloadBlob(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function highlightText(text: string): string {
    const q = filter.value.trim();
    if (!q || !text) return text;
  
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="bg-highlight">$1</span>');
}
</script>
