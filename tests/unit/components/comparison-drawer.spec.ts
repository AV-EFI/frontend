// @vitest-environment happy-dom
import { reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ComparisonDrawer from '~/components/global/ComparisonDrawer.vue';

const navigateToMock = vi.fn();

const comparisonStore = reactive({
  comparisonDrawerOpen: true,
  objects: [] as Array<{ filmId: string; filmTitle: string }>,
  removeObject: vi.fn((index: number) => {
    comparisonStore.objects.splice(index, 1);
  }),
  removeAllObjects: vi.fn(() => {
    comparisonStore.objects.splice(0, comparisonStore.objects.length);
  }),
});

Object.defineProperty(comparisonStore, 'getObjectIds', {
  get() {
    return comparisonStore.objects.map((obj) => obj.filmId);
  },
});

const favouritesStore = reactive({
  objects: [] as Array<{ filmId: string; filmTitle: string }>,
  removeObject: vi.fn((index: number) => {
    favouritesStore.objects.splice(index, 1);
  }),
  removeAllObjects: vi.fn(() => {
    favouritesStore.objects.splice(0, favouritesStore.objects.length);
  }),
});

Object.defineProperty(favouritesStore, 'getObjectIds', {
  get() {
    return favouritesStore.objects.map((obj) => obj.filmId);
  },
});

vi.mock('~/stores/compareList', () => ({
  useObjectListStore: () => comparisonStore,
}));

vi.mock('~/stores/favourites', () => ({
  useFavourites: () => favouritesStore,
}));

beforeEach(() => {
  comparisonStore.objects.splice(0, comparisonStore.objects.length);
  favouritesStore.objects.splice(0, favouritesStore.objects.length);
  navigateToMock.mockReset();

  vi.stubGlobal('navigateTo', navigateToMock);
  vi.stubGlobal('useNuxtApp', () => ({
    $toggleComparisonDrawerState: vi.fn(),
    $toast: { error: vi.fn() },
  }));
});

function mountComponent() {
  return mount(ComparisonDrawer, {
    global: {
      stubs: {
        ClientOnly: { template: '<div><slot /></div>' },
        Icon: { template: '<i />' },
        GlobalExportDataComp: { template: '<button />' },
      },
      mocks: {
        $t: (key: string) => key,
      },
    },
  });
}

describe('ComparisonDrawer interaction contracts', () => {
  test('keeps compare action disabled when not exactly 2 objects', () => {
    comparisonStore.objects.push({ filmId: 'a', filmTitle: 'A' });

    const wrapper = mountComponent();
    const compareButton = wrapper.find('button.btn-compare-list');
    expect(compareButton.exists()).toBe(true);
    expect(compareButton.classes()).toContain('btn-disabled');
  });

  test('navigates to compare route when exactly 2 objects exist', async () => {
    comparisonStore.objects.push(
      { filmId: 'id-1', filmTitle: 'First' },
      { filmId: 'id-2', filmTitle: 'Second' }
    );

    const wrapper = mountComponent();
    const compareButton = wrapper.find('button.btn-compare-list');
    await compareButton.trigger('click');

    expect(navigateToMock).toHaveBeenCalledTimes(1);
    expect(navigateToMock).toHaveBeenCalledWith('/compare?prev=id-1&next=id-2');
  });

  test('switches to favourites tab when comparison is empty and favourites has items', async () => {
    favouritesStore.objects.push({ filmId: 'fav-1', filmTitle: 'Fav' });
    const wrapper = mountComponent();

    const comparisonPanel = wrapper.get('#comparison-panel');
    const favouritesPanel = wrapper.get('#favourites-panel');

    expect(comparisonPanel.attributes('aria-hidden')).toBe('true');
    expect(favouritesPanel.attributes('aria-hidden')).toBe('false');
  });
});
