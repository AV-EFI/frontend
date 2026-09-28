import { createError, defineEventHandler, setHeader } from 'h3';
import { $fetch } from 'ofetch';
import { isNewsEnabled } from '~/utils/newsEnabled';
import { NEWS_FEED_URL, parseNewsFeed } from '../utils/newsFeed';

const loadNews = defineCachedFunction(async () => {
  const xml = await $fetch<string, 'text'>(NEWS_FEED_URL, { responseType: 'text', timeout: 10_000, retry: 0 });
  return parseNewsFeed(xml);
}, { name: 'project-news', maxAge: 300, swr: false });

export default defineEventHandler(async (event) => {
  if (!isNewsEnabled(useRuntimeConfig(event).public.newsEnabled)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  try {
    return await loadNews();
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'News feed unavailable' });
  }
});
