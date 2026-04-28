// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import ConfirmActionModal from '~/components/global/ConfirmActionModal.vue';

// useId() is a Nuxt 3.5+ global — stub with a simple incrementing counter.
let idCounter = 0;
vi.stubGlobal('useId', () => `test-id-${++idCounter}`);

const globalConfig = {
    mocks: { $t: (k: string) => k },
    stubs: {
        // Stub Teleport so the dialog renders inline (not teleported to body)
        // so that wrapper.find('dialog') locates it within the wrapper tree.
        Teleport: { template: '<slot />' },
        Transition: { template: '<slot />' },
        Icon: { template: '<i data-icon />' },
    },
};

function mountModal(props: Record<string, unknown> = {}) {
    return mount(ConfirmActionModal, {
        global: globalConfig,
        props: {
            open: true,
            title: 'Delete item?',
            ...props,
        },
        attachTo: document.body,
    });
}

describe('GlobalConfirmActionModal', () => {
    test('is not rendered when open=false', () => {
        const wrapper = mountModal({ open: false });
        expect(wrapper.find('dialog').exists()).toBe(false);
    });

    test('is rendered when open=true', () => {
        const wrapper = mountModal({ open: true });
        expect(wrapper.find('dialog').exists()).toBe(true);
    });

    test('dialog has role="dialog" and aria-modal="true"', () => {
        const wrapper = mountModal();
        const dialog = wrapper.find('dialog');
        expect(dialog.attributes('role')).toBe('dialog');
        expect(dialog.attributes('aria-modal')).toBe('true');
    });

    test('title is rendered', () => {
        const wrapper = mountModal({ title: 'Remove from list?' });
        expect(wrapper.text()).toContain('Remove from list?');
    });

    test('description is rendered when provided', () => {
        const wrapper = mountModal({ description: 'This cannot be undone.' });
        expect(wrapper.text()).toContain('This cannot be undone.');
    });

    test('description is absent when not provided', () => {
        const wrapper = mountModal({ description: undefined });
        // Only one <p> element for the modal body — it should not exist.
        expect(wrapper.find('p').exists()).toBe(false);
    });

    test('confirm button uses custom confirmLabel', () => {
        const wrapper = mountModal({ confirmLabel: 'Yes, delete' });
        const buttons = wrapper.findAll('button');
        const confirmBtn = buttons.find((b) => b.text().includes('Yes, delete'));
        expect(confirmBtn).toBeDefined();
    });

    test('cancel button uses custom cancelLabel', () => {
        const wrapper = mountModal({ cancelLabel: 'Never mind' });
        const buttons = wrapper.findAll('button');
        const cancelBtn = buttons.find((b) => b.text().includes('Never mind'));
        expect(cancelBtn).toBeDefined();
    });

    test('confirm button falls back to $t("confirm")', () => {
        const wrapper = mountModal();
        const buttons = wrapper.findAll('button');
        expect(buttons.some((b) => b.text() === 'confirm')).toBe(true);
    });

    test('cancel button falls back to $t("cancel")', () => {
        const wrapper = mountModal();
        const buttons = wrapper.findAll('button');
        expect(buttons.some((b) => b.text() === 'cancel')).toBe(true);
    });

    test('clicking confirm emits "confirm"', async () => {
        const wrapper = mountModal();
        const confirmBtn = wrapper.findAll('button').find((b) => b.text() === 'confirm')!;
        await confirmBtn.trigger('click');
        expect(wrapper.emitted('confirm')).toBeTruthy();
    });

    test('clicking cancel emits "cancel"', async () => {
        const wrapper = mountModal();
        const cancelBtn = wrapper.findAll('button').find((b) => b.text() === 'cancel')!;
        await cancelBtn.trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    test('pressing Escape emits "cancel"', async () => {
        const wrapper = mountModal();
        await wrapper.find('dialog').trigger('keydown.escape');
        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    test('clicking the backdrop form emits "cancel"', async () => {
        const wrapper = mountModal();
        await wrapper.find('form.modal-backdrop').trigger('click');
        expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    test('danger variant applies btn-error class to confirm button', () => {
        const wrapper = mountModal({ variant: 'danger' });
        const confirmBtn = wrapper.findAll('button').find((b) => b.text() === 'confirm')!;
        expect(confirmBtn.classes()).toContain('btn-error');
    });

    test('info variant applies btn-primary class to confirm button', () => {
        const wrapper = mountModal({ variant: 'info' });
        const confirmBtn = wrapper.findAll('button').find((b) => b.text() === 'confirm')!;
        expect(confirmBtn.classes()).toContain('btn-primary');
    });

    test('aria-labelledby points to the title element id', () => {
        const wrapper = mountModal();
        const dialog = wrapper.find('dialog');
        const labelId = dialog.attributes('aria-labelledby');
        expect(labelId).toBeTruthy();
        expect(wrapper.find(`#${labelId}`).text()).toContain('Delete item?');
    });

    test('aria-describedby is set when description is provided', () => {
        const wrapper = mountModal({ description: 'Are you sure?' });
        const dialog = wrapper.find('dialog');
        const descId = dialog.attributes('aria-describedby');
        expect(descId).toBeTruthy();
        expect(wrapper.find(`#${descId}`).text()).toContain('Are you sure?');
    });

    test('aria-describedby is absent when no description provided', () => {
        const wrapper = mountModal({ description: undefined });
        expect(wrapper.find('dialog').attributes('aria-describedby')).toBeUndefined();
    });
});
