<template>
  <div class="mt-4">
    <section>
      <div class="grid grid-cols-7 xl:grid-cols-8 gap-2 w-100 grid-rows-[48px_64px_64px_auto_auto_auto_64px_64px_auto_auto_auto_auto_auto_auto] auto-rows-fr">
        <ViewsWorkViewEditorStretched
          v-if="prev"
          v-model="prev"
          @update-target-model-g-p="onUpdateTargetModelGP"
        />
        <ViewsWorkViewEditorStretched
          v-if="current"
          v-model="current"
          @update-target-model-g-p="onUpdateTargetModelGP"
        />
        <ViewsWorkViewEditorResultStretched v-model="mergedDataset" />
      </div>
    </section>
  </div>
</template>
<script lang="ts" setup>
import type { MergedDataset } from '@/models/interfaces/manual/IMergedDataSet';
import { useFormattedAVefiRecord } from '@/composables/useFormattedAVefiRecord';

const props = defineProps({
    items: {
        type: Array<string>,
        required: true,
        default: () => []
    }
});

const mergedDataset = ref<MergedDataset>({
    title: '',
    other_ids: [],
    countries: [],
    directors: [],
    castmembers: [],
    producers: [],
    productionyears: [],
    subjects: []
});

function onUpdateTargetModelGP(targetPropertyValue: string, targetPropertyName: string) {
    if (['countries', 'directors', 'castmembers', 'producers'].includes(targetPropertyName)) {
        const key = targetPropertyName as keyof Pick<MergedDataset, 'countries' | 'directors' | 'castmembers' | 'producers'>;
        (mergedDataset.value[key] as { name: string; gnd: number }[]).push({
            name: targetPropertyValue,
            gnd: 12345
        });
    } else if (targetPropertyName === 'other_ids') {
        mergedDataset.value.other_ids.push({ name: targetPropertyValue, type: 'defaultType' });
    } else if (targetPropertyName === 'title') {
        mergedDataset.value.title = targetPropertyValue;
    } else if (['productionyears', 'subjects'].includes(targetPropertyName)) {
        const key = targetPropertyName as keyof Pick<MergedDataset, 'productionyears' | 'subjects'>;
        (mergedDataset.value[key] as string[]).push(targetPropertyValue);
    }
}

const objectListStore = useObjectListStore();

const { data: prev } = await useAsyncData('prev', () =>
    useFormattedAVefiRecord(props.items[0], { logErrors: true })
);

const { data: current } = await useAsyncData('current', () =>
    useFormattedAVefiRecord(props.items[1], { logErrors: true })
);

onMounted(() => {
    if (objectListStore.comparisonDrawerOpen) {
        objectListStore.comparisonDrawerOpen = false;
    }
});

</script>