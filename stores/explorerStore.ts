import { defineStore } from 'pinia';
import { CASES } from '~/utils/explorer/cases';
import type { GroupId, RuleId } from '~/utils/explorer/model';
import type { LevelId } from '~/utils/explorer/schemaModel';
import { persistedLocalStorage } from '~/utils/persistedStorage';

export type ExplorerView = 'model' | 'cases';
export type ExplorerHighlight = 'required' | 'match' | null;

/** What the information drawer shows. Null keeps the drawer closed. */
export type ExplorerSelection =
  | { kind: 'overview' }
  | { kind: 'level'; id: LevelId }
  | { kind: 'rule'; id: RuleId }
  | { kind: 'group'; id: GroupId; field?: string }
  | { kind: 'imports' }
  | { kind: 'caseRules' }
  | null;

/** Bump when the shape of the saved progress changes; older progress is then ignored. */
export const EXPLORER_PROGRESS_KEY = 'avefi-explorer-progress-v1';

export const useExplorerStore = defineStore('explorer', {
  state: () => ({
    view: 'model' as ExplorerView,
    highlight: null as ExplorerHighlight,
    openLevels: [] as LevelId[],
    selection: null as ExplorerSelection,
    /** Element the view should scroll to and flash, set when the drawer links into the overview. */
    scrollTarget: null as string | null,
    activeCaseId: null as string | null,
    solvedCaseIds: [] as string[],
  }),
  getters: {
    openCaseCount: (state): number => CASES.filter((item) => !state.solvedCaseIds.includes(item.id)).length,
    drawerOpen: (state): boolean => state.selection !== null,
  },
  actions: {
    setView(view: ExplorerView) {
      this.view = view;
      this.selection = null;
    },
    toggleHighlight(highlight: Exclude<ExplorerHighlight, null>) {
      this.highlight = this.highlight === highlight ? null : highlight;
    },
    isLevelOpen(level: LevelId): boolean {
      return this.openLevels.includes(level);
    },
    /** Showing or hiding the fields of a level never opens the information drawer; the details button does. */
    toggleLevel(level: LevelId) {
      this.openLevels = this.isLevelOpen(level)
        ? this.openLevels.filter((open) => open !== level)
        : [...this.openLevels, level];
    },
    toggleLevelDetails(level: LevelId) {
      const shown = this.selection?.kind === 'level' && this.selection.id === level;
      this.selection = shown ? null : { kind: 'level', id: level };
    },
    select(selection: Exclude<ExplorerSelection, null>) {
      this.selection = selection;
    },
    selectField(group: GroupId, field: string) {
      const same = this.selection?.kind === 'group' && this.selection.id === group && this.selection.field === field;
      this.selection = same ? null : { kind: 'group', id: group, field };
    },
    closeDrawer() {
      this.selection = null;
    },
    /** From the drawer: open a level, select it and bring it into view. */
    goToLevel(level: LevelId) {
      if (!this.isLevelOpen(level)) this.openLevels = [...this.openLevels, level];
      this.selection = { kind: 'level', id: level };
      this.scrollTarget = `level-${level}`;
    },
    /** From the drawer: show a group of fields inside a level. */
    showGroupAt(group: GroupId, level: LevelId) {
      if (!this.isLevelOpen(level)) this.openLevels = [...this.openLevels, level];
      this.scrollTarget = `group-${level}-${group}`;
    },
    clearScrollTarget() {
      this.scrollTarget = null;
    },
    openCase(id: string) {
      this.activeCaseId = id;
    },
    closeCase() {
      this.activeCaseId = null;
    },
    markSolved(id: string) {
      if (!this.solvedCaseIds.includes(id)) this.solvedCaseIds = [...this.solvedCaseIds, id];
    },
  },
  persist: {
    key: EXPLORER_PROGRESS_KEY,
    storage: persistedLocalStorage,
    pick: ['solvedCaseIds'],
  },
});
