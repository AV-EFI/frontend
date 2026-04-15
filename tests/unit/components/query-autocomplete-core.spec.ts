// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import QueryAutocompleteCore from '~/components/search/QueryAutocompleteCore.vue';

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
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
});
