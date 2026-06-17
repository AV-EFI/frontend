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
          props: ['keytxt', 'valtxt', 'showSameAsLink'],
          template: '<div class="kv">{{ keytxt }}={{ valtxt }} link={{ showSameAsLink }}</div>',
        },
        DetailKeyValueListComp: {
          props: ['keytxt', 'valtxt'],
          template: '<div class="kvl">{{ keytxt }}:{{ valtxt?.length ?? 0 }}</div>',
        },
        MicroLabelComp: {
          props: ['labelText'],
          template: '<div class="label">{{ labelText }}</div>',
        },
        DetailSameAsComp: { template: '<div class="same-as-menu" />' },
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
      'same_as': [{ id: 'gnd:123', category: 'avefi:GNDResource' }],
      'has_alternative_title': [{ 'has_name': 'Alt 1' }],
      'is_part_of': [{ id: 'parent-1', category: 'gnd' }],
    };

    const wrapper = mountComponent(model, t);

    expect(wrapper.text()).toContain('avefi:GNDResource');
    expect(wrapper.text()).toContain('avefi:GNDResource=gnd:123 link=true');
    expect(wrapper.text()).toContain(`${t('AlternativeTitles')}:1`);
    expect(wrapper.text()).toContain('parent-1');
    expect(wrapper.get('#alternative-titles').element.tagName).toBe('H3');
    expect(wrapper.get('#references-work-relations').element.tagName).toBe('H3');
    expect(wrapper.find(`[aria-label="${t('AlternativeTitle')}"]`).exists()).toBe(true);
    expect(wrapper.find(`[aria-label="${t('isPartOf')}"]`).exists()).toBe(true);
  });

  test('renders root same_as references through the shared key-value layout', () => {
    const eidrId = '10.5240/9E5C-344E-D7B7-F66F-0864-F';
    const wrapper = mountComponent({
      'same_as': [{ id: eidrId, category: 'avefi:EIDRResource' }],
    }, (key: string) => key);

    const sameAsValue = wrapper.findAll('.kv').find((node) => node.text().includes(eidrId));
    expect(sameAsValue?.text()).toBe(`avefi:EIDRResource=${eidrId} link=true`);
  });

  test('renders Filmportal through the same shared key-value layout', () => {
    const filmportalId = '4c5c2cbf5b1642e5a19be9bd51dff70f';
    const wrapper = mountComponent({
      'same_as': [{ id: filmportalId, category: 'avefi:FilmportalResource' }],
    }, (key: string) => key);

    const sameAsValue = wrapper.findAll('.kv').find((node) => node.text().includes(filmportalId));
    expect(sameAsValue?.text()).toBe(`avefi:FilmportalResource=${filmportalId} link=true`);
  });
});
