<template>
  <div>
    <input
      v-model="newObjectName"
      type="text"
      placeholder="Enter object name"
    >
    <button
      title="Add to comparison"
      class="btn btn-primary"
      @click="addObject"
    >
      Add to Comparison
    </button>
    
    <ul>
      <li
        v-for="(object, index) in objectListStore.objects"
        :key="index"
      >
        {{ object.filmTitle }}
        <button
          title="Remove"
          class="btn btn-warning"
          @click="removeObject(index)"
        >
          Remove
        </button>
      </li>
    </ul>

    <button
      title="Clear all"
      class="btn btn-error"
      @click="removeAllObjects"
    >
      Clear All
    </button>
  </div>
</template>

<script setup lang="ts">
//import { useObjectListStore } from '@/store';

const objectListStore = useObjectListStore();
//const objects = objectListStore.objects;
let newObjectName = '';

const addObject = () => {
    if (newObjectName.trim() !== '') {
        objectListStore.addObject({ filmId: 1, filmTitle: newObjectName });
        newObjectName = ''; // Clear input field after adding object
    }
};

const removeObject = (index) => {
    objectListStore.removeObject(index);
};

const removeAllObjects = () => {
    console.log("removeAll");
    objectListStore.removeAllObjects();
    console.log('Objects after removal:', objectListStore.objects);
};
</script>
