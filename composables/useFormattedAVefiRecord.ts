import { getDataSet } from '@/utils/getDataSet';

export const useFormattedAVefiRecord = async (
    id: string,
    options?: { logErrors?: boolean }
): Promise<string> => {
    try {
        const normalizedId = id.includes('.') ? id : `21.11155/${id}`;
        const result = await getDataSet([normalizedId]);

        if (!result) {
            if (options?.logErrors) console.warn(`No data found for ID: ${normalizedId}`);
            return '';
        }

        return JSON.stringify(result, null, 2);
    } catch (error) {
        if (options?.logErrors) console.error(`Error fetching record for ID ${id}:`, error);
        return '';
    }
};
