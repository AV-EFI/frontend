// @vitest-environment happy-dom
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import QueryAutocompleteCore from '~/components/search/QueryAutocompleteCore.vue';

const localeRef = ref('de');

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: localeRef,
    t: (key: string) => {
      if (key === 'facetValue.in_language_code.ger') return 'Deutsch';
      if (key === 'facetValue.in_language_code.dut') return 'Niederländisch';
      if (key === 'facetValue.in_language_code.dan') return 'Dänisch';
      return key;
    },
  }),
}));

function mountComponent() {
  return mount(QueryAutocompleteCore, {
    props: {
      modelValue: '',
      name: 'query',
      recentSearches: [{ query: 'older query', url: 'query=older', timestamp: Date.now() }],
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
}

describe('QueryAutocompleteCore interaction contracts', () => {
  test('selects highlighted suggestion with keyboard enter', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      '$fetch',
      vi.fn().mockResolvedValue({
        success: true,
        suggestions: [{ text: 'Berlin', type: 'title', count: 10 }],
      })
    );

    const wrapper = mount(QueryAutocompleteCore, {
      props: {
        modelValue: '',
        name: 'query',
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
    const input = wrapper.get('input');

    await input.setValue('Ber');
    await vi.runAllTimersAsync();
    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });

    const emittedSelect = wrapper.emitted('select');
    expect(emittedSelect).toBeTruthy();
    expect(emittedSelect?.[0]).toEqual(['Berlin']);
  });

  test('emits recent history actions', async () => {
    vi.stubGlobal(
      '$fetch',
      vi.fn().mockResolvedValue({
        success: true,
        suggestions: [],
      })
    );

    const wrapper = mountComponent();
    const input = wrapper.get('input');

    await input.trigger('focus');
    await input.trigger('keydown', { key: 'ArrowDown' });

    const clearHistoryButton = wrapper.findAll('button').find((b) => b.text().includes('clearSearchHistory'));
    expect(clearHistoryButton).toBeTruthy();
    await clearHistoryButton!.trigger('mousedown');
    expect(wrapper.emitted('clear-history')).toBeTruthy();
  });

  test('filters facet suggestions by localized labels and emits raw value on select', async () => {
    vi.useFakeTimers();
    localeRef.value = 'de';

    const fetchMock = vi.fn().mockResolvedValue({
      success: true,
      suggestions: [
        { text: 'ger', type: 'facet', count: 10 },
        { text: 'dut', type: 'facet', count: 8 },
        { text: 'dan', type: 'facet', count: 7 },
      ],
    });
    vi.stubGlobal('$fetch', fetchMock);

    const wrapper = mount(QueryAutocompleteCore, {
      props: {
        modelValue: '',
        name: 'query',
        facetAttr: 'in_language_code',
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

    const input = wrapper.get('input');
    await input.setValue('deut');
    await vi.runAllTimersAsync();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1]?.body?.query).toBe('');

    const dropdownText = wrapper.text();
    expect(dropdownText).toContain('Deutsch');
    expect(dropdownText).not.toContain('Niederländisch');
    expect(dropdownText).not.toContain('Dänisch');

    await input.trigger('keydown', { key: 'ArrowDown' });
    await input.trigger('keydown', { key: 'Enter' });

    const emittedSelect = wrapper.emitted('select');
    expect(emittedSelect).toBeTruthy();
    expect(emittedSelect?.[0]).toEqual(['ger']);

    vi.useRealTimers();
  });

  test('closes an open facet dropdown when the facet key changes', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      '$fetch',
      vi.fn().mockResolvedValue({
        success: true,
        suggestions: [{ text: 'ger', type: 'facet', count: 10 }],
      })
    );

    const wrapper = mount(QueryAutocompleteCore, {
      props: {
        modelValue: '',
        name: 'query',
        facetAttr: 'in_language_code',
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

    const input = wrapper.get('input');
    await input.setValue('deut');
    await vi.runAllTimersAsync();

    expect(input.attributes('aria-expanded')).toBe('true');

    await wrapper.setProps({ facetAttr: 'has_sound_type' });

    expect(wrapper.get('input').attributes('aria-expanded')).toBe('false');
    expect(wrapper.text()).not.toContain('Deutsch');

    vi.useRealTimers();
  });
});
