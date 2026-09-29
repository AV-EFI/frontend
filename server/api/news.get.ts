import { createError, defineEventHandler, getQuery, setHeader } from 'h3';
import { $fetch } from 'ofetch';
import { isNewsEnabled } from '~/utils/newsEnabled';
import { parseNewsFeed } from '../utils/newsFeed';

const DEFAULT_NEWS_FEED_URL = 'https://projects.tib.eu/av-efi/rss.xml';

const loadNews = defineCachedFunction(async (feedUrl: string) => {
  const xml = await $fetch<string, 'text'>(feedUrl, { responseType: 'text', timeout: 10_000, retry: 0 });
  return parseNewsFeed(xml);
}, { name: 'project-news', maxAge: 300, swr: false, getKey: (feedUrl: string) => feedUrl });

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!isNewsEnabled(config.public.newsEnabled)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  const feedUrl = String(config.private?.newsFeedUrl || process.env.NEWS_FEED_URL || DEFAULT_NEWS_FEED_URL);
  let articles;
  try {
    articles = await loadNews(feedUrl);
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'News feed unavailable' });
  }
  const limit = Number(getQuery(event).limit);
  return Number.isInteger(limit) && limit > 0 ? articles.slice(0, limit) : articles;
});
