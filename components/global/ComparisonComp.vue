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
        v-for="(object, index) in objectListStore.objects"
        :key="index"
      >
        {{ object.filmTitle }}
        <button
          :title="$t('remove').toUpperCase"
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
import {useObjectListStore} from '../../stores/compareList';
const objectListStore = useObjectListStore();
//const objects = objectListStore.objects;
let newObjectName = '';

const addObject = () => {
    if (newObjectName.trim() !== '') {
        objectListStore.addObject({ filmId: "1", filmTitle: newObjectName });
        newObjectName = ''; // Clear input field after adding object
    }
};

const removeObject = (index) => {
    objectListStore.removeObject(index);
};

const removeAllObjects = () => {
    objectListStore.removeAllObjects();
    console.log('Objects after removal:', objectListStore.objects);
};
</script>
