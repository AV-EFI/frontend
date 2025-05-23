import Client from '@searchkit/api'
import { config } from '@/searchConfig_avefi'

export default defineEventHandler(async (event) => {
  const apiClient = Client(config, { debug: true })
  const body = await readBody(event)

  try {
    const response = await apiClient.searchkit.handleInstantSearchRequests(body, {
      hooks: {
        afterSearch: async (requests, responses) => responses,
        beforeSearch: async (searchRequests) => {
          return searchRequests.map((sr) => {
            const indexName = sr.indexName
            const allParams = sr.request?.params || {}
            const indexParams =
              allParams[indexName] && typeof allParams[indexName] === 'object'
                ? allParams[indexName]
                : allParams

            // Parse numeric refinements from 'numeric-refinements' (note the dash)
            const numericRefinements = indexParams['numeric-refinements'] || {}

            // Parse production_in_year range filters from numericRefinements
            const range = numericRefinements['production_in_year'] || {}
            const rangeFilters = []
            if (range['>='] !== undefined || range['<='] !== undefined) {
              const rangeQuery: any = {}
              if (range['>='] !== undefined) rangeQuery.gte = range['>=']
              if (range['<='] !== undefined) rangeQuery.lte = range['<=']
              rangeFilters.push({ range: { production_in_year: rangeQuery } })
            }

            // Check if prodYearsOnly filter is active
            const prodYearsOnlyActive = numericRefinements['prodYearsOnly']?.['='] === 1

            // Add exists filter if prodYearsOnly is active
            const mustExistFilters = prodYearsOnlyActive
              ? [{ exists: { field: 'production_in_year' } }]
              : []

            // Remove prodYearsOnly from numeric refinements so it is not processed again downstream
            if (prodYearsOnlyActive) {
              delete numericRefinements['prodYearsOnly']
            }

            const existingFilters = Array.isArray(sr.body.query?.bool?.filter)
              ? sr.body.query.bool.filter
              : []

            const updatedFilters = [
              ...existingFilters,
              ...rangeFilters,
              ...mustExistFilters
            ]

            return {
              ...sr,
              body: {
                ...sr.body,
                query: {
                  bool: {
                    ...sr.body.query?.bool,
                    filter: updatedFilters
                  }
                }
              }
            }
          })
        }
      }
    })

    return response
  } catch (ex) {
    console.error('[Search Error]', ex)
    return null
  }
})
