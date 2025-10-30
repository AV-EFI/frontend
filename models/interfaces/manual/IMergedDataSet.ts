/* eslint-disable */
export interface NameGndEntry {
  name: string;
  gnd: number;
}

export interface NameTypeEntry {
  name: string;
  type: string;
}

export interface MergedDataset {
  title: string;
  other_ids: NameTypeEntry[];
  countries: NameGndEntry[];
  directors: NameGndEntry[];
  castmembers: NameGndEntry[];
  producers: NameGndEntry[];
  productionyears: string[];
  subjects: string[];
}
