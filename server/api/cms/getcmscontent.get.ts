import axios from 'axios';

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_URL = process.env.STRAPI_URL;

interface GetCMSContentParams {
    contenttype: string;
    id?: string;
    locale?: string;
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as GetCMSContentParams;
    const { contenttype, id, locale } = query;

    try {
        const response = await axios.get(`${STRAPI_URL}/api/${contenttype}?${locale?'locale='+locale:''}`, {
            params: id ? { id } : {},
            headers: {
                Authorization: `Bearer ${STRAPI_TOKEN}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching CMS content:', error);
        throw error;
    }
});