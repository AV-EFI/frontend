// @vitest-environment happy-dom
import { reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import IndicatorComp from '~/components/global/IndicatorComp.vue';

const comparisonStore = reactive({ objects: [] as { filmId: string }[] });
const favouritesStore = reactive({ objects: [] as { filmId: string }[] });

vi.mock('~/stores/compareList', () => ({
    useObjectListStore: () => comparisonStore,
}));
vi.mock('~/stores/favourites', () => ({
    useFavourites: () => favouritesStore,
}));

beforeEach(() => {
    comparisonStore.objects = [{ filmId: 'f1' }, { filmId: 'f2' }];
    favouritesStore.objects = [{ filmId: 'fav1' }];
    vi.stubGlobal('useNuxtApp', () => ({
        $toggleComparisonDrawerState: vi.fn(),
    }));
});

function mountComp() {
    return mount(IndicatorComp, {
        global: {
            mocks: { $t: (k: string) => k, $toggleComparisonDrawerState: vi.fn() },
            stubs: { Icon: { template: '<i />' } },
        },
    });
}

describe('IndicatorComp badge i18n keys', () => {
    test('first badge (favourites) uses elementsinfavourites key in aria-label', () => {
        const wrapper = mountComp();
        const badges = wrapper.findAll('.badge');
        expect(badges[0].attributes('aria-label')).toContain('elementsinfavourites');
    });

    test('first badge (favourites) does NOT use elementsincomparison key', () => {
        const wrapper = mountComp();
        const badges = wrapper.findAll('.badge');
        expect(badges[0].attributes('aria-label')).not.toContain('elementsincomparison');
    });

    test('second badge (comparison) uses elementsincomparison key in aria-label', () => {
        const wrapper = mountComp();
        const badges = wrapper.findAll('.badge');
        expect(badges[1].attributes('aria-label')).toContain('elementsincomparison');
    });

    test('second badge (comparison) does NOT use elementsinfavourites key', () => {
        const wrapper = mountComp();
        const badges = wrapper.findAll('.badge');
        expect(badges[1].attributes('aria-label')).not.toContain('elementsinfavourites');
    });

    test('first badge shows favourites count', () => {
        const wrapper = mountComp();
        const badges = wrapper.findAll('.badge');
        expect(badges[0].text()).toContain('1');
    });

    test('second badge shows comparison count', () => {
        const wrapper = mountComp();
        const badges = wrapper.findAll('.badge');
        expect(badges[1].text()).toContain('2');
    });
});
