import { pipe } from './pipe';
import { drop } from './drop';
import { createCounter } from './_counter';
import { take } from './take';

const array = [1, 2, 3, 4, 5] as const;
const expected = [3, 4, 5];

describe('data first', () => {
  test('should drop last', () => {
    expect(drop(array, 2)).toEqual(expected);
  });
});

describe('data last', () => {
  test('drop', () => {
    const result = pipe(array, drop(2));
    expect(result).toEqual(expected);
  });
  test('drop with take', () => {
    const counter = createCounter();
    const result = pipe(array, counter.fn(), drop(2), take(2));
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([3, 4]);
  });
});
