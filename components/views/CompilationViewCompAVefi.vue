<template>
    <div>
        <div v-if="mir" class="border-l-2 border-work px-2" role="region" :aria-label="`${$t('detailsFor')} ${
            mir?.has_primary_title?.has_name ?? ''
        }`">
        </div>
        <div v-else>
            <pre>{{ mir }}</pre>
        </div>
        <div v-if="(mir?.is_manifestation_of?.length ?? 0) > 0 && (dataObject?.compound_record?._source?.work_variants?.length ?? 0) > 0"
             class="mt-4">
            <div class="alert">
                <p v-if="resourceType == 'compilationManifestation'" v-html="$t('multihelptextManifestation', {'name': dataObject?.handle})"></p>
                <p v-else-if="resourceType == 'compilationItem'" v-html="$t('multihelptextItem', {'name': dataObject?.handle, 'manifestation': dataObject.compound_record?._source?.handle ?? ''})"></p>
                <p v-else v-html="$t('multihelptext', {'name': dataObject?.handle})"></p>
            </div>
            <ViewsWorkViewCompParts :type="resourceType"
                                    :parts="dataObject?.compound_record?._source?.work_variants ?? []"
                                    :handle="dataObject?.handle ?? dataObject?.compound_record?._source?.handle" />
        </div>

        <!-- 12 Letzte Bearbeitung -->
        <div v-if="dataObject?.compound_record?._source?.['@timestamp']" class="w-full mt-4 justify-center items-center">
            <DetailKeyValueComp class="col-span-full mx-auto" keytxt="lastedit" :clip="false"
                                :valtxt="formatTimestamp(dataObject.compound_record._source['@timestamp'])" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { WorkVariant, Manifestation } from "~/models/interfaces/schema/avefi_schema_type_utils";
import type { Part } from "./WorkViewCompParts.vue";

// Enable hash navigation for manifestations and items
useHash();

defineProps<{
    resourceType: string;
}>();

interface DataObject {
    handle?: string;
    compound_record?: {
        _source?: {
            handle?: string;
            '@timestamp'?: number;
            has_record?: WorkVariant | Manifestation;
            work_variants?: Part[];
        };
    };
}

const dataJson = defineModel({ type: Object, required: true });
// Defensive parse
let dataObject: DataObject = {};
try {
    dataObject = (dataJson.value ?? {}) as DataObject;
} catch {
    dataObject = {};
}

// has_record here is either a WorkVariant or (for compilationManifestation/compilationItem
// resource types) a Manifestation, hence the union rather than reusing WorkViewCompAVefi's mir typing.
const mir = (dataObject?.compound_record?._source?.has_record ?? null) as (WorkVariant & Partial<Manifestation>) | null;

// helpers
function formatTimestamp(ts: string | number): string {
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
