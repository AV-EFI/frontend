import type { IAVefiListResponse } from '../models/interfaces/IAVefiWork';

const getDataSet = async function (routeParamsId: string[]): Promise<IAVefiListResponse | null> { 
    const config = useRuntimeConfig();

    const { data } = await useApiFetchLocal<IAVefiListResponse>(
        `${config.public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_WORK}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `ApiKey ${config.public.ELASTIC_IMDB_APIKEY}`
            },
            body: {
                documentId: routeParamsId
            }
        }
    );
    
    if (data.value) {
        return data.length == 1 ? data?.value[0] : data.value;
    }
    return null;
};

const getDataSetSerial = async function (routeParamsId: string[]): Promise<IAVefiListResponse | null> { 

    const config = useRuntimeConfig();
    const { data } = await useApiFetchLocal<IAVefiListResponse>(
        `${config.public.AVEFI_ELASTIC_API}/${useRuntimeConfig().public.AVEFI_GET_WORK_BY_IS_PART_OF}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `ApiKey ${config.public.ELASTIC_IMDB_APIKEY}`
            },
            body: {
                documentId: routeParamsId
            }
        }
    );
    
    if (data.value) {
        return data.length == 1 ? data?.value[0] : data.value;
    }
    return null;
};

export { getDataSet, getDataSetSerial };