import { groupWith } from './groupWith';
import { pipe } from './pipe';
import { flatten } from './flatten';

describe('groupWith', () => {
  const equals = <T>(a: T, b: T) => a === b;

  it('splits the list into groups according to the grouping function', () => {
    expect(groupWith([1, 2, 2, 3], equals)).toEqual([[1], [2, 2], [3]]);
    expect(groupWith([1, 1, 1, 1], equals)).toEqual([[1, 1, 1, 1]]);
    expect(groupWith([1, 2, 3, 4], equals)).toEqual([[1], [2], [3], [4]]);
  });

  it('splits the list into "streaks" testing adjacent elements', function () {
    const isConsecutive = (a: number, b: number) => a + 1 === b;
    expect(groupWith([], isConsecutive)).toEqual([]);
    expect(groupWith([4, 3, 2, 1], isConsecutive)).toEqual([
      [4],
      [3],
      [2],
      [1],
    ]);
    expect(groupWith([1, 2, 3, 4], isConsecutive)).toEqual([[1, 2, 3, 4]]);
    expect(groupWith([1, 2, 2, 3], isConsecutive)).toEqual([
      [1, 2],
      [2, 3],
    ]);
    expect(groupWith([1, 2, 9, 3, 4], isConsecutive)).toEqual([
      [1, 2],
      [9],
      [3, 4],
    ]);
  });

  it('returns an empty array if given an empty array', () => {
    expect(groupWith([], equals)).toEqual([]);
  });

  it('can be turned into the original list through concatenation', () => {
    const list = [1, 1, 2, 3, 4, 4, 5, 5];
    const result = pipe(list, groupWith(equals), flatten);
    expect(result).toEqual(list);
  });
});
