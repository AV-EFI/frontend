import { defineStore } from 'pinia';

export const useSearchParamsStore = defineStore({
    id: 'searchParamsStore',
    state: () => {
        return {
            //formData: useStorage('avefi-searchParams', [])            
            formData: {
                searchToggle: false,
                regularSearch: {
                    searchTerm: '',
                    optionsList: [] as IOptions[]
                } as IRegularSearch | null,
                extendedSearch: {
                    searchTermExtended: '', operators: [{
                        searchTerm: '',
                        booleanOperator: 'and',
                        fieldOperator: 'Title'
                    }
                    ]
                } as IExtendedSearch | null
            }
        };
    },
    actions: {
        /*
        async searchMovies({ search }: { search?: string }) {
            let apiUrl = `${useRuntimeConfig().public.frontendUrl}/api/work-levels/sampleData`;
            if (search) {
                apiUrl += `?title=${search}`;
            }

            const { data: response } = await useApiFetch<IAVefiListResponse>(apiUrl, { method: 'GET' });

            if (response) {
                //return data.value;
                console.log(response.value);
                return response.value?.data.map((item: any) => {
                    if (item.attributes.Title) {
                        return {
                            'label': item.attributes.Title,
                            'value': item.id
                        };
                    }
                    return { label: 'Unknown title', value: item.id };
                });
            }
            return null;
        }
            */
    },
    getters: {
    },
    persist: {
        key: 'avefi-searchparams',
        storage: persistedState.sessionStorage,
        paths: ['formData']
    }
}
);

interface IOperators {
    searchTerm: string,
    booleanOperator: string,
    fieldOperator: string
}

interface IOptions {
    label: string,
    value: string
}

interface IExtendedSearch {
    searchTermExtended: string,
    fieldOperator: string
    operators: IOperators[]
}

interface IRegularSearch {
    searchTerm: string,
    optionsList: IOptions[]
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