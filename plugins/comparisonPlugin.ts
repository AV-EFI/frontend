import { toast } from "vue3-toastify";
import {useObjectListStore} from '../stores/compareList';

export default defineNuxtPlugin((nuxtApp) => {
    const useObjectStore = useObjectListStore();

    const $i18n:any = nuxtApp.$i18n;
    const t = $i18n.t;

    const $addToComparison = ((filmId: string, filmTitle?: string): void => {
        if (filmId) {
            useObjectStore.addObject({ filmId, filmTitle })
                .then((added) => {
                    if (added == "listfull") {
                        toast.warn(t('comparisonfull'), { autoClose: 4000 });
                    }
                    else if (added == "already") {
                        toast.warn(t('comparisonalready'), { autoClose: 3000 });
                    }
                    else if (added == "succ") {
                        toast.success(t('addedtocomparisonparam', {'name': filmTitle}));
                    } else {
                        toast('Something happened');
                    }
                });
        }
    });

    return {
        provide: {
            addToComparison: $addToComparison,
            //ref by $toggleDrawerState
            toggleComparisonDrawerState: useObjectStore.toggleComparisonDrawerState,
            toggleFacetDrawerState: useObjectStore.toggleFacetDrawerState
        }
    };
});