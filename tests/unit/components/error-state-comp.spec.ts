// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import ErrorStateComp from '~/components/global/ErrorStateComp.vue';

const globalConfig = {
    mocks: { $t: (k: string) => k },
    stubs: {
        Icon: { template: '<i data-icon />' },
        NuxtLink: { template: '<a><slot /></a>' },
    },
};

function mountComp(props: Record<string, unknown> = {}) {
    return mount(ErrorStateComp, { global: globalConfig, props });
}

describe('GlobalErrorStateComp', () => {
    test('root element has role="alert"', () => {
        const wrapper = mountComp();
        expect(wrapper.find('[role="alert"]').exists()).toBe(true);
    });

    test('renders $t("errorOccurred") as default title', () => {
        const wrapper = mountComp();
        expect(wrapper.text()).toContain('errorOccurred');
    });

    test('renders custom title when provided', () => {
        const wrapper = mountComp({ title: 'Search failed' });
        expect(wrapper.find('h3').text()).toContain('Search failed');
    });

    test('description is shown when provided', () => {
        const wrapper = mountComp({ description: 'No connection to the server.' });
        expect(wrapper.text()).toContain('No connection to the server.');
    });

    test('description is absent when not provided', () => {
        const wrapper = mountComp({ description: undefined });
        expect(wrapper.find('p').exists()).toBe(false);
    });

    test('retry button is hidden by default', () => {
        const wrapper = mountComp();
        const btns = wrapper.findAll('button');
        expect(btns.some((b) => b.text().includes('tryAgain'))).toBe(false);
    });

    test('retry button appears when showRetry=true', () => {
        const wrapper = mountComp({ showRetry: true });
        const btns = wrapper.findAll('button');
        expect(btns.some((b) => b.text().includes('tryAgain'))).toBe(true);
    });

    test('retry button uses custom retryLabel', () => {
        const wrapper = mountComp({ showRetry: true, retryLabel: 'Reload' });
        const btns = wrapper.findAll('button');
        expect(btns.some((b) => b.text().includes('Reload'))).toBe(true);
    });

    test('clicking retry emits "retry"', async () => {
        const wrapper = mountComp({ showRetry: true });
        const retryBtn = wrapper.findAll('button').find((b) => b.text().includes('tryAgain'))!;
        await retryBtn.trigger('click');
        expect(wrapper.emitted('retry')).toBeTruthy();
    });

    test('home link is shown by default', () => {
        const wrapper = mountComp();
        // NuxtLink is stubbed to <a>
        expect(wrapper.find('a').exists()).toBe(true);
        expect(wrapper.find('a').text()).toContain('backToHome');
    });

    test('home link is hidden when showHome=false', () => {
        const wrapper = mountComp({ showHome: false });
        expect(wrapper.find('a').exists()).toBe(false);
    });

    test('contact button is hidden by default', () => {
        const wrapper = mountComp();
        const btns = wrapper.findAll('button');
        expect(btns.some((b) => b.text().includes('contactUs'))).toBe(false);
    });

    test('contact button appears when showContact=true', () => {
        const wrapper = mountComp({ showContact: true });
        const btns = wrapper.findAll('button');
        expect(btns.some((b) => b.text().includes('contactUs'))).toBe(true);
    });

    test('contact button dispatches toggle-contact-drawer event', async () => {
        const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
        const wrapper = mountComp({ showContact: true });
        const contactBtn = wrapper.findAll('button').find((b) => b.text().includes('contactUs'))!;
        await contactBtn.trigger('click');
        expect(dispatchSpy).toHaveBeenCalledWith(
            expect.objectContaining({ type: 'toggle-contact-drawer' }),
        );
        dispatchSpy.mockRestore();
    });
});
