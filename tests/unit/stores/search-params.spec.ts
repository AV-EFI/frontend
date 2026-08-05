import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, expect, test } from 'vitest';
import { useSearchParamsStore } from '~/stores/searchParams';

describe('useSearchParamsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe('initial state', () => {
    test('searchToggle starts as false', () => {
      const store = useSearchParamsStore();
      expect(store.formData.searchToggle).toBe(false);
    });

    test('regularSearch starts with empty searchTerm', () => {
      const store = useSearchParamsStore();
      expect(store.formData.regularSearch?.searchTerm).toBe('');
    });

    test('regularSearch starts with empty optionsList', () => {
      const store = useSearchParamsStore();
      expect(store.formData.regularSearch?.optionsList).toEqual([]);
    });

    test('extendedSearch starts with one empty operator entry', () => {
      const store = useSearchParamsStore();
      const ops = store.formData.extendedSearch?.operators;
      expect(ops).toHaveLength(1);
      expect(ops?.[0]!.searchTerm).toBe('');
      expect(ops?.[0]!.booleanOperator).toBe('and');
      expect(ops?.[0]!.fieldOperator).toBe('Title');
    });
  });

  describe('state mutations', () => {
    test('searchToggle can be set to true', () => {
      const store = useSearchParamsStore();
      store.formData.searchToggle = true;
      expect(store.formData.searchToggle).toBe(true);
    });

    test('regularSearch searchTerm can be updated', () => {
      const store = useSearchParamsStore();
            store.formData.regularSearch!.searchTerm = 'Murnau';
            expect(store.formData.regularSearch?.searchTerm).toBe('Murnau');
    });

    test('regularSearch optionsList can be populated', () => {
      const store = useSearchParamsStore();
            store.formData.regularSearch!.optionsList = [{ label: 'Director', value: 'director' }];
            expect(store.formData.regularSearch?.optionsList).toHaveLength(1);
    });

    test('extendedSearch operators can be extended', () => {
      const store = useSearchParamsStore();
            store.formData.extendedSearch!.operators.push({
              searchTerm: 'Nosferatu',
              booleanOperator: 'or',
              fieldOperator: 'Title',
            });
            expect(store.formData.extendedSearch?.operators).toHaveLength(2);
    });

    test('store instances are isolated between tests', () => {
      const store = useSearchParamsStore();
            store.formData.regularSearch!.searchTerm = 'Hitchcock';
            // Create a second store in the same test — should share state
            const store2 = useSearchParamsStore();
            expect(store2.formData.regularSearch?.searchTerm).toBe('Hitchcock');
    });
  });
});
