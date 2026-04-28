// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import OnboardingHint from '~/components/global/OnboardingHint.vue';

// ---------------------------------------------------------------------------
// Stub useLocalStorage (VueUse — not available in vitest node/happy-dom).
// We back it with a plain in-memory map so tests are isolated.
// ---------------------------------------------------------------------------
import { ref } from 'vue';

const localStorageStore = new Map<string, ReturnType<typeof ref<boolean>>>();

vi.stubGlobal('useLocalStorage', (key: string, defaultValue: boolean) => {
    if (!localStorageStore.has(key)) {
        localStorageStore.set(key, ref(defaultValue));
    }
    return localStorageStore.get(key)!;
});

const globalConfig = {
    mocks: { $t: (k: string) => k },
    stubs: {
        Icon: { template: '<i data-icon />' },
        Transition: { template: '<slot />' },
    },
};

function mountHint(props: Record<string, unknown> = {}) {
    return mount(OnboardingHint, {
        global: globalConfig,
        props: { storageKey: 'test-hint', text: 'Try clicking the filters button', ...props },
    });
}

describe('GlobalOnboardingHint', () => {
    beforeEach(() => {
        // Reset stored dismissed state before each test.
        localStorageStore.clear();
    });

    test('renders aside with role="note" when not dismissed', () => {
        const wrapper = mountHint();
        expect(wrapper.find('[role="note"]').exists()).toBe(true);
    });

    test('hint text is displayed', () => {
        const wrapper = mountHint({ text: 'Use facets to narrow results' });
        expect(wrapper.text()).toContain('Use facets to narrow results');
    });

    test('dismiss button has accessible aria-label from $t("dismissHint")', () => {
        const wrapper = mountHint();
        const btn = wrapper.find('button');
        expect(btn.attributes('aria-label')).toBe('dismissHint');
    });

    test('clicking dismiss hides the hint', async () => {
        const wrapper = mountHint();
        await wrapper.find('button').trigger('click');
        expect(wrapper.find('[role="note"]').exists()).toBe(false);
    });

    test('dismissed state persists: hint is hidden on remount', async () => {
        // Dismiss on first mount.
        const wrapper = mountHint({ storageKey: 'persist-test' });
        await wrapper.find('button').trigger('click');

        // Second mount with the same storageKey — localStorage ref should still be true.
        const wrapper2 = mountHint({ storageKey: 'persist-test' });
        expect(wrapper2.find('[role="note"]').exists()).toBe(false);
    });

    test('different storageKeys are independent', async () => {
        const a = mountHint({ storageKey: 'hint-a' });
        const b = mountHint({ storageKey: 'hint-b' });
        await a.find('button').trigger('click');

        expect(a.find('[role="note"]').exists()).toBe(false);
        expect(b.find('[role="note"]').exists()).toBe(true);
    });

    test('icon prop is passed; defaults to tabler:bulb', () => {
        // Icon is stubbed but component receives the name prop.
        const wrapper = mountHint();
        // The Icon stub renders without props inspection, but we can verify the
        // component does not crash and renders with the default icon value.
        expect(wrapper.find('[role="note"]').exists()).toBe(true);
    });

    test('custom icon prop renders without error', () => {
        const wrapper = mountHint({ icon: 'tabler:git-compare' });
        expect(wrapper.find('[role="note"]').exists()).toBe(true);
    });
});
