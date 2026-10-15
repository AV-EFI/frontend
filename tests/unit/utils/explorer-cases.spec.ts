import { describe, expect, test } from 'vitest';
import { allJudged, hasMisjudgedRow, isCorrectChoice, reviewRow, type Judgements } from '~/utils/explorer/caseEngine';
import { CASES, getCase } from '~/utils/explorer/cases';

describe('explorer cases', () => {
  test('have exactly one correct decision each', () => {
    for (const item of CASES) {
      expect(item.choices.filter((choice) => choice.correct)).toHaveLength(1);
    }
  });

  test('differ in different fields, so the visitor cannot rely on one pattern', () => {
    const differing = CASES.map((item) => item.rows.filter((row) => !row.same).map((row) => row.label).join(','));

    expect(new Set(differing).size).toBeGreaterThanOrEqual(3);
    expect(differing).toEqual(expect.arrayContaining(['director', 'title', 'year']));
    expect(isCorrectChoice(getCase('harbour')!, 'confirm')).toBe(true);
    expect(isCorrectChoice(getCase('nightTrain')!, 'confirm')).toBe(true);
  });

  test('follow the examples of the work match', () => {
    const undine = getCase('undine');
    expect(undine?.rows.find((row) => row.label === 'director')).toMatchObject({ same: false });
    expect(isCorrectChoice(undine!, 'merge')).toBe(true);

    expect(isCorrectChoice(getCase('smultron')!, 'confirm')).toBe(true);
    expect(isCorrectChoice(getCase('christmas')!, 'split')).toBe(true);
    expect(isCorrectChoice(getCase('christmas')!, 'merge')).toBe(false);
  });
});

describe('case judgement', () => {
  const undine = getCase('undine')!;
  const allSame: Judgements = Object.fromEntries(undine.rows.map((_, index) => [index, { mode: 'same', value: '' }]));

  test('is complete only when every field is judged', () => {
    expect(allJudged(undine, {})).toBe(false);
    expect(allJudged(undine, { 0: { mode: 'same', value: '' } })).toBe(false);
    expect(allJudged(undine, allSame)).toBe(true);
  });

  test('grades same and different, but not an own value', () => {
    const director = undine.rows.find((row) => row.label === 'director')!;
    expect(reviewRow(director, { mode: 'diff', value: '' })).toBe('correct');
    expect(reviewRow(director, { mode: 'same', value: '' })).toBe('wrong');
    expect(reviewRow(director, { mode: 'own', value: 'Petzold, Christian' })).toBe('own');
  });

  test('reports a wrong judgement of a field', () => {
    expect(hasMisjudgedRow(undine, allSame)).toBe(true);
    const careful: Judgements = { ...allSame, 3: { mode: 'diff', value: '' } };
    expect(hasMisjudgedRow(undine, careful)).toBe(false);
  });

  test('does not know a case or choice that does not exist', () => {
    expect(getCase('unknown')).toBeUndefined();
    expect(isCorrectChoice(undine, 'unknown')).toBe(false);
  });
});
