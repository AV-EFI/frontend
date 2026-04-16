// @vitest-environment happy-dom
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import WorkVariantTopLevelComp from '~/components/detail/WorkVariantTopLevelComp.vue';
import de from '~/i18n/locales/de';
import en from '~/i18n/locales/en';

function getByPath(messages: Record<string, unknown>, key: string): string {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages);

  return typeof value === 'string' ? value : key;
}

const Host = defineComponent({
  components: { WorkVariantTopLevelComp },
  props: {
    modelValue: { type: Object, required: true },
  },
  template: '<WorkVariantTopLevelComp v-model="modelValue" handle="h" es-timestamp="now" />',
});

function mountComponent(modelValue: Record<string, unknown>, t: (key: string) => string) {
  return mount(Host, {
    props: { modelValue },
    global: {
      stubs: {
        NuxtLayout: { template: '<div><slot name="center" /></div>' },
        DetailKeyValueComp: {
          props: ['keytxt', 'valtxt'],
          template: '<div class="kv">{{ keytxt }}={{ valtxt }}</div>',
        },
        DetailKeyValueListComp: {
          props: ['keytxt', 'valtxt'],
          template: '<div class="kvl">{{ keytxt }}:{{ valtxt?.length ?? 0 }}</div>',
        },
        MicroLabelComp: {
          props: ['labelText'],
          template: '<div class="label">{{ labelText }}</div>',
        },
        RouterLink: {
          props: ['to'],
          template: '<a :href="to"><slot /></a>',
        },
      },
      mocks: {
        $t: t,
      },
    },
  });
}

describe('WorkVariantTopLevelComp labels and work properties', () => {
  test.each([
    { locale: 'de', messages: de as Record<string, unknown> },
    { locale: 'en', messages: en as Record<string, unknown> },
  ])('renders labeled work properties for locale $locale', ({ messages }) => {
    const t = (key: string) => getByPath(messages, key);
    const model = {
      'same_as': [{ id: 'gnd:123', category: 'gnd' }],
      'has_alternative_title': [{ 'has_name': 'Alt 1' }],
      'is_part_of': [{ id: 'parent-1', category: 'gnd' }],
    };

    const wrapper = mountComponent(model, t);

    expect(wrapper.text()).toContain('gnd=gnd:123');
    expect(wrapper.text()).toContain('AlternativeTitle:1');
    expect(wrapper.text()).toContain('parent-1');
    expect(wrapper.find(`[aria-label="${t('AlternativeTitle')}"]`).exists()).toBe(true);
    expect(wrapper.find(`[aria-label="${t('isPartOf')}"]`).exists()).toBe(true);
  });
});
