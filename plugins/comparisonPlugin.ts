/* eslint-disable @typescript-eslint/no-explicit-any */
import { useObjectListStore } from '../stores/compareList';
import { useFavourites } from "../stores/favourites";

type ToastMethod = (message: unknown, options?: Record<string, unknown>) => unknown;
type ToastLike = {
  warn?: ToastMethod;
  success?: ToastMethod;
  error?: ToastMethod;
};

export default defineNuxtPlugin((nuxtApp) => {
  const useObjectStore = useObjectListStore();
  const favouritesStore = useFavourites();
  const $i18n:any = nuxtApp.$i18n || useNuxtApp().$i18n;
  const t = (key: string, params?: Record<string, unknown>) => $i18n.t(key, params);
  const getToast = () => nuxtApp.$toast as ToastLike | undefined;

  const addToComparison = ((filmId: string, filmTitle?: string, listType: string = 'compare'): void => {
    if (filmId) {
      if(listType == "favourites") {
        favouritesStore.addObject({ filmId, filmTitle })
          .then((added) => {
            if (added == "listfull") {
              getToast()?.warn?.(t('favouritesfull'), { autoClose: 4000 });
            }
            else if (added == "already") {
              getToast()?.warn?.(t('favouritesalready'), { autoClose: 3000 });
            }
            else if (added == "succ") {
              getToast()?.success?.(t('addedtofavouritesparam', {'name': filmTitle}));
            } else {
              getToast()?.error?.(t('unexpectedError'));
            }
          });

      } else {
        useObjectStore.addObject({ filmId, filmTitle })
          .then((added) => {
            if (added == "listfull") {
              getToast()?.warn?.(t('comparisonfull'), { autoClose: 4000 });
            }
            else if (added == "already") {
              getToast()?.warn?.(t('comparisonalready'), { autoClose: 3000 });
            }
            else if (added == "succ") {
              getToast()?.success?.(t('addedtocomparisonparam', {'name': filmTitle}));
            } else {
              getToast()?.error?.(t('unexpectedError'));
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
