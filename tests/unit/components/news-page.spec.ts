// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { defineComponent, h, ref, Suspense } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import NewsPage from '~/pages/news.vue';

afterEach(() => vi.unstubAllGlobals());

async function render(status: string, error: unknown = null, data: unknown = []) {
  const refresh = vi.fn();
  vi.stubGlobal('definePageMeta', vi.fn());
  vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('de') }));
  vi.stubGlobal('useSeoMeta', vi.fn());
  vi.stubGlobal('useFetch', () => Promise.resolve({ data: ref(data), status: ref(status), error: ref(error), refresh }));
  vi.stubGlobal('useRoute', () => ({ query: {} }));
  vi.stubGlobal('useRouter', () => ({ push: vi.fn() }));
  const wrapper = mount(defineComponent({ render: () => h(Suspense, null, { default: () => h(NewsPage) }) }), {
    global: {
      mocks: { $t: (key: string) => key },
      stubs: {
        NuxtLayout: { template: '<div><slot name="title" /><slot name="cardBody" /></div>' },
        GlobalPageTitleComp: { template: '<h1><slot /></h1>' },
        GlobalBreadcrumbsComp: true,
      },
    },
  });
  await flushPromises();
  return { wrapper, refresh };
}

describe('news page states', () => {
  it('announces loading', async () => {
    const { wrapper } = await render('pending');
    expect(wrapper.get('[role="status"]').text()).toBe('news.loading');
    wrapper.unmount();
  });
  it('announces an empty feed', async () => {
    const { wrapper } = await render('success');
    expect(wrapper.get('[role="status"]').text()).toBe('news.empty');
    wrapper.unmount();
  });
  it('offers retry and an independent source link on failure', async () => {
    const { wrapper, refresh } = await render('error', new Error('offline'));
    expect(wrapper.get('[role="alert"]').text()).toContain('news.error');
    expect(wrapper.get('a').attributes('href')).toBe('https://projects.tib.eu/av-efi/');
    await wrapper.get('button').trigger('click');
    expect(refresh).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it('links each article to its original source next to that article\'s own heading', async () => {
    const { wrapper } = await render('success', null, [
      { id: '1', title: 'Newest', link: 'https://projects.tib.eu/av-efi/news/newest', preview: '', content: '', publishedAt: null },
    ]);
    const heading = wrapper.get('h2');
    const sourceLink = heading.element.parentElement?.querySelector('a[href="https://projects.tib.eu/av-efi/news/newest"]');
    expect(sourceLink).toBeTruthy();
    expect(sourceLink?.textContent).toContain('news.original');
    wrapper.unmount();
  });
});
