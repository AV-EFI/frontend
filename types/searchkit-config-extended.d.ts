import type { SearchkitConfig as BaseSearchkitConfig } from "searchkit";

export interface SearchkitConfigExtended extends BaseSearchkitConfig {
  nbWorks?: number;
  nbManifestations?: number;
  nbItems?: number;
}
