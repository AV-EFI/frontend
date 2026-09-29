import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

export type NewsArticle = {
  id: string;
  title: string;
  link: string;
  preview: string;
  content: string;
  publishedAt: string | null;
};

export function useNews(options: { limit?: MaybeRefOrGetter<number> } = {}) {
  const limit = options.limit === undefined ? undefined : toValue(options.limit);
  return useFetch<NewsArticle[]>('/api/news', {
    key: limit === undefined ? 'news-all' : `news-limit-${limit}`,
    query: limit === undefined ? undefined : { limit },
  });
}
