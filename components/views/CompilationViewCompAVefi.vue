<template>
    <div>
        <div v-if="mir" class="border-l-2 border-work px-2" role="region" :aria-label="`${$t('detailsFor')} ${
        mir?.has_primary_title?.has_name ?? ''
      }`">
        </div>
        <div v-else>
            <pre>{{ mir }}</pre>
        </div>
        <div v-if="mir?.is_manifestation_of.length > 0 && dataObject?.compound_record?._source?.work_variants?.length > 0"
            class="mt-4">
            <div class="alert">
                <p v-html="$t('multihelptext', {'name': dataObject?.compound_record?._source?.handle})"></p>
            </div>
            <ViewsWorkViewCompParts type="compilationManifestation"
                :parts="dataObject?.compound_record?._source?.work_variants"
                :handle="dataObject?.compound_record?._source?.handle" />
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
