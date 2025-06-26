<template>
  <div class="relative inline-block">
    <button
      class="btn btn-primary w-full h-full"
      :class="[btnSize]"
      :alt="$t('exportdata')"
      :title="$t('exportdata')"
      aria-haspopup="true"
      :aria-expanded="menuOpen.toString()"
      aria-controls="export-menu"
      @click="toggleMenu"
      @keydown.enter.prevent="toggleMenu"
      @keydown.space.prevent="toggleMenu"
    >
      <Icon
        name="formkit:download"
        class="text-xl w-4 h-4"
      />
      <span
        v-if="showLabel"
        class="hidden md:inline-block capitalize ml-1 text-left"
        :class="[fixedWith? 'w-24' : '']"
      >{{ $t('export') }}</span>
    </button>
  
    <div
      v-if="menuOpen"
      id="export-menu"
      role="menu"
      class="absolute z-30 mt-2 bg-white border rounded shadow w-48"
      style="top: calc(100% + 5px); right: 0;"
    >
      <ul>
        <li
          v-for="option in exportOptions"
          :key="option.format"
          role="none"
        >
          <button
            role="menuitem"
            tabindex="0"
            class="w-full text-left px-4 py-2 hover:bg-gray-100"
            @click="exportData(option.format)"
            @keydown.enter.prevent="exportData(option.format)"
            @keydown.space.prevent="exportData(option.format)"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { mkConfig, generateCsv, download as downloadCsv } from 'export-to-csv';
import { toast } from 'vue3-toastify';
import { useI18n } from 'vue-i18n';
  
const { t: $t } = useI18n();
const menuOpen = ref(false);
const toggleMenu = () => (menuOpen.value = !menuOpen.value);
  
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
  
const exportOptions = [
    { format: 'csv', label: $t('exportAsCSV') },
    { format: 'json', label: $t('exportAsJSON') },
    { format: 'xml', label: $t('exportAsXML') }
];
  
const csvConfig = mkConfig({
    filename: `avefi_export_${new Date().toISOString().slice(0, 10)}`,
    useKeysAsHeaders: true
});
  
async function exportData(format: 'csv' | 'json' | 'xml') {
    menuOpen.value = false;
    let rawData = props.dataSetJson?.length ? props.dataSetJson : await getDataSet(props.dataSetId);
  
    if (typeof rawData === 'string') {
        rawData = JSON.parse(rawData);
    }
  
    if (!rawData || rawData.length === 0) {
        toast.error('No data to export', { timeout: 2000 });
        return;
    }
  
    const flattened = Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === 'object'
        ? rawData.flatMap((item: any) => deepFlattenToObjectStructured(item))
        : [rawData].flatMap((item: any) => deepFlattenToObjectStructured(item));
  
    const filename = `avefi_export_${new Date().toISOString().slice(0, 10)}`;
  
    try {
        if (format === 'csv') {
            const csv = await generateCsv(csvConfig)(flattened);
            if (csv) {
                downloadCsv(csvConfig)(csv);
                toast.success('CSV exported!', { timeout: 2000 });
            }
        } else if (format === 'json') {
            downloadBlob(JSON.stringify(flattened, null, 2), `${filename}.json`, 'application/json');
            toast.success('JSON exported!', { timeout: 2000 });
        } else if (format === 'xml') {
            const xml = jsonToXml(flattened);
            downloadBlob(xml, `${filename}.xml`, 'application/xml');
            toast.success('XML exported!', { timeout: 2000 });
        }
    } catch (err) {
        toast.error(`Export failed: ${err}`, { timeout: 3000 });
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
  
function jsonToXml(jsonArray: any[]): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<records>\n`;
    for (const obj of jsonArray) {
        xml += `  <record>\n`;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const safeValue = String(obj[key] ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                xml += `    <${key}>${safeValue}</${key}>\n`;
            }
        }
        xml += `  </record>\n`;
    }
    xml += `</records>`;
    return xml;
}
  
function deepFlattenToObjectStructured(entry: any) {
    const rows: any[] = [];
    const source = entry._source || entry;
    const workVariant = source.has_record || {};
    const manifestations = source.manifestations || [];
  
    const directors_or_editors = new Set<string>();
    const castmembers = new Set<string>();
    const production = new Set<string>();
    const locations = new Set<string>();
    const agents = new Set<string>();
  
    if (source.directors_or_editors) {
        for (const name of source.directors_or_editors) {
            directors_or_editors.add(sanitizeCsvValue(name));
        }
    } else {
        for (const event of workVariant.has_event || []) {
            for (const activity of event.has_activity || []) {
                if (activity.category === "avefi:DirectingActivity" || activity.category === "avefi:EditingActivity") {
                    for (const agent of activity.has_agent || []) {
                        if (agent.has_name) {
                            directors_or_editors.add(sanitizeCsvValue(agent.has_name));
                        }
                    }
                }
            }
        }
    }
  
    if (source.castmembers) {
        for (const name of source.castmembers) {
            castmembers.add(sanitizeCsvValue(name));
        }
    } else {
        for (const event of workVariant.has_event || []) {
            for (const activity of event.has_activity || []) {
                if (activity.category === "avefi:CastActivity") {
                    for (const agent of activity.has_agent || []) {
                        if (agent.has_name) {
                            castmembers.add(sanitizeCsvValue(agent.has_name));
                        }
                    }
                }
            }
        }
    }
  
    if (source.production) {
        for (const name of source.production) {
            production.add(sanitizeCsvValue(name));
        }
    } else {
        for (const event of workVariant.has_event || []) {
            for (const activity of event.has_activity || []) {
                if (activity.category === "avefi:ProducingActivity") {
                    for (const agent of activity.has_agent || []) {
                        if (agent.has_name) {
                            production.add(sanitizeCsvValue(agent.has_name));
                        }
                    }
                }
            }
        }
    }
  
    if (source.located_in) {
        for (const name of source.located_in) {
            locations.add(sanitizeCsvValue(name));
        }
    } else {
        for (const event of workVariant.has_event || []) {
            for (const loc of event.located_in || []) {
                if (loc.has_name) {
                    locations.add(sanitizeCsvValue(loc.has_name));
                }
            }
        }
    }
  
    for (const event of workVariant.has_event || []) {
        for (const activity of event.has_activity || []) {
            if (
                activity.category !== "avefi:ProducingActivity" &&
          activity.category !== "avefi:DirectingActivity" &&
          activity.category !== "avefi:CastActivity" &&
          activity.category !== "avefi:EditingActivity"
            ) {
                for (const agent of activity.has_agent || []) {
                    if (agent.has_name) {
                        const agentWithType = `${sanitizeCsvValue(agent.has_name)} (${sanitizeCsvValue(activity.type || '')})`;
                        agents.add(agentWithType);
                    }
                }
            }
        }
    }
  
    const baseRow = {
        workVariant_id: source.handle,
        primary_title: sanitizeCsvValue(workVariant.has_primary_title?.has_name || '').replace(/"/g, '""'),
        alternative_title: sanitizeCsvValue(workVariant.has_alternative_title?.[0]?.has_name || '').replace(/"/g, '""'),
        production_year: source.years?.[0] || '',
        directors_or_editors: Array.from(directors_or_editors).join('; '),
        castmembers: Array.from(castmembers).join('; '),
        production: Array.from(production).join('; '),
        located_in: Array.from(locations).join('; '),
        agents: Array.from(agents).join('; ')
    };
  
    if (manifestations.length === 0) {
        rows.push({ ...baseRow });
        return rows;
    }
  
    for (const man of manifestations) {
        const manRecord = man.has_record || {};
        const manRow = {
            ...baseRow,
            manifestation_id: man.handle,
            has_issuer_name: manRecord.described_by?.has_issuer_name,
            has_colour_type: manRecord.has_colour_type || '',
            has_sound_type: manRecord.has_sound_type || '',
            has_duration: ''
        };
  
        const items = man.items || [];
        if (items.length === 0) {
            rows.push({ ...manRow });
            continue;
        }
  
        for (const item of items) {
            const itemRecord = item.has_record || {};
            const format = itemRecord.has_format?.map((f: any) => f.type).join('; ') || '';
            rows.push({
                ...manRow,
                item_id: item.handle,
                has_format: format
            });
        }
    }
  
    return rows;
}
  
function sanitizeCsvValue(value: string): string {
    return value.replace(/\r?\n|\r/g, ' ').replace(/"/g, "'").trim();
}
</script>
  