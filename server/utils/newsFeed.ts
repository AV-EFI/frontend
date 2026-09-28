import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sanitizeHtml from 'sanitize-html';

export const NEWS_FEED_URL = 'https://projects.tib.eu/av-efi/rss.xml';
const PROJECT_URL = 'https://projects.tib.eu/av-efi/';

function webUrl(value: string): string {
  try {
    const url = new URL(value, PROJECT_URL);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function cleanHtml(value: string): string {
  return sanitizeHtml(value, {
    allowedTags: ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'blockquote', 'a', 'h2', 'h3', 'h4'],
    allowedAttributes: { a: ['href'] },
    allowedSchemes: ['https', 'http'],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tag, attributes) => ({ tagName: 'a', attribs: { href: attributes.href ? webUrl(attributes.href) : '' } }),
    },
  });
}

const text = (value: unknown): string => typeof value === 'string' ? value : '';

export function parseNewsFeed(xml: string) {
  // RSS does not need DTDs; reject them before entity processing.
  if (/<!DOCTYPE/i.test(xml) || XMLValidator.validate(xml) !== true) {
    throw new Error('Invalid RSS feed');
  }
  const parsed = new XMLParser({ parseTagValue: false, trimValues: true }).parse(xml);
  const channel = parsed?.rss?.channel;
  if (channel === '') return [];
  if (!channel || typeof channel !== 'object') throw new Error('Missing RSS channel');
  const items: Record<string, unknown>[] = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];
  return items.flatMap((item) => {
    const title = text(item.title);
    const link = text(item.link) ? webUrl(text(item.link)) : '';
    if (!title || !link) return [];
    const content = cleanHtml(text(item['content:encoded']) || text(item.description));
    const preview = cleanHtml(text(item.description)) || content.match(/^<p>[\s\S]*?<\/p>/)?.[0] || '';
    const timestamp = Date.parse(text(item.pubDate));
    return [{
      id: text(item.guid) || link,
      title,
      link,
      preview,
      content,
      publishedAt: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null,
    }];
  }).sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
}
