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
      stubs: { NuxtLink: { template: '<a><slot /></a>' }, Icon: { template: '<i />' } },
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

  it('links the expanded article to its original source once expanded', async () => {
    const wrapper = mountSection([article('1', 'First'), article('2', 'Second')]);
    await flushPromises();
    expect(wrapper.find('a[href="https://projects.tib.eu/av-efi/1"]').exists()).toBe(false);

    await wrapper.findAll('button')[0]?.trigger('click');
    await flushPromises();

    const sourceLink = wrapper.find('a[href="https://projects.tib.eu/av-efi/1"]');
    expect(sourceLink.exists()).toBe(true);
    expect(sourceLink.text()).toBe('news.original');
  });

  it('switches to a split layout showing the full text when a card is expanded', async () => {
    const wrapper = mountSection([article('1', 'First', '<p>Preview one.</p>'), article('2', 'Second', '<p>Preview two.</p>'), article('3', 'Third', '<p>Preview three.</p>')]);
    await flushPromises();
    expect(wrapper.findAll('ul[role="list"] > li')).toHaveLength(3);

    await wrapper.findAll('button')[0]?.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('First');
    expect(wrapper.text()).toContain('Preview one.');
    expect(wrapper.findAll('article')).toHaveLength(3);
    expect(wrapper.text()).toContain('Second');
    expect(wrapper.text()).toContain('Third');
  });

  it('collapses back to the three-card grid', async () => {
    const wrapper = mountSection([article('1', 'First'), article('2', 'Second')]);
    await flushPromises();
    await wrapper.findAll('button')[0]?.trigger('click');
    await flushPromises();

    const collapseButton = wrapper.find('button[aria-label="home.sections.news.collapse"]');
    expect(collapseButton.exists()).toBe(true);
    await collapseButton.trigger('click');
    await flushPromises();

    expect(wrapper.findAll('ul[role="list"] > li')).toHaveLength(2);
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
