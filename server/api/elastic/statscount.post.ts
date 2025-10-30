/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineEventHandler, readBody } from 'h3';
import { Client } from '@elastic/elasticsearch';


export default defineEventHandler(async (event) => {
    const index = useRuntimeConfig().public.ELASTIC_INDEX_DETAIL;
    // Initialize the ElasticSearch client
    const client = new Client({
        node: useRuntimeConfig().public.ELASTIC_HOST_PUBLIC || 'http://localhost:9200',
    });

    try {
    // Read the body of the POST request
        const body = await readBody(event);

        // Validate request body
        if (!body) {
            throw new Error('Invalid request: "index" and "query" fields are required.');
        }

        // Destructure the request body
        const { query } = body;
        const institutionid:string = `https://w3id.org/isil/${query.term}`;


        // Integrate the query into a bigger Elasticsearch bool query
        const integratedQuery = {
            bool: {
                must: [
                    { term: { 'has_record.category.keyword': query.cat } },
                    { term: { 'has_record.described_by.has_issuer_id.keyword': institutionid } },
                ]
            }
        };

        console.log(integratedQuery);

        // Perform the search query
        const response = await client.count({
            index,
            query: integratedQuery,
        });

        // Return the ElasticSearch results
        return {
            success: true,
            data: response.count,
        };
    } catch (error: any) {
    // Handle and return errors
        return {
            success: false,
            message: error.message || 'An error occurred while processing the request.',
        };
    }
});
