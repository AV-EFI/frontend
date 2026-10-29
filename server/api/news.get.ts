import { createError, defineEventHandler, getQuery, setHeader } from 'h3';
import { $fetch } from 'ofetch';
import { isNewsEnabled } from '~/utils/newsEnabled';
import { parseNewsFeed } from '../utils/newsFeed';

const DEFAULT_NEWS_FEED_URL = 'https://projects.tib.eu/av-efi/rss.xml';
const DEFAULT_NEWS_FEED_URL_EN = 'https://projects.tib.eu/av-efi/en/rss.xml';

const loadNews = defineCachedFunction(async (feedUrl: string) => {
  const xml = await $fetch<string, 'text'>(feedUrl, { responseType: 'text', timeout: 10_000, retry: 0 });
  return parseNewsFeed(xml);
}, { name: 'project-news', maxAge: 300, swr: false, getKey: (feedUrl: string) => feedUrl });

type NewsArticle = Awaited<ReturnType<typeof loadNews>>[number] & { language: 'de' | 'en' };

// The English feed only lists translated articles; untranslated ones stay German.
async function withEnglishTranslations(german: NewsArticle[], englishFeedUrl: string): Promise<NewsArticle[]> {
  let english: NewsArticle[];
  try {
    english = (await loadNews(englishFeedUrl)).map((article) => ({ ...article, language: 'en' as const }));
  } catch {
    return german;
  }
  const translated = new Set(english.map((article) => article.id));
  return [...english, ...german.filter((article) => !translated.has(article.id))]
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  if (!isNewsEnabled(config.public.newsEnabled)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' });
  }
  setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  const feedUrl = String(config.private?.newsFeedUrl || process.env.NEWS_FEED_URL || DEFAULT_NEWS_FEED_URL);
  const query = getQuery(event);
  let articles: NewsArticle[];
  try {
    const german = (await loadNews(feedUrl)).map((article) => ({ ...article, language: 'de' as const }));
    articles = query.locale === 'en'
      ? await withEnglishTranslations(german, String(config.private?.newsFeedUrlEn || process.env.NEWS_FEED_URL_EN || DEFAULT_NEWS_FEED_URL_EN))
      : german;
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'News feed unavailable' });
  }
  const limit = Number(query.limit);
  return Number.isInteger(limit) && limit > 0 ? articles.slice(0, limit) : articles;
});
