<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">{{ $t('githubProjectExport') }}</h1>
      
      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold mb-2">{{ $t('githubUserStories') }}</h2>
            <p class="text-gray-600 dark:text-gray-300">
              Export user stories and project items from the AV-EFI GitHub project board.
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Source: <a 
                href="https://github.com/orgs/AV-EFI/projects/1" 
                target="_blank" 
                class="link link-primary"
              >
                https://github.com/orgs/AV-EFI/projects/1
              </a>
            </p>
          </div>
          <div class="ml-4 flex flex-col gap-2">
            <GitHubProjectExportComp 
              :show-label="true" 
              btn-size="btn-md"
              :fixed-with="true"
            />
            <div class="text-xs text-center text-gray-500 dark:text-gray-400">
              GitHub Project Export
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Project Board Preview</h3>
        
        <div v-if="loading" class="flex items-center justify-center py-8">
          <Icon name="formkit:spinner" class="w-8 h-8 animate-spin mr-2" />
          <span>{{ $t('loadingGithubProject') }}</span>
        </div>

        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <Icon name="formkit:alert" class="w-5 h-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h4 class="text-sm font-medium text-red-800">Error loading project board</h4>
              <p class="text-sm text-red-600 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>

        <div v-else-if="projectData">
          <div class="mb-4">
            <h4 class="font-medium">{{ projectData.project?.title }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ projectData.project?.shortDescription }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Loaded: {{ new Date(projectData.timestamp).toLocaleString() }}
            </p>
          </div>

          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>State</th>
                  <th>Assignees</th>
                  <th>Labels</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="item in previewItems" 
                  :key="item.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td>
                    <span class="badge badge-outline">{{ item.type }}</span>
                  </td>
                  <td>
                    <a 
                      v-if="item.content?.url" 
                      :href="item.content.url" 
                      target="_blank"
                      class="link link-primary"
                    >
                      {{ item.content?.title }}
                    </a>
                    <span v-else>{{ item.content?.title }}</span>
                  </td>
                  <td>
                    <span 
                      v-if="item.content?.state"
                      class="badge"
                      :class="{
                        'badge-success': item.content.state === 'OPEN',
                        'badge-error': item.content.state === 'CLOSED',
                        'badge-warning': item.content.state === 'DRAFT'
                      }"
                    >
                      {{ item.content?.state }}
                    </span>
                  </td>
                  <td>
                    <span class="text-sm">
                      {{ item.content?.assignees?.nodes?.map(a => a.name || a.login).join(', ') || '-' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex flex-wrap gap-1">
                      <span 
                        v-for="label in item.content?.labels?.nodes || []"
                        :key="label.name"
                        class="badge badge-xs"
                        :style="{ backgroundColor: `#${label.color}`, color: getContrastColor(label.color) }"
                      >
                        {{ label.name }}
                      </span>
                    </div>
                  </td>
                  <td class="text-sm">
                    {{ item.content?.createdAt ? new Date(item.content.createdAt).toLocaleDateString() : '-' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="totalItems > 10" class="mt-4 text-center">
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Showing first 10 of {{ totalItems }} items. Export to see all items.
            </p>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <button 
            class="btn btn-primary"
            @click="loadProjectData"
          >
            Load Project Board
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const { fetchProjectBoard } = useGithubProject();

definePageMeta({
  auth: false,
  layout: 'default'
});

const projectData = ref(null);
const loading = ref(false);
const error = ref(null);

const previewItems = computed(() => {
  return projectData.value?.project?.items?.nodes?.slice(0, 10) || [];
});

const totalItems = computed(() => {
  return projectData.value?.project?.items?.nodes?.length || 0;
});

const loadProjectData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    projectData.value = await fetchProjectBoard();
  } catch (err: any) {
    error.value = err.message || 'Failed to load project board';
    console.error('Error loading project board:', err);
  } finally {
    loading.value = false;
  }
};

const getContrastColor = (hexColor: string) => {
  // Simple contrast calculation - return black or white based on brightness
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

// Auto-load project data on mount
onMounted(() => {
  loadProjectData();
});
</script>