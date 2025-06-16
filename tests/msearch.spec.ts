import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { describe, it, expect } from 'vitest'

import Client from '@searchkit/instantsearch-client'
import { config } from '../searchConfig_avefi.ts'

const searchClient = Client({
  config: config,
  url: 'http:localhost:3000/api/elastic/msearch'
})

const indexName = process.env.ELASTIC_INDEX;


/**
 FAIL  tests/msearch.spec.ts > Searchkit instantsearch-client facet filtering > filters correctly by facet "in_language_code" = "deu"
 FAIL  tests/msearch.spec.ts > Searchkit instantsearch-client facet filtering > filters correctly by facet "has_format_type" = "35mmFilm"
 */
 const allFacets = [
  'castmembers',
  'directors_or_editors',
  'has_colour_type',
  'has_duration_has_value',
  'has_form',
  'has_format_type',
  'has_genre_has_name',
  'has_issuer_name',
  'has_sound_type',
  'in_language_code',
  'item_element_type',
  'located_in_has_name',
  'manifestation_event_type',
  'production',
  'subjects'
]

// facets that use nested filtering in your searchConfig_avefi.ts
const nestedFacets = new Set([
  'has_format_type',
  'item_element_type',
  'in_language_code',
  'has_sound_type',
  'has_colour_type',
  'has_duration_has_value',
  'has_issuer_name',
  'manifestation_event_type'
])

const testFacets = [
  { key: 'has_sound_type', value: 'Silent' },
  { key: 'has_colour_type', value: 'Colour' },
  { key: 'has_duration_has_value', value: 'PT00H10M00S' },
  { key: 'has_issuer_name', value: 'Haus des Dokumentarfilms' },
  { key: 'in_language_code', value: 'deu' },
  { key: 'has_format_type', value: '35mmFilm' },
  { key: 'item_element_type', value: 'Positive' },
  { key: 'has_form', value: 'HomeMovie' },
  { key: 'has_genre_has_name', value: 'Dokumentation' },
  { key: 'castmembers', value: 'Rühmann, Heinz' },
  { key: 'directors_or_editors', value: 'Troller, Georg Stefan' },
  { key: 'production', value: 'Schlenker, Hermann' },
  { key: 'subjects', value: 'Amateurfilm' },
  { key: 'located_in_has_name', value: 'Deutschland' },
  { key: 'manifestation_event_type', value: 'TheatricalDistributionEvent' }
]

// Test suite for Searchkit instantsearch-client facet filtering
describe('Searchkit instantsearch-client facet filtering', () => {
  testFacets.forEach(({ key, value }) => {
    it(
      `filters correctly by facet "${key}" = "${value}"`,
      async () => {
        try {
          const response = await searchClient.search([
            {
              indexName,
              params: {
                query: '',
                facetFilters: [[`${key}:${value}`]],
                hitsPerPage: 5,
                facets: allFacets
              }
            }
          ]);

            expect(response).toBeDefined();
            console.log(response);

            const facets = response.results[0].facets;
//            expect(facets).toBeDefined();
            //console.log(facets, 'facets found for', key, value);
          const hits = response?.results[0]?.hits?? [];
          console.log(hits.length, 'hits found for facet', key, value);

          if (hits.length === 0) {
            console.warn(`❌ No hits for facet ${key}:${value}`)
            //console.dir(results, { depth: null })
          }

          if (nestedFacets.has(key)) {
            // only expect inner_hits on known nested filters
            const hasInnerHits = hits.every((hit: any) => hit.inner_hits && Object.keys(hit.inner_hits).length > 0)
            expect(hasInnerHits).toBe(true)
          } else {
            expect(hits.length).toBeGreaterThan(0)
          }

        } catch (err) {
          console.error(`❌ ERROR on facet ${key}:${value}`);
          console.error(err);
          throw err;
        }
      },
      30000 // timeout per test
    )
  })

  it('returns results for query "Schlenker"', async () => {
    const response = await searchClient.search([
      {
        indexName,
        params: {
          query: 'Schlenker',
          hitsPerPage: 5,
          facets: allFacets
        }
      }
    ]);
  
    const hits = response?.results?.[0]?.hits ?? [];
    console.log(hits.length, 'hits found for query "Schlenker"');
    expect(hits.length).toBeGreaterThan(0);
  }, 10000);
  
  it('returns results for query "Metropolis"', async () => {
    const response = await searchClient.search([
      {
        indexName,
        params: {
          query: 'Metropolis',
          hitsPerPage: 5,
          facets: allFacets
        }
      }
    ]);
  
    const hits = response?.results?.[0]?.hits ?? [];
    console.log(hits.length, 'hits found for query "Metropolis"');
    expect(hits.length).toBeGreaterThan(0);
  }, 10000);


  it('returns results for query "Schlenker"', async () => {
    const response = await searchClient.search([
      {
        indexName,
        params: {
          query: 'Zweiter Weltkrieg',
          hitsPerPage: 3,
          facets: allFacets
        }
      }
    ]);
  
    const hits = response?.results?.[0]?.hits ?? [];
    console.log(hits.length, 'hits found for query "Zweiter Weltkrieg"');
    expect(hits.length).toBeGreaterThan(0);
  }, 10000);

});