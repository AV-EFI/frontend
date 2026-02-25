import axios from 'axios';
import { createError } from 'h3';

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_URL = process.env.STRAPI_URL;

// Allow only alphanumeric characters, hyphens, and underscores for content type names
const CONTENTTYPE_RE = /^[a-zA-Z0-9_-]+$/;
// Allow only BCP 47-like locale strings (e.g. "en", "de", "en-US", "zh-Hant")
const LOCALE_RE = /^[a-zA-Z]{2,8}(-[a-zA-Z0-9]{1,8})*$/;

interface GetCMSContentParams {
    contenttype: string;
    id?: string;
    locale?: string;
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as GetCMSContentParams;
    const { contenttype, id, locale } = query;

    if (!contenttype || !CONTENTTYPE_RE.test(contenttype)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid content type' });
    }

    if (locale && !LOCALE_RE.test(locale)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid locale' });
    }

    const url = `${STRAPI_URL}/api/${encodeURIComponent(contenttype)}${locale ? `?locale=${encodeURIComponent(locale)}` : ''}`;

    try {
        const response = await axios.get(url, {
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