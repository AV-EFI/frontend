// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import DropdownMenu from '~/components/global/DropdownMenu.vue';

let idCounter = 0;
vi.stubGlobal('useId', () => `dd-id-${++idCounter}`);

const globalConfig = {
    mocks: { $t: (k: string) => k },
    stubs: { Transition: { template: '<slot />' } },
};

function mountDropdown(props: Record<string, unknown> = {}, slots = {}) {
    return mount(DropdownMenu, {
        global: globalConfig,
        props,
        slots: {
            trigger: `<template #trigger="{ triggerAttrs, toggle }">
                <button class="trigger-btn" v-bind="triggerAttrs" @click="toggle">Toggle</button>
            </template>`,
            content: `<template #content="{ close }">
                <button class="menu-item" @click="close">Item</button>
            </template>`,
            ...slots,
        },
        attachTo: document.body,
    });
}

describe('GlobalDropdownMenu', () => {
    beforeEach(() => {
        idCounter = 0;
    });

    test('menu panel is hidden initially', () => {
        const wrapper = mountDropdown();
        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    });

    test('menu panel appears after trigger click', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    });

    test('menu panel closes on second trigger click', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    });

    test('trigger button has aria-haspopup="menu"', () => {
        const wrapper = mountDropdown();
        expect(wrapper.find('.trigger-btn').attributes('aria-haspopup')).toBe('menu');
    });

    test('aria-expanded is "false" when closed', () => {
        const wrapper = mountDropdown();
        expect(wrapper.find('.trigger-btn').attributes('aria-expanded')).toBe('false');
    });

    test('aria-expanded is "true" when open', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('.trigger-btn').attributes('aria-expanded')).toBe('true');
    });

    test('aria-controls points to the menu panel id', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        const controls = wrapper.find('.trigger-btn').attributes('aria-controls');
        expect(controls).toBeTruthy();
        expect(wrapper.find(`#${controls}`).exists()).toBe(true);
    });

    test('Escape key closes the menu', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);

        await wrapper.find('[role="menu"]').trigger('keydown.escape');
        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    });

    test('clicking a menu item with close() closes the menu', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        await wrapper.find('.menu-item').trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    });

    test('click outside closes the menu', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);

        // Simulate a click outside the component's container.
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        await wrapper.vm.$nextTick();
        expect(wrapper.find('[role="menu"]').exists()).toBe(false);
    });

    test('menuLabel is forwarded as aria-label on the menu panel', async () => {
        const wrapper = mountDropdown({ menuLabel: 'Export options' });
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').attributes('aria-label')).toBe('Export options');
    });

    test('align="left" applies left-0 class', async () => {
        const wrapper = mountDropdown({ align: 'left' });
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').classes()).toContain('left-0');
    });

    test('align="right" applies right-0 class (default)', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.find('[role="menu"]').classes()).toContain('right-0');
    });

    test('v-model controls open state', async () => {
        const wrapper = mount(DropdownMenu, {
            global: globalConfig,
            props: { modelValue: true },
            slots: {
                trigger: `<template #trigger="{ triggerAttrs }">
                    <button class="trigger-btn" v-bind="triggerAttrs">Toggle</button>
                </template>`,
                content: `<template #content><span>Content</span></template>`,
            },
        });
        expect(wrapper.find('[role="menu"]').exists()).toBe(true);
    });

    test('emits update:modelValue on toggle', async () => {
        const wrapper = mountDropdown({ modelValue: false });
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
    });

    test('emits open event when menu opens', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.emitted('open')).toBeTruthy();
    });

    test('emits close event when menu closes', async () => {
        const wrapper = mountDropdown();
        await wrapper.find('.trigger-btn').trigger('click');
        await wrapper.find('.trigger-btn').trigger('click');
        expect(wrapper.emitted('close')).toBeTruthy();
    });
});
