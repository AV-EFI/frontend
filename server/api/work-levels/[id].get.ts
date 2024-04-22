import type { IAVefiListResponse, IAVefiSingleResponse, IAVefiData } from "~/models/interfaces/IAVefiWork";
import jsonSampleData from '~/models/sampleData/random_iavefiwork_50.json';


export default defineEventHandler((event) => {
    if (event.context?.params?.id) {
        const paramId: Number = Number.parseInt(event.context?.params?.id?.toString());
        if (paramId) {
            return filterById(jsonSampleData, paramId);
        }
        // Do what you need to do with the id
    }
    return { hereIs: 'your data' };
});

// Function to filter the array based on Title
function filterById(aVefiData: IAVefiListResponse, paramId: Number): IAVefiSingleResponse {
    const filteredData: IAVefiData | undefined = aVefiData.data.find((item: IAVefiData) => {
        // Check if the Title matches the search term
        return item.id == paramId;
    });

    if (filteredData) {
        return {
            data: filteredData,
            meta: {
                "pagination": {
                    "page": 1,
                    "pageSize": 25,
                    "pageCount": 1,
                    "total": 1
                }
            }
        };
    }
    return {
        data: {} as IAVefiData,
        meta: {
            "error": "no data found"
        }
    };
}
