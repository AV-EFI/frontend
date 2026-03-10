/* eslint-disable @typescript-eslint/no-explicit-any */
import { useObjectListStore } from '../stores/compareList';
import { useFavourites } from "../stores/favourites";

export default defineNuxtPlugin((nuxtApp) => {
    const useObjectStore = useObjectListStore();
    const favouritesStore = useFavourites();
    const $i18n:any = nuxtApp.$i18n || useNuxtApp().$i18n;
    const t = $i18n.t;
    const toast = nuxtApp.$toast;

    const addToComparison = ((filmId: string, filmTitle?: string, listType: string = 'compare'): void => {
        if (filmId) {
            if(listType == "favourites") {
                favouritesStore.addObject({ filmId, filmTitle })
                    .then((added) => {
                        if (added == "listfull") {
                            toast?.warn?.(t('favouritesfull'), { autoClose: 4000 });
                        }
                        else if (added == "already") {
                            toast?.warn?.(t('favouritesalready'), { autoClose: 3000 });
                        }
                        else if (added == "succ") {
                            toast?.success?.(t('addedtofavouritesparam', {'name': filmTitle}));
                        } else {
                            toast && toast('Something happened');
                        }
                    });

            } else {
                useObjectStore.addObject({ filmId, filmTitle })
                    .then((added) => {
                        if (added == "listfull") {
                            toast?.warn?.(t('comparisonfull'), { autoClose: 4000 });
                        }
                        else if (added == "already") {
                            toast?.warn?.(t('comparisonalready'), { autoClose: 3000 });
                        }
                        else if (added == "succ") {
                            toast?.success?.(t('addedtocomparisonparam', {'name': filmTitle}));
                        } else {
                            toast && toast('Something happened');
                        }
                    });
            }
        }
    });

    return {
        provide: {
            addToComparison: addToComparison,
            //ref by $toggleDrawerState
            toggleComparisonDrawerState: useObjectStore.toggleComparisonDrawerState,
            toggleFacetDrawerState: useObjectStore.toggleFacetDrawerState
        }
    };
});