<template>
  <div class="drawer drawer-end">
    <input
      id="comparison_drawer"
      type="checkbox"
      class="drawer-toggle"
      :checked="objectListStore.drawerOpen"
    >
    <div class="drawer-side z-20">
      <label
        aria-label="close sidebar"
        class="drawer-overlay z-99"
        @click="toggleDrawer"
      />
      <div class="menu p-4 w-96 min-h-full bg-base-100 text-base-content">
        <div class="w-100 flex flex-row p-2">
          <button 
            class="btn btn-outline btn-ghost w-1/3"
            title="Close drawer"
            @click="$toggleDrawerState"
          >
            <Icon name="fa-regular:window-close" />
          </button>
          <button
            title="Go to comp"
            class="btn btn-outline w-2/3"
            :class="objectListStore.objects.length != 2 && 'btn-disabled'"
            @click="navigateToComparison"
          >
            <Icon name="fa-regular:object-group" />
          </button>
        </div>
        <ul class="mt-2 p-2">
          <li
            v-for="(object, index) in objectListStore.objects"
            :key="index"
            class="text-lg mt-2 border-2 rounded-xl border-zinc-300 p-3"
          >
            {{ object.filmTitle }}
            <button
              :title="`Remove '${object.filmTitle}' from comparison`"
              class="btn btn-warning"
              @click="removeObject(index)"
            >
              Remove
            </button>
          </li>
        </ul>
        <div class="mt-2 p-2">
          <button
            class="btn btn-danger btn-block"
            title="Clear comparison"
            @click="removeAllObjects"
          >
            Clear
          </button>
        </div>
        <div>
          {{ objectListStore.getObjectIds }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const objectListStore = useObjectListStore();
const toggleDrawer = (() => {
    objectListStore.drawerOpen = !objectListStore.drawerOpen;
});

const removeObject = (index) => {
    objectListStore.removeObject(index);
};

const removeAllObjects = () => {
    console.log("removeAll");
    objectListStore.removeAllObjects();
    console.log('Objects after removal:', objectListStore.objects);
};

const navigateToComparison = () => {
    const objectIds: number[] = objectListStore.getObjectIds;
    if(objectIds.length == 2) {
        navigateTo(`/protected/compare?compare=[${objectIds[0]},${objectIds[1]}]`);
    }
};
</script>
