// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import NoResultsComp from '~/components/search/NoResultsComp.vue';

function mountComp() {
    return mount(NoResultsComp, {
        global: {
            mocks: { $t: (k: string) => k },
        },
    });
}

describe('NoResultsComp accessibility', () => {
    test('has a live region with role="status"', () => {
        const wrapper = mountComp();
        expect(wrapper.find('[role="status"]').exists()).toBe(true);
    });

    test('sr-only span renders immediately (without waiting for animation)', () => {
        const wrapper = mountComp();
        const srOnly = wrapper.find('span.sr-only');
        expect(srOnly.exists()).toBe(true);
        // noResults key is translated via $t mock → returns 'noResults'
        expect(srOnly.text()).toBe('noResults');
    });

    test('sr-only text does not depend on any v-if condition', async () => {
        const wrapper = mountComp();
        // Component just mounted — showNothing is still false but sr-only should exist
        const srOnly = wrapper.find('span.sr-only');
        expect(srOnly.isVisible()).toBe(true);
    });
});
