import { defineStore } from 'pinia';

// Define the structure of each object in the list
interface ObjectItem {
    filmTitle?: string;
    filmId: string;
    // Add more properties as needed
}

// Define the state shape of the store
interface ObjectListState {
    objects: ObjectItem[];
    comparisonDrawerOpen: boolean;
    facetDrawerOpen: boolean;
}

// Define and export the store
export const useObjectListStore = defineStore({
    id: 'objectList',
    state: (): ObjectListState => ({
        objects: [],
        comparisonDrawerOpen: false as boolean,
        facetDrawerOpen: false as boolean
    }),
    getters: {
        getObjectIds(): string[] {
            const objectIds = this.objects.map((i) => {
                return i.filmId;
            });
            return objectIds;
        }
    },
    actions: {
        async addObject(object: ObjectItem): Promise<String> {
            if (this.objects.length >= 2) {
                return "listfull";
            }
            const existingObject = this.objects.find(obj => obj.filmId === object.filmId);
            if (!existingObject) {
                // If no object with the same ID exists, add the new object
                this.objects.push(object);
                return "succ";
            }
            console.error("Already added");
            return "already";
        },
        removeObject(index: number): void {
            this.objects.splice(index, 1);
        },
        removeAllObjects(): void {
            this.objects = [];
        },
        removeObjectById(id: string): void {
            const index = this.objects.findIndex(object => object.filmId === id);
            if (index !== -1) {
                this.objects.splice(index, 1);
            }
        },
        toggleFacetDrawerState() {
            //this.comparisonDrawerOpen = !this.comparisonDrawerOpen;
            this.facetDrawerOpen = !this.facetDrawerOpen;
        },
        toggleComparisonDrawerState() {
            this.comparisonDrawerOpen = !this.comparisonDrawerOpen;
        }
    },
    persist: {
        key: 'avefi-objectList',
        storage: persistedState.sessionStorage,
    }
});
