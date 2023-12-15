import { pipe } from './pipe';
import { takeLastWhile } from './takeLastWhile';

const DATA = [1, 2, 3, 4] as const;

describe('data first', () => {
  it('should return items after the last predicate failure', () => {
    expect(takeLastWhile(DATA, n => n !== 2)).toStrictEqual([3, 4]);
  });

  it('should return an empty array when the last item fails the predicate', () => {
    expect(takeLastWhile(DATA, n => n !== 4)).toStrictEqual([]);
  });

  it('should return an empty array when an empty array is passed', () => {
    expect(takeLastWhile([], n => n > 0)).toStrictEqual([]);
  });

  it('should return the original array when all items pass the predicate', () => {
    expect(takeLastWhile(DATA, n => n > 0)).toBe(DATA);
  });
});

describe('data last', () => {
  it('should return items after the last predicate failure', () => {
    expect(
      pipe(
        DATA,
        takeLastWhile(n => n !== 2)
      )
    ).toStrictEqual([3, 4]);
  });

  it('should return an empty array when the last item fails the predicate', () => {
    expect(
      pipe(
        DATA,
        takeLastWhile(n => n !== 4)
      )
    ).toStrictEqual([]);
  });

  it('should return an empty array when an empty array is passed', () => {
    expect(
      pipe(
        [],
        takeLastWhile(n => n > 0)
      )
    ).toStrictEqual([]);
  });

  it('should return the original array when all items pass the predicate', () => {
    expect(
      pipe(
        DATA,
        takeLastWhile(n => n > 0)
      )
    ).toBe(DATA);
  });
});
