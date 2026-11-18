import { computed } from 'vue';
import { useRoute, useState } from '#app';
import filmQuotesData from '~/data/film-quotes.json';

export type FilmQuoteErrorType = '404' | '500';

/**
 * Picks a random film quote for an error page, once per page call.
 * The pick is stored in Nuxt state, so the browser shows the quote the server rendered instead of
 * drawing a different one during hydration. The key includes the URL, so every error page call
 * gets a new pick, also after a client-side navigation.
 */
export function useRandomFilmQuote(errorType: FilmQuoteErrorType) {
  const quotes = filmQuotesData.films.flatMap((film) => film.quotes
    .filter((quote) => quote.errorType === errorType)
    .map((quote) => ({
      text: quote.text,
      film: film.film,
      year: film.year,
      avefiUrl: film.avefiUrl,
      wikiquoteUrl: film.wikiquoteUrl,
      license: film.license,
    })));

  const route = useRoute();
  const quoteIndex = useState(`film-quote-${errorType}-${route.fullPath}`, () => Math.floor(Math.random() * quotes.length));

  return computed(() => quotes[quoteIndex.value] ?? null);
}
