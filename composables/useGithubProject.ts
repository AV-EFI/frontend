export interface GithubProjectItem {
    id: string;
    type: string;
    content?: {
        id: string;
        number?: number;
        title: string;
        body?: string;
        state?: string;
        url?: string;
        createdAt: string;
        updatedAt: string;
        assignees?: {
            nodes: Array<{
                login: string;
                name?: string;
            }>;
        };
        labels?: {
            nodes: Array<{
                name: string;
                color: string;
            }>;
        };
    };
    fieldValues?: {
        nodes: Array<{
            text?: string;
            number?: number;
            name?: string;
            date?: string;
            field: {
                name: string;
            };
        }>;
    };
}

export interface GithubProject {
    id: string;
    title: string;
    shortDescription?: string;
    items: {
        nodes: GithubProjectItem[];
    };
    fields: {
        nodes: Array<{
            id: string;
            name: string;
            dataType: string;
            options?: Array<{
                id: string;
                name: string;
            }>;
        }>;
    };
}

export const useGithubProject = () => {
    const { $apiFetch } = useNuxtApp();

    const fetchProjectBoard = async (): Promise<{ project: GithubProject; timestamp: string }> => {
        try {
            const data = await $apiFetch('/api/github/project-board');
            return data;
        } catch (error) {
            console.error('Failed to fetch GitHub project board:', error);
            throw error;
        }
    };

    const transformProjectItemsForExport = (project: GithubProject) => {
        if (!project?.items?.nodes) {
            return [];
        }

        return project.items.nodes.map((item: GithubProjectItem) => {
            const content = item.content;
            const fieldValues: Record<string, any> = {};
            
            // Extract custom field values
            if (item.fieldValues?.nodes) {
                item.fieldValues.nodes.forEach(fieldValue => {
                    const fieldName = fieldValue.field.name;
                    if (fieldValue.text !== undefined) {
                        fieldValues[fieldName] = fieldValue.text;
                    } else if (fieldValue.number !== undefined) {
                        fieldValues[fieldName] = fieldValue.number;
                    } else if (fieldValue.name !== undefined) {
                        fieldValues[fieldName] = fieldValue.name;
                    } else if (fieldValue.date !== undefined) {
                        fieldValues[fieldName] = fieldValue.date;
                    }
                });
            }

            return {
                id: item.id,
                type: item.type,
                number: content?.number || '',
                title: content?.title || '',
                body: content?.body || '',
                state: content?.state || '',
                url: content?.url || '',
                created_at: content?.createdAt || '',
                updated_at: content?.updatedAt || '',
                assignees: content?.assignees?.nodes?.map(a => a.name || a.login).join(', ') || '',
                labels: content?.labels?.nodes?.map(l => l.name).join(', ') || '',
                ...fieldValues
            };
        });
    };

    const getProjectBoardExportData = async () => {
        const { project } = await fetchProjectBoard();
        return transformProjectItemsForExport(project);
    };

    return {
        fetchProjectBoard,
        transformProjectItemsForExport,
        getProjectBoardExportData
    };
};