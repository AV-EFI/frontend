<template>
  <div class="relative inline-block">
    <button
      class="btn btn-primary w-full h-full"
      :class="[btnSize]"
      :alt="$t('exportGithubProject')"
      :title="$t('exportGithubProject')"
      aria-haspopup="true"
      :aria-expanded="menuOpen.toString()"
      aria-controls="github-export-menu"
      :disabled="loading"
      @click="toggleMenu"
      @keydown.enter.prevent="toggleMenu"
      @keydown.space.prevent="toggleMenu"
    >
      <Icon
        v-if="!loading"
        name="formkit:download"
        class="text-xl w-4 h-4"
      />
      <Icon
        v-else
        name="formkit:spinner"
        class="text-xl w-4 h-4 animate-spin"
      />
      <span
        v-if="showLabel"
        class="hidden md:inline-block capitalize ml-1 text-left"
        :class="[fixedWith ? 'w-24' : '']"
      >{{ $t('githubProjectExport') }}</span>
    </button>

    <div
      v-if="menuOpen"
      id="github-export-menu"
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
            class="w-full text-left px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
            :disabled="loading"
            @click="exportGithubProject(option.format)"
            @keydown.enter.prevent="exportGithubProject(option.format)"
            @keydown.space.prevent="exportGithubProject(option.format)"
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
const { getProjectBoardExportData } = useGithubProject();

const menuOpen = ref(false);
const loading = ref(false);

const toggleMenu = () => (menuOpen.value = !menuOpen.value);

const props = defineProps({
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
  filename: `github_project_export_${new Date().toISOString().slice(0, 10)}`,
  useKeysAsHeaders: true
});

async function exportGithubProject(format: 'csv' | 'json' | 'xml') {
  menuOpen.value = false;
  loading.value = true;

  try {
    toast.info($t('loadingGithubProject'), { timeout: 2000 });
    
    const projectData = await getProjectBoardExportData();
    
    if (!projectData || projectData.length === 0) {
      toast.error('No GitHub project data to export', { timeout: 2000 });
      return;
    }

    const filename = `github_project_export_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      const csv = await generateCsv(csvConfig)(projectData);
      if (csv) {
        downloadCsv(csvConfig)(csv);
        toast.success($t('githubExportSuccess'), { timeout: 2000 });
      }
    } else if (format === 'json') {
      downloadBlob(JSON.stringify(projectData, null, 2), `${filename}.json`, 'application/json');
      toast.success($t('githubExportSuccess'), { timeout: 2000 });
    } else if (format === 'xml') {
      const xml = jsonToXml(projectData);
      downloadBlob(xml, `${filename}.xml`, 'application/xml');
      toast.success($t('githubExportSuccess'), { timeout: 2000 });
    }
  } catch (error: any) {
    console.error('GitHub export error:', error);
    toast.error(`${$t('githubExportError')}: ${error.message || error}`, { timeout: 3000 });
  } finally {
    loading.value = false;
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
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<github_project_items>\n`;
  for (const obj of jsonArray) {
    xml += `  <item>\n`;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const safeValue = String(obj[key] ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xml += `    <${key}>${safeValue}</${key}>\n`;
      }
    }
    xml += `  </item>\n`;
  }
  xml += `</github_project_items>`;
  return xml;
}
</script>