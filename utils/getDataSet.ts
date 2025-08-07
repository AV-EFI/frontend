import type { ElasticGetByIdResponse } from '~/models/interfaces/generated/IElasticResponses';

const getDataSet = async function (routeParamsId: string): Promise<ElasticGetByIdResponse | null> { 

    console.log('***');
    console.log('getDataSet', routeParamsId);

    const config = useRuntimeConfig();

    const { data } = await useApiFetchLocal<ElasticGetByIdResponse>(
        `${config.public.AVEFI_ELASTIC_API}/${config.public.AVEFI_GET_WORK}/${routeParamsId}`,
        {
            method: 'GET',
            headers: {
                //'Authorization': `ApiKey ${config.public.ELASTIC_IMDB_APIKEY}`
            },
            /*
            body: {
                documentId: routeParamsId
            }
                */
        }
    );
    
    if (data.value) {
        console.log('getDataSet data.value', data.value);
        return data.value as ElasticGetByIdResponse;
    }
    return null;
};

export { getDataSet };