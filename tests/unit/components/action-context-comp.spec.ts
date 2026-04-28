// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import ActionContextComp from '~/components/global/ActionContextComp.vue';

const itemWithWorkVariant = {
    has_record: { category: 'avefi:WorkVariant', has_primary_title: { has_name: 'Test Film' } },
    compound_record: { _source: { has_record: { has_primary_title: { has_name: 'Test Film' } } } },
    handle: 'test-handle',
};

const globalConfig = {
    mocks: { $t: (k: string) => k },
    stubs: {
        Icon: { template: '<i />' },
        LazyCartAddToFavouritesComp: { template: '<button />' },
        LazyCartAddToComparisonComp: { template: '<button />' },
        GlobalExportDataComp: { template: '<button />' },
    },
};

beforeEach(() => {
    vi.stubGlobal('useNuxtApp', () => ({ $toast: { success: vi.fn(), error: vi.fn() } }));
});

describe('ActionContextComp aria-expanded', () => {
    test('does not render when item category is not WorkVariant', () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: { has_record: { category: 'avefi:Manifestation' } } },
            global: globalConfig,
        });
        expect(wrapper.find('[role="button"]').exists()).toBe(false);
    });

    test('renders dropdown when category is avefi:WorkVariant', () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: itemWithWorkVariant },
            global: globalConfig,
        });
        expect(wrapper.find('[role="button"]').exists()).toBe(true);
    });

    test('aria-expanded starts as "false"', () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: itemWithWorkVariant },
            global: globalConfig,
        });
        expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('false');
    });

    test('click toggles aria-expanded to "true"', async () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: itemWithWorkVariant },
            global: globalConfig,
        });
        await wrapper.find('[role="button"]').trigger('click');
        expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('true');
    });

    test('second click toggles aria-expanded back to "false"', async () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: itemWithWorkVariant },
            global: globalConfig,
        });
        await wrapper.find('[role="button"]').trigger('click');
        await wrapper.find('[role="button"]').trigger('click');
        expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('false');
    });

    test('Escape key closes the menu', async () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: itemWithWorkVariant },
            global: globalConfig,
        });
        await wrapper.find('[role="button"]').trigger('click');
        expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('true');
        await wrapper.find('[role="button"]').trigger('keydown', { key: 'Escape' });
        expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('false');
    });

    test('Enter key toggles menu open', async () => {
        const wrapper = mount(ActionContextComp, {
            props: { item: itemWithWorkVariant },
            global: globalConfig,
        });
        await wrapper.find('[role="button"]').trigger('keydown', { key: 'Enter' });
        expect(wrapper.find('[role="button"]').attributes('aria-expanded')).toBe('true');
    });
});
