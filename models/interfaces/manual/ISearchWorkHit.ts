import type { IAVefiWorkVariant } from '~/models/interfaces/generated/IAVefiWorkVariant';
import type { IAVefiManifestation } from '~/models/interfaces/generated/IAVefiManifestation';
import type { IAVefiItem } from '~/models/interfaces/generated/IAVefiItem';

// The generated IAVefiWorkVariant/IAVefiManifestation are missing the nested
// manifestations/items arrays, and the Algolia/instantsearch-specific fields
// (objectID, category, _highlightResult), that the real search response
// actually returns, so they're added back on here against real usage across
// the search list views.
export type SearchItem = IAVefiItem & {
    // ES-index-only facet field, not part of the AVefi schema's Item type
    duration_in_minutes?: number;
};
export type SearchManifestation = IAVefiManifestation & { items?: SearchItem[] };

// Algolia highlight-result node shape, scoped to the fields actually read
// across the search list views (title + alternative titles).
type HighlightValue = { value?: string; matchLevel?: string; matchedWords?: string[] };
type WorkHighlightResult = {
    has_record?: {
        has_primary_title?: { has_name?: HighlightValue };
        has_alternative_title?: { has_name?: HighlightValue[] };
    };
};

export type SearchWorkHit = IAVefiWorkVariant & {
    manifestations?: SearchManifestation[];
    items?: SearchItem[];
    objectID?: string;
    category?: string;
    _highlightResult?: WorkHighlightResult;
};
