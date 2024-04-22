import { toast } from "vue3-toastify";

export default defineNuxtPlugin(() => {

    const useObjectStore = useObjectListStore();

    const $addToComparison = ((filmId: number, filmTitle?: string): void => {
        if (filmId) {
            useObjectStore.addObject({ filmId, filmTitle })
                .then((added) => {
                    if (added == "listfull") {
                        toast.warn('Comparison already contains two items');
                    }
                    else if (added == "already") {
                        toast.warn('Item already in comparison', { autoClose: 3000 });
                    }
                    else if (added == "succ") {
                        toast.success("Item added to comparison");
                    } else {
                        toast('Something happened');
                    }
                });
            /*
        const t = setTimeout(() => {
            useObjectStore.toggleDrawerState();
            clearTimeout(t);
        }, 300);
        */
        }
    });

    return {
        provide: {
            addToComparison: $addToComparison,
            //ref by $toggleDrawerState
            toggleDrawerState: useObjectStore.toggleDrawerState
        }
    };
});