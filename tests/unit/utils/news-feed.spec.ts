import { describe, expect, it } from 'vitest';
import { parseNewsFeed } from '~/server/utils/newsFeed';
import { isNewsEnabled } from '~/utils/newsEnabled';

const feed = (items: string) => `<rss><channel>${items}</channel></rss>`;
const item = (extra = '') => `<item><title>News &amp; updates</title><link>https://projects.tib.eu/av-efi/news/one</link>${extra}</item>`;

describe('project news feed', () => {
  it('reads TYPO3 summaries, full text, dates and identifiers', () => {
    const [article] = parseNewsFeed(feed(item('<guid>news-1</guid><pubDate>Mon, 18 May 2026 06:01:00 +0000</pubDate><description>Preview</description><content:encoded><![CDATA[<p>Full <strong>text</strong></p>]]></content:encoded>')));
    expect(article).toMatchObject({ id: 'news-1', title: 'News & updates', preview: 'Preview', content: '<p>Full <strong>text</strong></p>', publishedAt: '2026-05-18T06:01:00.000Z' });
  });

  it('removes active content and unsafe links while preserving safe relative links', () => {
    const [article] = parseNewsFeed(feed(item('<content:encoded><![CDATA[<script>alert(1)</script><p onclick="evil()">Text<img src=x onerror="evil()"><a href="javascript:evil()">bad</a><a href="/av-efi/materials" target="_blank">good</a></p>]]></content:encoded>')));
    if (!article) throw new Error('Expected a parsed article');
    expect(article.content).not.toMatch(/script|onclick|onerror|<img|target=/);
    expect(article.content).toContain('href="https://projects.tib.eu/av-efi/materials"');
    expect(article.preview).toBe(article.content);
  });

  it('handles empty feeds, missing descriptions, invalid dates and unsafe item URLs', () => {
    expect(parseNewsFeed(feed(''))).toEqual([]);
    expect(parseNewsFeed(feed(item('<pubDate>bad</pubDate>')))[0]).toMatchObject({ preview: '', content: '', publishedAt: null });
    expect(parseNewsFeed(feed('<item><title>Bad</title><link>javascript:evil()</link></item>'))).toEqual([]);
  });

  it('rejects malformed XML, non-RSS responses and DTDs', () => {
    for (const xml of ['<rss>', '<html>Unavailable</html>', '<!DOCTYPE rss><rss><channel /></rss>']) {
      expect(() => parseNewsFeed(xml)).toThrow();
    }
  });

  it('orders dated entries newest first and undated entries last', () => {
    const articles = parseNewsFeed(feed(item() + item('<pubDate>2024-01-01</pubDate>') + item('<pubDate>2026-01-01</pubDate>')));
    expect(articles.map(article => article.publishedAt)).toEqual(['2026-01-01T00:00:00.000Z', '2024-01-01T00:00:00.000Z', null]);
  });
});

describe('news deployment flag', () => {
  it('requires explicit enablement, including runtime environment strings', () => {
    for (const value of [undefined, null, '', false, 'false', 'production', 1]) expect(isNewsEnabled(value)).toBe(false);
    expect(isNewsEnabled(true)).toBe(true);
    expect(isNewsEnabled('true')).toBe(true);
  });
});
