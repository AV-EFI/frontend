<template>
  <button
    class="btn btn-primary"
    :class="[btnSize]"
    :alt="$t('exportdata')"
    :title="$t('exportdata')"
    @click="exportData(dataSetId)"
  >
    <Icon
      name="formkit:download"
      size="1em"
      alt="Export data"
    />
  </button>
</template>

<script lang="ts" setup>
import { mkConfig, generateCsv, download } from "export-to-csv";
const csvConfig = mkConfig({ useKeysAsHeaders: true, filename: `avefi_${new Date().toJSON().slice(0,10)}` });
const props = defineProps({
    'dataSetId': {
        type: Array<string>,
        required: false,
        default: null
    },
    'dataSetJson': {
        type: Array<Object>,
        required: false,
        default: null
    },
    'btnSize': {
        type: String,
        required: false,
        default: 'btn-sm'
    }
});

//TODO: remove github copilot
//TODO2: rewrite for list of objects
async function exportData(dataSetId: Array<string>) {
    const exportData = props.dataSetJson ?? await getDataSet(dataSetId);
    if(typeof (exportData) === 'string') {
        const test2 = [deepFlattenToObject(JSON.parse(exportData))];
        const csv = await generateCsv(csvConfig)(test2);
        if(csv) {
            download(csvConfig)(csv);
        }
        return;
    } 
    const arr = [];
    arr.push(exportData.map((item) => deepFlattenToObject(item)));
    const csv = await generateCsv(csvConfig)(arr[0]);
    if(csv) {
        download(csvConfig)(csv);
    }
    return;
    
}

function deepFlattenToObject(obj, prefix = '', level = 0) {
    return Object.keys(obj).reduce((acc, k) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof obj[k] === 'object' && obj[k] !== null) {
            if (level > 0) {
                Object.assign(acc, deepFlattenToObject(obj[k], pre + k, level + 1));
            } else {
                Object.assign(acc, deepFlattenToObject(obj[k], '', level + 1));
            }
        } else {
            acc[pre + k] = obj[k];
        }
        return acc;
    }, {});
}
</script>