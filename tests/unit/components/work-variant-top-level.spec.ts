// @vitest-environment happy-dom
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import WorkVariantTopLevelComp from '~/components/detail/WorkVariantTopLevelComp.vue';

const Host = defineComponent({
  components: { WorkVariantTopLevelComp },
  props: {
    modelValue: { type: Object, required: true },
  },
  template: '<WorkVariantTopLevelComp v-model="modelValue" handle="h" es-timestamp="now" />',
});

function mountComponent(modelValue: Record<string, unknown>) {
  return mount(Host, {
    props: { modelValue },
    global: {
      stubs: {
        NuxtLayout: { template: '<div><slot name="center" /></div>' },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('WorkVariantTopLevelComp', () => {
  test('renders no content of its own; references, alternative titles, genre and subject moved to the right panel of WorkViewCompAVefi', () => {
    const wrapper = mountComponent({
      'same_as': [{ id: 'gnd:123', category: 'avefi:GNDResource' }],
      'has_alternative_title': [{ 'has_name': 'Alt 1' }],
      'is_part_of': [{ id: 'parent-1', category: 'gnd' }],
    });

    expect(wrapper.text().trim()).toBe('');
    expect(wrapper.find('#references-work-relations').exists()).toBe(false);
    expect(wrapper.find('#alternative-titles').exists()).toBe(false);
  });
});
