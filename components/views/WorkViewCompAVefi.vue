<template>
  <div>
    <div v-if="mir" class="border-l-2 border-work px-2" role="region" :aria-label="`${$t('detailsFor')} ${
        mir?.has_primary_title?.has_name ?? ''
      }`">
      <NuxtLayout name="partial-grid-2-1-no-heading">
        <template #left>
          <!-- 01–04 + 06–09: handled inside TopLevelComp
               New: enforce 08.06.25 order, hide duplicate handle, swap years/places -->
          <DetailWorkVariantTopLevelComp 
            v-model="mir" 
            :handle="dataObject?.compound_record?._source?.handle"
            :es-timestamp="dataObject?.compound_record?._source?.['@timestamp']" :order-key="'08-06-2025'"
            :hide-second-handle="true" :swap-years-and-places="true" />

          <!-- 05 Produktions-Events -->
          <DetailHasEventComp v-if="Array.isArray(mir?.has_event) && mir.has_event.length > 0"
            v-model="mir.has_event" />
        </template>

        <template #right>
          <!-- 10 Genre -->
          <DetailKeyValueListComp v-if="Array.isArray(mir?.has_genre) && mir.has_genre.length > 0" keytxt="avefi:Genre"
            class="col-span-full mb-2" :ul="true" :same-as="true" :valtxt="mir.has_genre" />

          <!-- 11 Schlagwort -->
          <DetailKeyValueListComp v-if="Array.isArray(mir?.has_subject) && mir.has_subject.length > 0"
            class="col-span-full mt-1" keytxt="avefi:Subject" :bg-color="true" :valtxt="mir.has_subject" :same-as="true"
            :ul="true" />
        </template>
      </NuxtLayout>
    </div>
    <div v-else>
      <pre>{{ mir }}</pre>
    </div>

    <!-- Manifestations block (unchanged; fully guarded) -->
    <div v-if="manifestations?.length > 0" :class="[
        Array.isArray(manifestations) && manifestations.length < 1
          ? 'flex place-content-center'
          : '',
      ]" role="region" aria-label="Manifestations">
      <div class="mt-4 ml-2">
        <hr class="my-2 col-span-full" />
        <h3 class="relative font-bold text-sm col-span-full text-primary-800 dark:text-primary-100 mb-1"
          :alt="$t('manifestations')">
          {{ $t("manifestations") }}
          <GlobalTooltipInfo :text="$t('tooltip.manifestation')" />
        </h3>
        <FormKit type="dropdown" name="manifestation-item-search" :label="$t('filterItemsAndManifestations')"
          :placeholder="$t('filterItemsAndManifestations')" :options="
            suggestionsForManifestations.map((s) => ({
              label: $t(s) !== s ? $t(s) : s,
              value: s,
            }))
          " :value="searchQuery" multiple popover class="w-72" @input="onSearchInput" />
      </div>

      <ClientOnly>
        <div v-if="loading" class="flex justify-center items-center min-h-[120px]">
          <span class="loading loading-spinner loading-lg text-primary" />
        </div>
        <template v-if="
            Array.isArray(filteredManifestations) &&
            filteredManifestations.length > 0
          ">
          <DetailManifestationListComp v-model="filteredManifestations" />
        </template>
      </ClientOnly>
    </div>
    <div v-else-if="parts">      
      <ViewsWorkViewCompParts
        class="mt-4"
        :parts="parts" 
        :handle="dataObject?.compound_record?._source?.handle" 
      />
    </div>
    <div v-else class="ml-2 alert alert-warning alert-outline text-white max-w-96 mt-4" role="alert"
      aria-label="No manifestations available">
      <MicroIconTextComp icon-name="tabler:mood-empty" text="noManifestations" />
    </div>

    <!-- 12 Letzte Bearbeitung -->
    <div v-if="dataObject?._source?.['@timestamp']" class="w-full mt-4 justify-center items-center">
      <DetailKeyValueComp class="col-span-full mx-auto" keytxt="lastedit" :clip="false"
        :valtxt="formatTimestamp(dataObject._source['@timestamp'])" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { FormKit } from "@formkit/vue";
import type { IAVefiWorkVariant as WorkVariant } from "~/models/interfaces/generated/IAVefiWorkVariant";

// Enable hash navigation for manifestations and items
useHash();

const dataJson = defineModel({ type: Object, required: true });
// Defensive parse
let dataObject: any = {};
try {
    dataObject = dataJson.value ?? {};
} catch {
    dataObject = {};
}

// WorkVariant (optional)
const mir = (dataObject?.compound_record?._source?.has_record ??
  null) as WorkVariant | null;
const parts = (dataObject?.compound_record?._source?.parts ??
  null) as WorkVariant | null;

// Manifestations (optional)
const manifestations = ref<Manifestation[]>(
    Array.isArray(dataObject?.compound_record?._source?.manifestations)
        ? dataObject.compound_record._source.manifestations
        : []
);

// --- Derived lists for 08–10 (all safely guarded) ---
const creditAgents = computed<string[]>(() => {
    const out: string[] = [];
    const seen = new Set<string>();
    const events = Array.isArray(mir?.has_event) ? mir!.has_event : [];
    for (const e of events) {
        const acts = Array.isArray(e?.has_activity) ? e.has_activity : [];
        for (const a of acts) {
            const n = a?.has_agent?.has_name;
            if (!n) continue;
            if (Array.isArray(n)) {
                for (const x of n) {
                    const s = String(x);
                    if (s && !seen.has(s)) { seen.add(s); out.push(s); }
                }
            } else {
                const s = String(n);
                if (s && !seen.has(s)) { seen.add(s); out.push(s); }
            }
        }
    }
    return out;
});

const productionPlaces = computed<string[]>(() => {
    const out: string[] = [];
    const seen = new Set<string>();
    const events = Array.isArray(mir?.has_event) ? mir!.has_event : [];
    for (const e of events) {
        const p = e?.located_in?.has_name;
        if (!p) continue;
        if (Array.isArray(p)) {
            for (const x of p) {
                const s = String(x);
                if (s && !seen.has(s)) { seen.add(s); out.push(s); }
            }
        } else {
            const s = String(p);
            if (s && !seen.has(s)) { seen.add(s); out.push(s); }
        }
    }
    return out;
});

const productionYears = computed<string[]>(() => {
    const out: string[] = [];
    const seen = new Set<string>();
    // `production_in_year` (single or array) + `years` (array)
    const add = (v: any) => {
        if (v == null) return;
        if (Array.isArray(v)) {
            for (const x of v) {
                const s = String(x);
                if (s && !seen.has(s)) { seen.add(s); out.push(s); }
            }
        } else {
            const s = String(v);
            if (s && !seen.has(s)) { seen.add(s); out.push(s); }
        }
    };
    if (mir) {
    // many datasets store these at work-level root
    // (mir.production_in_year / mir.years); if nested in has_record, mir already *is* has_record
    // so both forms collapse to mir.*
        add((mir as any).production_in_year);
        add((mir as any).years);
    }
    return out;
});

// --- Dynamic search state (manifestation filter) ---
const searchQuery = ref<string[]>([]);
const loading = ref(false);
function onSearchInput(val: any) {
    searchQuery.value = Array.isArray(val) ? val : val ? [val] : [];
    loading.value = true;
    setTimeout(() => {
        loading.value = false;
    }, 600);
}

// --- SEARCH WHITELIST (manifestation/item fields) ---
const SEARCH_WHITELIST = [
    // Manifestation-level
    "has_record.described_by.has_issuer_name",
    "in_language.code",
    "has_record.has_colour_type",
    "has_record.has_sound_type",
    // Item-level
    "items.has_webresource",
    "items.has_record.has_format.type",
    "items.has_record.element_type",
    "items.in_language.code",
    "items.has_record.has_colour_type",
    "items.has_record.has_sound_type",
    "items.has_record.has_frame_rate",
];

function get(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    return path
        .split(".")
        .reduce((o, p) => (o && o[p] != null ? o[p] : undefined), obj);
}
function pushValue(arr: string[], v: any) {
    if (v == null) return;
    if (Array.isArray(v)) {
        for (const x of v) if (x != null && String(x) !== "") arr.push(String(x));
    } else {
        const s = String(v);
        if (s !== "") arr.push(s);
    }
}
function valuesForManifestation(mf: any): string[] {
    const vals: string[] = [];
    for (const p of SEARCH_WHITELIST) {
        if (p.startsWith("items.")) {
            const items = Array.isArray(mf?.items) ? mf.items : [];
            for (const it of items) pushValue(vals, get(it, p.slice(6)));
        } else {
            pushValue(vals, get(mf, p));
        }
    }
    // Deduplicate (case-insensitive)
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of vals) {
        const k = s.toLowerCase();
        if (!seen.has(k)) {
            seen.add(k);
            out.push(s);
        }
    }
    return out;
}

const suggestionsForManifestations = computed(() => {
    const set = new Set<string>();
    for (const mf of manifestations.value) {
        for (const v of valuesForManifestation(mf)) {
            set.add(v);
            if (set.size >= 100) break;
        }
        if (set.size >= 100) break;
    }
    return Array.from(set).slice(0, 100);
});

function mfMatchesQuery(mf: any, q: string): boolean {
    if (!q) return true;
    return valuesForManifestation(mf).some((v) => v === q);
}

const filteredManifestations = computed(() => {
    const selected = searchQuery.value;
    if (Array.isArray(selected) && selected.length > 0) {
        return manifestations.value.filter((mf) =>
            selected.every((q) => mfMatchesQuery(mf, q))
        );
    }
    return manifestations.value;
});

// helpers
function formatTimestamp(ts: any): string {
    try {
        const d = new Date(ts);
        return isNaN(d.getTime()) ? "" : d.toLocaleString("de-DE");
    } catch {
        return "";
    }
}
</script>

<style scoped>
.collapse-plus>.collapse-title:after {
  top: 25%;
}
</style>
