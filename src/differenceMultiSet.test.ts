import { differenceMultiSet } from './differenceMultiSet';
import { map } from './map';
import { pipe } from './pipe';
import { take } from './take';

describe('runtime', () => {
  it('returns empty array on empty input', () => {
    expect(differenceMultiSet([], [1, 2, 3])).toEqual([]);
  });

  it('removes nothing on empty other array', () => {
    const data = [1, 2, 3];
    expect(differenceMultiSet(data, [])).toEqual(data);
  });

  it('removes an item that is in the input', () => {
    expect(differenceMultiSet([1], [1])).toEqual([]);
  });

  it('doesnt remove items that are not in the other array', () => {
    expect(differenceMultiSet([1], [2])).toEqual([1]);
  });

  it('maintains multi-set semantics (removes only one copy)', () => {
    expect(differenceMultiSet([1, 1], [1])).toEqual([1]);
  });

  it('works if the other array has too many copies', () => {
    expect(differenceMultiSet([1], [1, 1])).toEqual([]);
  });

  it('preserves the original order in source array', () => {
    const result = differenceMultiSet([3, 1, 2, 2], [2]);
    expect(result).toEqual([3, 1, 2]);
  });
});

describe('piping', () => {
  test('lazy', () => {
    const count = vi.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map(x => {
        count();
        return x;
      }),
      differenceMultiSet([2, 3]),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 4]);
  });
});

describe('typing', () => {
  it('trivially works with different item types', () => {
    expect(differenceMultiSet([1, 2, 3], ['a', 'b'])).toEqual([1, 2, 3]);
  });
});
