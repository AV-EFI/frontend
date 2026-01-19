/* eslint-disable */
export interface IVocabEntry {
  term: string;
  label: string;
  labels: {
    de?: string;
    en?: string;
  }
  description: string;
  definition: string;
  enumSource: string;
  category: string;
  isTranslated: boolean;
}
