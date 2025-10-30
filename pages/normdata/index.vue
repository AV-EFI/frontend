<template>
  <NuxtLayout name="partial-grid-1">
    <template #center>
      <div class="col-span-full">
        <div class="mb-4">
          <h2 class="text-xl font-semibold">
            Explore Normdata & Identifiers
          </h2>
          <p class="opacity-75 text-sm">
            Preconfigured overview across the whole index (no ID, no input). Counts use ES <code>exists</code> queries.
          </p>
        </div>

        <div
          v-if="pending"
          class="alert alert-info my-3"
        >
          <span>Loading…</span>
        </div>
        <div
          v-else-if="error"
          class="alert alert-warning my-3"
        >
          <span>Failed to load counts.</span>
        </div>

        <section class="mb-6">
          <h3 class="text-lg font-semibold mb-2">
            Work level
          </h3>
          <div class="grid md:grid-cols-2 gap-3">
            <NdFieldCard
              v-for="f in workFields"
              :key="f.path"
              :label="f.label"
              :es-path="f.path"
              :count="counts[f.path] ?? null"
              :kibana="kibanaView"
            />
          </div>
        </section>

        <section class="mb-6">
          <h3 class="text-lg font-semibold mb-2">
            Manifestation level
          </h3>
          <div class="grid md:grid-cols-2 gap-3">
            <NdFieldCard
              v-for="f in manFields"
              :key="f.path"
              :label="f.label"
              :es-path="f.path"
              :count="counts[f.path] ?? null"
              :kibana="kibanaView"
            />
          </div>
        </section>

        <section>
          <h3 class="text-lg font-semibold mb-2">
            Item level
          </h3>
          <div class="grid md:grid-cols-2 gap-3">
            <NdFieldCard
              v-for="f in itemFields"
              :key="f.path"
              :label="f.label"
              :es-path="f.path"
              :count="counts[f.path] ?? null"
              :kibana="kibanaView"
            />
          </div>
        </section>
      </div>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Normdata & Identifiers Overview',
    description: 'Preconfigured overview of normdata and identifier fields in the AVE-FI index.',
    auth: false,
});
import { computed } from 'vue';

type FieldCfg = { label: string; path: string }

const workFields: FieldCfg[] = [
    { label: 'is_part_of.id', path: 'is_part_of.id' },
    { label: 'same_as.id', path: 'same_as.id' },
    { label: 'has_identifier.id_value', path: 'has_identifier.id_value' },
    { label: 'has_event.id', path: 'has_event.id' },
];

const manFields: FieldCfg[] = [
    { label: 'manifestations.same_as.id', path: 'manifestations.same_as.id' },
    { label: 'manifestations.has_record.same_as.id', path: 'manifestations.has_record.same_as.id' },
    { label: 'manifestations.has_identifier.id_value', path: 'manifestations.has_identifier.id_value' },
    { label: 'manifestations.is_manifestation_of.id', path: 'manifestations.is_manifestation_of.id' },
];

const itemFields: FieldCfg[] = [
    { label: 'manifestations.items.has_record.same_as.id', path: 'manifestations.items.has_record.same_as.id' },
    { label: 'manifestations.items.has_identifier.id_value', path: 'manifestations.items.has_identifier.id_value' },
    { label: 'manifestations.items.same_as.id', path: 'manifestations.items.same_as.id' },
];

const allPaths = [...workFields, ...manFields, ...itemFields].map(f => f.path);
const { data, pending, error } = await useFetch('/api/elastic/normdata/counts', {
    query: { field: allPaths },
    server: true,
    lazy: false
});

const counts = computed<Record<string, number>>(() => (data.value?.counts ?? {}));

// optional Kibana (auto-hidden if not configured)
const rc = useRuntimeConfig();
const kibanaBase = (rc.public as any)?.KIBANA_BASE as string | undefined;
const kibanaDataViewId = (rc.public as any)?.KIBANA_DATA_VIEW_ID as string | undefined;

const kibanaView = computed(() => {
    if (!kibanaBase || !kibanaDataViewId) return undefined;
    return {
        baseUrl: kibanaBase,
        viewType: 'discover' as const,
        dataViewId: kibanaDataViewId,
        timeFrom: 'now-10y',
        timeTo: 'now'
    };
}).value;
</script>
