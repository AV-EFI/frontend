<template>
  <div class="p-4">
    <ul class="space-y-4">
      <li
        v-for="(group, status) in favouritesList"
        :key="status"
        class="p-4 border rounded-lg shadow-md bg-base-100 dark:bg-gray-800"
      >
        <div class="collapse collapse-arrow">
          <input
            type="checkbox"
            :checked="!collapsedGroups[status]"
            @change="toggleGroup(status)"
          >
          <div class="collapse-title text-xl font-semibold cursor-pointer dark:text-gray-200">
            {{ group.title }}
          </div>
          <div class="collapse-content">
            <div class="text-sm text-gray-700 dark:text-gray-400">
              Date: {{ group.date }}
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-400">
              Number of Items: {{ group.numberOfItems }}
            </div>
            <ul class="mt-2 space-y-2">
              <li
                v-for="log in group.items"
                :key="log.category + '-' + (log.has_primary_title?.has_name || 'unnamed')"
                class="p-4 border rounded-lg shadow-md bg-base-200 dark:bg-gray-700"
              >
                <div class="collapse collapse-arrow">
                  <input
                    type="checkbox"
                    :checked="!collapsedItems[log.category + '-' + (log.has_primary_title?.has_name || 'unnamed')]"
                    @change="toggleItem(log.category + '-' + (log.has_primary_title?.has_name || 'unnamed'))"
                  >
                  <div class="collapse-title text-sm text-gray-700 cursor-pointer dark:text-gray-300">
                    Category: {{ log.category }} - {{ log.has_primary_title?.has_name || 'Unnamed' }}
                  </div>
                  <div class="collapse-content grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Primary Title: {{ log.has_primary_title?.has_name || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Described By: {{ log.described_by?.has_issuer_name || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Has Event: {{ log.has_event?.map((event: any) => event.category).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Has Identifier: {{ log.has_identifier?.map((identifier: any) => identifier.category).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Has Source Key: {{ log.has_source_key?.join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Alternative Titles: {{ log.has_alternative_title?.map((title: any) => title.has_name).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700 dark:text-gray-400">
                      Category: {{ log.category }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MovingImageRecord } from '../../models/interfaces/schema/avefi_schema_type_utils';

// Define interfaces for better type safety
interface GroupData {
    title: string;
    date: string;
    items: MovingImageRecord[];
    numberOfItems: number;
}

const logs = ref<MovingImageRecord[]>([]);
const collapsedGroups = ref<Record<string, boolean>>({});
const collapsedItems = ref<Record<string, boolean>>({});

const favouritesList = computed(() => {
    const groups = logs.value.reduce((acc: Record<string, GroupData>, log: MovingImageRecord) => {
        const groupKey = log.category || 'Unknown';
        if (!acc[groupKey]) {
            acc[groupKey] = {
                title: groupKey,
                date: new Date().toLocaleDateString(), // Example date, you can modify as needed
                items: [],
                numberOfItems: 0
            };
        }
        acc[groupKey].items.push(log);
        return acc;
    }, {} as Record<string, GroupData>);

    // Add number of items property
    Object.values(groups).forEach((group: GroupData) => {
        group.numberOfItems = group.items.length;
    });

    // Initialize collapsedGroups state
    Object.keys(groups).forEach((key, index) => {
        collapsedGroups.value[key] = index !== 0;
    });

    return groups;
});

function toggleGroup(status: string) {
    collapsedGroups.value[status] = !collapsedGroups.value[status];
}

function toggleItem(id: string) {
    collapsedItems.value[id] = !collapsedItems.value[id];
}

function generateFakeData() {
    const fakeData: MovingImageRecord[] = [];
    for (let i = 1; i <= 25; i++) {
        const category = `Category${Math.ceil(i / 5)}`; // Group items by category
        fakeData.push({
            category: category,
            described_by: { 
                has_issuer_id: `issuer-${i}`, 
                has_issuer_name: `Issuer ${i}` 
            },
            has_event: [{ category: `Event${i}` }],
            has_identifier: [{ 
                id: `ID${i}`, 
                category: `Identifier${i}` 
            }],
            has_source_key: [`Key${i}`],
            has_alternative_title: [{ 
                has_name: `Alt Title ${i}`, 
                type: 'AlternativeTitle' 
            }],
            has_primary_title: { 
                has_name: `Primary Title ${i}`, 
                type: 'PreferredTitle' 
            }
        });
    }
    logs.value = fakeData;

    // Initialize collapsedItems state
    fakeData.forEach(log => {
        const key = log.category + '-' + (log.has_primary_title?.has_name || 'unnamed');
        collapsedItems.value[key] = true;
    });
}

generateFakeData();
</script>