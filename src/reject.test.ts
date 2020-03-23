import { pipe } from './pipe';
import { reject } from './reject';
import { createCounter } from './_counter';

describe('data_first', () => {
  it('reject', () => {
    const result = reject([1, 2, 3] as const, x => x % 2 === 0);
    expect(result).toEqual([1, 3]);
  });
  it('reject.indexed', () => {
    const result = reject.indexed(
      [1, 2, 3] as const,
      (x, i) => x % 2 === 0 && i === 1
    );
    expect(result).toEqual([1, 3]);
  });
});

describe('data_last', () => {
  it('filter', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3] as const,
      reject(x => x % 2 === 0),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 3]);
  });
  it('filter.indexed', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3] as const,
      reject.indexed((x, i) => x % 2 === 0 && i === 1),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 3]);
  });
});
