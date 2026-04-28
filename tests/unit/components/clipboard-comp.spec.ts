// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import ClipboardComp from '~/components/global/ClipboardComp.vue';

const copyExtendedMock = vi.fn();

// Mock useClipboardUtil so we can assert it is called during setup,
// not inside the click handler (regression for "Must be called at the
// top of a setup function" error caused by calling useI18n() in onClick).
vi.mock('~/utils/clipboard', () => ({
    useClipboardUtil: vi.fn(() => ({
        copyExtended: copyExtendedMock,
        isSupported: true,
    })),
}));

const globalConfig = {
    mocks: { $t: (k: string) => k },
    stubs: { Icon: { template: '<i />' } },
};

beforeEach(() => {
    vi.stubGlobal('useNormdataUrl', () => ({ getNormdataUrl: (key: string, id: string) => `https://example.com/${id}` }));
});

describe('ClipboardComp', () => {
    test('calls useClipboardUtil() during setup, not on click', async () => {
        const { useClipboardUtil } = await import('~/utils/clipboard');

        mount(ClipboardComp, {
            props: { displayText: 'hello' },
            global: globalConfig,
        });

        // Must be invoked exactly once at component setup time
        expect(useClipboardUtil).toHaveBeenCalledTimes(1);
    });

    test('clicking the copy button calls copyExtended with the display text', async () => {
        const wrapper = mount(ClipboardComp, {
            props: { displayText: 'hello' },
            global: globalConfig,
        });

        await wrapper.find('button').trigger('click');

        expect(copyExtendedMock).toHaveBeenCalledWith('hello');
    });

    test('clicking the copy button calls copyExtended with explicit copyText when provided', async () => {
        const wrapper = mount(ClipboardComp, {
            props: { displayText: 'Label', copyText: 'explicit-value' },
            global: globalConfig,
        });

        await wrapper.find('button').trigger('click');

        expect(copyExtendedMock).toHaveBeenCalledWith('explicit-value');
    });
});
