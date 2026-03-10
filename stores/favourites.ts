import { defineStore } from 'pinia';

// Define the structure of each object in the list
interface ObjectItem {
  filmTitle?: string;
  filmId: string;
  // Add more properties as needed
}

// Define the state shape of the store
interface FavouritesState {
  objects: ObjectItem[];
  comparisonDrawerOpen: boolean;
  facetDrawerOpen: boolean;
}

// Define and export the store
export const useFavourites = defineStore({
  id: 'favourites',
  state: (): FavouritesState => ({
    objects: [],
    comparisonDrawerOpen: false as boolean,
    facetDrawerOpen: false as boolean,
  }),
  getters: {
    getObjectIds(): string[] {
      return this.objects.map((i) => i.filmId);
    },
  },
  actions: {
    // Ensure objects are always ObjectItem[] after hydration
    hydrateObjects() {
      if (Array.isArray(this.objects) && this.objects.length > 0 && typeof this.objects[0] === 'string') {
        this.objects = this.objects.map((id: string) => ({ filmId: id, filmTitle: '' }));
      }
    },
    async addObject(object: ObjectItem): Promise<string> {
      this.hydrateObjects();
      if (this.objects.length >= 10) {
        return 'listfull';
      }
      const existingObject = this.objects.find((obj) => obj.filmId === object.filmId);
      if (!existingObject) {
        this.objects.push(object);
        return 'succ';
      }
      return 'already';
    },
    removeObject(index: number): void {
      this.hydrateObjects();
      this.objects.splice(index, 1);
    },
    removeAllObjects(): void {
      this.hydrateObjects();
      this.objects = [];
    },
    removeObjectById(id: string): void {
      this.hydrateObjects();
      const index = this.objects.findIndex((object) => object.filmId === id);
      if (index !== -1) {
        this.objects.splice(index, 1);
      }
    },
    toggleFacetDrawerState() {
      this.hydrateObjects();
      this.facetDrawerOpen = !this.facetDrawerOpen;
    },
    toggleComparisonDrawerState() {
      this.hydrateObjects();
      this.comparisonDrawerOpen = !this.comparisonDrawerOpen;
    },
  },
  persist: {
    key: 'avefi-favourites',
    storage: persistedState.localStorage,
  },
});
