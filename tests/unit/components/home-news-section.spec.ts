// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref, Suspense } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HomeNewsSection from '~/components/home/HomeNewsSection.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key, locale: ref('de') }),
}));
vi.mock('nuxt/app', () => ({
  useRuntimeConfig: () => ({ public: { newsHomeCount: 3 } }),
}));

afterEach(() => vi.unstubAllGlobals());

const article = (id: string, title: string, preview = '<p>Preview text.</p>') => ({
  id, title, link: `https://projects.tib.eu/av-efi/${id}`, preview, content: preview, publishedAt: '2026-05-18T00:00:00.000Z',
});

function mountSection(data: unknown) {
  vi.stubGlobal('useFetch', () => Promise.resolve({ data: ref(data), status: ref('success'), error: ref(null), refresh: vi.fn() }));
  const wrapper = mount(defineComponent({ render: () => h(Suspense, null, { default: () => h(HomeNewsSection) }) }), {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: { NuxtLink: { template: '<a><slot /></a>' } },
    },
  });
  return wrapper;
}

describe('HomeNewsSection', () => {
  it('renders up to the configured number of teaser cards with a link to all news', async () => {
    const wrapper = mountSection([article('1', 'First'), article('2', 'Second')]);
    await flushPromises();
    expect(wrapper.findAll('li')).toHaveLength(2);
    expect(wrapper.text()).toContain('First');
    expect(wrapper.text()).toContain('Preview text.');
    expect(wrapper.text()).toContain('home.sections.news.allNews');
  });

  it('links the latest article to its original source at the top right', async () => {
    const wrapper = mountSection([article('1', 'First'), article('2', 'Second')]);
    await flushPromises();
    const sourceLink = wrapper.find('a[href="https://projects.tib.eu/av-efi/1"]');
    expect(sourceLink.exists()).toBe(true);
    expect(sourceLink.text()).toBe('news.original: First');
  });

  it('strips HTML from the teaser text', async () => {
    const wrapper = mountSection([article('1', 'First', '<p>Hello <strong>world</strong></p>')]);
    await flushPromises();
    expect(wrapper.html()).not.toContain('<strong>');
    expect(wrapper.text()).toContain('Hello world');
  });

  it('renders nothing when the feed is empty', async () => {
    const wrapper = mountSection([]);
    await flushPromises();
    expect(wrapper.find('section').exists()).toBe(false);
  });

  it('renders nothing when the feed fails to load', async () => {
    const wrapper = mountSection(null);
    await flushPromises();
    expect(wrapper.find('section').exists()).toBe(false);
  });
});
