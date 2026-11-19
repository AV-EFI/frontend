// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { describe, expect, test, vi } from 'vitest';

vi.stubGlobal('onMounted', onMounted);
vi.stubGlobal('onBeforeUnmount', onBeforeUnmount);

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {}, path: '/search' }),
  useRouter: () => ({ replace: vi.fn() }),
}));

const { default: VueSlider } = await import('~/components/input/VueSlider.vue');

const sliderStub = { name: 'Slider', template: '<div data-testid="slider" />' };

function mountSlider() {
  return mount(VueSlider, {
    global: {
      stubs: {
        Slider: sliderStub,
        IntegerField: { template: '<input />' },
        Icon: { template: '<span />' },
        MicroBadgeCategoryComp: { template: '<span />' },
        AisConfigure: { template: '<div />' },
        'ais-configure': { template: '<div />' },
      },
      mocks: { $t: (key: string) => key },
    },
  });
}

describe('VueSlider', () => {
  test('builds the slider only once the panel is opened, and keeps it after closing', async () => {
    const wrapper = mountSlider();
    const panelToggle = wrapper.get('input.collapse-checkbox');

    expect(wrapper.findComponent(sliderStub).exists()).toBe(false);

    await panelToggle.setValue(true);
    await nextTick();
    expect(wrapper.findComponent(sliderStub).exists()).toBe(true);

    await panelToggle.setValue(false);
    await nextTick();
    expect(wrapper.findComponent(sliderStub).exists()).toBe(true);
  });
});
