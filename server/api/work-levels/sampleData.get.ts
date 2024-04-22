import { IAVefiListResponse, IDataAttributesWork, IAVefiData } from "~/models/interfaces/IAVefiWork";
import jsonSampleData from '~/models/sampleData/random_iavefiwork_50.json';

interface QueryInterface {
    title: string;
}

export default defineEventHandler(async (event) => {
    const query = await getQuery<QueryInterface>(event);
    if (query.title) {
        const searchTerm = query.title;
        if (searchTerm) {
            const filteredByTitle: IAVefiListResponse = filterByTitle(jsonSampleData, searchTerm);
            return filteredByTitle;
        }
    }
    return jsonSampleData;

});


// Function to filter the array based on Title
function filterByTitle(aVefiData: IAVefiListResponse, searchTerm: string): IAVefiListResponse {
    const filteredData: IAVefiData[] = aVefiData.data.filter((item: IAVefiData) => {
        // Check if the Title matches the search term
        return (item.attributes as IDataAttributesWork).Title.toLowerCase().includes(searchTerm.toLowerCase());
    });
    return {
        data: filteredData,
        meta: {
            "pagination": {
                "page": 1,
                "pageSize": 25,
                "pageCount": 1,
                "total": filteredData.length
            }
        }
    };
}
