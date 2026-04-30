import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';
import { config as loadEnv } from 'dotenv';

for (const file of ['.env', '.env.local']) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    loadEnv({ path: fullPath, override: true });
  }
}

const ENV_BACKEND_BASE =
  process.env.E2E_BACKEND_BASE
  || process.env.PUBLIC_AVEFI_ELASTIC_API
  || process.env.AVEFI_ELASTIC_API;

const BACKEND_BASE = ENV_BACKEND_BASE
  ? (ENV_BACKEND_BASE.startsWith('http') ? ENV_BACKEND_BASE : `http://localhost:8080${ENV_BACKEND_BASE}`)
  : 'http://localhost:8080/rest/v1';
const SEARCH_URL = `${BACKEND_BASE}/frontend/search`;
const INDEX = process.env.ELASTIC_INDEX || '21.11155-denormalised-work';

interface IssuerCounts {
  'avefi:WorkVariant': number;
  'avefi:Manifestation': number;
  'avefi:Item': number;
}

interface IssuerRow {
  name: string;
  id: string | null;
  doc_count: number;
  category_counts: IssuerCounts;
}

interface TopIssuersFile {
  generated_at: string;
  issuers: IssuerRow[];
}

function searchPayloadByIssuer(issuerName: string) {
  return [
    {
      indexName: INDEX,
      params: {
        query: '',
        page: 0,
        hitsPerPage: 20,
        facetFilters: [[`has_issuer_name:${issuerName}`]],
      },
    },
  ];
}

function readTopIssuers(): TopIssuersFile {
  const filePath = path.resolve(process.cwd(), 'data', 'top-issuers.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as TopIssuersFile;
}

test.describe('Issuer Counts Match Search Facet Results', () => {
  test.setTimeout(180_000);

  test('top-issuers category counts equal search result counters for has_issuer_name facet', async ({ request }) => {
    const topIssuers = readTopIssuers();

    expect(Array.isArray(topIssuers.issuers), 'top-issuers.json must contain issuers array').toBe(true);
    expect(topIssuers.issuers.length, 'top-issuers.json must contain at least one issuer').toBeGreaterThan(0);

    for (const issuer of topIssuers.issuers) {
      expect(issuer.category_counts, `Issuer ${issuer.name} is missing category_counts`).toBeTruthy();

      const res = await request.post(SEARCH_URL, {
        data: searchPayloadByIssuer(issuer.name),
      });

      expect(res.status(), `Search request failed for issuer ${issuer.name}`).toBe(200);

      const body = await res.json();
      const result = body?.results?.[0];

      expect(result, `Search result missing for issuer ${issuer.name}`).toBeTruthy();

      expect(
        result?.nbWorks,
        `[${issuer.name}] nbWorks mismatch`,
      ).toBe(issuer.category_counts['avefi:WorkVariant']);

      expect(
        result?.nbManifestations,
        `[${issuer.name}] nbManifestations mismatch`,
      ).toBe(issuer.category_counts['avefi:Manifestation']);

      expect(
        result?.nbItems,
        `[${issuer.name}] nbItems mismatch`,
      ).toBe(issuer.category_counts['avefi:Item']);
    }
  });
});
