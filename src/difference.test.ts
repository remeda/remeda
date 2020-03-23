import { difference } from './difference';
import { pipe } from './pipe';
import { take } from './take';
import { map } from './map';

const source = [1, 2, 3, 4] as const;
const other = [2, 5, 3] as const;
const expected = [1, 4] as const;

describe('data_first', () => {
  test('should return difference', () => {
    expect(difference(source, other)).toEqual(expected);
  });
});

describe('data_last', () => {
  test('should return difference', () => {
    expect(difference(other)(source)).toEqual(expected);
  });

  test('lazy', () => {
    const count = jest.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map(x => {
        count();
        return x;
      }),
      difference([2, 3]),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 4]);
  });
});
