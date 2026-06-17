export type ClickableFacetConfig =
    | {
        type: 'refinementList';
        labelKey?: string;
    }
    | {
        type: 'numericRange';
        labelKey?: string;
        attribute: string;
        minOperator: string;
        maxOperator: string;
    };

export const clickableFacetConfig: Record<string, ClickableFacetConfig> = {
    has_genre_has_name: { type: 'refinementList', labelKey: 'has_genre_has_name' },
    subjects: { type: 'refinementList', labelKey: 'subjects' },
    subject: { type: 'refinementList', labelKey: 'subject' },
    creators: { type: 'refinementList', labelKey: 'creators' },
    castmembers: { type: 'refinementList', labelKey: 'castmembers' },
    production: { type: 'refinementList', labelKey: 'production' },
    located_in_has_name: { type: 'refinementList', labelKey: 'located_in_has_name' },
    manifestation_event_type: { type: 'refinementList', labelKey: 'manifestation_event_type' },
    has_issuer_name: { type: 'refinementList', labelKey: 'has_issuer_name' },
    has_access_status: { type: 'refinementList', labelKey: 'has_access_status' },
    has_format_type: { type: 'refinementList', labelKey: 'has_format_type' },
    has_colour_type: { type: 'refinementList', labelKey: 'has_colour_type' },
    has_sound_type: { type: 'refinementList', labelKey: 'has_sound_type' },
    in_language_code: { type: 'refinementList', labelKey: 'in_language_code' },
    has_duration_has_value: { type: 'refinementList', labelKey: 'has_duration_has_value' },
    has_extent_has_value: { type: 'refinementList', labelKey: 'has_extent_has_value' },
    item_element_type: { type: 'refinementList', labelKey: 'item_element_type' },
    has_form: { type: 'refinementList', labelKey: 'has_form' },
    productionyear: {
        type: 'numericRange',
        labelKey: 'productionyear',
        attribute: 'production_in_year',
        minOperator: '>=',
        maxOperator: '<=',
    },
};

export function clickableFacetLabelKey(attribute: string): string {
    return clickableFacetConfig[attribute]?.labelKey || attribute;
}
