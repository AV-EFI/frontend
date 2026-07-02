export type Level = 'work' | 'manifestation' | 'item';

export type IconSegment = {
    text: string;
    hilite: boolean;
    facetValue?: string;
};

export type IconEntry = {
    key: string;
    icon: string;
    text: IconSegment[] | string;
    aria: string;
};
