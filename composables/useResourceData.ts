import type { ElasticGetByIdResponse } from '@/models/interfaces/generated/IElasticResponses.js';
import { ref } from 'vue';
import { getDataSet } from '@/utils/getDataSet.js';

export const useResourceData = async (id: string, prefix?: string) => {
    try {

        const resourceType = ref<string>('workVariant'); // Default resource type
  
        // Handle missing prefix - expect it to be 21.11155
        let fullId = id;
        if (prefix && id.indexOf('.') < 0) {
            fullId = `${prefix}/${id}`;
        }
  
        const data: ElasticGetByIdResponse | null = await getDataSet(fullId);
        console.log('Data:', data);
  
        // Extract resource_type from the response if available
        if (data?.compound_record?.resource_type) {
            resourceType.value = data.compound_record.resource_type;
        } else {
            if(data?.handle !== data?.compound_record?._source.handle) {
                if(data?.compound_record?._source?.manifestations && data?.compound_record?._source?.manifestations.length > 0) {
                    resourceType.value = "manifestationOrItem";
                } else if(data?.compound_record?._source?.items && data?.compound_record?._source?.items.length > 0) {
                    resourceType.value = "manifestationOrItem";
                    console.log('Data compound_record source:', data?.compound_record?._source);
                }
            } else {
                if(data?.compound_record?._source?.parts && data?.compound_record?._source?.has_record.type == "Serial") {
                    resourceType.value = "compilation";
                } else if(data?.compound_record?._source?.has_record?.is_manifestation_of?.length > 1) {
                    resourceType.value = "compilationManifestation";
                }
            }
        }  
        // Modify handle for manifestationOrItem type
        let effectiveHandle = fullId;
        if (resourceType.value === 'manifestationOrItem' && data) {
            effectiveHandle = `${data.compound_record?._source?.handle}#${data.handle}`;
        }
  
        return {
            data: data as ElasticGetByIdResponse,
            resourceType,
            effectiveHandle
        };
    } catch (error) {
        console.error('Error in useResourceData:', error);
        return {
            data: null,
            resourceType: ref<string>('workVariant')
        };
    }
};
