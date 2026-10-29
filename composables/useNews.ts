import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

export type NewsArticle = {
  id: string;
  title: string;
  link: string;
  preview: string;
  content: string;
  publishedAt: string | null;
  language: 'de' | 'en';
};

export function useNews(options: { limit?: MaybeRefOrGetter<number>; locale: MaybeRefOrGetter<string> }) {
  const limit = options.limit === undefined ? undefined : toValue(options.limit);
  return useFetch<NewsArticle[]>('/api/news', {
    key: limit === undefined ? 'news-all' : `news-limit-${limit}`,
    query: computed(() => ({ limit, locale: toValue(options.locale) })),
  });
}
