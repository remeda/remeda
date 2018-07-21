import { uniq } from './uniq';
import { pipe } from './pipe';
import { createCounter } from './_counter';
import { take } from './take';

it('uniq', () => {
  expect(uniq([1, 2, 2, 5, 1, 6, 7])).toEqual([1, 2, 5, 6, 7]);
});

describe('pipe', () => {
  it('uniq', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 2, 5, 1, 6, 7],
      counter.fn(),
      uniq(),
      take(3)
    );
    expect(counter.count).toHaveBeenCalledTimes(4);
    expect(result).toEqual([1, 2, 5]);
  });
});
