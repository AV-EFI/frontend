import { defineStore } from 'pinia';
import type { IAVefiListResponse } from '../models/interfaces/IAVefiWork.ts';

export const useSearchResultsStore = defineStore({
    id: 'searchResults',
    state: () => {
        return {
            searchResults: null as IAVefiListResponse | null,
            viewMode: ViewModes.List as ViewModes
        };
    },
    actions: {
        async updateResults(searchParamsFormData: SearchComp) {
            if (searchParamsFormData.extendedSearch?.searchTermExtended) {
                this.convertStoreToRequestData('rest', searchParamsFormData);
                console.log("updateResults");
                console.log(searchParamsFormData);
            }
        },
        async convertStoreToRequestData(type: String, searchFormData: SearchComp) {
            //REST or GraphQL
            //validation here?
            if (type === 'rest') {

                console.log("preparing rest ...");
                console.log(searchFormData);
                const queryString: string = this.convertToFieldFilters(searchFormData);
                this.performSearchRequestREST(queryString);

            } else if (type === 'graphql') {
                console.log("preparing graphql ...");
                //this.performSearchRequestGRAPHQL(searchFormData);
            } else {
                throw new Error("naw");
            }
        },
        async performSearchRequestREST(queryString: string) {
            console.log("performing search request");
            console.log(queryString);
            const apiUrl = `${useRuntimeConfig().public.frontendUrl}/api/work-levels/sampleData?${queryString}`;
            const { data: response } = await useApiFetch<IAVefiListResponse>(apiUrl, { method: 'GET' });
            this.searchResults = response.value;
        },
        convertToFieldFilters(searchComp: ISearchComp): string {
            const filters: string[] = [];

            if (!searchComp.searchToggle) {
                // Regular search filter
                if (searchComp.searchToggle == false && searchComp.regularSearch?.searchTerm) {
                    filters.push(`title=${searchComp.regularSearch.searchTerm}`);
                }
            } else {
                // Extended search filters
                if (searchComp.extendedSearch && searchComp.extendedSearch.searchTermExtended && searchComp.extendedSearch.fieldOperator) {
                    filters.push(`${searchComp.extendedSearch.fieldOperator}=${searchComp.extendedSearch.searchTermExtended.trim()}`);

                    // Operators filters
                    const operatorFilters = searchComp.extendedSearch.operators.map(operator => {
                        if (operator.searchTerm) {
                            return `[${operator.fieldOperator}][${operator.booleanOperator}]=${operator.searchTerm}`;
                        }
                        return null;
                    });

                    if (operatorFilters.length > 0) {
                        filters.push(operatorFilters.join('&'));
                    }
                }
            }

            // Construct the query string by joining the filters array with '&'
            let filtersString = filters.join('&');
            if (filtersString.endsWith('&')) {
                filtersString = filtersString.slice(0, -1);
            }
            return filtersString;
        },
        convertToFieldFiltersStrapi(searchComp: ISearchComp): string {
            const filters: string[] = [];

            if (!searchComp.searchToggle) {
                // Regular search filter
                if (searchComp.searchToggle == false && searchComp.regularSearch?.searchTerm) {
                    filters.push(`filters[Title][$contains]=${searchComp.regularSearch.searchTerm}`);
                }
            } else {
                // Extended search filters
                if (searchComp.extendedSearch && searchComp.extendedSearch.searchTermExtended && searchComp.extendedSearch.fieldOperator) {
                    filters.push(`filters[${searchComp.extendedSearch.fieldOperator}][$contains]=${searchComp.extendedSearch.searchTermExtended.trim()}`);

                    // Operators filters
                    const operatorFilters = searchComp.extendedSearch.operators.map(operator => {
                        if (operator.searchTerm) {
                            return `[${operator.fieldOperator}][${operator.booleanOperator}]=${operator.searchTerm}`;
                        }
                        return null;
                    });

                    if (operatorFilters.length > 0) {
                        filters.push(operatorFilters.join('&'));
                    }
                }
            }

            // Construct the query string by joining the filters array with '&'
            let filtersString = filters.join('&');
            if (filtersString.endsWith('&')) {
                filtersString = filtersString.slice(0, -1);
            }
            return filtersString;
        }
    },
    getters: {
    },
    persist: {
        key: 'avefi-searchpref',
        storage: persistedState.localStorage,
        paths: ['viewMode', 'searchResults']
    }
});

enum ViewModes {
    List = "list",
    Grid = "grid"
}

interface IOperators {
    searchTerm: string,
    booleanOperator: string,
    fieldOperator: string
}

interface IExtendedSearch {
    searchTermExtended: string,
    fieldOperator: string
    operators: IOperators[]
}

interface IRegularSearch {
    searchTerm: string
}

interface ISearchComp {
    searchToggle: boolean,
    regularSearch: IRegularSearch | null,
    extendedSearch: IExtendedSearch | null,
}

class SearchComp implements ISearchComp {
    searchToggle: boolean;
    regularSearch: IRegularSearch | null;
    extendedSearch: IExtendedSearch | null;

    constructor() {
        this.searchToggle = false;
        this.regularSearch = { searchTerm: "" } as IRegularSearch;
        this.extendedSearch = {
            searchTermExtended: '',
            operators: [{
                searchTerm: '',
                booleanOperator: 'and',
                fieldOperator: 'Title'
            }]
        } as IExtendedSearch;
    }
}