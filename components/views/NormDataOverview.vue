<template>
  <div
    class="col-span-full mt-4"
    role="region"
    :aria-label="$t('normdataOverview')"
  >
    <h3 class="font-semibold text-lg mb-3">
      {{ $t('normdataOverview') }}
    </h3>

    <!-- WORK -->
    <section
      v-if="sections.work.entries.length"
      class="border border-base-300 rounded-lg p-3 mb-3"
      role="region"
      :aria-label="$t('workLevel')"
    >
      <header class="flex items-center justify-between mb-2 gap-2">
        <h4 class="font-medium text-base">
          {{ $t('workLevel') }}
        </h4>
        <ViewsKibanaEmbed
          v-if="kibana && (getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))"
          :base-url="kibana.baseUrl"
          :view-type="(getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))!.viewType"
          :saved-object-id="(getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))!.savedObjectId"
          :data-view-id="(getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))!.dataViewId"
          :field-exists="(getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))!.fieldExists"
          :filter-mode="(getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))!.filterMode || 'doc'"
          :custom-kql="(getK('is_part_of') || getK('same_as') || getK('has_event') || getK('has_identifier'))!.customKql"
          :handle="handle"
          :time-from="kibana.timeFrom || 'now-15y'"
          :time-to="kibana.timeTo || 'now'"
          :aria-label="$t('openInKibana')"
        />
      </header>

      <ul class="space-y-1 text-sm">
        <li
          v-for="(row, i) in sections.work.entries"
          :key="'w-' + i"
          class="flex flex-wrap items-baseline gap-x-2"
        >
          <span
            class="font-mono truncate"
            :title="row.path"
          >{{ row.path }}</span>
          <span>→</span>
          <template v-if="row.type === 'normref'">
            <router-link
              v-if="isInternalId(row.value.id)"
              class="link link-primary"
              :to="toInternalRoute(row.value.id!)"
              :title="row.value.id"
              target="_blank"
            >
              {{ row.value.id }}
            </router-link>
            <span
              v-else
              class="font-mono"
              :title="row.value.id"
            >{{ row.value.id }}</span>
            <span v-if="row.value.category">({{ $t(row.value.category) }})</span>
            <span v-if="row.value.has_name">&nbsp;– {{ row.value.has_name }}</span>
            <span
              v-if="row.value.note"
              class="opacity-70"
            >&nbsp;· {{ row.value.note }}</span>
          </template>
          <template v-else-if="row.type === 'identifier'">
            <span v-if="row.value.id_category">{{ row.value.id_category }}:</span>
            <span
              v-if="row.value.id_value"
              class="font-mono"
            >{{ row.value.id_value }}</span>
            <span
              v-if="row.value.note"
              class="opacity-70"
            >&nbsp;· {{ row.value.note }}</span>
          </template>
        </li>
      </ul>
    </section>

    <!-- MANIFESTATIONS -->
    <section
      v-if="sections.manifestations.entries.length"
      class="border border-base-300 rounded-lg p-3 mb-3"
      role="region"
      :aria-label="$t('manifestationLevel')"
    >
      <header class="flex items-center justify-between mb-2 gap-2">
        <h4 class="font-medium text-base">
          {{ $t('manifestationLevel') }}
        </h4>
        <ViewsKibanaEmbed
          v-if="kibana && (getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))"
          :base-url="kibana.baseUrl"
          :view-type="(getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))!.viewType"
          :saved-object-id="(getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))!.savedObjectId"
          :data-view-id="(getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))!.dataViewId"
          :field-exists="(getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))!.fieldExists"
          :filter-mode="(getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))!.filterMode || 'doc'"
          :custom-kql="(getK('m_same_as') || getK('m_has_record_same_as') || getK('m_has_identifier') || getK('m_is_manifestation_of'))!.customKql"
          :handle="handle"
          :time-from="kibana.timeFrom || 'now-15y'"
          :time-to="kibana.timeTo || 'now'"
          :aria-label="$t('openInKibana')"
        />
      </header>

      <ul class="space-y-1 text-sm">
        <li
          v-for="(row, i) in sections.manifestations.entries"
          :key="'m-' + i"
          class="flex flex-wrap items-baseline gap-x-2"
        >
          <span
            class="font-mono truncate"
            :title="row.path"
          >{{ row.path }}</span>
          <span>→</span>
          <template v-if="row.type === 'normref'">
            <router-link
              v-if="isInternalId(row.value.id)"
              class="link link-primary"
              :to="toInternalRoute(row.value.id!)"
              :title="row.value.id"
              target="_blank"
            >
              {{ row.value.id }}
            </router-link>
            <span
              v-else
              class="font-mono"
              :title="row.value.id"
            >{{ row.value.id }}</span>
            <span v-if="row.value.category">({{ $t(row.value.category) }})</span>
            <span v-if="row.value.has_name">&nbsp;– {{ row.value.has_name }}</span>
            <span
              v-if="row.value.note"
              class="opacity-70"
            >&nbsp;· {{ row.value.note }}</span>
          </template>
          <template v-else-if="row.type === 'identifier'">
            <span v-if="row.value.id_category">{{ row.value.id_category }}:</span>
            <span
              v-if="row.value.id_value"
              class="font-mono"
            >{{ row.value.id_value }}</span>
            <span
              v-if="row.value.note"
              class="opacity-70"
            >&nbsp;· {{ row.value.note }}</span>
          </template>
        </li>
      </ul>
    </section>

    <!-- ITEMS -->
    <section
      v-if="sections.items.entries.length"
      class="border border-base-300 rounded-lg p-3"
      role="region"
      :aria-label="$t('itemLevel')"
    >
      <header class="flex items-center justify-between mb-2 gap-2">
        <h4 class="font-medium text-base">
          {{ $t('itemLevel') }}
        </h4>
        <ViewsKibanaEmbed
          v-if="kibana && (getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))"
          :base-url="kibana.baseUrl"
          :view-type="(getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))!.viewType"
          :saved-object-id="(getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))!.savedObjectId"
          :data-view-id="(getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))!.dataViewId"
          :field-exists="(getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))!.fieldExists"
          :filter-mode="(getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))!.filterMode || 'doc'"
          :custom-kql="(getK('i_has_record_same_as') || getK('i_has_identifier') || getK('i_same_as'))!.customKql"
          :handle="handle"
          :time-from="kibana.timeFrom || 'now-15y'"
          :time-to="kibana.timeTo || 'now'"
          :aria-label="$t('openInKibana')"
        />
      </header>

      <ul class="space-y-1 text-sm">
        <li
          v-for="(row, i) in sections.items.entries"
          :key="'i-' + i"
          class="flex flex-wrap items-baseline gap-x-2"
        >
          <span
            class="font-mono truncate"
            :title="row.path"
          >{{ row.path }}</span>
          <span>→</span>
          <template v-if="row.type === 'normref'">
            <router-link
              v-if="isInternalId(row.value.id)"
              class="link link-primary"
              :to="toInternalRoute(row.value.id!)"
              :title="row.value.id"
              target="_blank"
            >
              {{ row.value.id }}
            </router-link>
            <span
              v-else
              class="font-mono"
              :title="row.value.id"
            >{{ row.value.id }}</span>
            <span v-if="row.value.category">({{ $t(row.value.category) }})</span>
            <span v-if="row.value.has_name">&nbsp;– {{ row.value.has_name }}</span>
            <span
              v-if="row.value.note"
              class="opacity-70"
            >&nbsp;· {{ row.value.note }}</span>
          </template>
          <template v-else-if="row.type === 'identifier'">
            <span v-if="row.value.id_category">{{ row.value.id_category }}:</span>
            <span
              v-if="row.value.id_value"
              class="font-mono"
            >{{ row.value.id_value }}</span>
            <span
              v-if="row.value.note"
              class="opacity-70"
            >&nbsp;· {{ row.value.note }}</span>
          </template>
        </li>
      </ul>
    </section>

    <p
      v-if="!hasAny"
      class="opacity-70 text-sm"
    >
      {{ $t('noNormdataFound') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type NormRef = { id?: string; category?: string; has_name?: string; note?: string }
type Identifier = { id_category?: string; id_value?: string; note?: string }
type Row =
  | { type: 'normref'; path: string; value: NormRef }
  | { type: 'identifier'; path: string; value: Identifier }

type KibanaFieldConfig = {
  viewType: 'discover' | 'lens'
  savedObjectId?: string
  dataViewId?: string
  fieldExists?: string
  filterMode?: 'doc' | 'exists' | 'custom'
  customKql?: string
}

const props = defineProps<{
  doc: Record<string, any>
  kibana?: {
    baseUrl: string
    timeFrom?: string
    timeTo?: string
    views?: {
      is_part_of?: KibanaFieldConfig
      same_as?: KibanaFieldConfig
      has_event?: KibanaFieldConfig
      has_identifier?: KibanaFieldConfig
      m_same_as?: KibanaFieldConfig
      m_has_record_same_as?: KibanaFieldConfig
      m_has_identifier?: KibanaFieldConfig
      m_is_manifestation_of?: KibanaFieldConfig
      i_has_record_same_as?: KibanaFieldConfig
      i_has_identifier?: KibanaFieldConfig
      i_same_as?: KibanaFieldConfig
    }
  }
}>();

const getArr = (x: any) => (Array.isArray(x) ? x : x ? [x] : []);
const isObj = (x: any) => x && typeof x === 'object' && !Array.isArray(x);

const isInternalId = (id?: string) => !!id && id.includes('21.11155/');
const toInternalRoute = (id: string) => `/film/${id.replace('21.11155/', '')}`;

function collectWork(doc: any): Row[] {
    if (!isObj(doc)) return [];
    const rows: Row[] = []
  ;['is_part_of', 'same_as', 'has_event'].forEach((key) => {
        getArr(doc?.[key]).forEach((e: NormRef, i: number) => {
            if (isObj(e) && (e.id || e.has_name || e.category)) {
                rows.push({ type: 'normref', path: `${key}[${i}]`, value: e });
            }
        });
    });
    getArr(doc?.has_identifier).forEach((e: Identifier, i: number) => {
        if (isObj(e) && (e.id_category || e.id_value)) {
            rows.push({ type: 'identifier', path: `has_identifier[${i}]`, value: e });
        }
    });
    return rows;
}

function collectManifestations(doc: any): Row[] {
    const rows: Row[] = [];
    getArr(doc?.manifestations).forEach((m: any, mi: number) => {
        getArr(m?.same_as).forEach((e: NormRef, i: number) => {
            if (isObj(e) && (e.id || e.has_name || e.category)) {
                rows.push({ type: 'normref', path: `manifestations[${mi}].same_as[${i}]`, value: e });
            }
        });
        getArr(m?.has_record?.same_as).forEach((e: NormRef, i: number) => {
            if (isObj(e) && (e.id || e.has_name || e.category)) {
                rows.push({ type: 'normref', path: `manifestations[${mi}].has_record.same_as[${i}]`, value: e });
            }
        });
        getArr(m?.has_identifier).forEach((e: Identifier, i: number) => {
            if (isObj(e) && (e.id_category || e.id_value)) {
                rows.push({ type: 'identifier', path: `manifestations[${mi}].has_identifier[${i}]`, value: e });
            }
        });
        getArr(m?.is_manifestation_of).forEach((e: NormRef, i: number) => {
            if (isObj(e) && (e.id || e.has_name || e.category)) {
                rows.push({ type: 'normref', path: `manifestations[${mi}].is_manifestation_of[${i}]`, value: e });
            }
        });
    });
    return rows;
}

function collectItems(doc: any): Row[] {
    const rows: Row[] = [];
    getArr(doc?.manifestations).forEach((m: any, mi: number) => {
        getArr(m?.items).forEach((it: any, ii: number) => {
            getArr(it?.has_record?.same_as).forEach((e: NormRef, i: number) => {
                if (isObj(e) && (e.id || e.has_name || e.category)) {
                    rows.push({
                        type: 'normref',
                        path: `manifestations[${mi}].items[${ii}].has_record.same_as[${i}]`,
                        value: e
                    });
                }
            });
            getArr(it?.has_identifier).forEach((e: Identifier, i: number) => {
                if (isObj(e) && (e.id_category || e.id_value)) {
                    rows.push({
                        type: 'identifier',
                        path: `manifestations[${mi}].items[${ii}].has_identifier[${i}]`,
                        value: e
                    });
                }
            });
            getArr(it?.same_as).forEach((e: NormRef, i: number) => {
                if (isObj(e) && (e.id || e.has_name || e.category)) {
                    rows.push({
                        type: 'normref',
                        path: `manifestations[${mi}].items[${ii}].same_as[${i}]`,
                        value: e
                    });
                }
            });
        });
    });
    return rows;
}

const workEntries = computed(() => collectWork(props.doc));
const manifestationEntries = computed(() => collectManifestations(props.doc));
const itemEntries = computed(() => collectItems(props.doc));

const sections = computed(() => ({
    work: { entries: workEntries.value },
    manifestations: { entries: manifestationEntries.value },
    items: { entries: itemEntries.value }
}));

const hasAny = computed(
    () =>
        sections.value.work.entries.length +
      sections.value.manifestations.entries.length +
      sections.value.items.entries.length >
    0
);

const handle = computed(() => props.doc?.handle || props.doc?._source?.handle || '');
const kibana = computed(() => props.kibana);

const getK = (key: keyof NonNullable<typeof props.kibana>['views']) => props.kibana?.views?.[key];
</script>

<style scoped>
.font-mono { max-width: 40ch; }
</style>
