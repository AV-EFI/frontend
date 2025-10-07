<template>
  <div>
    <input
      v-model="newObjectName"
      type="text"
      :placeholder="$t('enterobjectname')"
    >
    <button
      :title="$t('addtocomparison')"
      class="btn btn-primary"
      @click="addObject"
    >
      {{ $t('addtocomparison') }}
    </button>
    
    <ul>
      <li
        v-for="(object, index) in objectListStore?.objects || []"
        :key="index"
      >
        {{ object.filmTitle }}
        <button
          :title="$t('remove').toUpperCase()"
          class="btn btn-warning"
          @click="removeObject(index)"
        >
          {{ $t('remove').toUpperCase() }}
        </button>
      </li>
    </ul>

    <button
      :title="$t('clearalllist')"
      class="btn btn-error"
      @click="removeAllObjects"
    >
      {{ $t('clearalllist') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {useObjectListStore} from '../../stores/compareList';

const objectListStore = ref();
let newObjectName = '';

onMounted(() => {
    try {
        objectListStore.value = useObjectListStore();
    } catch (error) {
        console.warn('Store not available yet:', error);
    }
});

const addObject = () => {
    if (newObjectName.trim() !== '' && objectListStore.value) {
        objectListStore.value.addObject({ filmId: "1", filmTitle: newObjectName });
        newObjectName = ''; // Clear input field after adding object
    }
};

const removeObject = (index: number) => {
    if (objectListStore.value) {
        objectListStore.value.removeObject(index);
    }
};

const removeAllObjects = () => {
    if (objectListStore.value) {
        objectListStore.value.removeAllObjects();
        console.log('Objects after removal:', objectListStore.value.objects);
    }
};
</script>
