import type { CaseRow, ExplorerCase } from './cases';

/**
 * The visitor judges every field of a case themselves. Nothing is revealed until the
 * decision has been made, so the engine only evaluates once all judgements and a choice exist.
 */
export type JudgementMode = 'same' | 'diff' | 'own';

export interface Judgement {
  mode: JudgementMode;
  /** The visitor's own value, only used with mode "own". */
  value: string;
}

export type Judgements = Record<number, Judgement | undefined>;

export function allJudged(explorerCase: ExplorerCase, judgements: Judgements): boolean {
  return explorerCase.rows.every((_, index) => judgements[index] !== undefined);
}

export type RowReview = 'correct' | 'wrong' | 'own';

/** An own value is not graded: the visitor named a value, they did not say same or different. */
export function reviewRow(row: CaseRow, judgement: Judgement): RowReview {
  if (judgement.mode === 'own') return 'own';
  return (judgement.mode === 'same') === row.same ? 'correct' : 'wrong';
}

export function hasMisjudgedRow(explorerCase: ExplorerCase, judgements: Judgements): boolean {
  return explorerCase.rows.some((row, index) => {
    const judgement = judgements[index];
    return judgement !== undefined && reviewRow(row, judgement) === 'wrong';
  });
}

export function isCorrectChoice(explorerCase: ExplorerCase, choiceId: string): boolean {
  return explorerCase.choices.some((choice) => choice.id === choiceId && choice.correct);
}
