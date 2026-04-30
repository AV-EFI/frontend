import type { InjectionKey } from 'vue';

export type SearchRefinementAction =
  | 'panel-facet-toggle'
  | 'panel-range-apply'
  | 'current-refinement-remove'
  | 'clear-all-refinements'
  | 'clear-production-year';

export interface SearchRefinementCoordinator {
  runRefinementAction: (action: SearchRefinementAction, operation: () => void) => void;
  notifyRefinementAction: (action: SearchRefinementAction, triggerSearch?: boolean) => void;
}

export const SEARCH_REFINEMENT_COORDINATOR_KEY: InjectionKey<SearchRefinementCoordinator> =
  Symbol('SEARCH_REFINEMENT_COORDINATOR_KEY');
