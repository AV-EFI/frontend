/**
 * The cases of the light table. The first three follow the examples of the AVefi Manual 2.2,
 * section 5.8 (work match); the last two are invented illustrations of the same rules at other
 * fields (a spelling of the title, a year apart). All films, archives and names are invented or illustrative;
 * the German and English wording is in i18n/locales/explorer.ts under cases.<textKey>.
 */

type CaseTextKey = 'undine' | 'smultron' | 'christmas' | 'harbour' | 'nightTrain';
type CaseRowLabel = 'title' | 'place' | 'year' | 'director' | 'directorFilmmaker' | 'gnd' | 'genre';
type CaseValueKey = 'none' | 'germany' | 'sweden' | 'amateurFilm' | 'featureFilm';

/** A value is either a literal (names, years, identifiers) or a word that has to be translated. */
export type CaseValue = string | { key: CaseValueKey };

export interface CaseRow {
  label: CaseRowLabel;
  /** Value in the new delivery. */
  incoming: CaseValue;
  /** Value of the record already in the system. */
  existing: CaseValue;
  /** Whether the two values are the same for the work match. */
  same: boolean;
}

interface CaseChoice {
  id: string;
  /** Whether this decision is the one the Manual 2.2 supports. */
  correct: boolean;
}

export interface ExplorerCase {
  id: CaseTextKey;
  year: number;
  rows: readonly CaseRow[];
  choices: readonly CaseChoice[];
}

export const CASES: readonly ExplorerCase[] = [
  {
    id: 'undine',
    year: 2019,
    rows: [
      { label: 'title', incoming: 'Undine', existing: 'Undine', same: true },
      { label: 'place', incoming: { key: 'germany' }, existing: { key: 'germany' }, same: true },
      { label: 'year', incoming: '2019', existing: '2019', same: true },
      { label: 'director', incoming: 'Petzoldt, Christian', existing: 'Petzold, Christian', same: false },
      { label: 'gnd', incoming: { key: 'none' }, existing: { key: 'none' }, same: true },
    ],
    choices: [
      { id: 'merge', correct: true },
      { id: 'split', correct: false },
    ],
  },
  {
    id: 'smultron',
    year: 1957,
    rows: [
      { label: 'title', incoming: 'Smultronstället', existing: 'Smultronstället', same: true },
      { label: 'place', incoming: { key: 'sweden' }, existing: { key: 'sweden' }, same: true },
      { label: 'year', incoming: '1957', existing: '1957', same: true },
      { label: 'director', incoming: 'Bergmann, Ingmar', existing: 'Bergman, Ingmar', same: false },
      { label: 'gnd', incoming: '118509519', existing: '118509519', same: true },
    ],
    choices: [
      { id: 'confirm', correct: true },
      { id: 'unmerge', correct: false },
    ],
  },
  {
    id: 'christmas',
    year: 1977,
    rows: [
      { label: 'title', incoming: 'Weihnachten', existing: 'Weihnachten', same: true },
      { label: 'genre', incoming: { key: 'amateurFilm' }, existing: { key: 'amateurFilm' }, same: true },
      { label: 'place', incoming: { key: 'germany' }, existing: { key: 'germany' }, same: true },
      { label: 'year', incoming: '1977', existing: '1978', same: false },
      { label: 'directorFilmmaker', incoming: 'Müller, Heinz', existing: 'Müller, Heinz', same: true },
    ],
    choices: [
      { id: 'split', correct: true },
      { id: 'merge', correct: false },
    ],
  },
  {
    id: 'harbour',
    year: 1954,
    rows: [
      { label: 'title', incoming: 'Die Hafenlichter', existing: 'Hafenlichter', same: false },
      { label: 'place', incoming: { key: 'germany' }, existing: { key: 'germany' }, same: true },
      { label: 'year', incoming: '1954', existing: '1954', same: true },
      { label: 'director', incoming: 'Brandt, Elisabeth', existing: 'Brandt, Elisabeth', same: true },
      { label: 'gnd', incoming: { key: 'none' }, existing: { key: 'none' }, same: true },
    ],
    choices: [
      { id: 'confirm', correct: true },
      { id: 'unmerge', correct: false },
    ],
  },
  {
    id: 'nightTrain',
    year: 1962,
    rows: [
      { label: 'title', incoming: 'Nachtzug', existing: 'Nachtzug', same: true },
      { label: 'genre', incoming: { key: 'featureFilm' }, existing: { key: 'featureFilm' }, same: true },
      { label: 'place', incoming: { key: 'germany' }, existing: { key: 'germany' }, same: true },
      { label: 'year', incoming: '1962', existing: '1963', same: false },
      { label: 'director', incoming: 'Weber, Karl', existing: 'Weber, Karl', same: true },
    ],
    choices: [
      { id: 'confirm', correct: true },
      { id: 'unmerge', correct: false },
    ],
  },
];

export function getCase(id: string): ExplorerCase | undefined {
  return CASES.find((candidate) => candidate.id === id);
}
