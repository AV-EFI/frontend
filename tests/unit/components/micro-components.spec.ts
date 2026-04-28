// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';

// Mock vue-i18n so LoadingSpinner.vue's explicit `import { useI18n }` resolves
// without needing a real i18n plugin installed in the test wrapper.
vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (k: string) => k }),
}));

import LoadingSpinner from '~/components/micro/LoadingSpinner.vue';
import InlineFieldError from '~/components/micro/InlineFieldError.vue';
import SkeletonLoader from '~/components/micro/SkeletonLoader.vue';
import DataLoadState from '~/components/micro/DataLoadState.vue';

// ---------------------------------------------------------------------------
// Shared stubs / mocks
// ---------------------------------------------------------------------------
const globalMocks = {
    mocks: { $t: (k: string) => k },
    stubs: {
        Icon: { template: '<i data-icon />' },
        MicroSkeletonLoader: { template: '<div data-test="skeleton" />' },
    },
};

// ---------------------------------------------------------------------------
// LoadingSpinner
// ---------------------------------------------------------------------------
describe('MicroLoadingSpinner', () => {
    test('renders role="status" wrapper', () => {
        const wrapper = mount(LoadingSpinner, { global: globalMocks });
        expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    test('spinner element carries aria-hidden', () => {
        const wrapper = mount(LoadingSpinner, { global: globalMocks });
        const spinner = wrapper.find('.loading-spinner');
        expect(spinner.attributes('aria-hidden')).toBe('true');
    });

    test('sr-only text falls back to $t("loading") when no label prop given', () => {
        const wrapper = mount(LoadingSpinner, { global: globalMocks });
        expect(wrapper.find('.sr-only').text()).toBe('loading');
    });

    test('label prop is rendered in sr-only text', () => {
        const wrapper = mount(LoadingSpinner, {
            global: globalMocks,
            props: { label: 'Loading results' },
        });
        expect(wrapper.find('.sr-only').text()).toBe('Loading results');
    });

    test.each([
        ['xs', 'loading-xs'],
        ['sm', 'loading-sm'],
        ['md', 'loading-md'],
        ['lg', 'loading-lg'],
    ] as const)('size="%s" applies class "%s" to spinner', (size, cls) => {
        const wrapper = mount(LoadingSpinner, {
            global: globalMocks,
            props: { size },
        });
        expect(wrapper.find('.loading-spinner').classes()).toContain(cls);
    });

    test('color prop is applied to spinner element', () => {
        const wrapper = mount(LoadingSpinner, {
            global: globalMocks,
            props: { color: 'text-secondary' },
        });
        expect(wrapper.find('.loading-spinner').classes()).toContain('text-secondary');
    });

    test('defaults to size md and color text-primary', () => {
        const wrapper = mount(LoadingSpinner, { global: globalMocks });
        const spinner = wrapper.find('.loading-spinner');
        expect(spinner.classes()).toContain('loading-md');
        expect(spinner.classes()).toContain('text-primary');
    });
});

// ---------------------------------------------------------------------------
// SkeletonLoader
// ---------------------------------------------------------------------------
describe('MicroSkeletonLoader', () => {
    test('renders role="status" wrapper and sr-only label', () => {
        const wrapper = mount(SkeletonLoader, { global: globalMocks });
        expect(wrapper.find('[role="status"]').exists()).toBe(true);
        expect(wrapper.find('.sr-only').text()).toBe('loading');
    });

    test('renders requested number of skeleton items', () => {
        const wrapper = mount(SkeletonLoader, {
            global: globalMocks,
            props: { count: 4 },
        });
        expect(wrapper.findAll('[aria-hidden="true"]')).toHaveLength(4);
    });

    test('falls back to one item when count is zero', () => {
        const wrapper = mount(SkeletonLoader, {
            global: globalMocks,
            props: { count: 0 },
        });
        expect(wrapper.findAll('[aria-hidden="true"]')).toHaveLength(1);
    });

    test('supports compact variant class set', () => {
        const wrapper = mount(SkeletonLoader, {
            global: globalMocks,
            props: { variant: 'compact' },
        });
        const first = wrapper.find('[aria-hidden="true"]');
        expect(first.classes()).toContain('rounded-md');
        expect(first.classes()).toContain('p-2');
    });

    test('supports disabling chip placeholders', () => {
        const wrapper = mount(SkeletonLoader, {
            global: globalMocks,
            props: { showChips: false },
        });
        expect(wrapper.findAll('.rounded-full')).toHaveLength(0);
    });

    test('uses label prop when provided', () => {
        const wrapper = mount(SkeletonLoader, {
            global: globalMocks,
            props: { label: 'Loading search results' },
        });
        expect(wrapper.find('.sr-only').text()).toBe('Loading search results');
    });
});

// ---------------------------------------------------------------------------
// DataLoadState
// ---------------------------------------------------------------------------
describe('MicroDataLoadState', () => {
    test('shows loading slot while pending', () => {
        const wrapper = mount(DataLoadState, {
            global: globalMocks,
            props: { pending: true, error: null, hasData: false, minSkeletonMs: 0 },
            slots: { default: '<div data-test="content" />' },
        });

        expect(wrapper.find('[data-test="skeleton"]').exists()).toBe(true);
        expect(wrapper.find('[data-test="content"]').exists()).toBe(false);
    });

    test('shows error slot when error exists and not pending', async () => {
        const wrapper = mount(DataLoadState, {
            global: globalMocks,
            props: { pending: false, error: 'boom', hasData: false, minSkeletonMs: 0 },
            slots: { error: '<div data-test="error-state">error state</div>' },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="error-state"]').exists()).toBe(true);
    });

    test('shows empty slot when no data and no error', async () => {
        const wrapper = mount(DataLoadState, {
            global: globalMocks,
            props: { pending: false, error: null, hasData: false, minSkeletonMs: 0 },
            slots: { empty: '<div data-test="empty-state">empty</div>' },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="empty-state"]').exists()).toBe(true);
    });

    test('shows default slot when data exists and not pending', async () => {
        const wrapper = mount(DataLoadState, {
            global: globalMocks,
            props: { pending: false, error: null, hasData: true, minSkeletonMs: 0 },
            slots: { default: '<div data-test="content">content</div>' },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.find('[data-test="content"]').exists()).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// InlineFieldError
// ---------------------------------------------------------------------------
describe('MicroInlineFieldError', () => {
    test('renders nothing when message is falsy', () => {
        const wrapper = mount(InlineFieldError, {
            global: globalMocks,
            props: { message: undefined },
        });
        expect(wrapper.find('p').exists()).toBe(false);
    });

    test('renders nothing when message is null', () => {
        const wrapper = mount(InlineFieldError, {
            global: globalMocks,
            props: { message: null },
        });
        expect(wrapper.find('p').exists()).toBe(false);
    });

    test('renders the message text when provided', () => {
        const wrapper = mount(InlineFieldError, {
            global: globalMocks,
            props: { message: 'Email is required' },
        });
        expect(wrapper.find('p').text()).toContain('Email is required');
    });

    test('error paragraph carries role="alert"', () => {
        const wrapper = mount(InlineFieldError, {
            global: globalMocks,
            props: { message: 'Invalid value' },
        });
        expect(wrapper.find('p').attributes('role')).toBe('alert');
    });

    test('id prop is forwarded to the paragraph element', () => {
        const wrapper = mount(InlineFieldError, {
            global: globalMocks,
            props: { message: 'Required', id: 'email-error' },
        });
        expect(wrapper.find('p').attributes('id')).toBe('email-error');
    });

    test('no id attribute when prop is omitted', () => {
        const wrapper = mount(InlineFieldError, {
            global: globalMocks,
            props: { message: 'Required' },
        });
        expect(wrapper.find('p').attributes('id')).toBeUndefined();
    });
});
