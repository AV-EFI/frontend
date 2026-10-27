<template>
    <div class="relative inline-block">
        <button class="btn btn-primary w-full h-full" :class="[btnSize]"
                :title="$t('exportdata')" aria-haspopup="true" :aria-expanded="menuOpen"
                aria-controls="export-menu" @click="toggleMenu" @keydown.enter.prevent="toggleMenu"
                @keydown.space.prevent="toggleMenu">
            <Icon name="tabler:download" class="icon-action" aria-hidden="true" />
            <span v-if="showLabel" class="hidden md:inline-block capitalize ml-1 text-left"
                  :class="[fixedWith? 'w-24' : '']">{{ $t('export') }}</span>
        </button>

        <div v-if="menuOpen" id="export-menu" role="menu" class="absolute z-30 mt-2 bg-base-100 border rounded shadow w-48"
             style="top: calc(100% + 5px); right: 0;">
            <ul>
                <li v-for="option in exportOptions" :key="option.format" role="none">
                    <button role="menuitem" tabindex="0" class="w-full text-left px-4 py-2 hover:bg-base-200"
                            @click="exportData(option.format)" @keydown.enter.prevent="exportData(option.format)"
                            @keydown.space.prevent="exportData(option.format)">
                        {{ option.label }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { mkConfig, generateCsv, download as downloadCsv } from 'export-to-csv';
import { useI18n } from 'vue-i18n';
import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses';

type ExportFormat = 'csv' | 'json' | 'xml';

// Nuxt's template-context typing doesn't pick up plugin-provided $-properties
// reliably in this project's Volar setup (same gap as $t), so this is typed
// locally against just the methods this component actually calls.
interface ExportNuxtApp {
    $toast?: {
        info?: (message: string, opts?: Record<string, unknown>) => unknown;
        error?: (message: string, opts?: Record<string, unknown>) => unknown;
        success?: (message: string, opts?: Record<string, unknown>) => unknown;
    };
}

const { t: $t } = useI18n();
const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
const { $toast } = useNuxtApp() as unknown as ExportNuxtApp;

const props = defineProps({
    dataSetId: {
        type: Array as () => string[],
        required: false,
        default: () => []
    },
    dataSetJson: {
        type: String,
        required: false,
        default: null
    },
    btnSize: {
        type: String,
        required: false,
        default: 'btn-sm'
    },
    showLabel: {
        type: Boolean,
        required: false,
        default: false
    },
    fixedWith: {
        type: Boolean,
        required: false,
        default: false
    }
});
  
const exportOptions: { format: ExportFormat; label: string }[] = [
    { format: 'csv', label: $t('exportAsCSV') },
    { format: 'json', label: $t('exportAsJSON') },
    { format: 'xml', label: $t('exportAsXML') }
];

const exportFilename = () => `avefi_export_${new Date().toISOString().slice(0, 10)}`;

async function exportData(format: ExportFormat) {
    menuOpen.value = false;
    let rawData: string | ElasticGetByIdResponse[] | null;
    if (props.dataSetJson?.length) {
        rawData = props.dataSetJson;
    } else {
        const fetched = await Promise.all(props.dataSetId.map((id) => getDataSet(id)));
        rawData = fetched.filter((entry): entry is ElasticGetByIdResponse => entry !== null);
    }

    if (typeof rawData === 'string') {
        rawData = JSON.parse(rawData);
    }

    const records = (Array.isArray(rawData) ? rawData : [rawData]).filter(Boolean).map(unwrapRecord);
    if (records.length === 0) {
        $toast?.error?.($t('noDataToExport'), { timeout: 2000 });
        return;
    }

    try {
        if (format === 'csv') {
            const { headers, rows } = recordsToCsvRows(records);
            const csvConfig = mkConfig({ filename: exportFilename(), columnHeaders: headers });
            downloadCsv(csvConfig)(generateCsv(csvConfig)(rows));
            $toast?.success?.($t('exportSuccess', { format: 'CSV' }), { timeout: 2000 });
        } else if (format === 'json') {
            downloadBlob(JSON.stringify(records.length === 1 ? records[0] : records, null, 2), `${exportFilename()}.json`, 'application/json');
            $toast?.success?.($t('exportSuccess', { format: 'JSON' }), { timeout: 2000 });
        } else if (format === 'xml') {
            downloadBlob(recordsToXml(records), `${exportFilename()}.xml`, 'application/xml');
            $toast?.success?.($t('exportSuccess', { format: 'XML' }), { timeout: 2000 });
        }
    } catch (err) {
        console.error('[ExportDataComp] export failed', err);
        $toast?.error?.($t('exportFailed'), { timeout: 3000 });
    }
}

function downloadBlob(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
</script>
