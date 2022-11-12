import { differenceWith } from './differenceWith';
import { equals } from './equals';
import { pipe } from './pipe';
import { take } from './take';
import { createCounter } from './_counter';

const source = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }];
const other = [{ a: 2 }, { a: 5 }, { a: 3 }];
const expected = [{ a: 1 }, { a: 4 }];

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
    const counter = createCounter();
    const result = pipe(
      [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 }, { a: 6 }],
      counter.fn(),
      differenceWith([{ a: 2 }, { a: 3 }], equals),
      take(2)
    );
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([{ a: 1 }, { a: 4 }]);
  });
});
