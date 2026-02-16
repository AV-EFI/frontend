/* eslint-disable @typescript-eslint/no-explicit-any */
import { useObjectListStore } from '../stores/compareList';
import { useShoppingCart } from "../stores/shoppingCart";

export default defineNuxtPlugin((nuxtApp) => {
    const useObjectStore = useObjectListStore();
    const shoppingCartStore = useShoppingCart();
    const $i18n:any = nuxtApp.$i18n || useNuxtApp().$i18n;
    const t = $i18n.t;
    const toast = nuxtApp.$toast;

    const addToComparison = ((filmId: string, filmTitle?: string, listType: string = 'compare'): void => {
        if (filmId) {
            if(listType == "shoppingcart") {
                shoppingCartStore.addObject({ filmId, filmTitle })
                    .then((added) => {
                        if (added == "listfull") {
                            toast?.warn?.(t('shoppingcartfull'), { autoClose: 4000 });
                        }
                        else if (added == "already") {
                            toast?.warn?.(t('shoppingcartalready'), { autoClose: 3000 });
                        }
                        else if (added == "succ") {
                            toast?.success?.(t('addedtoshoppingcartparam', {'name': filmTitle}));
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