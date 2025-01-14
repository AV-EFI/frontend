<template>
  <div class="p-4">
    <ul class="space-y-4">
      <li
        v-for="(group, status) in favouritesList"
        :key="status"
        class="p-4 border rounded-lg shadow-md bg-base-100"
      >
        <div class="collapse collapse-arrow">
          <input
            type="checkbox"
            :checked="!collapsedGroups[status]"
            @change="toggleGroup(status)"
          >
          <div class="collapse-title text-xl font-semibold cursor-pointer">
            {{ group.title }}
          </div>
          <div class="collapse-content">
            <div class="text-sm text-gray-700">
              Date: {{ group.date }}
            </div>
            <div class="text-sm text-gray-700">
              Number of Items: {{ group.numberOfItems }}
            </div>
            <ul class="mt-2 space-y-2">
              <li
                v-for="log in group.items"
                :key="log.id"
                class="p-4 border rounded-lg shadow-md bg-base-200"
              >
                <div class="collapse collapse-arrow">
                  <input
                    type="checkbox"
                    :checked="!collapsedItems[log.id]"
                    @change="toggleItem(log.id)"
                  >
                  <div class="collapse-title text-sm text-gray-700 cursor-pointer">
                    ID: {{ log.id }} - {{ log.has_primary_title.title }}
                  </div>
                  <div class="collapse-content grid grid-cols-2 gap-4">
                    <div class="text-sm text-gray-700">
                      Title: {{ log.title }}
                    </div>
                    <div class="text-sm text-gray-700">
                      Described By: {{ log.described_by?.description || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700">
                      Has Event: {{ log.has_event?.map(event => event.name).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700">
                      Has Identifier: {{ log.has_identifier?.map(identifier => identifier.id).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700">
                      Has Source Key: {{ log.has_source_key?.join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700">
                      In Language: {{ log.in_language?.map(language => language.name).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700">
                      Has Alternative Title: {{ log.has_alternative_title?.map(title => title.title).join(', ') || 'N/A' }}
                    </div>
                    <div class="text-sm text-gray-700">
                      Has Primary Title: {{ log.has_primary_title.title }}
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
import type { MovingImageRecord } from 'models/interfaces/av_efi_schema.ts';

const logs = ref<MovingImageRecord[]>([]);
const collapsedGroups = ref<Record<string, boolean>>({});
const collapsedItems = ref<Record<number, boolean>>({});

const favouritesList = computed(() => {
    const groups = logs.value.reduce((acc, log) => {
        if (!acc[log.title]) {
            acc[log.title] = {
                title: log.title,
                date: new Date().toLocaleDateString(), // Example date, you can modify as needed
                items: []
            };
        }
        acc[log.title].items.push(log);
        return acc;
    }, {} as Record<string, { title: string, date: string, items: MovingImageRecord[] }>);

    // Add number of items property
    Object.values(groups).forEach(group => {
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

function toggleItem(id: number) {
    collapsedItems.value[id] = !collapsedItems.value[id];
}

function generateFakeData() {
    const fakeData: MovingImageRecord[] = [];
    for (let i = 1; i <= 25; i++) {
        const title = `List Title ${Math.ceil(i / 5)}`; // Group items by title
        fakeData.push({
            id: i,
            title: title,
            described_by: { description: `Description ${i}` },
            has_event: [{ name: `Event ${i}` }],
            has_identifier: [{ id: `ID${i}` }],
            has_source_key: [`Key${i}`],
            in_language: [{ name: i % 2 === 0 ? 'English' : 'Deutsch' }],
            has_alternative_title: [{ title: `Alt Title ${i}` }],
            has_primary_title: { title: `Primary Title ${i}` }
        });
    }
    logs.value = fakeData;

    // Initialize collapsedItems state
    fakeData.forEach(log => {
        collapsedItems.value[log.id] = true;
    });
}

generateFakeData();
</script>