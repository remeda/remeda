import { pipe } from './pipe';
import { filter } from './filter';
import { createCounter } from './_counter';

describe('data_first', () => {
  it('filter', () => {
    const result = filter([1, 2, 3], x => x % 2 === 1);
    expect(result).toEqual([1, 3]);
  });

  it('filter.indexed', () => {
    const result = filter.indexed([1, 2, 3], (x, i) => x % 2 === 1 && i !== 1);
    expect(result).toEqual([1, 3]);
  });
});

describe('data_last', () => {
  it('filter', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3],
      filter(x => x % 2 === 1),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 3]);
  });
  it('filter.indexed', () => {
    const counter = createCounter();
    const result = pipe(
      [1, 2, 3],
      filter.indexed((x, i) => x % 2 === 1 && i !== 1),
      counter.fn()
    );
    expect(counter.count).toHaveBeenCalledTimes(2);
    expect(result).toEqual([1, 3]);
  });
});
