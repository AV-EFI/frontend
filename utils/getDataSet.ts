import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses.js';

const getDataSet = async function (routeParamsId: string): Promise<ElasticGetByIdResponse | null> { 
try {

    const config = useRuntimeConfig();
    const route = `${config.public.AVEFI_ELASTIC_API}/${config.public.AVEFI_GET_WORK}/${routeParamsId}`;
    const { data } = await useFetch(route);

    if (data.value) {
        return data.value;
    }
    return null;
}
catch (e) {
    console.error('getDataSet error', e);
    return null;
}
};

export { getDataSet };