export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const query = getQuery(event);
    
    // GitHub organization and project number from the URL
    const org = 'AV-EFI';
    const projectNumber = 1;
    
    if (!config.GITHUB_TOKEN) {
        throw createError({
            statusCode: 401,
            statusMessage: 'GitHub token not configured'
        });
    }

    try {
        // GitHub GraphQL API query to get project board data
        const graphqlQuery = `
            query($org: String!, $projectNumber: Int!) {
                organization(login: $org) {
                    projectV2(number: $projectNumber) {
                        id
                        title
                        shortDescription
                        items(first: 100) {
                            nodes {
                                id
                                type
                                content {
                                    ... on Issue {
                                        id
                                        number
                                        title
                                        body
                                        state
                                        url
                                        createdAt
                                        updatedAt
                                        assignees(first: 10) {
                                            nodes {
                                                login
                                                name
                                            }
                                        }
                                        labels(first: 20) {
                                            nodes {
                                                name
                                                color
                                            }
                                        }
                                    }
                                    ... on PullRequest {
                                        id
                                        number
                                        title
                                        body
                                        state
                                        url
                                        createdAt
                                        updatedAt
                                        assignees(first: 10) {
                                            nodes {
                                                login
                                                name
                                            }
                                        }
                                        labels(first: 20) {
                                            nodes {
                                                name
                                                color
                                            }
                                        }
                                    }
                                    ... on DraftIssue {
                                        id
                                        title
                                        body
                                        createdAt
                                        updatedAt
                                        assignees(first: 10) {
                                            nodes {
                                                login
                                                name
                                            }
                                        }
                                    }
                                }
                                fieldValues(first: 20) {
                                    nodes {
                                        ... on ProjectV2ItemFieldTextValue {
                                            text
                                            field {
                                                ... on ProjectV2FieldCommon {
                                                    name
                                                }
                                            }
                                        }
                                        ... on ProjectV2ItemFieldNumberValue {
                                            number
                                            field {
                                                ... on ProjectV2FieldCommon {
                                                    name
                                                }
                                            }
                                        }
                                        ... on ProjectV2ItemFieldSingleSelectValue {
                                            name
                                            field {
                                                ... on ProjectV2FieldCommon {
                                                    name
                                                }
                                            }
                                        }
                                        ... on ProjectV2ItemFieldDateValue {
                                            date
                                            field {
                                                ... on ProjectV2FieldCommon {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        fields(first: 20) {
                            nodes {
                                ... on ProjectV2Field {
                                    id
                                    name
                                    dataType
                                }
                                ... on ProjectV2SingleSelectField {
                                    id
                                    name
                                    dataType
                                    options {
                                        id
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const response = await $fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'User-Agent': 'AVEfi-Frontend/1.0'
            },
            body: {
                query: graphqlQuery,
                variables: {
                    org,
                    projectNumber
                }
            }
        });

        if (response.errors) {
            throw createError({
                statusCode: 400,
                statusMessage: 'GitHub API Error',
                data: response.errors
            });
        }

        return {
            project: response.data?.organization?.projectV2,
            timestamp: new Date().toISOString()
        };

    } catch (error: any) {
        console.error('GitHub API Error:', error);
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message || 'Failed to fetch GitHub project data'
        });
    }
});