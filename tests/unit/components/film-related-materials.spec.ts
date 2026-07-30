// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FilmRelatedMaterialsComp from '~/components/detail/FilmRelatedMaterialsComp.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

const mountComponent = (workVariantId: string) =>
  mount(FilmRelatedMaterialsComp, {
    props: {
      workVariantId,
    },
    global: {
      stubs: {
        Icon: { template: '<i />' },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });

describe('FilmRelatedMaterialsComp', () => {
  test('filters film-related materials by direct record search text', async () => {
    const wrapper = mountComponent('21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA');

    await flushPromises();
    expect(wrapper.findAll('article')).toHaveLength(4);

    await wrapper.get('input[type="search"]').setValue('Pelz');
    await flushPromises();

    const articles = wrapper.findAll('article');
    expect(articles).toHaveLength(1);
    expect(articles[0].text()).toContain('Leopardenpelz');
    expect(articles[0].text()).not.toContain('Leopardentop');
  });

  test('renders one placeholder thumbnail image for every representation', async () => {
    const wrapper = mountComponent('21.11155/A37FAC2F-2527-4DFE-94FB-5C18D2569406');

    await flushPromises();
    await wrapper.get('input[type="search"]').setValue('Mechau Mod III');
    await flushPromises();

    expect(wrapper.findAll('article')).toHaveLength(1);
    expect(wrapper.findAll('.material-representation-thumbnail')).toHaveLength(5);
    expect(wrapper.findAll('img[src="/img/img_placeholder_150.webp"]')).toHaveLength(5);
    expect(wrapper.find('.material-thumbnail__placeholder').exists()).toBe(false);
  });
});
