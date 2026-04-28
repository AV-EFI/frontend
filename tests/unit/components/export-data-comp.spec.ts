// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('vue-i18n', () => ({
    useI18n: () => ({ t: (k: string) => k }),
}));

// Mock export-to-csv to avoid heavy dependencies
vi.mock('export-to-csv', () => ({
    mkConfig: () => ({}),
    generateCsv: () => (_: unknown) => 'csv-data',
    download: () => (_: unknown) => undefined,
}));

import ExportDataComp from '~/components/global/ExportDataComp.vue';

const toastError = vi.fn();
const toastSuccess = vi.fn();

beforeEach(() => {
    toastError.mockReset();
    toastSuccess.mockReset();
    vi.stubGlobal('useNuxtApp', () => ({
        $toast: { error: toastError, success: toastSuccess },
    }));
    // stub getDataSet global util
    vi.stubGlobal('getDataSet', vi.fn().mockResolvedValue(null));
});

function mountComp(dataSetJson = '') {
    return mount(ExportDataComp, {
        props: { dataSetJson, dataSetId: [] },
        global: {
            mocks: { $t: (k: string) => k },
            stubs: { Icon: { template: '<i />' } },
        },
    });
}

describe('ExportDataComp toast i18n', () => {
    test('shows exportNoData toast when data is empty', async () => {
        const wrapper = mountComp('');
        // open menu then click CSV
        await wrapper.find('button').trigger('click');
        const menuItems = wrapper.findAll('[role="menuitem"]');
        expect(menuItems.length).toBeGreaterThan(0);
        await menuItems[0].trigger('click');
        expect(toastError).toHaveBeenCalledWith('exportNoData', expect.objectContaining({ timeout: 2000 }));
    });

    test('shows csvExported toast for valid CSV export', async () => {
        const validData = JSON.stringify([{ title: 'Test', year: 2020 }]);
        const wrapper = mountComp(validData);
        await wrapper.find('button').trigger('click');
        const menuItems = wrapper.findAll('[role="menuitem"]');
        await menuItems[0].trigger('click');
        expect(toastSuccess).toHaveBeenCalledWith('csvExported', expect.objectContaining({ timeout: 2000 }));
    });

    test('shows jsonExported toast for JSON export', async () => {
        const validData = JSON.stringify([{ title: 'Test' }]);
        const wrapper = mountComp(validData);
        await wrapper.find('button').trigger('click');
        const menuItems = wrapper.findAll('[role="menuitem"]');
        await menuItems[1].trigger('click');
        expect(toastSuccess).toHaveBeenCalledWith('jsonExported', expect.objectContaining({ timeout: 2000 }));
    });

    test('shows xmlExported toast for XML export', async () => {
        const validData = JSON.stringify([{ title: 'Test' }]);
        const wrapper = mountComp(validData);
        await wrapper.find('button').trigger('click');
        const menuItems = wrapper.findAll('[role="menuitem"]');
        await menuItems[2].trigger('click');
        expect(toastSuccess).toHaveBeenCalledWith('xmlExported', expect.objectContaining({ timeout: 2000 }));
    });
});
