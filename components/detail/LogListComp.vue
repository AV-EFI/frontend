<template>
  <div class="p-4">
    <ul class="space-y-4">
      <li
        v-for="log in logs"
        :key="log.id"
        class="p-4 border rounded-lg shadow-md"
      >
        <div class="text-sm text-gray-500">
          {{ log.date }}
        </div>
        <div class="text-lg font-semibold">
          {{ log.message }}
        </div>
        <div :class="log.status === 'Success' ? 'text-green-500' : 'text-red-500'">
          {{ log.status }}
        </div>
        <div class="text-sm text-gray-700">
          Successful Dataset Imports: {{ log.successfulImports }}
        </div>
        <div class="text-sm text-gray-700">
          Created EFIs: {{ log.createdEfis }}
        </div>
        <div class="text-sm text-gray-700">
          Merged Datasets: {{ log.mergedDatasets }}
        </div>
        <button
          class="mt-2 text-blue-500 hover:underline"
          @click="toggleDetails(log.id)"
        >
          {{ log.showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
        <div
          v-if="log.showDetails"
          class="mt-2 text-sm text-gray-700"
        >
          <!-- Add more detailed information here if needed -->
          Detailed information about log entry {{ log.id }},
          Optional Download Link, ...
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const logs = ref(generateFakeLogs(20));

function generateFakeLogs(count) {
    const logs = [];
    for (let i = 1; i <= count; i++) {
        logs.push({
            id: i,
            date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleString(),
            message: `Import Log ${i}`,
            status: i % 2 === 0 ? 'Success' : 'Failure',
            successfulImports: Math.floor(Math.random() * 100),
            createdEfis: Math.floor(Math.random() * 50),
            mergedDatasets: Math.floor(Math.random() * 20),
            showDetails: false
        });
    }
    return logs;
}

function toggleDetails(id) {
    const log = logs.value.find(log => log.id === id);
    if (log) {
        log.showDetails = !log.showDetails;
    }
}
</script>