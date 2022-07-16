import { differenceWith } from './differenceWith';
import { equals } from './equals';
import { map } from './map';
import { pipe } from './pipe';
import { take } from './take';

const source = [1, 2, 3, 4] as const;
const other = [2, 5, 3] as const;
const expected = [1, 4] as const;

describe('data_first', () => {
  test('should return difference', () => {
    expect(differenceWith(source, other, equals)).toEqual(expected);
  });
});

describe('data_last', () => {
  test('should return difference', () => {
    expect(differenceWith(other, equals)(source)).toEqual(expected);
  });

  test('lazy', () => {
    const count = jest.fn();
    const result = pipe(
      [1, 2, 3, 4, 5, 6],
      map(x => {
        count();
        return x;
      }),
      differenceWith([2, 3], equals),
      take(2)
    );
    expect(count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 4]);
  });
});
