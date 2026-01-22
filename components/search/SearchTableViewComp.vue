<template>
  <div class="overflow-x-auto w-full">
    <table class="table w-full table-zebra table-sm border border-base-300">
      <thead class="bg-base-200">
        <tr>
          <th></th>
          <th class="min-w-56">{{ $t('title') }}</th>
          <th>{{ $t('AlternativeTitle') }}</th>
          <th>{{ $t('country') }}</th>
          <th>{{ $t('year') }}</th>
          <th>{{ $t('directors_or_editors') }}</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="(work, widx) in datasets" :key="work.handle ?? widx">
          <!-- MAIN ROW -->
          <tr v-if="work?.has_record">
            <td>
              <button class="btn btn-xs btn-square btn-ghost" @click="toggleExpand(work.handle)">
                <Icon :name="expanded.has(work.handle)
                    ? 'tabler:chevron-up'
                    : 'tabler:chevron-down'" />
              </button>
            </td>
            <td class="h-full">
              <div class="flex flex-row items-center gap-x-1 h-full">
                <span>
                  {{
                    work.has_record.has_primary_title?.has_name
                    || work.handle
                  }}
                </span>
                <div class="btn btn-xs btn-outline btn-primary btn-circle">
                  <NuxtLink
                    target="_blank"
                    :to="`/res/${work.handle}`"
                    class="link link-light flex"
                    :aria-label="`${$t('detailedViewLinkFor')} ${work.has_record.has_primary_title?.has_name || work.handle}`"
                  >
                    <Icon class="text-xs dark:text-white" name="tabler:eye" />
                  </NuxtLink>
                </div>
              </div>
            </td>
            <td>
              <ul v-if="Array.isArray(work.has_record.has_alternative_title)" class="list-disc ml-2">
                <li v-for="alt in work.has_record.has_alternative_title" :key="alt.has_name">
                  {{ alt.has_name }}
                  <span v-if="alt.type"> ({{ $t(alt.type) }})</span>
                </li>
              </ul>
            </td>

            <td>
              <div v-for="loc in work.has_record.has_event?.[0]?.located_in || []" :key="loc.has_name">
                {{ loc.has_name }}
              </div>
            </td>

            <td>
              <span v-if="Array.isArray(work.years)">
                {{ work.years.join(', ') }}
              </span>
              <span v-else>
                {{ work.years }}
              </span>
            </td>

            <td>
              <template v-for="dir in work.directors_or_editors || []" :key="dir">
                <span>
                  {{ dir }}
                </span>
              </template>
            </td>
          </tr>

          <!-- EXPANDED -->
          <tr v-if="expanded.has(work.handle)" class="bg-base-100">
            <td></td>
            <td colspan="6">
              <div class="py-2 space-y-2">
                <!-- MANIFESTATION (single dense row, NO table) -->
                <div v-for="mf in work.manifestations || []" :key="mf.handle"
                  class="mb-3 border border-base-200 rounded px-2 py-1">
                  <!-- header line -->
                  <div class="flex items-center gap-2 text-xs mb-1">
                      <span class="text-xs font-semibold" >efi:</span>
                      <span>{{ mf.handle }}</span>
                      <MicroBadgeCategoryComp
                        :category="mf?.has_record?.category || 'avefi:Manifestation'"
                      />
                  </div>
                  <!-- icon-based metadata row -->
                  <SearchGenericIconList                   
                    :data="mf" 
                    level="manifestation" 
                  />
                  <h3 class="font-semibold mt-2">
                    {{ $t('items') }}
                  </h3>
                  <table v-if="mf.items?.length" class="table table-xs table-zebra w-full border border-base-300 mt-2">
                    <thead class="bg-base-200 text-xs">
                      <tr>
                        <th>efi</th>
                        <th>{{ $t('has_access_status') }}</th>
                        <th>{{ $t('has_format') }}</th>
                        <th>{{ $t('item_element_type') }}</th>
                        <th>{{ $t('has_language') }}</th>
                        <th>{{ $t('has_sound_type') }}</th>
                        <th>{{ $t('has_colour') }}</th>
                        <th>{{ $t('has_duration') }}</th>
                        <th>{{ $t('has_extent') }}</th>
                        <th>{{ $t('has_frame_rate') }}</th>
                        <th>{{ $t('has_webresource') }}</th>
                        <th>{{ $t('detailedView') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in mf.items" :key="item.handle" class="text-xs">
                        <td>{{ item.handle }}</td>
                        <td>{{ item.has_record?.has_access_status ? $t(item.has_record.has_access_status) : '—' }}</td>

                        <td>
                          {{
                          (Array.isArray(item.has_record?.has_format)
                          ? item.has_record.has_format.map(f => $t(f.type)).join(', ')
                          : '')
                          || '—'
                          }}
                        </td>

                        <td>{{ item.has_record?.element_type ? $t(item.has_record.element_type) : '—' }}</td>

                        <td>
                          {{
                          (Array.isArray(item.has_record?.in_language)
                          ? item.has_record.in_language.map(l => $t(l.code || l)).join(', ')
                          : '')
                          || '—'
                          }}
                        </td>

                        <td>{{ item.has_record?.has_sound_type ? $t(item.has_record.has_sound_type) : '—' }}</td>

                        <td>{{ item.has_record?.has_colour_type ? $t(item.has_record.has_colour_type) : '—' }}</td>

                        <td>
                          {{
                          item.has_record?.has_duration?.has_value
                          ? formatDuration(item.has_record.has_duration.has_value)
                          : '—'
                          }}
                        </td>

                        <td>
                          {{
                          item.has_record?.has_extent?.has_value
                          ? `${item.has_record.has_extent.has_value} ${item.has_record.has_extent.has_unit || ''}`
                          : '—'
                          }}
                        </td>
                        <td>{{ $t(item.has_record?.has_frame_rate || '—') }}</td>
                        <td>
                          <div v-for="has_web in item.has_record?.has_webresource || []" :key="has_web">
                            <a class="link link-primary" :href="has_web || '#'">
                              {{ $t('webresource') }}
                            </a>
                          </div>
                        </td>
                        <td>
                          <NuxtLink
                            target="_blank"
                            :to="`/res/${item.handle}`"
                            class="link link-primary"
                          >
                            {{ $t('detailviewlink') }}
                          </NuxtLink>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                </div>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IAVefiWorkVariant } from '@/models/interfaces/search/IAVefiWorkVariant';

defineProps<{ datasets: IAVefiWorkVariant[] }>();

const expanded = ref(new Set<string>());

function toggleExpand(handle: string) {
    expanded.value.has(handle)
        ? expanded.value.delete(handle)
        : expanded.value.add(handle);
}

function formatDuration(has_value: any): string {
    if (has_value) {
        try {
            const duration = has_value
                .replace(/PT/g, '')
                .replace(/S/g, '')
                .replace(/M/g, ':')
                .replace(/H/g, ':')
                .split(':');
            duration[0] = String(duration[0]).padStart(2, '0');
            if (duration.length > 1) duration[1] = String(duration[1]).padStart(2, '0');
            return duration.join(':');
        } catch (error) {
            console.error('Error formatting duration:', error);
            return String(has_value);
        }
    }
    return has_value;
}
</script>
